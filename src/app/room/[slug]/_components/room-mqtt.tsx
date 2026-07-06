'use client';

import {
  formatNow,
  generateMqttTopic,
  invalidateQueries,
  notify,
  publishMqttMessage
} from '@/utils';
import { logger } from '@/logger';
import {
  DATE_TIME_FORMAT,
  mqttCMDs,
  mqttTopics,
  queryKeys,
  ROOM_STATE_RUNNING,
  roomEndReasons
} from '@/constants';
import type {
  ChatBodyType,
  ChatResType,
  RoomEndType,
  RoomKickType,
  RoomParticipantJoinType,
  RoomPlayerStateType,
  RoomResType,
  RoomSyncType,
  RoomUpdateParticipantCountType
} from '@/types';
import { useEffect } from 'react';
import { useAuth, useMqtt, useMqttSubscribe } from '@/hooks';
import { useChatListQuery, useParticipantListQuery } from '@/queries';
import { useChatStore, useRoomStore } from '@/store';
import { useShallow } from 'zustand/shallow';

const PING_INTERVAL = 10_000; // 10 seconds

type RoomMqttProps = {
  room: RoomResType;
};

export function RoomMqtt({ room }: RoomMqttProps) {
  const { profile, isAuthenticated } = useAuth();
  const { isJoined } = useRoomStore(
    useShallow((state) => ({
      isJoined: state.isJoined
    }))
  );

  const isRunning = room.state === ROOM_STATE_RUNNING;
  const isHost = profile?.id === room.host.id;

  // CMD_CLIENT_PING
  // Send ping to the room every 10 seconds to keep the connection alive
  useEffect(() => {
    if (!isRunning || !isHost || !isJoined) return;

    const sendPing = async () => {
      try {
        await publishMqttMessage(
          generateMqttTopic(mqttTopics.ROOM, { roomId: room.id }),
          {
            cmd: mqttCMDs.CLIENT_PING,
            data: { accountId: room.host.id }
          }
        );
        logger.info('[MQTT] Ping room sent');
      } catch (err) {
        logger.error('[MQTT] Ping room failed', err);
      }
    };

    sendPing();

    const interval = setInterval(sendPing, PING_INTERVAL);
    return () => clearInterval(interval);
  }, [isHost, isRunning, isJoined, room.host.id, room.id]);
  // Send ping to the room every 10 seconds to keep the connection alive

  // Topic: room/:roomId
  // Subscribe to room topic when the room is running
  useMqttSubscribe(
    generateMqttTopic(mqttTopics.ROOM, { roomId: room.id }),
    isRunning
  );
  // Subscribe to room topic when the room is running

  // room/:roomId/:userId
  // Subscribe to room-user topic for the host when the room is running
  useMqttSubscribe(
    generateMqttTopic(mqttTopics.ROOM_USER, {
      roomId: room.id,
      userId: room.host.id
    }),
    isRunning
  );

  useMqttSubscribe(
    generateMqttTopic(mqttTopics.ROOM_USER, {
      roomId: room.id,
      userId: profile?.id || ''
    }),
    isRunning
  );
  // Subscribe to room-user topic for the host when the room is running

  // CMD_END_ROOM
  // Handle room end event
  useMqtt<RoomEndType>({
    topic: generateMqttTopic(mqttTopics.ROOM, { roomId: room?.id || '' }),
    cmd: mqttCMDs.END_ROOM,
    callback: (data) => {
      const reason = roomEndReasons.find(
        (r) => String(r.value) === String(data.reason)
      )?.label;

      const message = reason || 'Chủ phòng đã kết thúc buổi xem chung';

      useRoomStore.getState().setReasonEnd(data.reason);

      invalidateQueries(
        [queryKeys.ROOM, data.roomId],
        [queryKeys.PARTICIPANT_LIST, { roomId: data.roomId }]
      );

      if (isHost) return;

      notify.info(message);
    }
  });
  // Handle room end event

  // Set current viewers count when room.currentViewers changes
  useEffect(() => {
    useRoomStore.getState().setParticipantCount(room.currentViewers);
  }, [room.currentViewers]);
  // Set current viewers count when room.currentViewers changes

  // Reset kicked state when entering a room
  useEffect(() => {
    useRoomStore.getState().setIsKicked(false);
  }, [room.id]);
  // Reset kicked state when entering a room

  // CMD_UPDATE_PARTICIPANT_COUNT
  // Handle room update participant count event
  useMqtt<RoomUpdateParticipantCountType>({
    topic: generateMqttTopic(mqttTopics.ROOM, { roomId: room?.id || '' }),
    cmd: mqttCMDs.UPDATE_PARTICIPANT_COUNT,
    callback: (data) => {
      useRoomStore.getState().setParticipantCount(data.currentViewers);
      useRoomStore.getState().setParticipants(data.participants || []);
    }
  });
  // Handle room update participant count event

  // CMD_PARTICIPANT_JOIN
  // Host responds with accurate live position from playerRef via store getter
  useMqtt<RoomParticipantJoinType>({
    topic: generateMqttTopic(mqttTopics.ROOM, { roomId: room?.id || '' }),
    cmd: mqttCMDs.PARTICIPANT_JOIN,
    callback: (data) => {
      if (!isHost) return;

      publishMqttMessage(
        generateMqttTopic(mqttTopics.ROOM_USER, {
          roomId: room.id,
          userId: data.id
        }),
        {
          cmd: mqttCMDs.ROOM_STATE,
          data: {
            ...useRoomStore.getState().playerState,
            currentPositionMovie: Math.floor(
              useRoomStore.getState().getPlayerCurrentTime()
            ),
            subCmd: mqttCMDs.ROOM_ALL_STATE
          }
        }
      );
    }
  });
  // Handle participant join event

  // CMD_KICK
  // Handle participant kicked event
  useMqtt<RoomKickType>({
    topic: generateMqttTopic(mqttTopics.ROOM_USER, {
      roomId: room?.id || '',
      userId: profile?.id || ''
    }),
    cmd: mqttCMDs.KICK_PARTICIPANT,
    callback: (data) => {
      if (isHost) return;
      if (data.targetUserId !== profile?.id) return;

      useRoomStore.getState().setIsKicked(true);
      useRoomStore.getState().setIsJoined(false);

      publishMqttMessage(
        generateMqttTopic(mqttTopics.ROOM, { roomId: data.roomId }),
        {
          cmd: mqttCMDs.PARTICIPANT_LEFT,
          data: {
            accountId: profile?.id
          }
        }
      );
    }
  });
  // Handle participant kicked event

  // CMD_ROOM_SYNC
  // Host responds with accurate live position from playerRef via store getter to the requesting participant
  useMqtt<RoomSyncType>({
    topic: generateMqttTopic(mqttTopics.ROOM, { roomId: room?.id || '' }),
    cmd: mqttCMDs.ROOM_SYNC,
    callback: (data) => {
      if (!isHost) return;

      publishMqttMessage(
        generateMqttTopic(mqttTopics.ROOM_USER, {
          roomId: room.id,
          userId: data.id
        }),
        {
          cmd: mqttCMDs.ROOM_STATE,
          data: {
            ...useRoomStore.getState().playerState,
            currentPositionMovie: Math.floor(
              useRoomStore.getState().getPlayerCurrentTime()
            ),
            subCmd: mqttCMDs.ROOM_ALL_STATE
          }
        }
      );
    }
  });
  // Handle room sync request event

  // CMD_ROOM_STATE: PLAY, PAUSE, SEEK, PLAY_SPEED
  // Handle room state event
  useMqtt<RoomPlayerStateType>({
    topic: generateMqttTopic(mqttTopics.ROOM, { roomId: room?.id || '' }),
    cmd: mqttCMDs.ROOM_STATE,
    callback: (data) => {
      if (isHost) return;

      const currentPlayerState = useRoomStore.getState().playerState;

      switch (data.subCmd) {
        case mqttCMDs.ROOM_PLAY:
          useRoomStore.getState().setPlayerState({
            ...currentPlayerState,
            isPlay: true,
            subCmd: data.subCmd
          });
          return;
        case mqttCMDs.ROOM_PAUSE:
          useRoomStore.getState().setPlayerState({
            ...currentPlayerState,
            isPlay: false,
            subCmd: data.subCmd
          });
          return;
        case mqttCMDs.ROOM_SEEK:
          useRoomStore.getState().setPlayerState({
            ...currentPlayerState,
            currentPositionMovie: data.currentPositionMovie,
            subCmd: data.subCmd
          });
          return;
        case mqttCMDs.ROOM_PLAY_SPEED:
          useRoomStore.getState().setPlayerState({
            ...currentPlayerState,
            playSpeed: data.playSpeed,
            subCmd: data.subCmd
          });
          return;
        default:
          useRoomStore.getState().setPlayerState(data);
      }
    }
  });
  // Handle room state event

  // CMD_ROOM_STATE: ALL_STATE,
  // Handle all room state event (sent by the host to a new participant)
  useMqtt<RoomPlayerStateType>({
    topic: generateMqttTopic(mqttTopics.ROOM_USER, {
      roomId: room?.id || '',
      userId: profile?.id || ''
    }),
    cmd: mqttCMDs.ROOM_STATE,
    callback: (data) => {
      if (isHost) return;

      useRoomStore.getState().setPlayerState(data);
    }
  });
  // Handle all room state event (sent by the host to a new participant)

  // Fetch chat history on first join
  const { data: chatList } = useChatListQuery({
    params: { roomId: room.id },
    enabled: isJoined && isRunning
  });

  useEffect(() => {
    if (chatList && !useChatStore.getState().messagesLoaded) {
      useChatStore.getState().setMessages(chatList);
    }
  }, [chatList]);
  // Fetch chat history on first join

  // CMD_CREATE_CHAT
  // Handle incoming chat message
  useMqtt<ChatBodyType>({
    topic: generateMqttTopic(mqttTopics.ROOM, { roomId: room?.id || '' }),
    cmd: mqttCMDs.CREATE_CHAT,
    callback: (data) => {
      const msg: ChatResType = {
        id: crypto.randomUUID(),
        createdDate: data.createdDate || formatNow(DATE_TIME_FORMAT),
        user: {
          id: data.user.id,
          username: data.user.username || '',
          email: '',
          fullName: data.user.fullName,
          avatarPath: data.user.avatarPath || '',
          kind: 0,
          gender: 0
        },
        content: data.content || ''
      };
      useChatStore.getState().addMessage(msg);
    }
  });
  // Handle incoming chat message

  // Fetch participant list on first join
  const { data: participantList } = useParticipantListQuery({
    params: { roomId: room.id },
    enabled: isAuthenticated
  });

  useEffect(() => {
    if (participantList && useRoomStore.getState().participants.length === 0) {
      useRoomStore.getState().setParticipants(participantList);
    }
  }, [participantList]);
  // Fetch participant list on first join

  // Clear chat messages on unmount
  useEffect(() => {
    return () => {
      useChatStore.getState().clearMessages();
    };
  }, []);
  // Clear chat messages on unmount

  // Clear participants on unmount
  useEffect(() => {
    return () => {
      useRoomStore.getState().setParticipants([]);
    };
  }, []);
  // Clear participants on unmount

  return null;
}

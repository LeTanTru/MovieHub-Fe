'use client';

import { mqttCMDs, mqttTopics, queryKeys } from '@/constants';
import { useAuth, useMqtt, useMqttSubscribe } from '@/hooks';
import { getMqttClient } from '@/lib/mqtt';
import { logger } from '@/logger';
import type {
  NotificationResType,
  NotificationRoomInviteType,
  ReplyCommentNotificationType,
  ToxicCommentLockedNotificationType,
  ToxicReviewLockedNotificationType,
  VoteCommentNotificationType,
  VoteReviewNotificationType
} from '@/types';
import {
  generateMqttTopic,
  invalidateQueries,
  notify,
  parseJSON
} from '@/utils';
import { useEffect } from 'react';

type QueryKey = (string | number | object)[];

const commentListKey = (movieId: string): QueryKey => [
  queryKeys.COMMENT_LIST,
  { movieId }
];

const commentRepliesKey = (
  movieId: string,
  parentId?: string | null
): QueryKey | null => {
  if (!parentId) return null;

  return [
    `${queryKeys.COMMENT_REPLIES_LIST}-${parentId}`,
    { movieId, parentId }
  ];
};

const invalidateNotificationQueries = (...keys: QueryKey[]) => {
  invalidateQueries(
    [queryKeys.UNREAD_NOTIFICATION_COUNT],
    [queryKeys.NOTIFICATION_LIST],
    ...keys
  );
};

const invalidateCommentQueries = ({
  movieId,
  parentId,
  includeVoteList = false
}: {
  movieId?: string;
  parentId?: string | null;
  includeVoteList?: boolean;
}) => {
  if (!movieId) return;

  const keys: QueryKey[] = [commentListKey(movieId)];
  const repliesKey = commentRepliesKey(movieId, parentId);

  if (repliesKey) keys.push(repliesKey);
  if (includeVoteList) keys.push([queryKeys.COMMENT_VOTE_LIST, movieId]);

  invalidateQueries(...keys);
};

const invalidateReviewQueries = ({
  movieId,
  includeVoteList = false
}: {
  movieId?: string;
  includeVoteList?: boolean;
}) => {
  if (!movieId) return;

  const keys: QueryKey[] = [[queryKeys.REVIEW_LIST, { movieId }]];

  if (includeVoteList) keys.push([queryKeys.REVIEW_VOTE_LIST, movieId]);

  invalidateQueries(...keys);
};

const isValidMqttCMD = (cmd: string) => Object.values(mqttCMDs).includes(cmd);

export function MqttProvider() {
  const { profile } = useAuth();
  const client = getMqttClient();

  // Subscribe to general CMS notification
  useMqttSubscribe(mqttTopics.MOVIE);

  // Subscribe to account notification
  useMqttSubscribe(
    generateMqttTopic(mqttTopics.ACCOUNT, { accountId: profile?.id || '' }),
    !!profile?.id
  );

  // Log all incoming MQTT messages for debugging
  useEffect(() => {
    const onMessage = (topic: string, message: Buffer) => {
      logger.info(
        `[MQTT] Received MQTT message on topic: ${topic}`,
        message.toString()
      );
    };

    client.on('message', onMessage);

    return () => {
      client.off('message', onMessage);
    };
  }, [client]);

  // Subscribe to notifications (single hook, one parse, routes by data.cmd)
  useMqtt<NotificationResType>({
    topic: mqttTopics.MOVIE,
    cmd: mqttCMDs.SEND_NOTIFICATION,
    callback: (data) => {
      if (!isValidMqttCMD(data.cmd)) return;

      invalidateNotificationQueries();
      notify.success(data.title);

      switch (data.cmd) {
        case mqttCMDs.NEW_MOVIE_ITEM:
        case mqttCMDs.NEW_MOVIE:
          break;
      }
    }
  });

  // Subscribe to per-account notifications
  useMqtt<NotificationResType>({
    topic: generateMqttTopic(mqttTopics.ACCOUNT, {
      accountId: profile?.id || ''
    }),
    cmd: mqttCMDs.SEND_NOTIFICATION,
    callback: (data) => {
      if (!isValidMqttCMD(data.cmd)) return;

      invalidateNotificationQueries();
      notify.success(data.title);

      switch (data.cmd) {
        case mqttCMDs.COMMENT_UNLOCKED:
        case mqttCMDs.TOXIC_COMMENT_LOCKED: {
          const body = parseJSON<ToxicCommentLockedNotificationType>(data.body);
          invalidateCommentQueries({
            movieId: body.movieId,
            parentId: body.parentId
          });
          break;
        }
        case mqttCMDs.NEW_MOVIE_ITEM:
        case mqttCMDs.NEW_MOVIE:
        case mqttCMDs.REPLY_COMMENT: {
          const body = parseJSON<ReplyCommentNotificationType>(data.body);
          invalidateCommentQueries({
            movieId: body.movieId,
            parentId: body.parentId
          });
          break;
        }
        case mqttCMDs.REVIEW_UNLOCKED:
        case mqttCMDs.TOXIC_REVIEW_LOCKED: {
          const body = parseJSON<ToxicReviewLockedNotificationType>(data.body);
          invalidateReviewQueries({
            movieId: body.movieId
          });
          break;
        }
        case mqttCMDs.ROOM_INVITE: {
          const body = parseJSON<NotificationRoomInviteType>(data.body);
          invalidateQueries(
            [queryKeys.ROOM, body.id],
            [queryKeys.ROOM_LIST],
            [queryKeys.MY_ROOM_LIST]
          );
          break;
        }
        case mqttCMDs.VOTE_COMMENT: {
          const body = parseJSON<VoteCommentNotificationType>(data.body);
          invalidateCommentQueries({
            movieId: body.movieId,
            parentId: body.parentId,
            includeVoteList: true
          });
          break;
        }
        case mqttCMDs.VOTE_REVIEW: {
          const body = parseJSON<VoteReviewNotificationType>(data.body);
          invalidateReviewQueries({
            movieId: body.movieId,
            includeVoteList: true
          });
          break;
        }
      }
    }
  });

  return null;
}

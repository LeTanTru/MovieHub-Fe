'use client';

import { mqttCMDs, mqttTopics, queryKeys } from '@/constants';
import { useAuth, useMqtt } from '@/hooks';
import { getMqttClient } from '@/lib/mqtt';
import { logger } from '@/logger';
import { NotificationResType } from '@/types';
import { generateMqttTopic, invalidateQueries, parseJSON } from '@/utils';
import { useEffect } from 'react';

export default function MqttProvider() {
  const { profile } = useAuth();
  const client = getMqttClient();

  // Subscribe to general CMS notification
  useEffect(() => {
    client.subscribe(mqttTopics.MOVIE, (err) => {
      if (!err)
        logger.info(`[MQTT] Subscribed to MQTT topic: ${mqttTopics.MOVIE}`);
      else logger.error('[MQTT_SUBSCRIBE_ERROR]', mqttTopics.MOVIE, err);
    });

    return () => {
      client.unsubscribe(mqttTopics.MOVIE);
    };
  }, [client]);

  // Subscribe to account notification
  useEffect(() => {
    if (profile?.id) {
      client.subscribe(
        generateMqttTopic(mqttTopics.ACCOUNT, {
          accountId: profile.id
        }),
        (err) => {
          if (!err)
            logger.info(
              `[MQTT] Subscribed to MQTT topic: ${mqttTopics.ACCOUNT.replace(
                ':accountId',
                profile.id
              )}`
            );
          else
            logger.error(
              '[MQTT_SUBSCRIBE_ERROR]',
              mqttTopics.ACCOUNT.replace(':accountId', profile.id),
              err
            );
        }
      );
    }

    return () => {
      if (profile?.id) {
        client.unsubscribe(
          mqttTopics.ACCOUNT.replace(':accountId', profile.id)
        );
      }
    };
  }, [profile?.id, client]);

  // Receive message from CMS
  useEffect(() => {
    const onMessage = (topic: string, message: Buffer) => {
      logger.info(
        `[MQTT] Received MQTT message on topic: ${topic}`,
        parseJSON(message.toString())
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
      switch (data.cmd) {
        case mqttCMDs.NEW_MOVIE_ITEM:
        case mqttCMDs.NEW_MOVIE:
          invalidateQueries([
            queryKeys.UNREAD_NOTIFICATION_COUNT,
            queryKeys.NOTIFICATION_LIST
          ]);
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
      switch (data.cmd) {
        case mqttCMDs.NEW_MOVIE_ITEM:
        case mqttCMDs.NEW_MOVIE:
        case mqttCMDs.REPLY_COMMENT:
        case mqttCMDs.VOTE_COMMENT:
        case mqttCMDs.VOTE_REVIEW:
          invalidateQueries([
            queryKeys.UNREAD_NOTIFICATION_COUNT,
            queryKeys.NOTIFICATION_LIST
          ]);
          break;
      }
    }
  });

  return null;
}

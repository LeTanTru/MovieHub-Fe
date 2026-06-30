import { getMqttClient } from '@/lib/mqtt';
import { logger } from '@/logger';
import { useEffect, useRef } from 'react';

type UseMqttType<T> = {
  topic: string;
  cmd: string;
  callback: (data: T) => void;
};

export const useMqtt = <T>({ topic, cmd, callback }: UseMqttType<T>) => {
  const callbackRef = useRef(callback);
  callbackRef.current = callback;
  const client = getMqttClient();

  useEffect(() => {
    const handleMessage = (incomingTopic: string, message: Buffer) => {
      if (incomingTopic !== topic) return;

      try {
        const parsedData: { cmd: string; data: T } = JSON.parse(
          message.toString()
        );
        if (parsedData.cmd === cmd) {
          callbackRef.current(parsedData.data);
        } else {
          logger.warn(
            `[MQTT_WARNING] Received ${parsedData.cmd}, expected: ${cmd}, message: ${message}`
          );
        }
      } catch (error) {
        logger.error(`[MQTT_PARSE_ERROR] ${topic}: ${error}`);
      }
    };

    client.subscribe(topic, (err) => {
      if (err) logger.error(`[MQTT_SUB_ERROR] ${topic}: ${err}`);
    });

    client.on('message', handleMessage);

    return () => {
      client.off('message', handleMessage);
      client.unsubscribe(topic);
    };
  }, [topic, cmd, client]);
};

export const useMqttSubscribe = (topic: string, enabled: boolean = true) => {
  const client = getMqttClient();

  useEffect(() => {
    if (!enabled || !topic) return;

    client.subscribe(topic, (err) => {
      if (!err) {
        logger.info(`[MQTT] Subscribed to MQTT topic: ${topic}`);
      } else {
        logger.error(`[MQTT_SUBSCRIBE_ERROR] ${topic}`, err);
      }
    });

    return () => {
      client.unsubscribe(topic);
    };
  }, [client, enabled, topic]);
};

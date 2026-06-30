import { logger } from '@/logger';
import { MqttClient } from 'mqtt';

export const generateMqttTopic = (
  topic: string,
  params: Record<string, string>
) => {
  return Object.entries(params).reduce((acc, [key, value]) => {
    return acc.replace(`:${key}`, value);
  }, topic);
};

export const publishMqttMessage = (
  client: MqttClient,
  topic: string,
  payload: Record<string, unknown>
): Promise<void> => {
  if (Object.keys(payload).length > 0)
    logger.info(
      `[PUBLISH_MQTT_MESSAGE]`,
      `Topic: ${topic}`,
      `Payload: ${JSON.stringify(payload)}`
    );

  return new Promise((resolve, reject) => {
    client.publish(topic, JSON.stringify(payload), (err) => {
      if (err) reject(err);
      else resolve();
    });
  });
};

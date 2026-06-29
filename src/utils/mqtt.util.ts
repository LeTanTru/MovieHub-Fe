import { MqttClient } from 'mqtt';

export const generateMqttTopic = (
  topic: string,
  params: Record<string, string>
) => {
  return Object.entries(params).reduce((acc, [key, value]) => {
    return acc.replace(`:${key}`, value);
  }, topic);
};

export const publishMqttMessage = <T>(
  client: MqttClient,
  topic: string,
  message: T
): Promise<void> => {
  return new Promise((resolve, reject) => {
    client.publish(topic, JSON.stringify(message), (err) => {
      if (err) reject(err);
      else resolve();
    });
  });
};

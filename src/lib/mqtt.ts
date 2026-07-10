import { envConfig } from '@/config';
import { logger } from '@/logger';
import mqtt, { MqttClient } from 'mqtt';

let client: MqttClient;

const generateClientId = () =>
  `moviehub_${Math.random().toString(36).slice(2, 10)}_${Date.now()}`;

const MQTT_CONNECT_TIMEOUT = 10_000;
const MQTT_KEEPALIVE = 60;
const MQTT_RECONNECT_PERIOD = 5_000;

export const getMqttClient = () => {
  if (!client) {
    client = mqtt.connect(envConfig.NEXT_PUBLIC_MQTT_BROKER as string, {
      username: envConfig.NEXT_PUBLIC_MQTT_USERNAME as string,
      password: envConfig.NEXT_PUBLIC_MQTT_PASSWORD as string,
      clientId: generateClientId(),
      clean: true, // always start a fresh session; prevents stale broker state
      reconnectPeriod: MQTT_RECONNECT_PERIOD,
      connectTimeout: MQTT_CONNECT_TIMEOUT,
      keepalive: MQTT_KEEPALIVE
    });

    client.on('connect', (e) => logger.info('MQTT connected', e));
    client.on('error', (err) => logger.error('[MQTT_ERROR]', err));
    client.on('reconnect', () => logger.info('[MQTT] Reconnecting...'));
    client.on('offline', () => logger.warn('[MQTT] Offline'));
    client.on('close', () => logger.info('[MQTT] Disconnected'));
  }

  return client;
};

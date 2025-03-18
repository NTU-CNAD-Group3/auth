import { createConnection } from '@/queues/connect.js';
import logger from '@/utils/logger.js';

export async function publishDirectMessage(exchangeName, routingKey, message) {
  try {
    const channel = await createConnection();
    channel.assertExchange(exchangeName, 'direct', { durable: true, autoDelete: false });
    channel.publish(exchangeName, routingKey, Buffer.from(message), { persistent: true });

    logger.info({
      message: `Message published to exchange: ${exchangeName} with routing key: ${routingKey}`,
      timestamp: new Date().toISOString(),
    });
  } catch (error) {
    logger.error({
      message: `Error occurred while publishing message to exchange: ${exchangeName} with routing key: ${routingKey}`,
      error: error.message,
      timestamp: new Date().toISOString(),
    });
  }
}

import amqplib from 'amqplib';

import config from '#src/config.js';
import logger from '#src/utils/logger.js';

let connection;

export async function createConnection() {
  try {
    if (!connection) {
      connection = await amqplib.connect(config.RABBITMQ_ENDPOINT);
    }
    if (!connection) {
      logger.error({
        message: `msg=Failed to connect to queue`,
      });
      throw new Error('Failed to connect to queue');
    }
    const channel = await connection.createChannel();

    logger.info({
      message: `msg=Connected to queue`,
    });

    closeConnection(channel, connection);

    return channel;
  } catch (error) {
    logger.error({
      message: `msg=Failed to connect to queue error=${error.message}`,
    });
    throw new Error('Failed to connect to queue');
  }
}

function closeConnection(channel, connection) {
  async function close() {
    await channel.close();
    await connection.close();
  }

  process.on('exit', close);
  process.on('SIGINT', close);
  process.on('SIGTERM', close);
  process.on('unhandledRejection', async (error) => {
    logger.error({
      message: `msg=Unhandled Rejection error=${error.message}`,
    });
    await close();
  });
  process.on('uncaughtException', async (error) => {
    logger.error({
      message: `msg=Uncaught Exception error=${error.message}`,
    });
    await close();
  });
}

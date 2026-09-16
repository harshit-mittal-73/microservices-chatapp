import amqp from 'amqplib';

let channel: amqp.Channel;

export const connectRabbitMQ = async() => {
    try{
        const rabbitConfig = {
            protocol: "amqp" as const,
            hostname: process.env.RABBITMQ_HOST ?? "localhost",
            port: 5672,
            username: process.env.RABBITMQ_USERNAME ?? "guest",
            password: process.env.RABBITMQ_PASSWORD ?? "guest",
        };

        const connection = await amqp.connect(rabbitConfig);

        channel = await connection.createChannel();

        console.log("✅ Connected to RabbitMQ")
    } catch(error){
        console.log("Failed to connect to RabbitMQ", error)
    }
};

export const publishToQueue = async(queueName: string, message: any) => {
    if (!channel) {
        console.log("RabbitMQ channel is not initialized");
        return;
    }
    await channel.assertQueue(queueName, { durable: true });
    channel.sendToQueue(queueName, Buffer.from(JSON.stringify(message)),{
        persistent: true,
    });
};
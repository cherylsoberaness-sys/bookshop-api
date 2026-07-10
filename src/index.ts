import { api } from './api';
import { environmentService } from './insfrastructure/EnvironmentService';
import { Worker, Job } from 'bullmq';
import { NodemailerEmailService } from './insfrastructure/shared/NodemailerEmailService';
import { PrismaUserRepository } from './insfrastructure/user/repositories/PrismaUserRepository';

environmentService.load();

const { PORT, REDIS_URL } = environmentService.get();

const port = Number(process.env.PORT) || 3000;

api.listen(port, () => {
    console.log(`Servidor corriendo en http://localhost ${PORT}`);
});


const redisUrl = new URL(REDIS_URL);
const workerCollection = {
    connection: {
        host: redisUrl.hostname,
        port: Number(redisUrl.port)
    }
}

new Worker(
    'book-purchased-email',
    async (job: Job<{ userId: string, bookTitle: string }>) => {
        console.log('Worker receiving queue message');
        
        const emailService = new NodemailerEmailService();
        const userRepository = new PrismaUserRepository();
        const user = await userRepository.findById(Number(job.data.userId));
        
        await emailService.send({
            email: user?.email ?? '',
            message: `the following book "${job.data.bookTitle}" has been purchased`,
            subject: `Your book has been sold!`
        });
    },
    workerCollection
);
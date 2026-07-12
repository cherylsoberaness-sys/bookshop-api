import { api } from './api';
import { environmentService } from './insfrastructure/EnvironmentService';
import { Worker, Job } from 'bullmq';
import { NodemailerEmailService } from './insfrastructure/shared/NodemailerEmailService';
import { PrismaUserRepository } from './insfrastructure/user/repositories/PrismaUserRepository';
import cron from 'node-cron';
import { PrismaBookRepository } from './insfrastructure/book/repositories/PrismaBookRepository';
import { PriceReductionSuggestionUseCase } from './domain/book/use-cases/price-reduction-suggestion';
import { BullQueueService } from './insfrastructure/shared/BullQueueService';

environmentService.load();

const { PORT, REDIS_URL } = environmentService.get();

const port = Number(process.env.PORT) || 3000;

api.listen(port, () => {
    console.log(`Servidor corriendo en http://localhost ${PORT}`);
});

//Execute each monday at 00:00
cron.schedule('0 0 * * 1', async () => { 
    console.log('Starting schedule task');
    const sevenDaysAgo = new Date();
    sevenDaysAgo.setDate(sevenDaysAgo.getDate() - 7);


    const prismaBookRepository = new PrismaBookRepository();
    const queueService = new BullQueueService();
    const priceReductionSuggestionUseCase = new PriceReductionSuggestionUseCase(prismaBookRepository, queueService);

    await priceReductionSuggestionUseCase.execute({ date: sevenDaysAgo });
    console.log('Finished schedule task');
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
    async (job: Job<{ ownerId: string, bookTitle: string, bookId: number }>) => {
        console.log('Worker receiving queue message');
        
        const emailService = new NodemailerEmailService();
        const userRepository = new PrismaUserRepository();
        const user = await userRepository.findById(Number(job.data.ownerId));
        
        await emailService.send({
            email: user?.email ?? '',
            message: `
                        Good news!

                        Your book has been purchased.

                        Title: ${job.data.bookTitle}
                        Book Id: ${job.data.bookId}
                        `,
            subject: `Your book has been sold!`
        });
    },
    workerCollection
);

new Worker(
    'price-reduction-suggestion-email',
    async (job: Job<{ ownerId: string, bookTitle: string, bookId: number }>) => {
        console.log('Worker receiving queue message');

        const emailService = new NodemailerEmailService();
        const userRepository = new PrismaUserRepository();
        const user = await userRepository.findById(Number(job.data.ownerId));

        await emailService.send({
            email: user?.email ?? '',
            message: `
                        The following book hasn't been purchased in a week.
                        We suggest you lower the price to ensure a successful sale
                        soon.
                        Book title: ${job.data.bookTitle}
                        Book Id: ${job.data.bookId}
                    `,
            subject: `Your book hasn't been sold`
        });
    },
    workerCollection
);
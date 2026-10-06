import express, { type Express, type Request, type Response } from 'express';
import fs from 'fs';
if (fs.existsSync('.env')) {
    process.loadEnvFile('.env');
}
import eventRoutes from './routes/events.ts';

const app: Express = express();

app.use(express.json());

app.get('/', (req: Request, res: Response) => {
    res.send('Hello World!');
});

app.use('/api/events', eventRoutes);

app.use((err: any, req: Request, res: Response, next: any) => {
    console.error('Global Error Handler:', err);
    res.status(err.status || 500).json({
        message: err.message,
        error: err
    });
});

app.listen(8080);

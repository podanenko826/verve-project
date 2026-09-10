import express, { type Express, type Request, type Response } from 'express';

const app: Express = express();

app.get('/', (req: Request, res: Response) => {
    res.send('Hello World!');
});

app.get('/events', (req: Request, res: Response) => {
    res.send({
        title: 'Event 1',
        start: '1234',
        end: '5678',
        description: 'Test',
    });
});

app.listen(8080);

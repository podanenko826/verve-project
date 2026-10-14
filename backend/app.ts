import serverless from "serverless-http";
import express, { type Express, type Request, type Response } from "express";
import cors from "cors";
import fs from "fs";
if (fs.existsSync(".env")) {
    process.loadEnvFile(".env");
}
import eventRoutes from "./routes/events.ts";

const app: Express = express();

app.use(cors());
app.use(express.json());

app.get("/", (req: Request, res: Response) => {
    res.send("Hello World!");
});

app.use("/api/events", eventRoutes);

app.use((err: any, req: Request, res: Response, next: any) => {
    console.error("Global Error Handler:", err);
    res.status(err.status || 500).json({
        message: err.message,
        error: err,
    });
});

if (process.env.NODE_ENV !== "production") {
    app.listen(8080, () => {
        console.log("Local development server listening on port 8080");
    });
}

// for Lambda
export const handler = serverless(app);

import type { Request, Response, NextFunction } from 'express';
import prisma from '../prisma/client.ts';

export const syncUser = async (req: Request, res: Response, next: NextFunction) => {
    // Ensure checkJwt has already run and populated req.auth
    const userId = (req as any).auth?.payload?.sub;

    if (!userId) {
        return res.status(401).json({ error: 'Unauthorized: Missing user ID in token' });
    }

    try {
        // Upsert the user into the database.
        // We only have the ID from the JWT payload by default.
        await prisma.user.upsert({
            where: { id: userId },
            update: {}, // Do nothing if the user already exists
            create: {
                id: userId,
                // If you later request custom claims in the JWT (like email/name), 
                // you can extract and save them here.
            },
        });

        next();
    } catch (error) {
        console.error('Error synchronizing user:', error);
        return res.status(500).json({ error: 'Failed to synchronize user identity' });
    }
};

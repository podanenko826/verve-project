import type { Request, Response, NextFunction } from 'express';

export const requireRole = (requiredRole: string) => {
    return (req: Request, res: Response, next: NextFunction) => {
        // Extract the roles array from the custom claim injected by Auth0
        const roles = (req as any).auth?.payload?.['https://verve.com/roles'] || [];
        
        if (!roles.includes(requiredRole)) {
            return res.status(403).json({ 
                error: 'Forbidden', 
                message: `You do not have the required role: ${requiredRole}` 
            });
        }
        
        next();
    };
};

import { Router } from "express";
import {
    getEventById,
    getEvents,
    createEvent,
    updateEvent,
    deleteEvent,
    getArchivedEvents,
} from "../controllers/eventController.ts";
import { checkJwt } from "../middleware/authMiddleware.ts";
import { syncUser } from "../middleware/syncUser.ts";
import { requireRole } from "../middleware/requireRole.ts";

const router = Router();

// Protect all event routes with Auth0 middleware and sync user to DB
router.get("/test", (req, res) => {
    res.json({
        message: "Backend is reachable",
        env: {
            aud: process.env.AUTH0_AUDIENCE,
            iss: process.env.AUTH0_ISSUER_BASE_URL,
        },
    });
});

router.use(checkJwt);
router.use(syncUser);

// event routes

// archived events routes
router.get("/archive", getArchivedEvents);

router.get("/", getEvents);

router.post("/", createEvent);

router.get("/:id", getEventById);

router.put("/:id", updateEvent);

router.delete("/:id", requireRole("Admin"), deleteEvent);

export default router;

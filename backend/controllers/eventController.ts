import type { Request, Response } from "express";
import prisma from "../prisma/client.ts";

import { Status } from "../types/index.ts";

export const getEventById = async (req: Request, res: Response) => {
    const idParam = req.params.id;
    if (typeof idParam !== "string") {
        return res.status(400).json({ error: "Invalid ID parameter" });
    }

    const eventId = parseInt(idParam);
    const event = await prisma.event.findUnique({
        where: { id: eventId },
    });

    if (!event) {
        return res.status(404).json({ error: "Event not found" });
    }

    res.json(event);
};

export const getEvents = async (req: Request, res: Response) => {
    const parsedLimit =
        typeof req.query.limit === "string"
            ? parseInt(req.query.limit, 10)
            : NaN;
    const limit =
        !isNaN(parsedLimit) && parsedLimit > 0
            ? Math.min(parsedLimit, 100)
            : 10;

    const events = await prisma.event.findMany({
        take: limit,
        orderBy: {
            createdAt: "desc",
        },
        where: {
            status: { not: Status.ARCHIVED },
        },
    });

    if (!events) {
        return res.status(404).json({ error: "Events not found" });
    }

    return res.status(200).json(events);
};

export const createEvent = async (req: Request, res: Response) => {
    console.log("[DEBUG] createEvent request body:", req.body);
    const { title, description, start, end, admin_id } = req.body;

    // Auth0 middleware injects req.auth
    const userId = (req as any).auth?.payload?.sub;
    if (!userId) {
        return res.status(401).json({ error: "Unauthorized: Missing user ID" });
    }

    if (!title || !start || !end) {
        return res.status(400).json({
            error: "Missing required fields: title, start, or end",
        });
    }

    try {
        const payloadToSave = {
            title,
            description: description || "",
            start: new Date(start),
            end: new Date(end),
            userId,
            adminId: admin_id ? parseInt(admin_id) : 1,
        };
        console.log("[DEBUG] createEvent payload saving to DB:", payloadToSave);

        const newEvent = await prisma.event.create({
            data: payloadToSave,
        });
        
        console.log("[DEBUG] createEvent DB response:", newEvent);

        return res.status(201).json(newEvent);
    } catch (error) {
        console.error("Error creating event:", error);
        return res.status(500).json({ error: "Failed to create event" });
    }
};

export const updateEvent = async (req: Request, res: Response) => {
    const { title, description, start, end, status, admin_id } = req.body;

    // Auth0 middleware injects req.auth
    const userId = (req as any).auth?.payload?.sub;
    if (!userId) {
        return res.status(401).json({ error: "Unauthorized: Missing user ID" });
    }

    if (!title || !start || !end) {
        return res.status(400).json({
            error: "Missing required fields: title, start, or end",
        });
    }

    const eventId = parseInt(req.params.id as string, 10);
    if (isNaN(eventId)) {
        return res.status(400).json({ error: "Invalid event ID format." });
    }

    try {
        const updatedEvent = await prisma.event.update({
            where: {
                id: eventId,
            },
            data: {
                title,
                description: description || "",
                start: new Date(start),
                end: new Date(end),
                userId,
                ...(admin_id && { adminId: parseInt(admin_id) }),
                ...(status && { status }),
            },
        });

        return res.status(200).json(updatedEvent);
    } catch (error) {
        console.error("Error updating event:", error);
        return res.status(500).json({ error: "Failed to update event" });
    }
};

export const deleteEvent = async (req: Request, res: Response) => {
    const userId = (req as any).auth?.payload?.sub;
    if (!userId) {
        return res.status(401).json({ error: "Unauthorized: Missing user ID" });
    }

    try {
        const deletedEvent = await prisma.event.delete({
            where: {
                id: parseInt(req.params.id as string),
            },
        });

        return res.status(200).json(deletedEvent);
    } catch (error) {
        console.error("Error deleting event:", error);
        return res.status(500).json({ error: "Failed to delete event" });
    }
};

export const getArchivedEvents = async (req: Request, res: Response) => {
    const userId = (req as any).auth?.payload?.sub;
    if (!userId) {
        return res.status(401).json({ error: "Unauthorized: Missing user ID" });
    }

    try {
        const user = await prisma.user.findUnique({
            where: {
                id: userId,
            },
        });

        if (!user) {
            return res.status(404).json({ error: "User not found" });
        }

        const allEvents = await prisma.event.findMany({
            where: {
                userId: userId,
                status: Status.ARCHIVED,
            },
        });

        if (allEvents.length) {
            const openEvents = allEvents.filter(
                (event) => event.status !== Status.OPEN,
            );

            if (!openEvents) {
                return res
                    .status(404)
                    .json({ error: "Archived events not found" });
            }

            return res.status(200).json(openEvents);
        }
    } catch (error) {
        console.error(
            "Error fetching archived event from the database:",
            error,
        );
        return res.status(500).json({ error: "Internal Server Error" });
    }
};

import { NextRequest, NextResponse } from "next/server";
import { z } from 'zod';
import prisma from "@/prisma/client";

const createEventSchema = z.object({
    title: z.string().min(3).max(255),
    start: z.string().min(16),
    end: z.string().min(16)
});

export async function POST(request: NextRequest) {
    const body = await request.json();
    const validation = createEventSchema.safeParse(body);
    if(!validation.success) {
        return NextResponse.json(validation.error.errors, { status: 400 });
    }

    const newEvent = await prisma.event.create({
        data: { title: body.title, start: body.start, end: body.end }
    });

    return NextResponse.json(newEvent, { status: 201 });
}
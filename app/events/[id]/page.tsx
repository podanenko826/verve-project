import { NextRequest, NextResponse } from 'next/server';
import React from 'react';
import { PrismaClient } from '@prisma/client';

export const EventEditPage = async (
  { params }: { params: { id: string } },
  request: NextRequest
) => {
  try {
    const prisma = new PrismaClient();

    const event = await prisma.event.findUnique({
      where: {
        event_id: parseInt(params.id),
      },
    });

    if (!event) {
      return NextResponse.json({ error: 'Event not found' }, { status: 404 });
    }

    return NextResponse.json(event);
  } catch (error) {
    console.error('Error fetching event from the database:', error);

    return NextResponse.json(
      { error: 'Internal Server Error' },
      { status: 500 }
    );
  }
  return <div>EventEditPage {params.id}</div>;
};

export default EventEditPage;

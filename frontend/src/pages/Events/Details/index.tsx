import { useEffect, useState } from "react";
import axios from "axios";

import SideBar from "../../../components/SideBar";
import NavBar from "../../../components/NavBar";
import { format } from "date-fns";
import { enUS } from "date-fns/locale";
import type { ProcessedEvent } from "@aldabil/react-scheduler/types";
import { useParams, useNavigate } from "react-router-dom";

import { Status } from "../../../types";
import type { Event } from "../../../types";

const DetailsPage = () => {
    const { id } = useParams();
    const navigate = useNavigate();

    const [selectedEvent, setSelectedEvent] = useState<Event>();

    const [isRenameModalOpen, setIsRenameModalOpen] = useState(false);
    const [newName, setNewName] = useState("");

    const [isTimeModalOpen, setIsTimeModalOpen] = useState(false);
    const [newStart, setNewStart] = useState("");
    const [newEnd, setNewEnd] = useState("");

    useEffect(() => {
        const fetchEvent = async () => {
            try {
                const response = await axios.get("/api/events");
                if (!Array.isArray(response.data)) {
                    return;
                }
                for (let i = 0; i < response.data.length; i++) {
                    if (id && response.data[i].id === parseInt(id)) {
                        setSelectedEvent(response.data[i]);
                    }
                }
            } catch (error) {
                console.error("Error fetching event:", error);
            }
        };

        fetchEvent();
    }, []);

    async function archiveEventOnServer(data: Event) {
        if (!data.id) {
            console.error("Id is required to delete an event.");
        }

        const updatedData = {
            ...data,
            status: data.status === Status.OPEN ? Status.ARCHIVED : Status.OPEN,
        };

        setSelectedEvent(updatedData);

        try {
            console.log(updatedData);
            const updatedEvent = await updateEventOnServer(
                data.id,
                updatedData,
            );
            console.log("Updated event on server:", updatedEvent);
        } catch (error) {
            console.error("Error archiving event:", error);
        }
    }

    const updateEventOnServer = async (
        updatedId: number,
        data: any,
    ): Promise<ProcessedEvent | undefined> => {
        try {
            const response = await axios.put(`/api/events/${updatedId}`, data);

            if (response.status === 200) {
                return response.data as ProcessedEvent;
            } else {
                console.error("Unexpected response status:", response.status);
                return undefined;
            }
        } catch (error) {
            console.error("Error updating event:", error);
            throw error;
        }
    };

    async function deleteEventOnServer(deletedId: number) {
        if (!deletedId) {
            return console.error("Id is required to delete an event.");
        }

        try {
            const response = await axios.delete(`/api/events/${deletedId}`);

            if (response.status === 200) {
                navigate("/events");
                return true; // Event deleted successfully
            } else {
                console.error("Unexpected response status:", response.status);
                return false; // Unexpected response status
            }
        } catch (error) {
            console.error("Error deleting event:", error);
            throw error; // Propagate the error or handle it as needed
        }
    }

    let startDate,
        startTime: string | null = null;

    if (selectedEvent && selectedEvent.start !== undefined) {
        const startDateTime = new Date(selectedEvent.start);
        startDate = format(startDateTime, "d MMMM yyyy", {
            locale: enUS,
        });
        startTime = format(startDateTime, "h:mm a", {
            // HH:mm (without a) for European time
            locale: enUS,
        });
    }

    let endDate,
        endTime: string | null = null;

    if (selectedEvent && selectedEvent.end !== undefined) {
        const endDateTime = new Date(selectedEvent.end);
        endDate = format(endDateTime, "d MMMM yyyy", {
            locale: enUS,
        });
        endTime = format(endDateTime, "h:mm a", {
            // HH:mm (without a) for European time
            locale: enUS,
        });
    }

    return (
        <>
            <div className="flex w-screen albertsans">
                <div className="hidden md:block">
                    <SideBar />
                </div>
                <div className="flex flex-col w-screen">
                    <NavBar />
                    <div className="flex flex-col px-8 md:px-16 pb-16">
                        <h1 className="text-4xl self-start font-bold text-gray-800 dark:text-gray-100 mb-10">
                            Event details
                        </h1>
                        {selectedEvent ? (
                            <>
                                <p className="font-medium">Name</p>
                                <h1 className="mb-10">
                                    {selectedEvent?.title}
                                </h1>

                                <p className="font-medium">Description</p>
                                <h1 className="mb-10">
                                    {selectedEvent?.description}
                                </h1>

                                <p className="font-medium">Time Duration</p>
                                {startDate === endDate
                                    ? startDate
                                    : "From " + startDate + " to " + endDate}
                                <h1 className="mb-3"></h1>
                                <h1 className="mb-10">
                                    {startTime} - {endTime}
                                </h1>

                                {/* <p className="font-medium">Ending time</p>
                <h1 className="mb-10">{endDate}</h1> */}

                                <p className="font-medium">Status</p>
                                <h1 className="mb-10">
                                    {selectedEvent.status === "OPEN"
                                        ? "Opened"
                                        : selectedEvent.status === "ARCHIVED" || selectedEvent.status === "CLOSED"
                                          ? "Archived"
                                          : "In Progress"}
                                </h1>
                                <div className="space-x-5">
                                    <button
                                        onClick={() => {
                                            setNewName(selectedEvent.title);
                                            setIsRenameModalOpen(true);
                                        }}
                                        className="px-2 h-10 bg-zinc-200 dark:bg-zinc-700 hover:bg-zinc-300 dark:hover:bg-zinc-500 active:bg-zinc-400 duration-300 rounded-[4.5px]"
                                    >
                                        Rename
                                    </button>
                                    <button
                                        onClick={() => {
                                            if (selectedEvent.start && selectedEvent.end) {
                                                const startDate = new Date(selectedEvent.start);
                                                const endDate = new Date(selectedEvent.end);
                                                setNewStart(startDate.toISOString().slice(0, 16));
                                                setNewEnd(endDate.toISOString().slice(0, 16));
                                            }
                                            setIsTimeModalOpen(true);
                                        }}
                                        className="px-2 h-10 bg-zinc-200 dark:bg-zinc-700 hover:bg-zinc-300 dark:hover:bg-zinc-500 active:bg-zinc-400 duration-300 rounded-[4.5px]"
                                    >
                                        Change time
                                    </button>
                                    <button
                                        onClick={() =>
                                            deleteEventOnServer(
                                                selectedEvent.id,
                                            )
                                        }
                                        className="px-2 h-10 bg-zinc-200 dark:bg-zinc-700 hover:bg-zinc-300 dark:hover:bg-zinc-500 active:bg-zinc-400 duration-300 rounded-[4.5px]"
                                    >
                                        Delete
                                    </button>
                                    <button
                                        onClick={() =>
                                            archiveEventOnServer(selectedEvent)
                                        }
                                        className="px-2 h-10 bg-zinc-200 dark:bg-zinc-700 hover:bg-zinc-300 dark:hover:bg-zinc-500 active:bg-zinc-400 duration-300 rounded-[4.5px]"
                                    >
                                        {selectedEvent.status === Status.OPEN
                                            ? "Archive"
                                            : "Unarchive"}
                                    </button>
                                </div>
                            </>
                        ) : (
                            <h1>Event {id} does not exist!</h1>
                        )}
                    </div>
                </div>
            </div>

            {/* Rename Modal */}
            {isRenameModalOpen && selectedEvent && (
                <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
                    <div className="bg-white dark:bg-zinc-800 p-8 rounded-xl shadow-2xl w-96 text-gray-800 dark:text-gray-100">
                        <h2 className="text-xl font-bold mb-4">Rename Event</h2>
                        <input 
                            type="text" 
                            className="w-full border border-gray-300 dark:border-zinc-600 rounded-md p-2 mb-4 dark:bg-zinc-700"
                            value={newName}
                            onChange={(e) => setNewName(e.target.value)}
                            placeholder="New Event Name"
                        />
                        <div className="flex justify-end space-x-3">
                            <button onClick={() => setIsRenameModalOpen(false)} className="px-4 py-2 bg-gray-200 dark:bg-zinc-700 rounded-md">Cancel</button>
                            <button onClick={async () => {
                                if (!newName) return;
                                const updatedData = { ...selectedEvent, title: newName };
                                const result = await updateEventOnServer(selectedEvent.id, updatedData);
                                if (result) setSelectedEvent(updatedData);
                                setIsRenameModalOpen(false);
                            }} className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700">Save</button>
                        </div>
                    </div>
                </div>
            )}

            {/* Change Time Modal */}
            {isTimeModalOpen && selectedEvent && (
                <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
                    <div className="bg-white dark:bg-zinc-800 p-8 rounded-xl shadow-2xl w-96 text-gray-800 dark:text-gray-100">
                        <h2 className="text-xl font-bold mb-4">Change Time</h2>
                        <div className="mb-4">
                            <label className="block text-sm mb-1">Start Time</label>
                            <input 
                                type="datetime-local" 
                                className="w-full border border-gray-300 dark:border-zinc-600 rounded-md p-2 dark:bg-zinc-700"
                                value={newStart}
                                onChange={(e) => setNewStart(e.target.value)}
                            />
                        </div>
                        <div className="mb-6">
                            <label className="block text-sm mb-1">End Time</label>
                            <input 
                                type="datetime-local" 
                                className="w-full border border-gray-300 dark:border-zinc-600 rounded-md p-2 dark:bg-zinc-700"
                                value={newEnd}
                                onChange={(e) => setNewEnd(e.target.value)}
                            />
                        </div>
                        <div className="flex justify-end space-x-3">
                            <button onClick={() => setIsTimeModalOpen(false)} className="px-4 py-2 bg-gray-200 dark:bg-zinc-700 rounded-md">Cancel</button>
                            <button onClick={async () => {
                                if (!newStart || !newEnd) return;
                                const updatedData = { ...selectedEvent, start: new Date(newStart), end: new Date(newEnd) };
                                const result = await updateEventOnServer(selectedEvent.id, updatedData);
                                if (result) setSelectedEvent(updatedData);
                                setIsTimeModalOpen(false);
                            }} className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700">Save</button>
                        </div>
                    </div>
                </div>
            )}
        </>
    );
};

export default DetailsPage;

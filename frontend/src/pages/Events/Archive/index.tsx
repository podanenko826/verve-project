import { useEffect, useState } from "react";
import axios from "axios";

import SideBar from "../../../components/SideBar";
import NavBar from "../../../components/NavBar";
import { format } from "date-fns";
import { enUS } from "date-fns/locale";
import type { ProcessedEvent } from "@aldabil/react-scheduler/types";

import { IoRefresh } from "react-icons/io5";

import { Status } from "../../../types";
import type { Event } from "../../../types";

const EventEditPage = () => {
    const [archivedEvents, setArchivedEvents] = useState<Event[]>([]);

    useEffect(() => {
        const fetchEvent = async () => {
            try {
                const response = await axios.get("/api/events/archive");
                if (!Array.isArray(response.data)) {
                    setArchivedEvents([]);
                    return;
                }
                setArchivedEvents(response.data);
            } catch (error) {
                console.error("Error fetching event:", error);
            }
        };

        fetchEvent();
    }, []);

    const refetchData = async () => {
        try {
            const response = await axios.get("/api/events/archive");
            if (!Array.isArray(response.data)) {
                setArchivedEvents([]);
                return;
            }
            setArchivedEvents(response.data);
        } catch (error) {
            console.error("Error fetching event:", error);
        }
    };

    async function unarchiveEventOnServer(data: Event) {
        if (!data.id) {
            console.error("Id is required to delete an event.");
        }

        const updatedData: Event = {
            ...data,
            status: data.status === Status.OPEN ? Status.CLOSED : Status.OPEN,
        };

        try {
            console.log(updatedData);
            const updatedEvent = await updateEventOnServer(
                data.id,
                updatedData,
            );

            refetchData();

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
                refetchData();
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

    return (
        <>
            <div className="flex w-screen albertsans">
                <div className="hidden md:block">
                    <SideBar />
                </div>
                <div className="flex flex-col w-screen">
                    <div>
                        <NavBar />
                    </div>

                    <div className="flex flex-col px-8 md:px-16 pb-16">
                        <div className="flex justify-between items-center mb-8 w-full">
                            <h1 className="text-4xl font-bold text-gray-800 dark:text-gray-100">
                                Archived events
                            </h1>

                            <button
                                onClick={() => refetchData()}
                                className="font-sans font-medium text-sm rounded-xl h-9 bg-white dark:bg-slate-800 border border-gray-200 dark:border-slate-700 hover:bg-gray-50 dark:hover:bg-slate-700 active:bg-gray-100 dark:active:bg-slate-600 transition-colors duration-200 px-4 py-1.5 flex items-center shadow-sm text-gray-700 dark:text-gray-200"
                            >
                                <IoRefresh className="text-lg mr-2" />
                                Refresh
                            </button>
                        </div>
                        {archivedEvents && archivedEvents.length > 0 ? (
                            <div className="overflow-x-auto rounded-xl border border-zinc-200 dark:border-zinc-800 shadow-sm w-full bg-white dark:bg-slate-800">
                                <table className="w-full text-left text-sm text-gray-700 dark:text-gray-300">
                                    <thead className="bg-zinc-50 dark:bg-zinc-900/50 text-xs uppercase font-semibold text-gray-500 dark:text-gray-400 border-b border-zinc-200 dark:border-zinc-800">
                                        <tr>
                                            <th
                                                scope="col"
                                                className="px-6 py-4"
                                            >
                                                Name
                                            </th>
                                            <th
                                                scope="col"
                                                className="px-6 py-4 hidden md:table-cell"
                                            >
                                                Description
                                            </th>
                                            <th
                                                scope="col"
                                                className="px-6 py-4"
                                            >
                                                Duration
                                            </th>
                                            <th
                                                scope="col"
                                                className="px-6 py-4"
                                            >
                                                Status
                                            </th>
                                            <th
                                                scope="col"
                                                className="px-6 py-4 text-center"
                                            >
                                                Actions
                                            </th>
                                        </tr>
                                    </thead>
                                    <tbody className="divide-y divide-zinc-100 dark:divide-zinc-800">
                                        {archivedEvents.map((item) => (
                                            <tr
                                                key={item.id}
                                                className="hover:bg-zinc-50 dark:hover:bg-zinc-800/50 transition-colors"
                                            >
                                                <td className="px-6 py-4 font-medium text-gray-900 dark:text-white whitespace-nowrap">
                                                    {item.title}
                                                </td>
                                                <td
                                                    className="px-6 py-4 hidden md:table-cell max-w-xs truncate"
                                                    title={
                                                        item.description || ""
                                                    }
                                                >
                                                    {item.description || (
                                                        <span className="text-gray-400 italic">
                                                            No description
                                                        </span>
                                                    )}
                                                </td>
                                                <td className="px-6 py-4 whitespace-nowrap">
                                                    <div className="flex flex-col space-y-1">
                                                        <span>
                                                            {format(
                                                                new Date(
                                                                    item.start,
                                                                ),
                                                                "d MMM yyyy, h:mm a",
                                                                {
                                                                    locale: enUS,
                                                                },
                                                            )}
                                                        </span>
                                                        <span className="text-gray-400 dark:text-gray-500 text-xs">
                                                            to{" "}
                                                            {format(
                                                                new Date(
                                                                    item.end,
                                                                ),
                                                                "d MMM yyyy, h:mm a",
                                                                {
                                                                    locale: enUS,
                                                                },
                                                            )}
                                                        </span>
                                                    </div>
                                                </td>
                                                <td className="px-6 py-4">
                                                    <span
                                                        className={`px-2.5 py-1 rounded-full text-xs font-medium ${item.status === Status.CLOSED ? "bg-zinc-100 text-zinc-600 dark:bg-zinc-700 dark:text-zinc-300" : "bg-blue-100 text-blue-600 dark:bg-blue-900/40 dark:text-blue-400"}`}
                                                    >
                                                        {item.status ===
                                                        Status.CLOSED
                                                            ? "Archived"
                                                            : "Open"}
                                                    </span>
                                                </td>
                                                <td className="px-6 py-4 flex justify-center space-x-2">
                                                    <button
                                                        onClick={() =>
                                                            unarchiveEventOnServer(
                                                                item,
                                                            )
                                                        }
                                                        className="px-3 py-1.5 text-xs font-medium text-blue-600 hover:text-blue-800 bg-blue-50 hover:bg-blue-100 dark:text-blue-400 dark:bg-blue-900/30 dark:hover:bg-blue-900/50 rounded-lg transition-colors"
                                                    >
                                                        {item.status ===
                                                        Status.OPEN
                                                            ? "Archive"
                                                            : "Unarchive"}
                                                    </button>
                                                    <button
                                                        onClick={() =>
                                                            deleteEventOnServer(
                                                                item.id,
                                                            )
                                                        }
                                                        className="px-3 py-1.5 text-xs font-medium text-red-600 hover:text-red-800 bg-red-50 hover:bg-red-100 dark:text-red-400 dark:bg-red-900/30 dark:hover:bg-red-900/50 rounded-lg transition-colors"
                                                    >
                                                        Delete
                                                    </button>
                                                </td>
                                            </tr>
                                        ))}
                                    </tbody>
                                </table>
                            </div>
                        ) : (
                            <div className="mt-8 text-gray-500 italic p-6 border border-dashed rounded-xl border-gray-300 dark:border-gray-700 mr-12 text-center">
                                No archived events found.
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </>
    );
};

export default EventEditPage;

import { Scheduler } from "@aldabil/react-scheduler";
import { useState, useEffect } from "react";
import { useAuth0 } from "@auth0/auth0-react";
import axios from "axios";
import { Typography } from "@mui/material";
import PersonRoundedIcon from "@mui/icons-material/PersonRounded";
import type {
    EventActions,
    ProcessedEvent,
    SchedulerHelpers,
} from "@aldabil/react-scheduler/types";
import { useSearchParams } from "react-router-dom";

import { IoRefresh } from "react-icons/io5";
import { RESOURCES } from "./resources";
import type { Event } from "../types";

const CustomEditor = ({ scheduler, onConfirm }: { scheduler: SchedulerHelpers, onConfirm: (e: ProcessedEvent, a: EventActions) => Promise<any> }) => {
    const event = scheduler.edited;
    
    const [title, setTitle] = useState(event?.title || "");
    const [subtitle, setSubtitle] = useState(event?.subtitle || "");
    
    // Helper to format date for datetime-local input (YYYY-MM-DDThh:mm)
    const formatDateForInput = (date: Date) => {
        const offset = date.getTimezoneOffset() * 60000;
        return new Date(date.getTime() - offset).toISOString().slice(0, 16);
    };

    const [start, setStart] = useState<string>(
        formatDateForInput(event?.start || scheduler.state.start.value as Date || new Date())
    );
    const [end, setEnd] = useState<string>(
        formatDateForInput(event?.end || scheduler.state.end.value as Date || new Date(Date.now() + 3600000))
    );

    const handleSubmit = async () => {
        try {
            scheduler.loading(true);
            const processedEvent: ProcessedEvent = {
                event_id: event?.event_id || Math.random().toString(36).substr(2, 9),
                title,
                subtitle,
                start: new Date(start),
                end: new Date(end),
            };
            
            // EXPLICTLY save to backend first
            const savedEvent = await onConfirm(processedEvent, event ? "edit" : "create");
            
            // Then update the UI
            await scheduler.onConfirm(savedEvent || processedEvent, event ? "edit" : "create");
            scheduler.close();
        } catch (error) {
            console.error("[DEBUG] CustomEditor error:", error);
        } finally {
            scheduler.loading(false);
        }
    };

    return (
        <div className="p-6 w-full md:w-[500px] bg-white rounded-xl flex flex-col gap-5">
            <div className="flex justify-between items-center pb-3 border-b border-gray-100">
                <h2 className="text-xl font-bold text-gray-800">{event ? "Edit Event" : "Add Event"}</h2>
            </div>
            
            <div className="flex flex-col gap-1.5">
                <label className="text-sm font-semibold text-gray-700">Title <span className="text-red-500">*</span></label>
                <input type="text" value={title as string} onChange={e => setTitle(e.target.value)} className="w-full p-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-all" placeholder="Event Title" />
            </div>

            <div className="flex flex-col gap-1.5">
                <label className="text-sm font-semibold text-gray-700">Description</label>
                <textarea rows={3} value={subtitle as string} onChange={e => setSubtitle(e.target.value)} className="w-full p-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-all resize-none" placeholder="Event Description"></textarea>
            </div>

            <div className="flex gap-4">
               <div className="flex flex-col w-full gap-1.5">
                  <label className="text-sm font-semibold text-gray-700">Start <span className="text-red-500">*</span></label>
                  <input type="datetime-local" value={start} onChange={e => setStart(e.target.value)} className="w-full p-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-all text-gray-800" />
               </div>
               <div className="flex flex-col w-full gap-1.5">
                  <label className="text-sm font-semibold text-gray-700">End <span className="text-red-500">*</span></label>
                  <input type="datetime-local" value={end} onChange={e => setEnd(e.target.value)} className="w-full p-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-all text-gray-800" />
               </div>
            </div>
            
            <div className="flex justify-end gap-3 mt-2">
                <button onClick={scheduler.close} className="px-5 py-2.5 text-sm font-semibold text-gray-700 bg-gray-100 hover:bg-gray-200 rounded-lg transition-colors">CANCEL</button>
                <button onClick={handleSubmit} disabled={!title || !start || !end} className="px-5 py-2.5 text-sm font-semibold text-white bg-blue-600 hover:bg-blue-700 disabled:bg-blue-400 disabled:cursor-not-allowed rounded-lg transition-colors">
                    CONFIRM
                </button>
            </div>
        </div>
    );
};

const ISheduller = () => {
    const [events, setEvents] = useState<Event[]>([]);
    const [isDataLoaded, setIsDataLoaded] = useState(false);
    const [eventStart, setEventStart] = useState<
        { id: string; date: Date } | undefined
    >();
    const [id, setId] = useState("");
    const { user } = useAuth0();
    const isAdmin = user?.['https://verve.com/roles']?.includes('Admin');

    const [searchParams] = useSearchParams();
    const search = searchParams.get("id");

    useEffect(() => {
        const findEvent = async () => {
            if (search) {
                try {
                    const response = await axios.get(
                        `/api/events/${parseInt(search)}`,
                    );
                    setEventStart({
                        id: search,
                        date: new Date(response.data.start),
                    });
                } catch (error) {
                    console.error("Error finding event:", error);
                    // On failure, fall back so we don't get stuck hiding the calendar forever
                    setEventStart({ id: search, date: new Date() });
                }
            } else {
                setEventStart(undefined);
            }
        };

        findEvent();
    }, [search]);

    useEffect(() => {
        const fetchData = async () => {
            try {
                const response = await axios.get("/api/events");
                if (!Array.isArray(response.data)) {
                    setEvents([]);
                } else {
                    setEvents(response.data);
                }
            } catch (error) {
                console.error("Error fetching event:", error);
            } finally {
                setIsDataLoaded(true);
            }
        };

        fetchData();
    }, []);

    useEffect(() => {
        const handleRefresh = () => {
            refetchData();
        };

        window.addEventListener("refreshCalendar", handleRefresh);
        return () => {
            window.removeEventListener("refreshCalendar", handleRefresh);
        };
    }, []);

    const addEventOnServer = async (
        data: any,
    ): Promise<ProcessedEvent | undefined> => {
        try {
            const response = await axios.post("/api/events", data);

            // Handle the response or return relevant data
            if (response.status === 201) {
                return response.data as ProcessedEvent;
            } else {
                console.error("Unexpected response status:", response.status);
                return undefined;
            }
        } catch (error) {
            console.error("Error adding event:", error);
            throw error; // Propagate the error or handle it as needed
        }
    };

    const updateEventOnServer = async (
        updatedId: any,
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

    const toggleEventStatus = async (event: any) => {
        const newStatus = event.status === "CLOSED" ? "OPEN" : "CLOSED";
        const dataToUpdate = {
            title: event.title,
            description: event.subtitle || event.description,
            start: event.start,
            end: event.end,
            status: newStatus,
            admin_id: event.admin_id,
        };
        await updateEventOnServer(event.event_id || event.id, dataToUpdate);
        refetchData();
    };

    async function deleteEventOnServer(deletedId: any) {
        if (!deletedId) {
            return console.error("Id is required to delete an event.");
        }

        try {
            const response = await axios.delete(`/api/events/${deletedId}`);

            if (response.status === 200) {
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

    const refetchData = async () => {
        try {
            const response = await axios.get("/api/events");
            if (!Array.isArray(response.data)) {
                setEvents([]);
                return;
            }
            setEvents(response.data);
        } catch (error) {
            console.error("Error fetching event:", error);
        }
    };
    const handleConfirm = async (
        event: ProcessedEvent,
        action: EventActions,
    ) => {
        console.log("[DEBUG] handleConfirm START. action:", action, "event:", event);

        let returnedEvent: any = {
            ...event,
            description: event.subtitle || "", // Map subtitle from Scheduler to description for backend
        };

        console.log("[DEBUG] initial returnedEvent:", returnedEvent);

        if (action === "edit") {
            const updated = await updateEventOnServer(
                returnedEvent.event_id || returnedEvent.id,
                returnedEvent,
            );
            console.log("[DEBUG] updated from server:", updated);
            if (updated) {
                returnedEvent = { 
                    ...returnedEvent, 
                    ...updated, 
                    event_id: updated.id,
                    start: new Date(updated.start || returnedEvent.start),
                    end: new Date(updated.end || returnedEvent.end)
                };
            }
        }
        if (action === "create") {
            const created = await addEventOnServer(returnedEvent);
            console.log("[DEBUG] created from server:", created);
            if (created) {
                // Use the real ID from the backend so future updates work!
                returnedEvent = { 
                    ...returnedEvent, 
                    ...created, 
                    event_id: created.id,
                    start: new Date(created.start || returnedEvent.start),
                    end: new Date(created.end || returnedEvent.end)
                };
            }
        }

        console.log("[DEBUG] final returnedEvent before refetchData:", returnedEvent);

        refetchData();

        return returnedEvent;
    };

    const handleEventDrop = async (
        _event: any,
        _droppedOn: Date,
        updatedEvent: any,
        _originalEvent: any,
    ) => {
        let returnedEvent: any = {
            ...updatedEvent,
            description: updatedEvent.subtitle || "",
        };
        await updateEventOnServer(
            returnedEvent.event_id || returnedEvent.id,
            returnedEvent,
        );
        refetchData();
        return updatedEvent;
    };

    const handleDelete = async (deletedId: any) => {
        await deleteEventOnServer(deletedId);

        return deletedId;
    };

    const baseProps: any = {
        view: "day",
        hourFormat: "24",
        onConfirm: handleConfirm,
        onDelete: handleDelete,
        onEventDrop: handleEventDrop,
        onSelectedDateChange: refetchData,
        draggable: true,
        events: events.map((mappedEvent: any) => ({
            event_id: mappedEvent.id,
            title: mappedEvent.title,
            subtitle: mappedEvent.description,
            start: new Date(mappedEvent.start),
            end: new Date(mappedEvent.end),
            status: mappedEvent.status,
            color: mappedEvent.status === "CLOSED" ? "#10b981" : "#3b82f6",
        })),
        height: 660,
        customEditor: (scheduler: SchedulerHelpers) => <CustomEditor scheduler={scheduler} onConfirm={handleConfirm} />,
        fields: [],
        viewerExtraComponent: (fields: any[], event: any) => {
            return (
                <>
                    <div className="mt-2 mb-2 flex justify-start items-center">
                        <button
                            onClick={() => toggleEventStatus(event)}
                            className={`text-sm font-medium px-3 py-1.5 rounded-md transition-colors duration-200 text-white ${
                                event.status === "CLOSED"
                                    ? "bg-slate-500 hover:bg-slate-600"
                                    : "bg-emerald-500 hover:bg-emerald-600"
                            }`}
                        >
                            {event.status === "CLOSED"
                                ? "Mark as Open"
                                : "Mark as Completed"}
                        </button>
                    </div>
                </>
            );
        },
    };

    const isSearchReady = search
        ? eventStart && eventStart.id === search
        : true;

    const shouldRenderScheduler = isSearchReady && isDataLoaded;

    return (
        <div className="max-h-min md:max-h-screen h-5/6 rounded-2xl mx-0 albertsans lg:mx-2 overflow-y-scroll">
            {shouldRenderScheduler && (
                <>
                    <button
                        onClick={() => refetchData()}
                        className="text-black dark:text-zinc-400 absolute font-sans rounded-[4.5px] hover:bg-zinc-100 dark:hover:bg-zinc-700 active:bg-zinc-300 dark:active:bg-zinc-500 duration-300 py-1.5 px-1.5 p mt-0.5 flex ml-[220px] custom-z-index"
                    >
                        <IoRefresh className="text-2xl mr-1 pb-0.5" />
                        Refresh
                    </button>
                    <Scheduler
                        key={search ? `search-${search}` : "default"}
                        {...baseProps}
                        selectedDate={
                            search && eventStart && eventStart.id === search
                                ? eventStart.date
                                : new Date()
                        }
                    />
                </>
            )}

            {isAdmin && (
                <div className="ml-5">
                    <label>
                        Enter ID:
                        <input
                            className="bg-slate-200 text-black ml-3 pl-2"
                            placeholder="id"
                            type="text"
                            value={id}
                            onChange={(e) => setId(e.target.value)}
                        />
                    </label>
                    <button
                        className="w-20 m-4 h-10 bg-slate-200 dark:bg-slate-600 hover:bg-slate-300 active:bg-slate-400 border-2 dark:border-0"
                        onClick={() => handleDelete(id)}
                    >
                        Delete
                    </button>
                </div>
            )}
        </div>
    );
};

export default ISheduller;

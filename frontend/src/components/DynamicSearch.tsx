import React, { useEffect, useState, useMemo } from "react";
import { IoMdSearch } from "react-icons/io";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { enUS } from "date-fns/locale";
import { format } from "date-fns";
import type { ProcessedEvent } from "@aldabil/react-scheduler/types";

import { ImCross } from "react-icons/im";
import { PiWarningOctagonFill } from "react-icons/pi";
import {
    MdDelete,
    MdInfoOutline,
    MdCheckCircle,
    MdRadioButtonUnchecked,
} from "react-icons/md";
import { RiArchive2Fill } from "react-icons/ri";
// import { useSession } from 'next-auth/react';

import { Status } from "../types";
import type { Event } from "../types";

const DynamicSearch = () => {
    const [data, setData] = useState("");
    const [selectedEvent, setSelectedEvent] = useState<Event>();
    // removed nearestEvents state
    const [eventTitle, setEventTitle] = useState("");

    const [pageChosen, setPageChosen] = useState<string>("allEvents");
    const [events, setEvents] = useState<Event[]>([]);
    // const [eventSearchFailed, setEventSearchFailed] = useState<boolean>(false);
    // const [eventDeleted, setEventDeleted] = useState<boolean>(false);
    // const [eventArchived, setEventArchived] = useState<boolean>(false);
    // const [unexpectedProblem, setUnexpectedProblem] = useState<boolean>(false);
    const [message, setMessage] = useState<string>("");

    const [searchOpened, setSearchOpened] = useState<boolean>(false);

    const navigate = useNavigate();

    useEffect(() => {
        const fetchEvent = async () => {
            try {
                const response = await axios.get("/api/events");
                if (!Array.isArray(response.data)) {
                    setEvents([]);
                    return;
                }

                setEvents(response.data);
            } catch (error) {
                console.error(
                    "Error fetching event:",
                    axios.isAxiosError(error) ? error.response?.data : error,
                );
            }
        };

        fetchEvent();
    }, []);

    useEffect(() => {
        const handleClickOutside = (event: MouseEvent) => {
            const target = event.target as HTMLElement;
            // Check if the click occurred outside of the context menu
            if (!target.closest(".dynamic-search")) {
                if (message === "") {
                    setSearchOpened(false);
                }
            }
        };

        document.addEventListener("click", handleClickOutside);

        return () => {
            document.removeEventListener("click", handleClickOutside);
        };
    }, [message]);

    const refetchData = async (overrideData?: string) => {
        try {
            const response = await axios.get("/api/events");
            if (!Array.isArray(response.data)) {
                setEvents([]);
                return;
            }

            console.log("refetching");

            const currentData =
                overrideData !== undefined ? overrideData : data;
            if (currentData) {
                const searchLower = currentData.toLowerCase();
                const filteredEvents = response.data.filter((event: Event) =>
                    event.title
                        .toLowerCase()
                        .split(/\s+/)
                        .some((word: string) => word.startsWith(searchLower)),
                );
                setEvents(filteredEvents);
            } else {
                setEvents(response.data);
            }
        } catch (error) {
            console.error("Error fetching event:", error);
        }
    };

    const nearestEvents = useMemo(() => {
        if (Array.isArray(events) && events.length) {
            const now = new Date().getTime();

            const validEvents = events.filter((e) => {
                const endDate =
                    e.end instanceof Date
                        ? e.end.getTime()
                        : new Date(e.end).getTime();
                return endDate >= now; // hide events that are past their end date
            });

            validEvents.sort((a, b) => {
                const startA =
                    a.start instanceof Date
                        ? a.start.getTime()
                        : new Date(a.start).getTime();
                const startB =
                    b.start instanceof Date
                        ? b.start.getTime()
                        : new Date(b.start).getTime();
                return startB - startA; // descending order
            });

            return validEvents;
        }
        return [];
    }, [events]);

    async function deleteEventOnServer(
        event: React.MouseEvent<HTMLButtonElement>,
        deletedId: number,
    ) {
        event.preventDefault();

        if (!deletedId) {
            setMessage("unexpected");
            setTimeout(() => {
                setMessage("");
            }, 4200);
            return false;
        }

        try {
            const response = await axios.delete(`/api/events/${deletedId}`);

            if (response.status === 200) {
                setMessage("deleted");
                setTimeout(() => {
                    setMessage("");
                }, 4200);
                setData("");
                setSelectedEvent(undefined);
                setEventTitle("");
                refetchData("");
                window.dispatchEvent(new Event("refreshCalendar"));
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

    async function archiveEventOnServer(
        event: React.MouseEvent<HTMLButtonElement>,
        archivedId: number,
    ) {
        event.preventDefault();

        if (!archivedId) {
            setMessage("unexpected");
            setTimeout(() => {
                setMessage("");
            }, 4200);

            return false;
        }

        const updatedData = {
            ...selectedEvent,
            status:
                selectedEvent!.status === Status.ARCHIVED
                    ? Status.OPEN
                    : Status.ARCHIVED,
        };

        // setSelectedEvent(updatedData);

        try {
            console.log(updatedData);
            const updatedEvent = await updateEventOnServer(
                archivedId,
                updatedData,
            );

            setMessage("archived");
            setTimeout(() => {
                setMessage("");
            }, 4200);

            setData("");
            setSelectedEvent(undefined);
            setEventTitle("");
            refetchData("");
            window.dispatchEvent(new Event("refreshCalendar"));

            console.log("Updated event on server:", updatedEvent);
        } catch (error) {
            console.error("Error archiving event:", error);
        }
    }

    const updateEventOnServer = async (
        updatedId: number,
        data: Partial<Event>,
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

    const toggleEventStatus = async (
        e: React.MouseEvent<HTMLButtonElement>,
        event: Event,
    ) => {
        e.preventDefault();
        const updatedData = {
            ...event,
            status:
                event.status === Status.CLOSED ? Status.OPEN : Status.CLOSED,
        };
        try {
            await updateEventOnServer(event.id, updatedData);
            setSelectedEvent(updatedData as Event);
            refetchData("");
            window.dispatchEvent(new Event("refreshCalendar"));
        } catch (error) {
            console.error("Error toggling event status:", error);
        }
    };

    const handleInput = async (input: string) => {
        setData(input);

        try {
            if (!input) {
                setSearchOpened(true);
                setSelectedEvent(undefined);
                setEventTitle("");
                refetchData("");
                return;
            }

            const response = await axios.get("/api/events");
            if (!Array.isArray(response.data)) {
                setEvents([]);
                return;
            }

            setSearchOpened(true);

            const searchLower = input.toLowerCase();
            const filteredEvents = response.data.filter((event: Event) =>
                event.title
                    .toLowerCase()
                    .split(/\s+/)
                    .some((word: string) => word.startsWith(searchLower)),
            );
            setEvents(filteredEvents);

            const exactMatch = response.data.find(
                (e: Event) => e.title.toLowerCase() === searchLower,
            );

            if (exactMatch) {
                setSelectedEvent(exactMatch);
                setEventTitle(exactMatch.title);
            } else {
                setSelectedEvent(undefined);
                setEventTitle("");
            }
        } catch (error) {
            console.error("Error fetching event:", error);
        }
    };

    const handleEventChoose = (
        event: React.MouseEvent<HTMLButtonElement>,
        selectedEventId: number,
    ) => {
        event.preventDefault();

        for (let i = 0; i < events.length; i++) {
            if (events[i].id === selectedEventId) {
                setData(events[i].title);
                setEventTitle(events[i].title);
                setSelectedEvent(events[i]);
            }
        }
    };

    const handleDetails = (event: React.MouseEvent<HTMLButtonElement>) => {
        event.preventDefault();

        navigate("/events/details/" + selectedEvent?.id);
    };

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

    const handleSubmit = (event: React.FormEvent<HTMLFormElement>) => {
        event.preventDefault();

        if (data) {
            for (const event of events) {
                if (data === event.title) {
                    window.location.href = `/events?id=${event.id}`;
                    return;
                }
            }
        }
        if (data) setMessage("searchFailed");
        else setMessage("nameRequired");
        setTimeout(() => {
            setMessage("");
        }, 4200);
        setSearchOpened(true);
    };

    const handleDynamicSearchClick = () => {
        // setSearchOpened(false);
        // setSearchOpened(true);
        setSearchOpened(!searchOpened);

        refetchData();
    };

    const handlePageChange = (
        event: React.MouseEvent<HTMLButtonElement>,
        page: string,
    ) => {
        event.preventDefault();

        setPageChosen(page);
    };
    // const session = useSession();

    return (
        <div>
            <form
                onSubmit={handleSubmit}
                autoComplete="off"
                className={`${
                    message !== "" || searchOpened
                        ? "rounded-xl"
                        : "dark:bg-gray-800 rounded-xl active:scale-105 active:border-[1.5px]"
                } dynamic-search w-40 md:w-72 lg:w-[350px] albertsans flex flex-col z-50 mt-6 bg-white max-w-[350px] outline-none custom-z-index-greater ease-in-out transition-all duration-500`}
            >
                <div
                    onClick={handleDynamicSearchClick}
                    className={`${
                        message !== "" || searchOpened
                            ? "rounded-t-xl"
                            : "dark:bg-gray-800 rounded-xl"
                    }  flex shadow-lg hover:shadow-sm ease-in-out transition-all duration-500`}
                >
                    {message === "" && (
                        <input
                            type="search"
                            id="search"
                            name="search"
                            value={data}
                            onChange={(e) => handleInput(e.target.value)}
                            placeholder={searchOpened ? "" : "Search"}
                            className={`${
                                message !== ""
                                    ? "rounded-t-xl"
                                    : searchOpened
                                      ? "rounded-tl-xl"
                                      : "dark:bg-gray-800 rounded-l-xl"
                            }  text-top w-full bg-white opacity-80 max-w-[350px] max-h-8 pl-3 p-1 outline-none custom-z-index-greater ease-in-out transition-all duration-500`}
                        />
                    )}
                    <button
                        type="submit"
                        className={`${message !== "" ? "hidden" : ""} ${
                            searchOpened
                                ? "rounded-tr-[10px]"
                                : "rounded-r-[10px]"
                        } w-9 h-8 flex items-center p-1 justify-center hover:bg-slate-200 bg-white opacity-80 text-zinc-300 hover:text-zinc-400 duration-200 custom-z-index-greatest transition-all`}
                    >
                        <IoMdSearch className="text-[25px]" />
                    </button>
                    {/* {!eventSearchFailed &&
            !eventDeleted &&
            !eventArchived &&
            !unexpectedProblem && (
              <button
                className={`dynamic-search custom-z-index-greater absolute ml-[170px] text-[15px] shadow-lg md:ml-[248px] lg:ml-[279px] mt-0.5 px-2.5 py-0.5 bg-gray-50 dark:bg-gray-700 hover:bg-gray-100 dark:hover:bg-slate-600 active:bg-slate-200 dark:active:bg-slate-800 duration-500 transition-all rounded-xl text-slate-600 dark:text-slate-300`}
                onClick={handleDynamicSearchClick}
                type="submit"
              >
                Search
              </button>
            )} */}
                </div>
                {searchOpened && (
                    <>
                        <div
                            className={`${
                                message !== "" || searchOpened
                                    ? "shadow-lg hover:shadow-md active:shadow-lg bg-white dark:bg-gray-800"
                                    : "bg-transparent"
                            } ${message !== "" && "h-[76px] rounded-xl"}
                    dynamic-search w-full overflow-y-auto overflow-x-hidden flex flex-col justify-start items-center h-[217px] p-0.5 custom-z-index-great ease-in-out transition-all duration-500 albertsans outline-none`}
                        >
                            {/* Max height 330px */}
                            {/* Code to display searched event delete and modify buttons */}

                            {searchOpened && selectedEvent && message === "" ? (
                                <>
                                    <div className="flex flex-col items-center justify-center w-full pt-4 px-4">
                                        <div className="space-y-1 w-full text-center">
                                            <div className="flex items-center justify-between px-6 space-x-2">
                                                <p className="text-[20px] text-left">
                                                    {selectedEvent
                                                        ? eventTitle
                                                        : ""}
                                                </p>
                                                {selectedEvent && (
                                                    <button
                                                        onClick={(
                                                            e: React.MouseEvent<HTMLButtonElement>,
                                                        ) => handleDetails(e)}
                                                        className="custom-z-index-great p-1.5 bg-zinc-100 dark:bg-zinc-600 hover:bg-zinc-200 dark:hover:bg-zinc-500 active:bg-zinc-200 dark:active:bg-zinc-400 rounded-md transition-all text-black dark:text-white text-left"
                                                        title="Details"
                                                    >
                                                        <MdInfoOutline
                                                            size={18}
                                                        />
                                                    </button>
                                                )}
                                            </div>
                                            <p>
                                                {selectedEvent
                                                    ? selectedEvent.description
                                                    : ""}
                                            </p>
                                            {startDate === endDate ? (
                                                <p className="text-sm text-center">
                                                    {startDate}, {startTime} -{" "}
                                                    {endTime}
                                                </p>
                                            ) : (
                                                <p className="text-[16px] text-center">
                                                    From {startDate} to{" "}
                                                    {endDate}, <br />
                                                    {startTime} - {endTime}
                                                </p>
                                            )}
                                        </div>
                                    </div>
                                    <div className="my-5 flex w-full space-x-3 items-center justify-start pl-8">
                                        <button
                                            onClick={(e) =>
                                                toggleEventStatus(
                                                    e,
                                                    selectedEvent,
                                                )
                                            }
                                            className="custom-z-index-great p-2 bg-zinc-100 dark:bg-zinc-600 hover:bg-zinc-200 dark:hover:bg-zinc-500 active:bg-zinc-200 dark:active:bg-zinc-400 rounded-md transition-all text-black dark:text-white"
                                            title={
                                                selectedEvent.status ===
                                                Status.CLOSED
                                                    ? "Mark as Open"
                                                    : "Mark as Completed"
                                            }
                                        >
                                            {selectedEvent.status ===
                                            Status.CLOSED ? (
                                                <MdCheckCircle
                                                    size={20}
                                                    className="text-emerald-500"
                                                />
                                            ) : (
                                                <MdRadioButtonUnchecked
                                                    size={20}
                                                    className="text-slate-500"
                                                />
                                            )}
                                        </button>
                                        <button
                                            onClick={(
                                                e: React.MouseEvent<HTMLButtonElement>,
                                            ) =>
                                                archiveEventOnServer(
                                                    e,
                                                    selectedEvent.id,
                                                )
                                            }
                                            className="custom-z-index-great p-2 bg-zinc-100 dark:bg-zinc-600 hover:bg-zinc-200 dark:hover:bg-zinc-500 active:bg-zinc-200 dark:active:bg-zinc-400 rounded-md transition-all text-black dark:text-white"
                                            title={
                                                selectedEvent.status ===
                                                Status.ARCHIVED
                                                    ? "Unarchive"
                                                    : "Archive"
                                            }
                                        >
                                            <RiArchive2Fill
                                                size={20}
                                                className="text-blue-500"
                                            />
                                        </button>
                                        <button
                                            onClick={(
                                                e: React.MouseEvent<HTMLButtonElement>,
                                            ) =>
                                                deleteEventOnServer(
                                                    e,
                                                    selectedEvent.id,
                                                )
                                            }
                                            className="custom-z-index-great p-2 bg-zinc-100 dark:bg-zinc-600 hover:bg-zinc-200 dark:hover:bg-zinc-500 active:bg-zinc-200 dark:active:bg-zinc-400 rounded-md transition-all text-red-500 hover:text-red-600"
                                            title="Delete"
                                        >
                                            <MdDelete size={20} />
                                        </button>
                                    </div>
                                </>
                            ) : (
                                ""
                            )}

                            {/* Code to display all events in a search bar */}
                            {events.length &&
                            searchOpened &&
                            pageChosen === "allEvents" &&
                            !eventTitle &&
                            message === "" ? (
                                <ul className="w-full mt-[2px] ease-in-out">
                                    <h1 className="font-bold py-2 w-full text-center">
                                        {!events[0] &&
                                            data &&
                                            "Event does not exist"}
                                        {data !== "" && events[0] !== null
                                            ? ""
                                            : "All events"}
                                    </h1>
                                    {events.map((item) => (
                                        <li key={item.id}>
                                            <button
                                                onClick={(
                                                    e: React.MouseEvent<HTMLButtonElement>,
                                                ) =>
                                                    handleEventChoose(
                                                        e,
                                                        item.id,
                                                    )
                                                }
                                                key={item.id}
                                                className="dynamic-search ease-in-out w-full px-4 overflow-hidden text-ellipsis whitespace-nowrap text-center hover:bg-slate-100 dark:hover:bg-gray-700 font-normal py-[10px] border-y border-zinc-100 dark:border-zinc-700 duration-300 transition-all"
                                            >
                                                {item.title}
                                            </button>
                                        </li>
                                    ))}
                                </ul>
                            ) : (
                                ""
                            )}

                            {events.length &&
                            searchOpened &&
                            pageChosen === "nearestEvent" &&
                            !eventTitle &&
                            message === "" ? (
                                <ul className="w-full mt-[2px] ease-in-out">
                                    <h1 className="font-bold py-2 w-full text-center">
                                        Nearest events
                                    </h1>
                                    {nearestEvents.map((item) => (
                                        <li key={item.id}>
                                            <button
                                                onClick={(
                                                    e: React.MouseEvent<HTMLButtonElement>,
                                                ) =>
                                                    handleEventChoose(
                                                        e,
                                                        item.id,
                                                    )
                                                }
                                                className="dynamic-search flex items-center justify-center w-full px-4 overflow-hidden text-ellipsis whitespace-nowrap text-center hover:bg-slate-100 dark:hover:bg-gray-700 font-normal py-[10px] border-y border-zinc-100 dark:border-zinc-700 duration-300 transition-all"
                                            >
                                                {item.title}{" "}
                                                <div className="w-[1.5px] h-6 dark:bg-white bg-gray-500 mx-3" />{" "}
                                                {format(
                                                    new Date(item.start),
                                                    "d MMMM yyyy h:mm",
                                                    {
                                                        locale: enUS,
                                                    },
                                                )}
                                            </button>
                                        </li>
                                    ))}
                                </ul>
                            ) : (
                                ""
                            )}

                            {/* Code to display various errors in a search bar */}

                            {data && message === "searchFailed" && (
                                <div className="flex space-x-5 py-[22px] ease-in-out transition-all">
                                    <ImCross className="text-red-600 text-xl" />
                                    <h1 className="font-medium">
                                        Event does not exist
                                    </h1>
                                </div>
                            )}

                            {!data && message === "nameRequired" && (
                                <div className="flex space-x-5 py-[22px] ease-in-out transition-all">
                                    <PiWarningOctagonFill className="text-yellow-500 text-2xl" />
                                    <h1 className="font-medium">
                                        Event name is required
                                    </h1>
                                </div>
                            )}

                            {message === "deleted" && (
                                <div className="flex space-x-5 py-[22px] ease-in-out transition-all">
                                    <MdDelete className="text-red-400 text-2xl" />
                                    <h1 className="font-medium">
                                        Event deleted successfully
                                    </h1>
                                </div>
                            )}

                            {message === "archived" && (
                                <div className="flex space-x-5 py-[22px] ease-in-out transition-all">
                                    <RiArchive2Fill className="text-slate-400 text-xl" />
                                    <h1 className="font-medium">
                                        Event archived successfully
                                    </h1>
                                </div>
                            )}

                            {message === "unexpected" && (
                                <div className="flex space-x-5 py-[22px] ease-in-out transition-all">
                                    <ImCross className="text-red-600 text-xl" />
                                    <h1 className="font-medium">
                                        Something went wrong
                                    </h1>
                                </div>
                            )}
                        </div>
                        {searchOpened && (
                            <div
                                className={`${
                                    message === ""
                                        ? "shadow-lg hover:shadow-md active:shadow-lg bg-white dark:bg-gray-800"
                                        : " bg-transparent"
                                }
                    dynamic-search w-full flex flex-col justify-around items-center rounded-b-xl p-0.5 custom-z-index-great ease-in-out transition-all duration-500 albertsans outline-none`}
                            >
                                {searchOpened && message === "" && (
                                    <div className="flex justify-center">
                                        <div className="rounded-2xl bg-zinc-100 dark:bg-gray-700 p-1 flex">
                                            <button
                                                className={`${pageChosen === "allEvents" ? "bg-zinc-200 dark:bg-zinc-500 hover:bg-zinc-300 dark:hover:bg-zinc-400 " : "bg-zinc-100 dark:bg-zinc-500 hover:bg-zinc-300 dark:hover:bg-zinc-400"} transition-colors text-sm font-medium rounded-xl px-4 py-1`}
                                                onClick={(
                                                    e: React.MouseEvent<HTMLButtonElement>,
                                                ) =>
                                                    handlePageChange(
                                                        e,
                                                        "allEvents",
                                                    )
                                                }
                                            >
                                                All Events
                                            </button>

                                            <button
                                                className={`${pageChosen === "nearestEvent" ? "bg-zinc-200 dark:bg-zinc-500 hover:bg-zinc-300 dark:hover:bg-zinc-400 " : "bg-zinc-100 dark:bg-zinc-500 hover:bg-zinc-300 dark:hover:bg-zinc-400"} transition-colors text-sm font-medium  rounded-xl px-4 py-1`}
                                                onClick={(
                                                    e: React.MouseEvent<HTMLButtonElement>,
                                                ) =>
                                                    handlePageChange(
                                                        e,
                                                        "nearestEvent",
                                                    )
                                                }
                                            >
                                                Nearest Events
                                            </button>
                                        </div>
                                    </div>
                                )}
                            </div>
                        )}
                    </>
                )}
            </form>
        </div>
    );
};

export default DynamicSearch;

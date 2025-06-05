import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { FaEye, FaTrash } from "react-icons/fa";
import moment from "moment";
import { apiFetch } from "../../utils/api";
import { STATUS } from "../../utils/constants";

function ViewIdeas({ myIdeas = false }) {
    const [ideas, setIdeas] = useState([]);
    const [searchTerm, setSearchTerm] = useState("");
    const [statusFilter, setStatusFilter] = useState(STATUS.ALL);
    const [filteredIdeas, setFilteredIdeas] = useState([]);
    const navigate = useNavigate();

    const userName = localStorage.getItem("username") || "Guest";
    const token = localStorage.getItem("token");

    // Search & Filter Logic
    const handleSearch = (data) => {
        const filtered = data.filter((idea) => {
            const matchSearch =
                (idea.title || "")
                    .toLowerCase()
                    .includes(searchTerm.toLowerCase()) ||
                (idea.area || "")
                    .toLowerCase()
                    .includes(searchTerm.toLowerCase());

            const matchStatus =
                statusFilter === STATUS.ALL || idea.status === statusFilter;
            return matchSearch && matchStatus;
        });
        setFilteredIdeas(filtered);
    };

    // Load ideas on mount
    useEffect(() => {
        setIdeas([]);
        const fetchIdeas = async () => {
            const url = myIdeas ? `/my-ideas` : "/ideas";
            await apiFetch(url)
                .then((data) => {
                    if (data.length > 0) {
                        setIdeas(data);
                        handleSearch(data);
                    }
                })
                .catch((err) => {
                    if (err.message === "Unauthorized") {
                        navigate("/login", { replace: true });
                    } else {
                        navigate("/error", { replace: true });
                    }
                });
        };

        const token = localStorage.getItem("token");
        if (!token) {
            navigate("/login");
            return;
        }
        fetchIdeas();
    }, [myIdeas]);

    useEffect(() => {
        handleSearch(ideas);
    }, [ideas, searchTerm, statusFilter]);

    const handleDelete = async (id) => {
        if (!window.confirm("Are you sure you want to delete this idea?"))
            return;
        try {
            const data = await apiFetch(`/ideas/${id}`, {
                method: "DELETE",
                headers: {
                    "Content-Type": "application/json",
                },
            });
            if (data) {
                const updated = ideas.filter((idea) => idea.id !== id);
                setIdeas(updated);
                alert("Idea deleted successfully!");
            }
        } catch (err) {
            if (err.message === "Unauthorized") {
                navigate("/login", { replace: true });
            } else {
                navigate("/error", { replace: true });
            }
        }
    };

    return (
        <div className="bg-theme flex flex-col items-center justify-center p-6">
            <div className="w-full max-w-3xl bg-header rounded-2xl shadow-xl p-10 border border-header">
                <h2 className="text-3xl font-extrabold text-header mb-6 tracking-tight flex items-center gap-2">
                    <span role="img" aria-label="paper">
                        📄
                    </span>{" "}
                    {(myIdeas ? "My " : "") + "Submitted Ideas"}
                </h2>
                <div className="flex flex-wrap gap-3 mb-6">
                    <input
                        type="text"
                        placeholder="Search by title or area"
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                        className="px-4 py-2 rounded-lg border border-header bg-header text-header placeholder:text-header focus:ring-2 focus:ring-[rgb(var(--color-header-active))] focus:outline-none transition-all"
                    />
                    <select
                        value={statusFilter}
                        onChange={(e) => setStatusFilter(e.target.value)}
                        className="px-2 py-2 rounded-lg border border-header bg-header text-header focus:ring-2 focus:ring-[rgb(var(--color-header-active))] focus:outline-none transition-all"
                    >
                        <option>{STATUS.ALL}</option>
                        <option>{STATUS.NEW}</option>
                        <option>{STATUS.IN_PROGRESS}</option>
                        <option>{STATUS.IMPLEMENTED}</option>
                        <option>{STATUS.CANCELLED}</option>
                        <option>{STATUS.REJECTED}</option>
                    </select>
                </div>
                {filteredIdeas.length === 0 ? (
                    <div className="text-header text-center py-8 text-lg font-medium">
                        No ideas found.
                    </div>
                ) : (
                    <div className="space-y-6">
                        {filteredIdeas.map((idea) => (
                            <div
                                key={idea.id}
                                className="bg-[rgb(var(--color-header-hover))] p-6 rounded-xl shadow border border-header flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 transition-all duration-200 hover:border-[rgb(var(--color-header-active))]"
                            >
                                <div className="flex-1 min-w-0">
                                    <h3 className="text-xl font-bold text-header truncate mb-1">
                                        {idea.title}
                                    </h3>
                                    <div className="flex flex-wrap gap-4 text-sm text-header mb-1">
                                        <span>
                                            Area:{" "}
                                            <span className="font-semibold text-header">
                                                {idea.area}
                                            </span>
                                        </span>
                                        <span>
                                            Status:{" "}
                                            <span className="font-semibold text-header">
                                                {idea.status}
                                            </span>
                                        </span>
                                    </div>
                                    <div className="text-xs text-header flex items-center gap-1">
                                        🕓{" "}
                                        {idea.created_at
                                            ? moment(idea.created_at).format(
                                                  "DD MMM YYYY hh:mm A"
                                              )
                                            : "Not available"}
                                    </div>
                                </div>
                                <div className="flex gap-3 min-w-fit">
                                    <button
                                        className="bg-[rgb(var(--color-header-active))] text-white px-4 py-2 rounded-lg font-semibold shadow hover:bg-[rgb(var(--color-header-icon))] transition-colors duration-150 flex items-center gap-1"
                                        onClick={() =>
                                            navigate(`/ideas/${idea.id}`)
                                        }
                                    >
                                        <FaEye className="inline-block" /> View
                                    </button>
                                    {(idea.username === userName ||
                                        myIdeas) && (
                                        <button
                                            className="bg-red-600 text-white px-4 py-2 rounded-lg font-semibold shadow hover:bg-red-700 transition-colors duration-150 flex items-center gap-1"
                                            onClick={() =>
                                                handleDelete(idea.id)
                                            }
                                        >
                                            <FaTrash className="inline-block" />{" "}
                                            Delete
                                        </button>
                                    )}
                                </div>
                            </div>
                        ))}
                    </div>
                )}
            </div>
        </div>
    );
}

export default ViewIdeas;

// src/components/Dashboard.jsx
import React, { useEffect, useState, useContext } from "react";
import { Link, useNavigate } from "react-router-dom";
import { FaSearch, FaBullseye, FaPaperclip } from "react-icons/fa";
import { PieChart, Pie, Cell, Tooltip, Legend } from "recharts";
import moment from "moment";
import { apiFetch } from "../utils/api";
import { STATUS } from "../utils/constants";

export default function Dashboard() {
    const navigate = useNavigate();
    const [ideas, setIdeas] = useState([]);
    const [filterArea, setFilterArea] = useState(STATUS.ALL);
    const [searchTerm, setSearchTerm] = useState("");
    const [error, setError] = useState("");
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        fetchIdeas();
    }, []);

    async function fetchIdeas() {
        try {
            const data = await apiFetch("/ideas");

            if (data || data.length != 0) {
                data.sort(
                    (a, b) => new Date(b.createdAt) - new Date(a.createdAt)
                );
                setIdeas(data);
            }
        } catch (err) {
            if (err.message === "Unauthorized") {
                navigate("/login", { replace: true });
            } else {
                navigate("/error", { replace: true });
            }
        } finally {
            setLoading(false);
        }
    }

    // Filter & search
    const filtered = ideas.filter((idea) => {
        const areaMatch = filterArea === STATUS.ALL || idea.area === filterArea;
        const textMatch = idea.title
            .toLowerCase()
            .includes(searchTerm.toLowerCase());
        return areaMatch && textMatch;
    });

    // Pie chart data
    const countBy = (status) => ideas.filter((i) => i.status === status).length;
    const pieData = [
        { name: STATUS.NEW, value: countBy(STATUS.NEW) },
        { name: STATUS.IN_PROGRESS, value: countBy(STATUS.IN_PROGRESS) },
        { name: STATUS.IMPLEMENTED, value: countBy(STATUS.IMPLEMENTED) },
        { name: STATUS.REJECTED, value: countBy(STATUS.REJECTED) },
    ];
    const COLORS = ["#8884d8", "#82ca9d", "#ffc658", "#ff6b6b"];

    // Unique areas
    const areas = Array.from(new Set(ideas.map((i) => i.area))).filter(Boolean);

    return (
        <div className="min-h-screen bg-theme px-2 py-6 sm:px-6 md:px-12">
            <h2 className="text-3xl sm:text-4xl font-extrabold mb-8 font-mono text-header">
                💡 Dashboard Overview
            </h2>

            {/* Search & Filter */}
            <div className="flex flex-wrap items-center gap-4 mb-8">
                <div className="flex items-center bg-header rounded-xl px-4 py-2 shadow-inner border border-header">
                    <FaSearch className="mr-2 text-[rgb(var(--color-header-icon))]" />
                    <input
                        type="text"
                        placeholder="Search ideas…"
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                        className="bg-transparent focus:outline-none text-header placeholder-[rgb(var(--color-header-icon))] font-mono text-base w-32 sm:w-48"
                    />
                </div>

                <div className="flex items-center bg-header rounded-xl px-4 py-2 shadow-inner border border-header">
                    <FaBullseye className="mr-2 text-[rgb(var(--color-header-icon))]" />
                    <select
                        value={filterArea}
                        onChange={(e) => setFilterArea(e.target.value)}
                        className="bg-transparent focus:outline-none text-header font-mono text-base"
                    >
                        <option value={STATUS.ALL}>All Areas</option>
                        {areas.map((a) => (
                            <option
                                key={a}
                                value={a}
                                className="bg-header text-header"
                            >
                                {a}
                            </option>
                        ))}
                    </select>
                </div>
            </div>

            {loading ? (
                <div className="text-center py-20 text-[rgb(var(--color-header-icon))] animate-pulse font-mono text-lg">
                    Loading…
                </div>
            ) : error ? (
                <div className="text-red-400 text-center font-mono bg-red-900/30 border border-red-500 rounded-lg py-2 px-4 animate-pulse max-w-md mx-auto">
                    {error}
                </div>
            ) : (
                <>
                    {/* Latest Submissions */}
                    <div className="flex flex-col md:flex-row items-center justify-between mb-8">
                        <div className="bg-header rounded-2xl shadow-xl border border-header p-6 w-full max-w-4xl">
                            <h3 className="text-xl font-semibold mb-4 text-[rgb(var(--color-header-icon))] font-mono tracking-widest">
                                📂 Latest Submissions
                            </h3>
                            {filtered.length === 0 ? (
                                <div className="text-[rgb(var(--color-header-icon))] font-mono">
                                    No ideas found.
                                </div>
                            ) : (
                                filtered.slice(0, 5).map((idea) => (
                                    <div
                                        key={idea.id}
                                        className="bg-[rgb(var(--color-header-hover))] rounded-xl p-4 mb-4 flex flex-col sm:flex-row justify-between items-start sm:items-center border border-header hover:border-[rgb(var(--color-header-active))] transition-all duration-200"
                                    >
                                        <Link
                                            to={`/ideas/${idea.id}`}
                                            className="font-bold text-[rgb(var(--color-header-active))] hover:underline font-mono text-lg"
                                        >
                                            {idea.title}
                                        </Link>
                                        <h4 className="text-xs sm:text-sm text-[rgb(var(--color-header-icon))] font-mono mt-2 sm:mt-0">
                                            {moment(idea.created_at).format(
                                                "DD MMM YYYY hh:mm A"
                                            )}
                                        </h4>
                                    </div>
                                ))
                            )}
                        </div>
                        {ideas.length > 0 && (
                            <div className="flex items-center justify-center">
                                <PieChart width={220} height={280}>
                                    <Pie
                                        data={pieData}
                                        dataKey="value"
                                        nameKey="name"
                                        cx="50%"
                                        cy="50%"
                                        outerRadius={80}
                                        label
                                    >
                                        {pieData.map((_, i) => (
                                            <Cell key={i} fill={COLORS[i]} />
                                        ))}
                                    </Pie>
                                    <Tooltip
                                        wrapperStyle={{
                                            background:
                                                "rgb(var(--color-header-bg))",
                                            color: "rgb(var(--color-header-text))",
                                            borderRadius: 8,
                                            fontFamily: "monospace",
                                        }}
                                    />
                                    <Legend
                                        verticalAlign="bottom"
                                        wrapperStyle={{
                                            color: "rgb(var(--color-header-text))",
                                            fontSize: "0.8rem",
                                            fontFamily: "monospace",
                                        }}
                                    />
                                </PieChart>
                            </div>
                        )}
                    </div>

                    {/* Stats */}
                    <div className="bg-header rounded-2xl shadow-xl border border-header p-6 flex flex-col md:flex-row gap-8 max-w-4xl">
                        <div className="flex-1">
                            <h3 className="text-xl font-semibold mb-4 text-[rgb(var(--color-header-icon))] font-mono tracking-widest">
                                📊 Idea Stats
                            </h3>
                            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                                {[
                                    STATUS.NEW,
                                    STATUS.IN_PROGRESS,
                                    STATUS.IMPLEMENTED,
                                    STATUS.REJECTED,
                                ].map((status, i) => (
                                    <div
                                        key={status}
                                        className="flex flex-col items-center justify-center bg-[rgb(var(--color-header-hover))] rounded-xl px-2 py-4 border border-header shadow-inner text-center"
                                    >
                                        <div className="text-2xl font-extrabold text-[rgb(var(--color-header-active))] font-mono">
                                            {countBy(status)}
                                        </div>
                                        <div className="text-wrap md:text-xs text-sm text-[rgb(var(--color-header-icon))] font-mono mt-1">
                                            {status}
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </div>
                    </div>
                </>
            )}
        </div>
    );
}

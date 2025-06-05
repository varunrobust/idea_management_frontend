import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { apiFetch } from "../../utils/api";
import { STATUS } from "../../utils/constants";

export default function AddIdeaForm() {
    const navigate = useNavigate();
    const [form, setForm] = useState({
        title: "",
        area: "",
        shortDesc: "",
        detailDesc: "",
        status: STATUS.NEW,
    });
    const [file, setFile] = useState(null);
    const [error, setError] = useState("");
    const [loading, setLoading] = useState(false);

    const handleChange = (e) =>
        setForm({ ...form, [e.target.name]: e.target.value });

    const handleFile = (e) => setFile(e.target.files[0]);

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError("");
        setLoading(true);

        // Simple validation
        if (!form.title.trim()) {
            setError("Title is required.");
            setLoading(false);
            return;
        }

        // Grab the token you saved at login
        const token = localStorage.getItem("token");
        if (!token) {
            setError("You must be logged in to submit an idea.");
            setLoading(false);
            return;
        }

        const data = new FormData();
        data.append("title", form.title);
        data.append("area", form.area);
        data.append("description", form.detailDesc);
        data.append("short_description", form.shortDesc);
        data.append("status", form.status);
        // if (file) data.append("file", file);

        try {
            const result = await apiFetch("/ideas", {
                method: "POST",
                body: data,
            });
            if (result) {
                navigate("/my-ideas");
            }
        } catch (err) {
            navigate("/error", { replace: true });
        }
    };

    return (
        <div className="bg-theme flex items-center justify-center p-6">
            <form
                onSubmit={handleSubmit}
                className="w-full max-w-2xl bg-header rounded-2xl shadow-xl p-10 space-y-7 border border-header"
            >
                <h1 className="text-3xl font-extrabold text-header mb-2 tracking-tight">
                    Submit New Idea
                </h1>

                {error && (
                    <div className="text-red-600 font-semibold bg-red-50 border border-red-200 rounded px-4 py-2 mb-2">
                        {error}
                    </div>
                )}

                <input
                    name="title"
                    value={form.title}
                    onChange={handleChange}
                    placeholder="Title"
                    className="w-full border border-header rounded-lg px-4 py-2 bg-header text-header placeholder:text-header focus:ring-2 focus:ring-[rgb(var(--color-header-active))] focus:outline-none transition-all"
                    required
                />

                <input
                    name="area"
                    value={form.area}
                    onChange={handleChange}
                    placeholder="Area / Category"
                    className="w-full border border-header rounded-lg px-4 py-2 bg-header text-header placeholder:text-header focus:ring-2 focus:ring-[rgb(var(--color-header-active))] focus:outline-none transition-all"
                />

                <input
                    name="shortDesc"
                    value={form.shortDesc}
                    onChange={handleChange}
                    placeholder="Short Description (max 100 characters)"
                    type="text"
                    maxLength={100}
                    className="w-full border border-header rounded-lg px-4 py-2 bg-header text-header placeholder:text-header focus:ring-2 focus:ring-[rgb(var(--color-header-active))] focus:outline-none transition-all"
                />

                <textarea
                    name="detailDesc"
                    value={form.detailDesc}
                    onChange={handleChange}
                    placeholder="Detailed Description"
                    rows={4}
                    className="w-full border border-header rounded-lg px-4 py-2 bg-header text-header placeholder:text-header focus:ring-2 focus:ring-[rgb(var(--color-header-active))] focus:outline-none transition-all"
                />

                {/* <label
                    className="block text-header font-semibold mb-1"
                    htmlFor="file-upload"
                >
                    Attachment (optional)
                </label>
                <div className="relative w-full">
                    <div className="flex items-center border border-header rounded-lg px-4 py-2 bg-header text-header transition-all focus-within:ring-2 focus-within:ring-[rgb(var(--color-header-active))]">
                        <span className="flex-1 truncate text-sm">
                            {file ? file.name : "No file selected"}
                        </span>
                        <span className="ml-4 text-xs text-[rgb(var(--color-header-icon))] font-medium">
                            Browse
                        </span>
                        <input
                            id="file-upload"
                            type="file"
                            onChange={handleFile}
                            className="absolute opacity-0 inset-0 w-full h-full cursor-pointer z-10"
                        />
                    </div>
                </div> */}

                <div className="flex gap-4 pt-2">
                    <button
                        type="submit"
                        disabled={loading}
                        className="flex-1 bg-[rgb(var(--color-header-active))] text-white py-2 rounded-lg hover:bg-[rgb(var(--color-header-icon))] transition-colors duration-150 font-semibold shadow-md disabled:opacity-60 disabled:cursor-not-allowed"
                    >
                        {loading ? "Submitting…" : "Submit Idea"}
                    </button>
                    <button
                        type="button"
                        onClick={() => navigate("/")}
                        disabled={loading}
                        className="flex-1 bg-red-600 text-white py-2 rounded-lg hover:bg-red-700 transition-colors duration-150 font-semibold shadow-md disabled:opacity-60 disabled:cursor-not-allowed"
                    >
                        Cancel
                    </button>
                </div>
            </form>
        </div>
    );
}

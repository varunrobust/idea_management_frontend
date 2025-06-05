import React, { useEffect, useState, useRef } from "react";
import { data, useNavigate, useParams } from "react-router-dom";
import {
    FaBackward,
    FaComment,
    FaRegSmile,
    FaEdit,
    FaSave,
    FaTimes,
    FaTrash,
    FaBackspace,
    FaArrowLeft,
} from "react-icons/fa";
import CommentThread from "./CommentThread";
import moment from "moment";
import { apiFetch } from "../../utils/api";
import Comments from "./Comments";
import { STATUS } from "../../utils/constants";

export default function IdeaDetails() {
    const navigate = useNavigate();
    const { id } = useParams();

    const [idea, setIdea] = useState(null);
    const [status, setStatus] = useState(STATUS.ALL);
    const [editingDesc, setEditingDesc] = useState(false);
    const [description, setDescription] = useState("");
    const [editingShortDesc, setEditingShortDesc] = useState(false);
    const [shortDescription, setShortDescription] = useState("");

    useEffect(() => {
        fetchIdea();
    }, [id]);

    const fetchIdea = () => {
        apiFetch(`/ideas/${id}`)
            .then((data) => {
                setIdea(data);
                setDescription(data.description || "");
                setShortDescription(data.short_description || "");
                setStatus(data.status || STATUS.NEW);
            })
            .catch((err) => {
                if (err.message === "Unauthorized") {
                    navigate("/login", { replace: true });
                } else {
                    navigate("/error", { replace: true });
                }
            });
    };

    // Reject idea
    const handleReject = () => {
        if (!window.confirm("Reject this idea?")) return;
        saveDescriptionAndStatus({ status: STATUS.REJECTED });
        setStatus(STATUS.REJECTED);
        alert("Idea rejected successfully!");
    };

    const handleDelete = async (id) => {
        if (!window.confirm("Are you sure you want to delete this idea?"))
            return;
        try {
            const res = await apiFetch(`/ideas/${id}`, {
                method: "DELETE",
                headers: {
                    "Content-Type": "application/json",
                },
            });
            if (res) alert("Idea deleted successfully!");
        } catch (err) {
            if (err.message === "Unauthorized") {
                navigate("/login", { replace: true });
            } else {
                navigate("/error", { replace: true });
            }
        }
    };

    // Save edited description (owner)
    const saveDescriptionAndStatus = (field) => {
        let body = {};
        if (field.shortDescription) {
            if (!shortDescription.trim()) {
                alert("Short description cannot be empty.");
                return;
            }
            if (shortDescription.length > 100) {
                alert("Short description cannot exceed 100 characters.");
                return;
            }
            body.short_description = field.shortDescription;
        } else if (field.description) {
            if (!description.trim()) {
                alert("Description cannot be empty.");
                return;
            }
            body.description = field.description;
        } else if (field.status) {
            if (!status) {
                alert("Please select a status.");
                return;
            }
            body.status = field.status;
        } else {
            alert("Invalid field to save.");
            return;
        }
        apiFetch(`/ideas/${id}`, {
            method: "PATCH",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify(body),
        })
            .then((res) =>
                res.ok
                    ? setIdea((prev) => ({
                          ...prev,
                          description: description,
                          short_description: shortDescription,
                          status: status || prev.status,
                      }))
                    : Promise.reject()
            )
            .then(() => {
                field === "description"
                    ? setEditingDesc(false)
                    : setEditingShortDesc(false);
            })
            .catch(console.error);
    };
    if (!idea)
        return (
            <div className="flex items-center justify-center h-screen text-header bg-theme">
                Loading...
            </div>
        );

    const isOwner = idea.username === localStorage.getItem("username");
    const totalReactions = Object.values(idea.reactions || {}).reduce(
        (s, v) => s + v,
        0
    );

    return (
        <div className="bg-theme flex items-center justify-center p-6">
            <div className="w-full max-w-3xl bg-header rounded-2xl shadow-xl p-10 border border-header">
                {/* Header */}
                <div className="flex justify-between items-center mb-6">
                    <button
                        onClick={() => navigate(-1)}
                        className="flex items-center text-header hover:text-[rgb(var(--color-header-active))] font-medium cursor-pointer"
                    >
                        <FaArrowLeft className="mr-2 text-xl" /> Back
                    </button>
                    <h1 className="text-3xl font-bold text-header truncate">
                        {idea.title || idea.name}
                    </h1>
                </div>

                {/* Meta & Status */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-header mb-6">
                    <div className="space-y-1">
                        <p>
                            <span className="font-semibold">Submitter:</span>{" "}
                            {idea.name[0].toUpperCase() + idea.name.slice(1)}
                        </p>
                        <p>
                            <span className="font-semibold">Area:</span>{" "}
                            {idea.area[0].toUpperCase() + idea.area.slice(1)}
                        </p>
                        <div className="flex items-center space-x-2">
                            <p className="font-semibold">Status:</p>
                            {!isOwner && status != STATUS.REJECTED ? (
                                <select
                                    value={status}
                                    onChange={(e) => {
                                        setStatus(e.target.value);
                                        saveDescriptionAndStatus({
                                            status: e.target.value,
                                        });
                                    }}
                                    className="px-2 py-2 rounded-lg border border-header bg-header text-header focus:ring-2 focus:ring-[rgb(var(--color-header-active))] focus:outline-none transition-all"
                                >
                                    <option>{STATUS.NEW}</option>
                                    <option>{STATUS.IN_PROGRESS}</option>
                                    <option>{STATUS.IMPLEMENTED}</option>
                                    <option>{STATUS.CANCELLED}</option>
                                    <option disabled>{STATUS.REJECTED}</option>
                                </select>
                            ) : (
                                <p className="font-regular">
                                    {idea.status[0].toUpperCase() +
                                        idea.status.slice(1)}
                                </p>
                            )}
                        </div>
                    </div>
                    <div className="text-right text-header">
                        {moment(idea.created_at).format("DD MMM YYYY, hh:mm A")}
                    </div>
                </div>

                {/* Short Description (editable) */}
                <div className="mb-6">
                    <h2 className="text-xl font-semibold mb-2 text-header">
                        Short Description
                    </h2>
                    {isOwner && !editingShortDesc && (
                        <button
                            onClick={() => setEditingShortDesc(true)}
                            className="float-right text-[rgb(var(--color-header-active))] hover:text-[rgb(var(--color-header-icon))]"
                        >
                            <FaEdit />
                        </button>
                    )}
                    {editingShortDesc ? (
                        <div className="space-y-2">
                            <textarea
                                rows={5}
                                value={shortDescription}
                                onChange={(e) =>
                                    setShortDescription(e.target.value)
                                }
                                className="w-full p-3 border border-header rounded-lg focus:ring-2 focus:ring-[rgb(var(--color-header-active))] bg-header text-header"
                            />
                            <div className="flex space-x-3">
                                <button
                                    onClick={() =>
                                        saveDescriptionAndStatus({
                                            shortDescription: shortDescription,
                                        })
                                    }
                                    className="px-4 py-2 bg-[rgb(var(--color-header-active))] text-white rounded-lg hover:bg-[rgb(var(--color-header-icon))]"
                                >
                                    Save <FaSave className="inline ml-2" />
                                </button>
                                <button
                                    onClick={() => setEditingShortDesc(false)}
                                    className="px-4 py-2 bg-header border border-header text-header rounded-lg"
                                >
                                    Cancel <FaTimes className="inline ml-2" />
                                </button>
                            </div>
                        </div>
                    ) : (
                        <div className="bg-[rgb(var(--color-header-hover))] p-4 rounded-lg">
                            <p className="text-header whitespace-pre-wrap">
                                {idea.short_description ||
                                    "No description provided."}
                            </p>
                        </div>
                    )}
                </div>
                <div>
                    <h2 className="text-xl font-semibold mb-2 text-header">
                        Detailed Description
                    </h2>
                    {isOwner && !editingDesc && (
                        <button
                            onClick={() => setEditingDesc(true)}
                            className="float-right text-[rgb(var(--color-header-active))] hover:text-[rgb(var(--color-header-icon))]"
                        >
                            <FaEdit />
                        </button>
                    )}
                    {editingDesc ? (
                        <div className="space-y-2">
                            <textarea
                                rows={5}
                                value={description}
                                onChange={(e) => setDescription(e.target.value)}
                                className="w-full p-3 border border-header rounded-lg focus:ring-2 focus:ring-[rgb(var(--color-header-active))] bg-header text-header"
                            />
                            <div className="flex space-x-3">
                                <button
                                    onClick={() =>
                                        saveDescriptionAndStatus({
                                            description: description,
                                        })
                                    }
                                    className="px-4 py-2 bg-[rgb(var(--color-header-active))] text-white rounded-lg hover:bg-[rgb(var(--color-header-icon))]"
                                >
                                    Save <FaSave className="inline ml-2" />
                                </button>
                                <button
                                    onClick={() => setEditingDesc(false)}
                                    className="px-4 py-2 bg-header border border-header text-header rounded-lg"
                                >
                                    Cancel <FaTimes className="inline ml-2" />
                                </button>
                            </div>
                        </div>
                    ) : (
                        <div className="bg-[rgb(var(--color-header-hover))] p-4 rounded-lg">
                            <p className="text-header whitespace-pre-wrap">
                                {idea.description || "No description provided."}
                            </p>
                        </div>
                    )}
                </div>
                <Comments ideaId={id} />

                {!isOwner && status != STATUS.REJECTED && (
                    <div className="mt-6">
                        <button
                            onClick={handleReject}
                            className="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700"
                        >
                            Reject
                        </button>
                    </div>
                )}
                {isOwner && (
                    <button
                        className="bg-red-600 text-white px-4 py-2 rounded-lg font-semibold shadow hover:bg-red-700 transition-colors duration-150 flex items-center gap-1"
                        onClick={() => handleDelete(idea.id)}
                    >
                        <FaTrash className="inline-block" /> Delete
                    </button>
                )}
            </div>
        </div>
    );
}

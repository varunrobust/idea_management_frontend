import React, { useState } from "react";
import { FaReply, FaTrash, FaTimes } from "react-icons/fa";
import moment from "moment";
import { apiFetch } from "../../utils/api";

export default function CommentThread({
    comments,
    fetchComments,
    postComment,
}) {
    const [replyingTo, setReplyingTo] = useState(null);
    const [replyText, setReplyText] = useState("");
    const username = localStorage.getItem("username");

    // Post a new reply
    const handleReplySubmit = async (parentId) => {
        await postComment(parentId, replyText)
            .then(() => {
                setReplyText("");
                setReplyingTo(null);
                fetchComments();
            })
            .catch((err) => {
                console.log(err);
            });
    };

    const handleDelete = async (id) => {
        if (!window.confirm("Are you sure you want to delete this comment?")) {
            return;
        }
        await apiFetch(`/comments/${id}`, {
            method: "DELETE",
        })
            .then(() => {
                alert("Comment deleted successfully.");
                fetchComments();
            })
            .catch((err) => {
                console.error("Error deleting comment:", err);
                if (err.message === "Unauthorized") {
                    navigate("/login", { replace: true });
                } else {
                    navigate("/error", { replace: true });
                }
            });
    };

    const renderComments = (commentsList, parent = null, level = 0) =>
        commentsList
            .filter((cmt) =>
                parent ? cmt.parent_id === parent.id : !cmt.parent_id
            )
            .map((cmt) => (
                <div
                    key={cmt.id}
                    className={`bg-header border border-header rounded-xl shadow p-4 mb-2 ${
                        level > 0 ? "ml-[calc(level*4)]" : ""
                    }`}
                >
                    {/* Header */}
                    <div className="flex justify-between items-center">
                        <div>
                            <p className="font-medium text-[rgb(var(--color-header-active))]">
                                {cmt.username}
                            </p>
                            <p className="text-xs text-gray-400">
                                {moment(cmt.created_at).format(
                                    "DD MMM YYYY, HH:mm A"
                                )}
                            </p>
                        </div>
                        {cmt.username === username && (
                            <button
                                onClick={() => handleDelete(cmt.id)}
                                className="text-red-500 hover:text-red-700 cursor-pointer"
                                title="Delete"
                            >
                                <FaTrash />
                            </button>
                        )}
                    </div>
                    <p className="text-header w-[95%] flex-wrap">
                        {cmt.comment}
                    </p>

                    {replyingTo != cmt.id && (
                        <button
                            onClick={() => {
                                setReplyingTo(cmt.id);
                                setReplyText("");
                            }}
                            className={`text-sm text-[rgb(var(--color-header-active))] hover:underline cursor-pointer ${
                                level == 0 && !replyingTo && "mb-4"
                            }`}
                        >
                            Reply
                        </button>
                    )}

                    {/* Inline reply input */}
                    {replyingTo === cmt.id && (
                        <div
                            className={`mt-3 flex items-center space-x-2 ${
                                level == 0 && "mb-4"
                            }`}
                        >
                            <input
                                type="text"
                                className="flex-1 p-2 border border-header rounded-lg bg-header text-header"
                                placeholder={`Reply to @${cmt.username}`}
                                value={replyText}
                                onChange={(e) => setReplyText(e.target.value)}
                                onKeyDown={(e) =>
                                    e.key === "Enter" &&
                                    handleReplySubmit(cmt.id)
                                }
                            />
                            <button
                                onClick={() => handleReplySubmit(cmt.id)}
                                className="p-2 bg-[rgb(var(--color-header-active))] hover:bg-[rgb(var(--color-header-icon))] text-white rounded-lg"
                            >
                                <FaReply />
                            </button>
                            <button
                                onClick={() => setReplyingTo(null)}
                                className="p-2 text-red-500 hover:text-red-700"
                            >
                                <FaTimes />
                            </button>
                        </div>
                    )}
                    {renderComments(
                        commentsList,
                        cmt,
                        level > 3 ? level : level + 1
                    )}
                </div>
            ));

    return <div className="space-y-6">{renderComments(comments)}</div>;
}

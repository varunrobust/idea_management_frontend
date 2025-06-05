import React, { useEffect, useState } from "react";
import CommentThread from "./CommentThread";
import { useNavigate } from "react-router-dom";
import { apiFetch } from "../../utils/api";

const Comments = ({ ideaId }) => {
    const navigate = useNavigate();
    const [comment, setComment] = useState("");
    const [previousComments, setPreviousComments] = useState([]);

    useEffect(() => {
        fetchComments();
    }, []);

    const fetchComments = async () => {
        apiFetch(`/ideas/${ideaId}/comments`)
            .then((data) => {
                console.log(data);
                setPreviousComments(data);
            })
            .catch((err) => {
                if (err.message === "Unauthorized") {
                    navigate("/login", { replace: true });
                } else {
                    navigate("/error", { replace: true });
                }
            });
    };

    // Post new comment
    const postComment = async (parentId = null, comment) => {
        if (!comment.trim()) return;
        console.log("entered postComment with parentId:", parentId);
        try {
            const createdComment = await apiFetch(`/ideas/${ideaId}/comments`, {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({
                    comment: comment,
                    parentId: parentId,
                }),
            });
            if (createdComment) {
                fetchComments();
                alert("Comment posted successfully!");
                setComment("");
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
        <>
            <div className="flex flex-col sm:flex-row items-start sm:items-center space-y-2 sm:space-y-0 sm:space-x-2 my-4">
                <input
                    type="text"
                    className="w-full p-2 border border-header rounded-lg bg-header text-header focus:ring-2 focus:ring-[rgb(var(--color-header-active))]"
                    placeholder="Write a comment…"
                    value={comment}
                    onChange={(e) => setComment(e.target.value)}
                    onKeyDown={(e) =>
                        e.key === "Enter" && postComment(null, comment)
                    }
                />
                <button
                    onClick={() => postComment(null, comment)}
                    disabled={!comment.trim()}
                    className="px-4 py-2 bg-[rgb(var(--color-header-active))] text-white rounded-lg hover:bg-[rgb(var(--color-header-icon))]"
                >
                    Post
                </button>
            </div>

            {previousComments?.length > 0 ? (
                <CommentThread
                    comments={previousComments}
                    fetchComments={fetchComments}
                    postComment={postComment}
                />
            ) : (
                <h4 className="text-sm font-medium text-[rgb(var(--color-header-text))] mb-4">
                    No Comments Present
                </h4>
            )}
        </>
    );
};

export default Comments;

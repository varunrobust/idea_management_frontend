import React from "react";
import { FaPaperPlane, FaSignOutAlt } from "react-icons/fa";
import { useNavigate } from "react-router-dom";

function Help() {
    const navigate = useNavigate();
    return (
        <div className="bg-theme flex flex-col space-y-4 items-center justify-center">
            <div className="w-full max-w-2xl bg-header rounded-2xl shadow-xl p-10 border border-header">
                <h2 className="text-3xl font-extrabold text-header mb-4 tracking-tight flex items-center gap-2">
                    <span role="img" aria-label="help">
                        💬
                    </span>{" "}
                    Suggestions & Help
                </h2>
                <p className="text-header text-base sm:text-lg mb-6">
                    This space is for users to get help, guidance, or share
                    suggestions for improvement.
                    <br />
                    <br />
                    👉 If you're having trouble with any functionality like
                    submitting ideas, editing, or switching themes — this is
                    where you find the answers.
                    <br />
                    <br />
                    🛠️ Features planned:
                </p>
                <ul className="list-disc pl-6 mb-6 text-header text-base sm:text-lg space-y-1">
                    <li>Submit support tickets</li>
                    <li>Chat or FAQ for troubleshooting</li>
                </ul>
                <p className="text-header text-base mt-6">
                    Got a bright idea{" "}
                    <span role="img" aria-label="bulb">
                        💡
                    </span>
                    ? Let us know and we’ll bring it to life!
                </p>
            </div>
            <button
                className="flex items-center gap-2 px-4 sm:px-5 py-2 rounded-xl font-mono font-bold shadow-lg transition-all duration-150 tracking-widest uppercase border border-[rgb(var(--color-header-active))] bg-gradient-to-r from-[rgb(var(--color-header-active))] to-[rgb(var(--color-header-icon))] text-white self-center cursor-pointer"
                onClick={() => navigate("/feedback")}
            >
                <FaPaperPlane className="inline-block text-lg" />
                <span className="block">Submit Feedback</span>
            </button>
        </div>
    );
}

export default Help;

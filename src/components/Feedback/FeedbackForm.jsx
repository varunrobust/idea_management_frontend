import React, { useState } from "react";
import { FaPaperPlane, FaSmile } from "react-icons/fa";
import { apiFetch } from "../../utils/api";

const FeedbackForm = () => {
    const [feedback, setFeedback] = useState("");
    const [email, setEmail] = useState("");
    const [submitted, setSubmitted] = useState(false);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState("");

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        setError("");
        if (!feedback.trim()) {
            setError("Feedback cannot be empty.");
            setLoading(false);
            return;
        }
        await apiFetch("/feedback", {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify({ feedback, email }),
        });
        setLoading(false);
        setSubmitted(true);
    };

    const handleEmailChange = (e) => {
        const value = e.target.value;
        // Simple email validation
        if (
            value &&
            !/^[\w-]+(\.[\w-]+)*@([\w-]+\.)+[a-zA-Z]{2,7}$/.test(value)
        ) {
            setError("Please enter a valid email address.");
        } else {
            setError("");
        }
        setEmail(value);
    };

    return (
        <div className="flex items-center justify-center bg-theme px-4 py-12">
            <div className="w-full max-w-lg border border-header shadow-header rounded-2xl flex flex-col items-center p-8">
                <div className="my-4 flex flex-col items-center">
                    <span className="rounded-full bg-[rgb(var(--color-header-hover))] border-4 border-[rgb(var(--color-header-active))] shadow-lg p-4 mb-2">
                        <FaSmile className="text-[rgb(var(--color-header-active))] text-3xl" />
                    </span>
                    <h1 className="text-2xl sm:text-3xl font-bold text-header mb-1 text-center">
                        We value your feedback!
                    </h1>
                    <p className="text-header text-center text-base sm:text-lg max-w-md">
                        Help us improve by sharing your thoughts, suggestions,
                        or issues.
                    </p>
                </div>
                {submitted ? (
                    <div className="flex flex-col items-center my-6">
                        <FaPaperPlane className="text-[rgb(var(--color-header-active))] text-4xl mb-2 animate-bounce" />
                        <p className="text-header text-lg font-semibold text-center mb-2">
                            Thank you for your feedback!
                        </p>
                        <p className="text-header text-center">
                            We appreciate your input and will use it to make
                            IdeaHub even better.
                        </p>
                    </div>
                ) : (
                    <form className="w-[90%] my-4" onSubmit={handleSubmit}>
                        <div className="mb-5">
                            <label
                                htmlFor="feedback"
                                className="block text-header font-medium mb-2"
                            >
                                Your Feedback*
                            </label>
                            <textarea
                                id="feedback"
                                name="feedback"
                                value={feedback}
                                onChange={(e) => setFeedback(e.target.value)}
                                placeholder="Share your thoughts, suggestions, or report an issue..."
                                className="w-full border border-header rounded-lg px-4 py-2 bg-header text-header placeholder:text-header focus:ring-2 focus:ring-[rgb(var(--color-header-active))] focus:outline-none transition-all"
                            />
                        </div>
                        <div className="mb-6">
                            <label
                                htmlFor="email"
                                className="block text-header font-medium mb-2"
                            >
                                Your Email (optional)
                            </label>
                            <input
                                id="email"
                                type="email"
                                className="w-full border border-header rounded-lg px-4 py-2 bg-header text-header placeholder:text-header focus:ring-2 focus:ring-[rgb(var(--color-header-active))] focus:outline-none transition-all"
                                placeholder="you@example.com"
                                value={email}
                                onChange={handleEmailChange}
                            />
                        </div>
                        {error && (
                            <p className="text-red-600 mb-4 text-center">
                                {error}
                            </p>
                        )}
                        <button
                            type="submit"
                            className="w-full flex items-center justify-center gap-2 px-6 py-3 bg-[rgb(var(--color-header-active))] text-white font-semibold rounded-lg shadow hover:bg-[rgb(var(--color-header-icon))] transition-colors duration-150 text-lg disabled:opacity-60 cursor-pointer"
                            disabled={loading}
                        >
                            {loading ? "Sending..." : "Send Feedback"}
                            <FaPaperPlane className="ml-2" />
                        </button>
                    </form>
                )}
            </div>
        </div>
    );
};

export default FeedbackForm;

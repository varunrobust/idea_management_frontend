import React from "react";
import { Link } from "react-router-dom";

const Error = ({
    message = "An unexpected error occurred or server not running. Please try after sometime",
}) => (
    <div className="min-h-screen flex flex-col items-center justify-center bg-theme px-4 py-12">
        <div className="bg-header border border-header shadow-header rounded-2xl px-8 py-12 flex flex-col items-center max-w-lg w-full">
            <div className="text-[4rem] font-extrabold text-red-600 mb-2 select-none">
                <span role="img" aria-label="Error">
                    ❌
                </span>
            </div>
            <h1 className="text-2xl sm:text-3xl font-bold text-header mb-2 text-center">
                Error Occurred
            </h1>
            <p className="text-header text-center mb-6 text-base sm:text-lg">
                {message}
            </p>
            <Link
                to="/"
                className="inline-block bg-[rgb(var(--color-header-active))] text-white font-semibold px-6 py-2 rounded-lg shadow hover:bg-[rgb(var(--color-header-icon))] transition-colors duration-150"
            >
                Go to Home
            </Link>
        </div>
    </div>
);

export default Error;

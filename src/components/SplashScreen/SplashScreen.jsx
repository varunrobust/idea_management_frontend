import React from "react";
import { FaLightbulb } from "react-icons/fa";

const SplashScreen = () => (
    <div className="min-h-screen flex flex-col items-center justify-center bg-theme transition-colors duration-300">
        <div className="flex flex-col items-center">
            <div className="rounded-full bg-[rgb(var(--color-header-hover))] border-4 border-[rgb(var(--color-header-active))] shadow-lg p-6 mb-6 animate-pulse">
                <FaLightbulb className="text-[rgb(var(--color-header-active))] text-6xl" />
            </div>
            <h1 className="text-3xl sm:text-4xl font-extrabold text-header mb-2 tracking-tight text-center drop-shadow">
                Idea Management System
            </h1>
            <p className="text-header text-lg text-center max-w-md mb-8">
                Organize, share, and collaborate on your best ideas.
                <br />
                <span className="text-[rgb(var(--color-header-active))] font-semibold">
                    Modern. Secure. Themed.
                </span>
            </p>
            <div className="flex gap-4 mt-4">
                <div
                    className="w-3 h-3 rounded-full bg-[rgb(var(--color-header-active))] animate-bounce"
                    style={{ animationDelay: "0s" }}
                ></div>
                <div
                    className=" w-3 h-3 rounded-full bg-[rgb(var(--color-header-active))] animate-bounce"
                    style={{ animationDelay: "0.2s" }}
                ></div>
                <div
                    className="w-3 h-3 rounded-full bg-[rgb(var(--color-header-active))] animate-bounce"
                    style={{ animationDelay: "0.4s" }}
                ></div>
            </div>
        </div>
    </div>
);

export default SplashScreen;

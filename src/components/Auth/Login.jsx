import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { apiFetch } from "../../utils/api";

export default function Login() {
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [error, setError] = useState("");
    const navigate = useNavigate();

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError("");

        setTimeout(() => {
            setError(
                "Logging you in... If this takes a while, our backend service may be waking up. Please wait or try again in a minute."
            );
        }, 5000);

        try {
            const data = await apiFetch("/login", {
                method: "POST",
                credentials: "include",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ email, password }),
            });
            if (!data.token) {
                throw new Error("No token received");
            }
            localStorage.setItem("token", data.token);
            console.log("Login successful, token stored:", data.token);
            navigate("/dashboard");
        } catch (err) {
            setError(err.message);
        }
    };

    return (
        <div className="min-h-screen flex items-center justify-center bg-gradient-to-tr from-gray-950 via-gray-900 to-gray-800 px-2 py-6 sm:px-4 sm:py-8">
            <div className="w-full max-w-md rounded-3xl shadow-2xl border border-cyan-500 bg-gray-900/80 backdrop-blur-xl p-4 sm:p-8 flex flex-col items-center animate-fade-in">
                <h2 className="text-2xl sm:text-3xl font-extrabold text-cyan-300 mb-6 tracking-widest font-mono text-center drop-shadow-glow">
                    Portal Login
                </h2>
                {error && (
                    <div className="mb-4 w-full text-center text-red-400 font-mono bg-red-900/30 border border-red-500 rounded-lg py-2 px-4 animate-pulse">
                        {error}
                    </div>
                )}
                <form
                    className="w-full flex flex-col gap-4 sm:gap-6"
                    onSubmit={handleSubmit}
                >
                    <label className="flex flex-col gap-2 text-cyan-200 font-mono w-full">
                        Email
                        <input
                            type="email"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            required
                            placeholder="johndoe@email.com"
                            className="rounded-xl px-4 py-3 bg-gray-800/80 border border-cyan-700 focus:ring-2 focus:ring-cyan-400 focus:outline-none text-cyan-100 placeholder-cyan-500 font-mono text-base transition-all duration-200 shadow-inner w-full"
                        />
                    </label>
                    <label className="flex flex-col gap-2 text-cyan-200 font-mono w-full">
                        Password
                        <input
                            type="password"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            required
                            placeholder="••••••••"
                            className="rounded-xl px-4 py-3 bg-gray-800/80 border border-cyan-700 focus:ring-2 focus:ring-cyan-400 focus:outline-none text-cyan-100 placeholder-cyan-500 font-mono text-base transition-all duration-200 shadow-inner w-full"
                        />
                    </label>
                    <button
                        type="submit"
                        className="w-full py-3 rounded-xl bg-gradient-to-br from-cyan-700 to-cyan-900 hover:from-cyan-600 hover:to-cyan-800 text-white font-bold font-mono tracking-widest uppercase shadow-lg border border-cyan-400 hover:border-cyan-300 transition-all duration-200 text-base sm:text-lg mt-2 self-center disabled:opacity-60"
                    >
                        Login
                    </button>
                </form>
                <p className="mt-6 text-center text-xs sm:text-sm text-cyan-400 font-mono">
                    Don't have an account?{" "}
                    <Link
                        to="/register"
                        className="text-cyan-300 underline hover:text-cyan-200 transition-all duration-150"
                    >
                        Register
                    </Link>
                </p>
            </div>
        </div>
    );
}

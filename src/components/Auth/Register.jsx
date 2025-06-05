import React, { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { apiFetch } from "../../utils/api";

export default function Register() {
    const navigate = useNavigate();
    const [form, setForm] = useState({
        username: "",
        email: "",
        password: "",
        confirm: "",
    });
    const [error, setError] = useState("");
    const [loading, setLoading] = useState(false);

    const handleChange = (e) =>
        setForm((prev) => ({ ...prev, [e.target.name]: e.target.value }));

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError("");
        if (!form.username || !form.email || !form.password || !form.name) {
            setError("All fields are required.");
            return;
        }
        if (form.password !== form.confirm) {
            setError("Passwords do not match.");
            return;
        }

        setLoading(true);
        try {
            const data = await apiFetch("/register", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({
                    username: form.username,
                    email: form.email,
                    password: form.password,
                    name: form.name,
                }),
            });
            navigate("/login");
        } catch (err) {
            if (err.message === "API Error") {
                navigate("/error", { replace: true });
            } else {
                navigate("/error", { replace: true });
            }
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="min-h-screen flex items-center justify-center bg-gradient-to-tr from-gray-950 via-gray-900 to-gray-800 px-2 py-6 sm:px-4 sm:py-8">
            <div className="w-full max-w-md rounded-3xl shadow-2xl border border-cyan-500 bg-gray-900/80 backdrop-blur-xl p-4 sm:p-8 flex flex-col items-center animate-fade-in">
                <h2 className="text-xl sm:text-2xl font-extrabold text-cyan-300 mb-4 tracking-widest font-mono text-center drop-shadow-glow">
                    Create Your Account
                </h2>
                {error && (
                    <div className="mb-4 w-full text-center text-red-400 font-mono bg-red-900/30 border border-red-500 rounded-lg py-2 px-4 animate-pulse">
                        {error}
                    </div>
                )}
                <form
                    onSubmit={handleSubmit}
                    className="flex flex-col items-start w-full gap-4 sm:gap-5"
                >
                    <label className="w-full text-cyan-200 font-mono flex flex-col gap-2">
                        Username
                        <input
                            name="username"
                            type="text"
                            placeholder="Username"
                            value={form.username}
                            onChange={handleChange}
                            className="w-full rounded-xl px-4 py-3 bg-gray-800/80 border border-cyan-700 focus:ring-2 focus:ring-cyan-400 focus:outline-none text-cyan-100 placeholder-cyan-500 font-mono text-base transition-all duration-200 shadow-inner"
                            required
                        />
                    </label>
                    <label className="w-full text-cyan-200 font-mono flex flex-col gap-2">
                        Name
                        <input
                            name="name"
                            type="text"
                            placeholder="Name"
                            value={form.name}
                            onChange={handleChange}
                            className="w-full rounded-xl px-4 py-3 bg-gray-800/80 border border-cyan-700 focus:ring-2 focus:ring-cyan-400 focus:outline-none text-cyan-100 placeholder-cyan-500 font-mono text-base transition-all duration-200 shadow-inner"
                            required
                        />
                    </label>
                    <label className="w-full text-cyan-200 font-mono flex flex-col gap-2">
                        Email
                        <input
                            name="email"
                            type="email"
                            placeholder="Email address"
                            value={form.email}
                            onChange={handleChange}
                            className="w-full rounded-xl px-4 py-3 bg-gray-800/80 border border-cyan-700 focus:ring-2 focus:ring-cyan-400 focus:outline-none text-cyan-100 placeholder-cyan-500 font-mono text-base transition-all duration-200 shadow-inner"
                            required
                        />
                    </label>
                    <label className="w-full text-cyan-200 font-mono flex flex-col gap-2">
                        Password
                        <input
                            name="password"
                            type="password"
                            placeholder="Password"
                            value={form.password}
                            onChange={handleChange}
                            className="w-full rounded-xl px-4 py-3 bg-gray-800/80 border border-cyan-700 focus:ring-2 focus:ring-cyan-400 focus:outline-none text-cyan-100 placeholder-cyan-500 font-mono text-base transition-all duration-200 shadow-inner"
                            required
                        />
                    </label>
                    <label className="w-full text-cyan-200 font-mono flex flex-col gap-2">
                        Confirm Password
                        <input
                            name="confirm"
                            type="password"
                            placeholder="Confirm password"
                            value={form.confirm}
                            onChange={handleChange}
                            className="w-full rounded-xl px-4 py-3 bg-gray-800/80 border border-cyan-700 focus:ring-2 focus:ring-cyan-400 focus:outline-none text-cyan-100 placeholder-cyan-500 font-mono text-base transition-all duration-200 shadow-inner"
                            required
                        />
                    </label>
                    <button
                        type="submit"
                        disabled={loading}
                        className="w-full py-3 rounded-xl bg-gradient-to-br from-cyan-700 to-cyan-900 hover:from-cyan-600 hover:to-cyan-800 text-white font-bold font-mono tracking-widest uppercase shadow-lg border border-cyan-400 hover:border-cyan-300 transition-all duration-200 text-base sm:text-lg mt-2 self-center disabled:opacity-60"
                    >
                        {loading ? "Registering…" : "Register"}
                    </button>
                </form>
                <p className="mt-6 text-center text-xs sm:text-sm text-cyan-400 font-mono">
                    Already have an account?{" "}
                    <Link
                        to="/login"
                        className="text-cyan-300 underline hover:text-cyan-200 transition-all duration-150"
                    >
                        Log in
                    </Link>
                </p>
            </div>
        </div>
    );
}

// src/pages/Register.jsx
// import React from 'react'
// import { useNavigate } from 'react-router-dom'
// import ptcLogo     from '../assets/ptc-logo.png'
// import heroImg     from '../assets/register.jpg'

// export default function Register() {
//   const navigate = useNavigate()

//   return (
//     <div className="flex min-h-screen">
//       {/* Left: hero image, 40% on md+ */}
//       <div className="hidden md:block md:w-2/5">
//         <img
//           src={heroImg}
//           alt="Lightbulb idea hero"
//           className="w-full h-full object-cover"
//         />
//       </div>

//       {/* Right: form */}
//       <div className="w-full md:w-3/5 flex items-center justify-center bg-gray-50 p-6">
//         <div className="w-full max-w-md bg-white rounded-lg shadow-lg overflow-hidden">
//           {/* Logo + heading */}
//           <div className="py-8 px-6 text-center">
//             <img src={ptcLogo} alt="PTC logo" className="mx-auto h-16 mb-4" />
//             <h1 className="text-2xl font-bold">Register</h1>
//           </div>

//           {/* Form */}
//           <div className="px-6 pb-8">
//             <form className="space-y-4">
//               <input
//                 type="text"
//                 placeholder="Username"
//                 className="w-full border border-gray-300 rounded px-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-400"
//               />
//               <input
//                 type="email"
//                 placeholder="Email address"
//                 className="w-full border border-gray-300 rounded px-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-400"
//               />
//               <input
//                 type="password"
//                 placeholder="Password"
//                 className="w-full border border-gray-300 rounded px-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-400"
//               />
//               <input
//                 type="password"
//                 placeholder="Confirm password"
//                 className="w-full border border-gray-300 rounded px-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-400"
//               />

//               <button
//                 type="submit"
//                 className="w-full bg-blue-600 text-white py-2 rounded hover:bg-blue-700 transition"
//               >
//                 Create Account
//               </button>
//             </form>

//             <p className="mt-4 text-center text-sm text-gray-600">
//               Already have an account?{' '}
//               <button
//                 onClick={() => navigate('/login')}
//                 className="text-blue-600 hover:underline"
//               >
//                 Log in
//               </button>
//             </p>
//           </div>
//         </div>
//       </div>
//     </div>
//   )
// }

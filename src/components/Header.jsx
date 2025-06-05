// Header.js
import React, { useState, useEffect } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import {
    FaPlus,
    FaBuilding,
    FaList,
    FaQuestion,
    FaSignOutAlt,
    FaUsers,
    FaSun,
    FaMoon,
    FaUser,
} from "react-icons/fa";
import { useTheme } from "../context/ThemeContext";
import { apiFetch } from "../utils/api";

function Header() {
    const { theme, toggleTheme } = useTheme();
    const navigate = useNavigate();
    const location = useLocation();
    const [showViewOptions, setShowViewOptions] = useState(false);
    const [username, setUsername] = useState("");

    const navItems = [
        { icon: <FaPlus />, label: "Add", path: "/add-idea" },
        { icon: <FaBuilding />, label: "Dashboard", path: "/dashboard" },
        { icon: <FaQuestion />, label: "Help", path: "/help" },
        {
            icon: <FaList />,
            label: "View Ideas",
            path: "/ideas",
            isViewDropdown: true,
        },
    ];

    // Dropdown open/close logic for modern UX
    const handleDropdown = (type) => {
        if (type === "view") {
            setShowViewOptions((prev) => !prev);
        }
    };
    // Close dropdowns on outside click
    useEffect(() => {
        const closeDropdowns = (e) => {
            if (!e.target.closest(".modern-dropdown")) {
                setShowViewOptions(false);
            }
        };
        document.addEventListener("mousedown", closeDropdowns);
        // Fetch user details on component mount
        fetchUserDetails();
        return () => document.removeEventListener("mousedown", closeDropdowns);
    }, []);

    async function fetchUserDetails() {
        try {
            const data = await apiFetch("/me");
            setUsername(data.username);
            localStorage.setItem("username", data.username);
            localStorage.setItem("email", data.email);
            localStorage.setItem("user_id", data.id);
        } catch (err) {
            if (err.message === "Unauthorized") {
                navigate("/login", { replace: true });
            } else {
                navigate("/error", { replace: true });
            }
        }
    }

    return (
        <header
            className="w-full top-0 z-50 sticky bg-header border-b border-header shadow-header mb-5"
            style={{ backdropFilter: "blur(12px)" }}
        >
            <div className="max-w-7xl mx-auto flex flex-col sm:flex-row items-center justify-between px-4 sm:px-8 py-3 gap-4 sm:gap-0">
                {/* Logo and Navigation */}
                <nav className="flex items-center gap-6 sm:gap-10 w-full sm:w-auto justify-center">
                    <div className="flex gap-4 sm:gap-8 w-full sm:w-auto justify-center">
                        {navItems.map((item, index) => (
                            <div
                                key={index}
                                className="relative group modern-dropdown"
                            >
                                <button
                                    onClick={() => {
                                        if (item.isViewDropdown) {
                                            handleDropdown("view");
                                        } else {
                                            setShowViewOptions(false);
                                            navigate(item.path);
                                        }
                                    }}
                                    className={`flex flex-col items-center justify-center px-3 sm:px-4 py-2 rounded-xl border border-header bg-header text-header shadow-lg transition-all duration-200 focus:outline-none ${
                                        location.pathname === item.path
                                            ? "ring-2 ring-[color:rgb(var(--color-header-active))]"
                                            : "hover:ring-2 hover:ring-[color:rgb(var(--color-header-active))]"
                                    }`}
                                >
                                    <span
                                        className="flex items-center justify-center w-10 h-10 sm:w-12 sm:h-12 rounded-full mb-1 text-xl sm:text-2xl border border-header"
                                        style={{
                                            background:
                                                "rgb(var(--color-header-hover))",
                                            color: "rgb(var(--color-header-icon))",
                                        }}
                                    >
                                        {item.icon}
                                    </span>
                                    <span className="text-sm font-semibold mt-1 tracking-normal text-header">
                                        {item.label}
                                    </span>
                                </button>
                                {/* View Dropdown */}
                                {item.isViewDropdown && showViewOptions && (
                                    <div className="absolute left-1/2 -translate-x-1/2 mt-4 w-48 sm:w-56 rounded-2xl shadow-2xl py-3 z-50 animate-fade-in backdrop-blur-xl flex flex-col items-center gap-2 modern-dropdown bg-[rgb(var(--color-header-dropdown-bg))] border border-[rgb(var(--color-header-dropdown-border))]">
                                        <button
                                            onClick={() => {
                                                setShowViewOptions(false);
                                                navigate("/view-ideas");
                                            }}
                                            className="flex items-center w-full px-4 md:px-5 py-3 hover:bg-[rgb(var(--color-header-hover))] hover:text-[rgb(var(--color-header-active))] rounded-xl transition-all duration-200 text-base font-medium gap-2 group text-header"
                                        >
                                            <FaUsers
                                                style={{
                                                    color: "rgb(var(--color-header-active))",
                                                }}
                                                className="group-hover:scale-110 transition-transform"
                                            />
                                            Ideas
                                        </button>
                                        <button
                                            onClick={() => {
                                                setShowViewOptions(false);
                                                navigate("/my-ideas");
                                            }}
                                            className="flex items-center w-full px-4 sm:px-5 py-3 hover:bg-[rgb(var(--color-header-hover))] hover:text-[rgb(var(--color-header-active))] rounded-xl transition-all duration-200 text-base font-medium gap-2 group text-header"
                                        >
                                            <FaList
                                                style={{
                                                    color: "rgb(var(--color-header-active))",
                                                }}
                                                className="group-hover:scale-110 transition-transform"
                                            />
                                            My Ideas
                                        </button>
                                    </div>
                                )}
                            </div>
                        ))}
                    </div>
                </nav>
                <div className="flex items-center gap-4 w-full sm:w-auto justify-center sm:justify-end">
                    <button
                        className="flex items-center gap-2 px-3 py-2 rounded-xl border border-header bg-[rgb(var(--color-header-hover))] text-header transition-all duration-150 ml-2"
                        onClick={toggleTheme}
                        aria-label="Toggle theme"
                    >
                        {theme === "dark" ? <FaSun /> : <FaMoon />}
                        <span className="hidden md:inline text-xs font-medium">
                            {theme === "dark" ? "Light" : "Dark"} Mode
                        </span>
                    </button>
                    <button
                        className="flex items-center gap-2 px-4 sm:px-5 py-2 rounded-xl font-mono font-bold shadow-lg transition-all duration-150 tracking-widest uppercase border border-[rgb(var(--color-header-active))] bg-gradient-to-r from-[rgb(var(--color-header-active))] to-[rgb(var(--color-header-icon))] text-white"
                        onClick={() => {
                            localStorage.clear();
                            navigate("/login");
                            window.location.reload();
                        }}
                    >
                        <FaSignOutAlt className="inline-block text-lg" />
                        <span className="hidden md:block">Logout</span>
                    </button>
                    <div className="flex flex-col items-center justify-center gap-2">
                        <FaUser className="text-[rgb(var(--color-header-active))]" />
                        <p className="inline text-xs font-medium text-[rgb(var(--color-header-text))]">
                            {username}
                        </p>
                    </div>
                </div>
            </div>
        </header>
    );
}

export default Header;

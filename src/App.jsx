import React, { useEffect, useState } from "react";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import Login from "./components/Auth/Login";
import Register from "./components/Auth/Register";
import Dashboard from "./components/Dashboard";
import AddIdea from "./components/Ideas/AddIdeaForm";
import ViewIdeas from "./components/Ideas/ViewIdeas";
import Help from "./components/Help";
import NotFound from "./components/ErrorHandlers/NotFound";
import ProtectedLayout from "./components/ProtectedLayout/ProtectedLayout";
import PrivateRoute from "./components/ProtectedLayout/PrivateRoute";
import IdeaDetails from "./components/Ideas/IdeaDetails";
import Error from "./components/ErrorHandlers/Error";
import SplashScreen from "./components/SplashScreen/SplashScreen";
import FeedbackForm from "./components/Feedback/FeedbackFOrm";

function App() {
    const [showSplash, setShowSplash] = useState(() => {
        return !sessionStorage.getItem("splashShown");
    });

    useEffect(() => {
        if (showSplash) {
            const splashTimeout = setTimeout(() => {
                setShowSplash(false);
                sessionStorage.setItem("splashShown", "true");
            }, 2000);
            return () => clearTimeout(splashTimeout);
        }
    }, [showSplash]);

    return (
        <>
            {showSplash ? (
                <SplashScreen />
            ) : (
                <div className="min-h-screen bg-theme">
                    <BrowserRouter>
                        <Routes>
                            <Route
                                path="/"
                                element={<Navigate to="/login" replace />}
                            />
                            <Route path="/login" element={<Login />} />
                            <Route path="/register" element={<Register />} />
                            <Route path="/not-found" element={<NotFound />} />
                            <Route path="/error" element={<Error />} />

                            <Route
                                element={
                                    <PrivateRoute>
                                        <ProtectedLayout />
                                    </PrivateRoute>
                                }
                            >
                                <Route
                                    path="/dashboard"
                                    element={<Dashboard />}
                                />
                                <Route path="/add-idea" element={<AddIdea />} />
                                <Route
                                    path="/view-ideas"
                                    element={<ViewIdeas />}
                                />
                                <Route
                                    path="/my-ideas"
                                    element={<ViewIdeas myIdeas={true} />}
                                />
                                <Route
                                    path="/ideas/:id"
                                    element={<IdeaDetails />}
                                />
                                <Route path="/help" element={<Help />} />
                                <Route
                                    path="/feedback"
                                    element={<FeedbackForm />}
                                />
                            </Route>

                            <Route
                                path="*"
                                element={<Navigate to="/not-found" replace />}
                            />
                        </Routes>
                    </BrowserRouter>
                </div>
            )}
        </>
    );
}

export default App;

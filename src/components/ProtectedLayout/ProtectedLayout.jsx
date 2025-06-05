import Header from "../Header";
import Footer from "../Footer";
import { Outlet } from "react-router-dom";

export default function ProtectedLayout() {
    return (
        <>
            <Header />
            <main className="min-h-[calc(100vh-150px)]">
                <Outlet />
            </main>
            <Footer />
        </>
    );
}

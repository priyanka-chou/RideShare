
import { Outlet } from "react-router-dom";
import Navbar from "../components/Navbar";
import DashboardNav from "../components/DashboardNav";

const Layout = ({ isLoggedIn, setIsLoggedIn, user, setUser }) => {
    return (
        <div className="h-dvh overflow-hidden">
            <Navbar
                isLoggedIn={isLoggedIn}
                setIsLoggedIn={setIsLoggedIn}
                user={user}
                setUser={setUser}
            />

            <div className="h-[calc(100dvh-72px)] min-h-0">
                <DashboardNav user={user} />

               <main className="h-full min-h-0 min-w-0 overflow-y-auto overscroll-contain pb-20 md:ml-56 md:pb-0">
                    <Outlet />
                </main>
            </div>
        </div>
    );
};

export default Layout;

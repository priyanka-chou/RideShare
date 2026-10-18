import Navbar from "../components/Navbar"
import {
    FaThLarge,
    FaUser,
    FaCarSide,
    FaChartBar,
    FaCog
} from "react-icons/fa";
import UserTableBody from "../components/UserTableBody";
import RecentUsers from "../components/RecentUsers";

const AdminDashboard = () => {
    return (
        <>
            <Navbar />

            <div className="min-h-screen bg-gray-100 ">
                <div className="grid  gap-6 grid-cols-1 md:grid-cols-[300px_minmax(0,1fr)]">
                    <aside className="hidden md:block bg-white shadow-sm p-8 min-h-screen">

                        <div className="space-y-1 ">
                            <div className="flex items-center gap-4 text-md font-medium text-orange-600 bg-orange-100 p-3 rounded-md">
                                <FaThLarge className="size-5 "/>
                                <span >Dashboard</span>
                            </div>

                            <div className="flex items-center gap-4 text-md font-medium text-gray-700 p-3">
                                <FaUser className="size-5 " />
                                <span>Manage Users</span>
                            </div>

                            <div className="flex items-center gap-4 text-md font-medium text-gray-700 p-3">
                                <FaCarSide className="size-5 "/>
                                <span>Manage Rides</span>
                            </div>

                            <div className="flex items-center gap-4 text-md font-medium text-gray-700 p-3">
                                <FaChartBar className="size-5 " />
                                <span>Reports</span>
                            </div>

                            <div className="flex items-center gap-4 text-md font-medium text-gray-700 p-3">
                                <FaCog className="size-5 "/>
                                <span>Settings</span>
                            </div>
                        </div>
                    </aside>

                    <main className="shadow-sm rounded-xl p-4">

                        <h1 className="text-3xl font-bold text-gray-800 p-3">Dashboard</h1>

                        <div className="grid lg:grid-cols-4  grid-cols-2 gap-6  ">

                            <div className="p-4 bg-white  rounded-xl border border-gray-200 shadow-sm">
                                <h3 className="text-blue-600 text-4xl font-bold mb-4">124</h3>
                                <div className="mb-3 h-1 w-8 rounded-full bg-blue-500"></div>
                                <p className="text-md font-medium text-gray-700"> Total Users</p>
                            </div>

                            <div className="p-4 bg-white  rounded-xl  border border-gray-200 shadow-sm">
                                <h3 className="text-gray-900 text-4xl font-bold mb-4">56</h3>
                                <div className="mb-3 h-1 w-8 rounded-full bg-gray-900"></div>
                                <p className="text-md font-medium text-gray-700"> Active Rides</p>
                            </div>

                            <div className="p-4 bg-white  rounded-xl  border border-gray-200 shadow-sm">
                                <h3 className="text-green-600 text-4xl font-bold mb-4">128</h3>
                                <div className="mb-3 h-1 w-8 rounded-full bg-green-500"></div>
                                <p className="text-md font-medium text-gray-700">Completed Rides</p>
                            </div>

                            <div className="p-4 bg-white rounded-xl  border border-gray-200 shadow-sm">
                                <h3 className="text-orange-600 text-4xl font-bold mb-4">4.8</h3>
                                <div className="mb-3 h-1 w-8 rounded-full bg-orange-500"></div>
                                <p className="text-md font-medium text-gray-700">Average Rating</p>
                            </div>

                        </div>

                        <RecentUsers/>

                    </main>
                </div>
            </div>
        </>
    )
}

export default AdminDashboard


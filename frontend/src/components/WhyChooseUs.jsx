import {
    FaWallet,
    FaUsers,
    FaLeaf,
    FaShieldAlt,
} from "react-icons/fa";

const WhyChooseUs = () => {
    return (
        <section className="py-12 px-6">
            <h2 className="text-blue-950 font-bold text-3xl text-center mb-12">Why Choose RideShare?</h2>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">

                <div className="bg-white border border-gray-200 rounded-xl text-center p-6 shadow-sm hover:shadow-md transition-all duration-200 hover:translate-y-1">
                    <div className="w-13 h-13 rounded-full bg-blue-100 flex items-center justify-center mx-auto mb-3">
                        <FaWallet className="text-blue-600 text-xl" />
                    </div>
                    <h3 className="font-semibold text-gray-800">Save Money</h3>
                    <p className="text-sm text-gray-500 mt-2">Share travel costs with fellow passengers and save money on your journey.</p>
                </div>

                <div className="bg-white border border-gray-200 rounded-xl text-center  p-6 shadow-sm hover:shadow-md transition-all duration-200 hover:-translate-y-1">
                    <div className="w-13 h-13 rounded-full bg-blue-100 flex items-center justify-center mx-auto mb-3">
                        <FaUsers className="text-blue-600 text-xl" />
                    </div>
                    <h3 className="font-semibold text-gray-800">Meet People</h3>
                    <p className="text-sm text-gray-500 mt-2">Connect with fellow students and travelers heading in the same direction.</p>
                </div>

                <div className="bg-white border border-gray-200 rounded-xl text-center  p-6 shadow-sm hover:shadow-md transition-all duration-200 hover:-translate-y-1">
                    <div className="w-13 h-13 rounded-full bg-green-100 flex items-center justify-center mx-auto mb-3">
                        <FaLeaf className="text-green-600 text-xl" />
                    </div>
                    <h3 className="font-semibold text-gray-800">Eco Freindly</h3>
                    <p className="text-sm text-gray-500 mt-2">Share rides to help reduce the number of cars on the road.</p>
                </div>

                <div className="bg-white border border-gray-200 rounded-xl text-center  p-6 shadow-sm hover:shadow-md transition-all duration-200 hover:-translate-y-1">
                    <div className="w-13 h-13 rounded-full bg-cyan-100 flex items-center justify-center mx-auto mb-3">
                        <FaShieldAlt className="text-cyan-600 text-xl" />
                    </div>
                    <h3 className="font-semibold text-gray-800">Safe & Verified</h3>
                    <p className="text-sm text-gray-500 mt-2">Check user profiles and available verification details before booking.</p>
                </div>

            </div>
        </section>
    )
}

export default WhyChooseUs

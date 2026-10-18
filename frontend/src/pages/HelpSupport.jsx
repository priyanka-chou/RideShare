

import { useEffect, useState } from "react";
import {
    createSupportRequest,
    getMySupportRequests,
    getSupportRequestById,
} from "../services/api/helpSupportApi";

import {
    CircleHelp,
    ChevronDown,
    ChevronUp,
    MessageSquare,
    ClipboardList,
} from "lucide-react";


import { toast } from "react-toastify";

const faqs = [
    {
        category: "Bookings",
        question: "How can I book a ride?",
        answer:
            "Open Find Rides, search for your route, select a suitable ride, and follow the booking process.",
    },
    {
        category: "Bookings",
        question: "Where can I see my bookings?",
        answer:
            "Open Ride History to view your bookings and their current status.",
    },
    {
        category: "Bookings",
        question: "Can I cancel a booking?",
        answer:
            "Open Ride History, select your booking, and use the cancellation option if it is available.",
    },
    {
        category: "Rides",
        question: "How can I offer a ride?",
        answer:
            "Use the ride creation option available in your account to publish a ride with its route, date, time, and available seats.",
    },
    {
        category: "Account",
        question: "How can I update my profile?",
        answer:
            "Open Settings and select Edit Profile to update your account details.",
    },
    {
        category: "Safety",
        question: "What should I do if I face a problem during a ride?",
        answer:
            "Contact your project support team and share the ride details and a clear description of the issue. If you are in immediate danger, contact local emergency services.",
    },
];

  




const HelpSupport = () => {

    const [activeCategory, setActiveCategory] = useState("All");
    const [openFaq, setOpenFaq] = useState(null);
   

    
const [category, setCategory] = useState("Booking");
const [subject, setSubject] = useState("");
const [message, setMessage] = useState("");
const [submitting, setSubmitting] = useState(false);


const [supportRequests, setSupportRequests] = useState([]);
const [loadingRequests, setLoadingRequests] = useState(true);
const [requestsError, setRequestsError] = useState("");


    const categories = [
        "All",
        ...new Set(faqs.map((faq) => faq.category)),
    ];

    const filteredFaqs =
        activeCategory === "All"
            ? faqs
            : faqs.filter(
                  (faq) => faq.category === activeCategory
              );


              
const loadSupportRequests = async () => {
    setLoadingRequests(true);
    setRequestsError("");

    try {
        const response = await getMySupportRequests();

        const requests =
            response?.data?.data ??
            response?.data ??
            response;

        setSupportRequests(
            Array.isArray(requests) ? requests : []
        );
    } catch (error) {
        console.error("Load support requests error:", error);

        setRequestsError(
            error.response?.data?.message ||
                "Unable to load support requests."
        );
    } finally {
        setLoadingRequests(false);
    }
};



useEffect(() => {
    loadSupportRequests();
}, []);


const handleSupportSubmit = async (e) => {
    e.preventDefault();

    if (!subject.trim() || !message.trim()) {
        toast.error("Please enter subject and message.");
        return;
    }

    if (subject.trim().length > 150) {
        toast.error("Subject cannot exceed 150 characters.");
        return;
    }

    if (message.trim().length > 5000) {
        toast.error("Message cannot exceed 5000 characters.");
        return;
    }

    try {
        setSubmitting(true);

        await createSupportRequest({
    category,
    subject: subject.trim(),
    message: message.trim(),
});

        toast.success("Support request submitted successfully!");
        setCategory("Booking");
        setSubject("");
        setMessage("");
    } catch (error) {
        toast.error(
            error.response?.data?.message ||
                "Unable to submit support request."
        );
    } finally {
        setSubmitting(false);
    }
};





    return (
        <main className="min-h-screen bg-gray-50 px-4 py-8 md:px-8">
            <div className="mx-auto max-w-4xl">
                <div className="mb-8 flex items-center gap-3">
                    <div className="rounded-xl bg-purple-100 p-3 text-purple-600">
                        <CircleHelp size={27} />
                    </div>

                    <div>
                        <h1 className="text-2xl font-bold text-slate-900 md:text-3xl">
                            Help & Support
                        </h1>
                        <p className="mt-1 text-sm text-slate-500">
                            Find answers and get help with RideShare.
                        </p>
                    </div>
                </div>

                <section className="mb-6 grid grid-cols-1 gap-4 sm:grid-cols-2">
                    <button
                        type="button"
                        onClick={() =>
                            document
                                .getElementById("contact-support")
                                ?.scrollIntoView({ behavior: "smooth" })
                        }
                        className="flex items-center gap-4 rounded-2xl border border-slate-100 bg-white p-5 text-left shadow-sm transition hover:border-orange-200 hover:shadow-md"
                    >
                        <div className="rounded-xl bg-orange-100 p-3 text-orange-600">
                            <MessageSquare size={23} />
                        </div>
                        <div>
                            <h2 className="font-semibold text-slate-900">
                                Contact Support
                            </h2>
                            <p className="mt-1 text-sm text-slate-500">
                                Get help with a problem.
                            </p>
                        </div>
                    </button>

                    <button
                        type="button"
                        onClick={() =>
                            document
                                .getElementById("my-requests")
                                ?.scrollIntoView({ behavior: "smooth" })
                        }
                        className="flex items-center gap-4 rounded-2xl border border-slate-100 bg-white p-5 text-left shadow-sm transition hover:border-orange-200 hover:shadow-md"
                    >
                        <div className="rounded-xl bg-blue-100 p-3 text-blue-600">
                            <ClipboardList size={23} />
                        </div>
                        <div>
                            <h2 className="font-semibold text-slate-900">
                                My Support Requests
                            </h2>
                            <p className="mt-1 text-sm text-slate-500">
                                Track your submitted requests.
                            </p>
                        </div>
                    </button>
                </section>

                <section className="mb-6 rounded-2xl border border-slate-100 bg-white p-5 shadow-sm md:p-6">
                    <h2 className="text-lg font-bold text-slate-900">
                        Frequently Asked Questions
                    </h2>
                    <p className="mt-1 text-sm text-slate-500">
                        Browse common questions about your account and rides.
                    </p>

                    <div className="my-5 flex flex-wrap gap-2">
                        {categories.map((category) => (
                            <button
                                key={category}
                                type="button"
                                onClick={() => {
                                    setActiveCategory(category);
                                    setOpenFaq(null);
                                }}
                                className={`rounded-full px-4 py-2 text-sm font-medium transition ${
                                    activeCategory === category
                                        ? "bg-orange-500 text-white"
                                        : "bg-slate-100 text-slate-600 hover:bg-slate-200"
                                }`}
                            >
                                {category}
                            </button>
                        ))}
                    </div>

                    <div className="divide-y divide-slate-100">
                        {filteredFaqs.map((faq, index) => {
                            const isOpen = openFaq === faq.question;

                            return (
                                <div key={faq.question} className="py-4">
                                    <button
                                        type="button"
                                        onClick={() =>
                                            setOpenFaq(
                                                isOpen ? null : faq.question
                                            )
                                        }
                                        className="flex w-full items-center justify-between gap-4 text-left"
                                    >
                                        <span className="font-medium text-slate-800">
                                            {faq.question}
                                        </span>
                                        {isOpen ? (
                                            <ChevronUp
                                                size={19}
                                                className="shrink-0 text-slate-500"
                                            />
                                        ) : (
                                            <ChevronDown
                                                size={19}
                                                className="shrink-0 text-slate-500"
                                            />
                                        )}
                                    </button>

                                    {isOpen && (
                                        <p className="mt-3 pr-6 text-sm leading-6 text-slate-600">
                                            {faq.answer}
                                        </p>
                                    )}
                                </div>
                            );
                        })}
                    </div>
                </section>

                
<section
    id="contact-support"
    className="mb-6 scroll-mt-6 rounded-2xl border border-slate-100 bg-white p-5 shadow-sm md:p-6"
>
    <h2 className="text-lg font-bold text-slate-900">
        Contact Support
    </h2>

    <p className="mt-1 text-sm text-slate-500">
        Describe your problem and our support team can help.
    </p>

    <form onSubmit={handleSupportSubmit} className="mt-5 space-y-4">
        <div>
            <label
                htmlFor="support-category"
                className="mb-1.5 block text-sm font-medium text-slate-700"
            >
                Category
            </label>

            <select
                id="support-category"
                value={category}
                onChange={(e) => setCategory(e.target.value)}
                className="w-full rounded-lg border border-slate-200 bg-white px-3 py-2.5 text-sm outline-none focus:border-orange-500 focus:ring-2 focus:ring-orange-100"
                required
            >
                <option value="Booking">Booking</option>
                <option value="Ride">Ride</option>
                <option value="Account">Account</option>
                <option value="Payment">Payment</option>
                <option value="Safety">Safety</option>
                <option value="Other">Other</option>
            </select>
        </div>

        <div>
            <label
                htmlFor="support-subject"
                className="mb-1.5 block text-sm font-medium text-slate-700"
            >
                Subject
            </label>

            <input
                id="support-subject"
                type="text"
                value={subject}
                onChange={(e) => setSubject(e.target.value)}
                placeholder="Briefly describe your issue"
                maxLength={150}
                className="w-full rounded-lg border border-slate-200 px-3 py-2.5 text-sm outline-none focus:border-orange-500 focus:ring-2 focus:ring-orange-100"
                required
            />
        </div>

        <div>
            <label
                htmlFor="support-message"
                className="mb-1.5 block text-sm font-medium text-slate-700"
            >
                Message
            </label>

            <textarea
                id="support-message"
                value={message}
                onChange={(e) => setMessage(e.target.value)}
                placeholder="Explain your problem in detail..."
                rows={5}
                maxLength={5000}
                className="w-full resize-y rounded-lg border border-slate-200 px-3 py-2.5 text-sm outline-none focus:border-orange-500 focus:ring-2 focus:ring-orange-100"
                required
            />

            <p className="mt-1 text-right text-xs text-slate-400">
                {message.length}/5000 characters
            </p>
        </div>

        <button
            type="submit"
            disabled={submitting}
            className="rounded-lg bg-orange-500 px-5 py-2.5 text-sm font-semibold text-white transition hover:bg-orange-600 disabled:cursor-not-allowed disabled:opacity-60"
        >
            {submitting ? "Submitting..." : "Submit Request"}
        </button>
    </form>
</section>



<section
    id="my-requests"
    className="rounded-2xl border border-slate-100 bg-white p-5 shadow-sm md:p-6"
>
    <h2 className="text-lg font-bold text-slate-900">
        My Support Requests
    </h2>

    <p className="mt-1 text-sm text-slate-500">
        Track the status of your submitted requests.
    </p>

    {loadingRequests ? (
        <p className="mt-5 text-sm text-slate-500">
            Loading your requests...
        </p>
    ) : requestsError ? (
        <p className="mt-5 text-sm text-red-600">
            {requestsError}
        </p>
    ) : supportRequests.length === 0 ? (
        <p className="mt-5 rounded-lg bg-slate-50 p-4 text-sm text-slate-500">
            You have not submitted any support requests yet.
        </p>
    ) : (
        <div className="mt-5 space-y-4">
            {supportRequests.map((request) => (
                <article
                    key={request.id}
                    className="rounded-xl border border-slate-200 p-4"
                >
                    <div className="flex flex-wrap items-start justify-between gap-3">
                        <div>
                            <h3 className="font-semibold text-slate-900">
                                {request.subject}
                            </h3>

                            <p className="mt-1 text-sm text-slate-500">
                                {request.category}
                            </p>
                        </div>

                        <span className="rounded-full bg-orange-100 px-3 py-1 text-xs font-semibold text-orange-700">
                            {request.status}
                        </span>
                    </div>

                    <p className="mt-3 whitespace-pre-wrap text-sm leading-6 text-slate-600">
                        {request.message}
                    </p>

                    <p className="mt-3 text-xs text-slate-400">
                        Request #{request.id}
                        {request.created_at
                            ? ` · ${new Date(request.created_at).toLocaleString()}`
                            : ""}
                    </p>
                </article>
            ))}
        </div>
    )}
</section>


            </div>
        </main>
    );
};

export default HelpSupport;

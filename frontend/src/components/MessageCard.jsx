import profile from "../assets/avtar.avif";

const MessageCard = ({
    name,
    lastMessage,
    time,
    onClick,
    isActive,
    profilePic,
}) => {
    return (
        <button
            type="button"
            onClick={onClick}
            className={`w-full border-b border-gray-200 p-4 text-left transition-colors ${
                isActive ? "bg-orange-50" : "hover:bg-gray-50"
            }`}
        >
            <div className="flex items-center justify-between gap-2">
                <div className="flex min-w-0 items-center gap-3">
                    <img
                        src={profilePic || profile}
                        alt={name}
                        className="size-12 shrink-0 rounded-full object-cover"
                    />

                    <div className="min-w-0">
                        <h3 className="truncate font-medium text-gray-800">
                            {name}
                        </h3>
                        <p className="truncate text-xs text-gray-600">
                            {lastMessage}
                        </p>
                    </div>
                </div>

                <span className="shrink-0 text-xs text-gray-500">
                    {time}
                </span>
            </div>
        </button>
    );
};

export default MessageCard;
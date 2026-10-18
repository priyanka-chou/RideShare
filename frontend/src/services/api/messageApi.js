
import { api } from "./api";

export const getConversation = async (userId) => {
    const response = await api.get(`/messages/${userId}`);
    return response.data;
};

export const sendChatMessage = async (receiverId, message) => {
    const response = await api.post("/messages", {
        receiverId,
        message,
    });

    return response.data;
};

export const getAllUsers = async () => {
    const response = await api.get("/messages/users");
    return response.data;
};
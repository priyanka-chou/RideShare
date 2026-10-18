import { api } from "./api";

// GET PROFILE
export const getProfile = async () => {
    const response = await api.get("/profile/");
    return response.data.data;
};

// UPDATE PROFILE
export const updateProfile = async (profileData) => {
    const response = await api.put("/profile/", profileData);
    return response.data;
};

// UPLOAD PROFILE PHOTO OR COVER IMAGE
export const uploadProfileImage = async (imageFile, type) => {
    const formData = new FormData();

    // Pehle type, phir image (multer ke liye safe order)
    formData.append("type", type);
    formData.append("image", imageFile, imageFile.name || `${type}.jpg`);

    // IMPORTANT: agar api instance me default "Content-Type: application/json"
    // set hai, to FormData JSON ban kar jaata hai aur multer ko file nahi milti.
    // multipart/form-data dene se axios khud boundary laga deta hai.
    const response = await api.post("/profile/upload-image", formData, {
        headers: {
            "Content-Type": "multipart/form-data",
        },
    });

    return response.data;
};
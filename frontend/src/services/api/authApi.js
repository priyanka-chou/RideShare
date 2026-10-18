import {api} from "./api";


export const loginUser = async (loginData)=>{  //   Haan, yahan loginData ka matlab hai login form se aane wala data.
    const response =await api.post("/auth/login",loginData);
    return response.data;
}
export const registerUser = async (registerData)=>{
   const response = await api.post("/auth/register",registerData);
   return response.data;
}

export const sendOtp = async (email)=>{
   const response = await api.post("/auth/send-Otp",{email});
   return response.data;
}

export const verifyOtp = async (otpData)=>{
    const response =await api.post("/auth/verify-otp",otpData);
    return response.data;
}

export const forgotPassword = async (email) => {

    const response = await api.post(
        "/auth/forgot-password",
        { email }
    );

    return response.data;
};



export const resetPassword = async (resetData) => {
    const response = await api.post("/auth/reset-password", resetData);
    return response.data;
};


export const logoutUser = async () => {
  const response = await api.post("/auth/logout");
  return response.data;
};

export const getCurrentUser = async () => {
    const response = await api.get("/auth/me");
    return response.data;
};

export const verifyResetOtp = async (otpData) => {
    const response = await api.post(
        "/auth/verify-reset-otp",
        otpData
    );

    return response.data;
};
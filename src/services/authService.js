import api from "./api";

export async function sendOtp(userName, phoneNumber) {
    const response = await api.post("/api/Auth/send-otp", {
        userName,
        phoneNumber,
    });
    return response.data;
}

export async function verifyOtp(userName, otpCode){
    const response = await api.post("/api/Auth/verify-otp", {
        userName,
        code: otpCode,
    });
    return response.data;
}

export async function refreshToken() {
    const refreshToken = localStorage.getItem("refreshToken");

    const response = await api.post(
        "/api/Auth/refresh",
        {
            refreshToken,
        }
    );

    return response.data;
}

export async function logout() {
    const savedRefreshToken = localStorage.getItem("refreshToken");

    const response = await api.post("/api/Auth/logout", {
        refreshToken: savedRefreshToken,
    });

    return response.data;
}
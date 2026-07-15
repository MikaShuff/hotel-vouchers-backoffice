import api from "./api";

export async function getUsers() {
    const response = await api.get("/api/User");
    return response.data;
}
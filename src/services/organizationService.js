import api from "./api";

export async function getOrganization() {
    const response = await api.get("/api/Organization/Organizations");
    return response.data;
}

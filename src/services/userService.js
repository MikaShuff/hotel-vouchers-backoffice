import api from "./api";

export async function getUsers() {
    const response = await api.get("/api/User");
    return response.data;
}

export async function getUserById(id) {
    const response = await api.get(`/api/User/${id}`);
    return response.data;
}

export async function updateUser(
    id,
    userName,
    roleId,
    branchId,
    organizationId,
    phone,
    email
) {
    const response = await api.patch(`/api/User/${id}`, {
        userName,
        roleId,
        branchId,
        organizationId,
        phone,
        email,
    });

    return response.data;
}

export async function activateUser(id) {
    const response = await api.patch(`/api/User/${id}/activate`);
    return response.data;
}

export async function deactivateUser(id) {
    const response = await api.patch(`/api/User/${id}/deactivate`);
    return response.data;
}

export async function blockUser(id, lockedUntil) {
    const response = await api.post(`/api/User/${id}/block`, {
        lockedUntil,
    });

    return response.data;
}

export async function unblockUser(id) {
    const response = await api.post(`/api/User/${id}/unblock`);
    return response.data;
}
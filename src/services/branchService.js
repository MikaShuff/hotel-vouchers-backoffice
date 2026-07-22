import api from "./api";

export async function getBranches() {
    const response = await api.get("/api/Branch");
    return response.data;
}

export async function getBranchById(id) {
    const response = await api.get(`/api/Branch/${id}`);
    return response.data;
}

export async function createBranch(
    name,
    organizationId,
    terminalUniqueIdentifier,
    maxWithdrawAmount
) {
    const response = await api.post("/api/Branch", {
        name,
        organizationId,
        terminalUniqueIdentifier,
        maxWithdrawAmount,
    });

    return response.data;
}

export async function updateBranch(
    id,
    name,
    terminalUniqueIdentifier,
    updateMaxWithdrawAmount,
    maxWithdrawAmount
) {
    const response = await api.patch(`/api/Branch/${id}`, {
        name,
        terminalUniqueIdentifier,
        updateMaxWithdrawAmount,
        maxWithdrawAmount,
    });

    return response.data;
}

export async function activateBranch(id) {
    const response = await api.patch(`/api/Branch/${id}/activate`);
    return response.data;
}

export async function deactivateBranch(id) {
    const response = await api.patch(`/api/Branch/${id}/deactivate`);
    return response.data;
}
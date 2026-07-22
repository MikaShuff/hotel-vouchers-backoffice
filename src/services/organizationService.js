import api from "./api";

export async function getOrganization() {
    const response = await api.get("/api/Organization/Organizations");
    return response.data;
}

export async function createOrganization(name, commission, allowCancel, maxWithdrawAmount){
    const response = await api.post("/api/Organization/Organizations", {
        name,
        commission,
        allowCancel,
        maxWithdrawAmount,
    });
    return response.data;
}

export async function updateOrganization(id, name, commission, allowCancel, updateMaxWithdrawAmount, maxWithdrawAmount) {
    const response = await api.patch(`/api/Organization/Organizations/${id}`, {
        name,
        commission,
        allowCancel,
        updateMaxWithdrawAmount,
        maxWithdrawAmount,
    });

    return response.data;
}

export async function activateOrganization(id) {
    const response = await api.patch(
        `/api/Organization/organizations/${id}/activate`
    );

    return response.data;
}

export async function deactivateOrganization(id) {
    const response = await api.patch(
        `/api/Organization/organizations/${id}/deactivate`
    );

    return response.data;
}
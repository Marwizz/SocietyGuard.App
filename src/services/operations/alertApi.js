import { apiConnector } from "../apiConnector";
import { alertsendpoints } from "../apis";


const {getAllAlerts_API, updateAlert_API} = alertsendpoints

export async function getAllAlerts(societyId) {
    try {
        const url = `${getAllAlerts_API}/${societyId}`;

        const response = await apiConnector("GET", url);
        console.log("getAllAlerts_API RESPONSE:", response);
        return response;
    } catch (error) {
        console.log("guardLogin_API ERROR:", error);
        throw error;
    }
}

export async function updateAlerts(alertId, status, guardId) {
    try {
        const url = `${updateAlert_API}/${alertId}/status`;

        const response = await apiConnector("PUT", url, {status: status, guardId: guardId});
        console.log("getAllAlerts_API RESPONSE:", response);
        return response;
    } catch (error) {
        console.log("guardLogin_API ERROR:", error);
        throw error;
    }
}
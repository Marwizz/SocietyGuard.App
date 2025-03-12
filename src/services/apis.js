import { get } from "react-native/Libraries/TurboModule/TurboModuleRegistry";

const BASE_URL = process.env.EXPO_PUBLIC_BASE_URL;

// AUTH ENDPOINTS
export const authendpoints = {
    guardLogin_API: BASE_URL + "/auth/login/securityGuard"
};

export const preapproveendpoint={
    visitor_API : BASE_URL + "/auth/verify-visitor-otp",
    group_API : BASE_URL +"/auth/society-parties",
    addGuest_API : BASE_URL + "/auth/party-invites/code",
    getAllDeliveries_API : BASE_URL + "/auth/delivery/society",
    getAllCabInvite_API : BASE_URL + "/auth/cab/society",
    verifyDeliveryInvite_API : BASE_URL + "/auth/delivery",
    verifyCabInvite_API : BASE_URL + "/auth/cab",
    frequentInvite_API : BASE_URL + "/auth/my-frequent-invites",
    recordVisit_API: BASE_URL + "/auth/record-visit",
    otherVisitor_API : BASE_URL + "/auth/get-visitors-for-Guard",
    verifyOtherVisitor_API : BASE_URL + "/auth/verify-other-guest"

};

export const onarrivalendpoints={
    guestwaiting_API : BASE_URL + "/auth/society-pending-visitors",
    cabWaiting_API : BASE_URL + "/auth/cab/society/waiting",
    deliveryWaiting_API : BASE_URL +"/auth/delivery/society/waiting"
}

export const alertsendpoints={
    getAllAlerts_API : BASE_URL + "/auth/alerts/society",
    updateAlert_API : BASE_URL + "/auth/alerts"
}
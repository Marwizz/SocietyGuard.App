const BASE_URL = process.env.API_BASE_URL;

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
    frequentInvite_API : BASE_URL + "/auth/my-frequent-invites",
    recordVisit_API: BASE_URL + "/auth/record-visit"

};

export const onarrivalendpoints={
    guestwaiting_API : BASE_URL + "/auth/society-pending-visitors",
}
const BASE_URL = process.env.API_BASE_URL;

// AUTH ENDPOINTS
export const authendpoints = {
    guardLogin_API: BASE_URL + "/auth/login/securityGuard"
};

export const preapproveendpoint={
    visitor_API : BASE_URL + "/auth/verify-visitor-otp",
    group_API : BASE_URL +"/auth/society-parties/:societyId",

}
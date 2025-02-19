import { apiConnector } from "../apiConnector";
import { preapproveendpoint } from "../apis";

const {visitor_API, group_API} = preapproveendpoint


export async function verifyVisitorOTP(otpData) {
    try {
        const response = await apiConnector("POST", visitor_API, otpData);
        console.log("VERIFY VISITOR OTP RESPONSE:", response);
        return response;
    } catch (error) {
        console.log("VERIFY_VISITOR_OTP ERROR:", error);
        throw error;
    }
}

export async function groupVisitorOTP(groupData) {
    try {
        const response = await apiConnector("POST", group_API, groupData);
        console.log("group_API VISITOR OTP RESPONSE:", response);
        return response;
    } catch (error) {
        console.log("group_API ERROR:", error);
        throw error;
    }
}

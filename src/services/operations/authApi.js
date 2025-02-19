import { apiConnector } from "../apiConnector";
import { authendpoints } from "../apis";


const {guardLogin_API} = authendpoints

export async function guardLogin(email, password) {
    try {
        let body;
        body = {
            email,
            password
          };
        const response = await apiConnector("POST", guardLogin_API,  body);
        console.log("guardLogin_API RESPONSE:", response);
        return response;
    } catch (error) {
        console.log("guardLogin_API ERROR:", error);
        throw error;
    }
}
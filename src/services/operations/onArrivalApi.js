import { apiConnector } from "../apiConnector";
import { onarrivalendpoints } from "../apis";


const {guestwaiting_API} = onarrivalendpoints

export async function guestWaiting(societyId) {
    try {
      if (!societyId) {
        throw new Error("societyId is required");
      }
  
      const url = `${guestwaiting_API}/${societyId}`;
  
      const response = await apiConnector("GET", url);
      console.log("guestwaiting_API RESPONSE:", response);
      return response;
    } catch (error) {
      console.log("guestwaiting_API ERROR:", error);
      throw error;
    }
  }
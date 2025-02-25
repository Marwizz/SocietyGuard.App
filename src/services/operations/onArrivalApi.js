import { apiConnector } from "../apiConnector";
import { onarrivalendpoints } from "../apis";


const {guestwaiting_API, cabWaiting_API, deliveryWaiting_API } = onarrivalendpoints

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

  export async function cabWaiting(societyId) {
    try {
      if (!societyId) {
        throw new Error("societyId is required");
      }
  
      const url = `${cabWaiting_API}/${societyId}`;
  
      const response = await apiConnector("GET", url);
      console.log("cabWaiting_API RESPONSE:", response);
      return response;
    } catch (error) {
      console.log("cabWaiting_API ERROR:", error);
      throw error;
    }
  }


  export async function deliveryWaiting(societyId) {
    try {
      if (!societyId) {
        throw new Error("societyId is required");
      }
  
      const url = `${deliveryWaiting_API}/${societyId}`;
  
      const response = await apiConnector("GET", url);
      console.log("deliveryWaiting_API RESPONSE:", response);
      return response;
    } catch (error) {
      console.log("deliveryWaiting_API ERROR:", error);
      throw error;
    }
  }
import { apiConnector } from "../apiConnector";
import { exitendpoints } from "../apis";

const {visitorExit_API, cabExit_API, deliveryExit_API} = exitendpoints

export async function visitorExit(societyId){
    try {
        if(!societyId){
            throw new Error("societyId is required")
        }
        const url = `${visitorExit_API}/${societyId}`
        const response = await apiConnector("GET", url)
        console.log("visitorExit_API RESPONSE:", response)
        return response
    } catch (error) {
        console.log("visitorExit_API ERROR:", error)
        throw error
    }
}


  export async function cabExit(societyId){
    try {
        if(!societyId){
            throw new Error("societyId is required")
        }
        const url = `${cabExit_API}/${societyId}`
        const response = await apiConnector("GET", url)
        console.log("cabExit_API RESPONSE:", response)
        return response
    } catch (error) {
        console.log("cabExit_API ERROR:", error)
        throw error
    }
  }

  export async function deliveryExit(societyId){
    try {
        if(!societyId){
            throw new Error("societyId is required")
        }
        const url = `${deliveryExit_API}/${societyId}`
        const response = await apiConnector("GET", url)
        console.log("deliveryExit_API RESPONSE:", response)
        return response
    } catch (error) {
        console.log("deliveryExit_API ERROR:", error)
        throw error
    }
  }

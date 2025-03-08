import { apiConnector } from "../apiConnector";
import { preapproveendpoint } from "../apis";

const {
  visitor_API,
  group_API,
  addGuest_API,
  getAllDeliveries_API,
  getAllCabInvite_API,
  verifyDeliveryInvite_API,
  verifyCabInvite_API,
  frequentInvite_API,
  recordVisit_API, otherVisitor_API, verifyOtherVisitor_API
} = preapproveendpoint;

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

export async function groupVisitorOTP(societyId) {
  try {
    if (!societyId) {
      throw new Error("societyId is required");
    }

    const url = `${group_API}/${societyId}`;

    const response = await apiConnector("GET", url);
    console.log("group_API VISITOR OTP RESPONSE:", response);
    return response;
  } catch (error) {
    console.log("group_API ERROR:", error);
    throw error;
  }
}

export async function otherVisitor(societyId) {
  try {
    if (!societyId) {
      throw new Error("societyId is required");
    }

    const url = `${otherVisitor_API}/${societyId}`;
    console.log("url is ", url);

    const response = await apiConnector("GET", url);
    console.log("otherVisitor_API VISITOR OTP RESPONSE:", response);
    return response;
  } catch (error) {
    console.log("otherVisitor_API ERROR:", error);
    throw error;
  }
}

export async function addGuestEntry(partyCode, guestData) {
  try {
    if (!partyCode) {
      throw new Error("partyCode is required");
    }

    const url = `${addGuest_API}/${partyCode}/guest`;
    console.log("url is ", url);
    const data = guestData;

    const response = await apiConnector("POST", url, data);

    console.log("addGuest_API RESPONSE:", response);
    return response;
  } catch (error) {
    console.error("addGuest_API ERROR:", error);
    throw error;
  }
}
export async function verifyDeliveryInvite(entryId, actionData) {
  try {
    if (!entryId) {
      throw new Error("entryId is required");
    }

    const url = `${verifyDeliveryInvite_API}/${entryId}/verify`;
    console.log("url is ", url);

    const response = await apiConnector("POST", url, actionData);

    console.log("verifyDeliveryInvite_API  RESPONSE:", response);
    return response;
  } catch (error) {
    console.error("verifyDeliveryInvite_API  ERROR:", error);
    throw error;
  }
}
export async function verifyCabInvite(entryId, actionData) {
  try {
    if (!entryId) {
      throw new Error("entryId is required");
    }

    const url = `${verifyCabInvite_API}/${entryId}/verify`;
    console.log("url is ", url);

    const response = await apiConnector("POST", url, actionData);

    console.log("verifyCabInvite_API  RESPONSE:", response);
    return response;
  } catch (error) {
    console.error("verifyCabInvite_API  ERROR:", error);
    throw error;
  }
}
export async function verifyOtherVisitor(guestId) {
  try {
    if (!guestId) {
      throw new Error("guestid is required");
    }

    const url = `${verifyOtherVisitor_API}`;
    console.log("url is ", url);

    const response = await apiConnector("POST", `${url}/${guestId}`, {
      params: guestId,
    });

    console.log("verifyOtherVisitor_API  RESPONSE:", response);
    return response;
  } catch (error) {
    console.error("verifyOtherVisitor_API  ERROR:", error);
    throw error;
  }
}

export async function recordVisit(inviteId) {
  try {
    if (!inviteId) {
      throw new Error("inviteId is required");
    }

    const url = `${recordVisit_API}`;
    console.log("url is", `${url}/${inviteId}`);

    const response = await apiConnector("POST", `${url}/${inviteId}`, {
      params: inviteId,
    });

    console.log("recordVisit_API  RESPONSE:", response);
    return response;
  } catch (error) {
    console.error("recordVisit_API  ERROR:", error);
    throw error;
  }
}
export async function getAllDeliveries(societyId) {
  try {
    if (!societyId) {
      throw new Error("societyId is required");
    }

    const url = `${getAllDeliveries_API}/${societyId}`;

    const response = await apiConnector("GET", url);
    console.log("getAllDeliveries_API RESPONSE:", response.data);
    return response.data;
  } catch (error) {
    console.log("getAllDeliveries_API ERROR:", error);
    throw error;
  }
}

export async function getAllCabInvite(societyId) {
  try {
    if (!societyId) {
      throw new Error("societyId is required");
    }

    const url = `${getAllCabInvite_API}/${societyId}`;

    const response = await apiConnector("GET", url);
    console.log("getAllCabInvite_API RESPONSE:", response.data);
    return response.data;
  } catch (error) {
    console.log("getAllCabInvite_API ERROR:", error);
    throw error;
  }
}
export async function getFrequentInvites(societyId) {
  try {
    if (!societyId) {
      throw new Error("societyId is required");
    }

    const url = `${frequentInvite_API}/${societyId}`;

    const response = await apiConnector("GET", url);
    console.log("frequentInvite_API RESPONSE:", response);
    return response;
  } catch (error) {
    console.log("frequentInvite_API ERROR:", error);
    throw error;
  }
}

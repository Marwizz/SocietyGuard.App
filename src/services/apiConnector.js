import axios from "axios";
import AsyncStorage from "@react-native-async-storage/async-storage";

export const axiosInstance = axios.create({
    headers: {
        'Content-Type': 'application/json',
    }
});

export const apiConnector = async (method, url, bodyData = null, headers = {}, params = {}) => {
    try {
        const token = await AsyncStorage.getItem("userToken");

        const authHeaders = token ? { 'Authorization': `Bearer ${token}` } : {};

        const response = await axiosInstance({
            method,
            url,
            data: bodyData,
            headers: { ...headers, ...authHeaders },
            params
        });

        return response;
    } catch (error) {
        console.error("API ERROR:", error);
        throw error;
    }
};

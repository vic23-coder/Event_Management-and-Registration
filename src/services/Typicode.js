import axios from "axios";
import config from "../config/index.js";


const typicodeAPI = axios.create({
  baseURL: config.TYPICODE_BASE_URL,
  timeout: 10000, // 
  headers: {
    Authorization: config.TYPICODE_BASE_API_KEY, 
    "Content-Type": "application/json",
  },
});


export async function getMockEvents() {
  try {
    const response = await typicodeAPI.get("/posts"); 
  } catch (error) {
    console.error("Error fetching mock events:", error.message);
    return [];
  }
}


export async function getMockOrganizers() {
  try {
    const response = await typicodeAPI.get("/users"); 
    return response.data;
  } catch (error) {
    console.error("Error fetching mock organizers:", error.message);
    return [];
  }
}


export async function registerMockEvent(userId, eventTitle) {
  try {
    const response = await typicodeAPI.post("/posts", {
      userId,
      title: `Registration for ${eventTitle}`,
      body: "User successfully registered for the event.",
    });
    return response.data;
  } catch (error) {
    console.error("Error registering mock event:", error.message);
    return null;
  }
}

export default {
  getMockEvents,
  getMockOrganizers,
  registerMockEvent,
};

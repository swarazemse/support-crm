import axios from "axios";

const API = axios.create({
  baseURL: "https://support-crn-backend-production.up.railway.app/api"
});

export default API;
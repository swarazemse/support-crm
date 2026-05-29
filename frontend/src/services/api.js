import axios from "axios";

const API = axios.create({
  
 baseURL: "https://support-crn-backend-production.up.railway.app/api",
  //baseURL: "http://127.0.0.1:8000/api",
  timeout: 15000
});

export default API;
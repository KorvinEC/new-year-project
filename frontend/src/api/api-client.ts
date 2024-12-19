import axios from "axios";

const API_ENPOINT = "http://localhost:8000/api/"

export const apiCient = axios.create({
  baseURL: API_ENPOINT
})

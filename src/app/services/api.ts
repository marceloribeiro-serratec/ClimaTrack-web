import axios from "axios";
import { WEATHER_API_TIMEOUT_MS } from "../constants/weather.constants";

export const api = axios.create({
    timeout: WEATHER_API_TIMEOUT_MS,
});

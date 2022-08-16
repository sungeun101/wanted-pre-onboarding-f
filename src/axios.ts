import axios from "axios";

export const axiosInstance = axios.create({
  baseURL:
    "https://5co7shqbsf.execute-api.ap-northeast-2.amazonaws.com/production/",
});

axiosInstance.interceptors.request.use((config) => {
  const accessToken = localStorage.getItem("accessToken");
  if (accessToken && config.headers) {
    config.headers.Authorization = `Bearer ${accessToken}`;
  }
  return config;
});

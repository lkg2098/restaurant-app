import axios from "axios";
import * as Keychain from "react-native-keychain";
import * as SecureStorage from "expo-secure-store";

const axiosAuth = axios.create({
  baseURL: "http://localhost:3000/",
  headers: {},
});

export const axiosLogin = axios.create({
  baseURL: "http://localhost:3000/",
  headers: {},
});

axiosLogin.interceptors.response.use(
  async (response) => {
    const username = JSON.parse(response.config.data).username;
    await SecureStorage.setItemAsync("accessToken", response.data.accessToken);
    // await Keychain.setGenericPassword(username, response.data.accessToken, {
    //   service: "accessToken",
    // });
    await SecureStorage.setItemAsync(
      "refreshToken",
      response.data.refreshToken
    );
    // await Keychain.setGenericPassword(username, response.data.refreshToken, {
    //   service: "refreshToken",
    // });
    return response;
  },
  async (error) => {
    return Promise.reject(error);
  }
);

axiosAuth.interceptors.request.use(
  async (config) => {
    try {
      const accessToken = await SecureStorage.getItemAsync("accessToken");
      //   const token = await Keychain.getGenericPassword({
      //     service: "accessToken",
      //   });
      if (accessToken) {
        config.headers.Authorization = `Bearer ${accessToken}`;
      }
      return config;
    } catch (err) {
      console.log(err);
      return Promise.reject(err);
    }
  },
  (error) => {
    return Promise.reject(error);
  }
);

axiosAuth.interceptors.response.use(
  async (response) => {
    if (response.data?.accessToken) {
      await SecureStorage.setItemAsync(
        "accessToken",
        response.data.accessToken
      );
      await SecureStorage.setItemAsync(
        "refreshToken",
        response.data.refreshToken
      );
    }
    return response;
  },
  async (error) => {
    const originalRequest = error.config;
    if (
      error.response?.status == 401 &&
      error.response?.data.error == "Not authorized" &&
      !originalRequest._retry
    ) {
      originalRequest._retry = true;
      const refreshToken = await SecureStorage.getItemAsync("refreshToken");
      if (refreshToken) {
        try {
          const response = await axios.post(
            "http://localhost:3000/refresh",
            {},
            {
              headers: {
                Authorization: `Bearer ${refreshToken}`,
              },
            }
          );
          const newAccessToken = response.data.accessToken;

          await SecureStorage.setItemAsync("accessToken", newAccessToken);
          //   await Keychain.setGenericPassword(tokens.username, newAccessToken, {
          //     service: "accessToken",
          //   });
          originalRequest.headers.Authorization = `Bearer ${newAccessToken}`;
          return axios(originalRequest);
        } catch (err) {
          return Promise.reject(err);
        }
      }
    }
    return Promise.reject(error);
  }
);

export default axiosAuth;

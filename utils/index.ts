import axios, { AxiosRequestConfig } from "axios";
import BASEURL from "../baseurl";
import { Message } from "./message";
import { retrieveData } from "./localStorage";
import { ACCESS_TOKEN } from "../constants/user";
interface Config {
  url: string;
  access_token?: string;
  headers?: any;
  data?: object;
}

export const API_REQUEST_HANDLER = async (
  endpoint: string,
  method: string,
  body?: object,
  header?: object,
  otherConfig?: AxiosRequestConfig
) => {
  return new Promise(async (resolve, reject) => {
    try {
      let loginButton = undefined as any;
      const CONFIG = {
        method: method,
        url: BASEURL + endpoint,
      } as Config;
      const HEADERS = header
        ? header
        : ({ "Content-Type": "application/json" } as any);
      const token = await localStorage.getItem("access_token");
      console.log({ token });
      if (token) {
        HEADERS.access_token = token;
      } else {
        HEADERS.access_token = ACCESS_TOKEN;
      }
      if (body) {
        CONFIG.data = body;
      }
      CONFIG.headers = HEADERS;
      console.log("====token====", token, CONFIG);
      if (endpoint === "/user/login") {
        loginButton = document.getElementsByClassName("login-spinner") as any;
        loginButton[0].style.display = "inline-block";
      }
      return axios({
        ...CONFIG,
        ...(otherConfig || {}),
      })
        .then((response) => {
          resolve(response.data);
        })
        .catch((err) => {
          console.log({ err });
          if (axios.isCancel(err)) {
            return reject(err);
          }
          let error = "";
          if (err.response && err.response.data) {
            reject(err.response.data);
          } else {
            if (!otherConfig?.signal) {
              error = "Something went wrong!";
              Message("danger", error);
            }
          }
          if (endpoint === "/user/login") {
            // document.getElementsByClassName("login-spinner")[0].style.display = "none";
            loginButton[0].style.display = "none";
          }
        });
    } catch (err: any) {
      if (axios.isCancel(err)) {
        return reject(err);
      }
      let error = "";
      reject();
      if (err.response && err.response.data) {
        error = err.response.data.message;
      } else {
        error = "Something went wrong!";
      }
      Message("danger", error);
    }
  });
};

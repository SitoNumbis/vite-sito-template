/* eslint-disable no-use-before-define */
// @ts-check

import config from "../config";
import { validateBasicKey } from "../services/auth";

// @ts-ignore
import {
  deleteCookie,
  getCookie,
  validation,
} from "some-javascript-utils/browser";

export const fromLocal = () => {
  const user = {};
  user.user = localStorage.getItem(config.userCookie);

  user.photo = localStorage.getItem(config.userPhotoCookie);
  try {
    if (validation(config.userActionsCookie))
      // @ts-ignore
      user.actions = JSON.parse(localStorage.getItem(config.userActionsCookie));
  } catch (err) {
    console.error(err);
  }
  return user;
};

export const getUserName = () => {
  let name = "";

  // @ts-ignore
  const local = localStorage.getItem(config.userCookie);

  name = local !== null ? local : "";
  if (!name) {
    // @ts-ignore
    const session = sessionStorage.getItem(config.userCookie);
    name = session !== null ? session : "";
  }
  return name;
};

export const getUserApps = () => {
  let apps = {};

  // @ts-ignore
  const local = localStorage.getItem(config.appsCookie);
  apps = local !== null ? JSON.parse(local) : undefined;
  if (!apps) {
    // @ts-ignore
    const session = sessionStorage.getItem(config.appsCookie);
    apps = session !== null ? JSON.parse(session) : {};
  }
  return apps;
};

export const hasApps = () => {
  return Object.keys(getUserApps()).length > 0;
};

/**
 *
 * @param {string} app
 * @returns
 */
export const hasExactApp = (app) => {
  return Object.values(getUserApps()).find((item) => item === app);
};

export const isAdmin = async () => {
  const value = await validateBasicKey("admin");
  if (value) return true;
  return false;
};

/**
 * If the user is logged in, return true, otherwise return false.
 */
export const userLogged = () =>
  // @ts-ignore
  getCookie(config.basicKeyCookie).length > 0;

export const logoutUser = () => {
  // @ts-ignore
  deleteCookie(config.basicKeyCookie);
  localStorage.removeItem(config.userCookie);
  localStorage.removeItem(config.userAppsCookie);
  localStorage.removeItem(config.userActionsCookie);
  localStorage.removeItem(config.userPhotoCookie);
};

export const userData = () => {
  let user = {};
  // @ts-ignore
  const local = JSON.parse(localStorage.getItem(config.userCookie));

  user = local !== null ? local : {};
  if (!user.user) {
    // @ts-ignore
    const session = JSON.parse(sessionStorage.getItem(config.userCookie));
    user = session !== null ? session : {};
  }
  return user;
};

/**
 * If remember is true, it stores user data to localStorage, otherwise it stores it in sessionStorage
 * @param {boolean} remember - a boolean value that determines whether the user should be remembered or not.
 * @param {object} data - The user object that you want to store in the browser.
 */
export const logUser = (remember, data) => {
  if (data.user) localStorage.setItem(config.userCookie, data.user);
  if (data.photo) localStorage.setItem(config.userPhotoCookie, data.photo);
  if (data.actions)
    localStorage.setItem(
      config.userActionsCookie,
      JSON.stringify(data.actions)
    );
  if (data.apps)
    localStorage.setItem(config.userAppsCookie, JSON.stringify(data.apps));
};

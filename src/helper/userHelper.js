import axios from "axios";
export const setInterceptors = () => {
  axios.interceptors.response.use(
    (response) => {
      return response;
    },
    (err) => {
      return new Promise((resolve, reject) => {
        if (
          err.response.status === 401 &&
          err.config &&
          !err.config.__isRetryRequest
        ) {
          // if you ever get an unauthorized response, logout the user
          this.emit("onAutoLogout", "Invalid access_token");
          this.setSession(null);
        }
        throw err;
      });
    }
  );
};

export const handleAuthentication = () => {
  const access_token = this.getAccessToken();

  if (!access_token) {
    this.emit("onNoAccessToken");

    return;
  }

  if (this.isAuthTokenValid("true")) {
    this.setSession(access_token);
    this.emit("onAutoLogin", true);
  } else {
    this.setSession(null);
    this.emit("onAutoLogout", "access_token expired");
  }
};

export const signInWithToken = () => {
  return new Promise((resolve, reject) => {
    axios
      .get("/user/login/", {
        access_token: this.getAccessToken(),
      })
      .then((response) => {
        if (response.data.data.user) {
          this.setSession(response.data.data.token);
          let userData = response.data.data;
          userData.user.data[
            "displayName"
          ] = `${response.data.data.user.data.first_name} ${response.data.data.user.data.last_name}`;
          resolve(userData.user);
        } else {
          this.logout();
          reject(new Error("Failed to login with token."));
        }
      })
      .catch((error) => {
        this.logout();
        reject(new Error("Failed to login with token."));
      });
  });
};

export const setSession = (access_token) => {
  if (access_token) {
    localStorage.setItem("jwt_access_token", access_token);
    axios.defaults.headers.common.Authorization = `${access_token}`;
  } else {
    localStorage.removeItem("jwt_access_token");
    delete axios.defaults.headers.common.Authorization;
  }
};

const logout = () => {
  this.setSession(null);
};

export const isAuthTokenValid = (access_token) => {
  if (!access_token) {
    return false;
  }
  // const decoded = jwtDecode(access_token);
  // const currentTime = Date.now() / 1000;
  // if (decoded.exp < currentTime) {
  // 	console.warn('access token expired');
  // 	return false;
  // }

  return true;
};

export const getAccessToken = () => {
  return window.localStorage.getItem("jwt_access_token");
};

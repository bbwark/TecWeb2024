const config = {
  numberOfArticles: 10, // Number for pagination
  apiBaseUrl: "http://localhost:3000/api",
};

const state = {
  isLogged: false,
  isAdmin: false,
  userId: null,
  setLoggedInStatus(status) {
    this.isLogged = status;
  },
  setAdminStatus(status) {
    this.isAdmin = status;
    if (status) this.isLogged = true;
  },
  setUserId(userId) {
    this.userId = userId;
  },
  clearUser() {
    this.userId = null;
    this.isLogged = false;
    this.isAdmin = false;
  },
};

export { config, state };

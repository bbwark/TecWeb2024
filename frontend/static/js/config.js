const config = {
    numberOfArticles: 10, // Number for pagination
    apiBaseUrl: "http://localhost:3000/api"
};

const state = {
    isLoggedIn: false,
    isAdmin: false,
    user: null,
    setLoggedInStatus(status) {
        this.isLoggedIn = status;
    },
    setAdminStatus(status) {
        this.isAdmin = status;
    },
    setUser(user) {
        this.user = user;
    },
    clearUser() {
        this.user = null;
        this.isLoggedIn = false;
        this.isAdmin = false;
    }
};

export { config, state };

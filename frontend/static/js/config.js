const config = {
    numberOfArticles: 10, // Number for pagination
    apiBaseUrl: "https://api.example.com"
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

const config = {
    numberOfArticles: 10, // Number for pagination
    apiBaseUrl: "http://localhost:3000/api"
};

const state = {
    isLogged: false,
    isAdmin: false,
    user: null,
    setLoggedInStatus(status) {
        this.isLogged = status;
    },
    setAdminStatus(status) {
        this.isAdmin = status;
    },
    setUser(user) {
        this.user = user;
    },
    clearUser() {
        this.user = null;
        this.isLogged = false;
        this.isAdmin = false;
    }
};

export { config, state };

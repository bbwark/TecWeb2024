const config = {
  numberOfArticles: 10, // Number for pagination
  apiBaseUrl: "http://localhost:3000/api",
};

const state = {
  isLogged: false,
  isAdmin: false,
  userId: null,
  openedPage: 1,
  articleModifying: 0,
  articlesToShow: null,
  setLoggedInStatus(status) {
    this.isLogged = status;
    this.saveState();
  },
  setAdminStatus(status) {
    this.isAdmin = status;
    if (status) this.isLogged = true;
    this.saveState();
  },
  setUserId(userId) {
    this.userId = userId;
    this.saveState();
  },
  clearState() {
    this.isLogged = false;
    this.isAdmin = false;
    this.userId = null;
    this.openedPage = 1;
    this.articleModifying = 0;
    this.articlesToShow = null;
    this.saveState();
  },
  setOpenedPage(page) {
    this.openedPage = page;
    this.saveState();
  },
  setArticleModifying(articleId) {
    this.articleModifying = articleId;
    this.saveState();
  },
  setArticlesToShow(params) {
    this.articlesToShow = params;
    this.saveState;
  },

  loadState() {
    const savedState = localStorage.getItem("appState");
    if (savedState) {
      Object.assign(this, JSON.parse(savedState));
    }
  },

  saveState() {
    localStorage.setItem("appState", JSON.stringify(this));
  },
};

export { config, state };

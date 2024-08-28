const APP_STATE_KEY = "appState";
const config = {
  numberOfArticlesPerPage: 10, // Number for pagination
  apiBaseUrl: "http://localhost:3000/api",
};

const articleShowCaseState = {
  USER_ARTICLES: "userArticles",
  TAG_ARTICLES: "tagArticles",
  ALL_ARTICLES: "allArticles",
};

const state = {
  isLogged: false,
  isAdmin: false,
  userId: null,
  accessToken: null,
  articlesOpenedPage: 1,
  articleModifying: 0,
  articlesToShow: null,
  articleIdDetailOpened: 0,
  articleShowCaseState: articleShowCaseState.ALL_ARTICLES,
  openedTag: null,
  userIdArticlesToShow: null,
  usersToShow: null,

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

  setAccessToken(token) {
    this.accessToken = token;
    this.saveState();
  },

  setArticlesOpenedPage(page) {
    this.articlesOpenedPage = page;
    this.saveState();
  },

  setArticleModifying(articleId) {
    this.articleModifying = articleId;
    this.saveState();
  },

  setArticlesToShow(params) {
    this.articlesToShow = params;
    this.saveState();
  },

  setArticleIdDetailOpened(articleId) {
    this.articleIdDetailOpened = articleId;
    this.saveState();
  },

  setArticleShowcaseState(state) {
    switch (state) {
      case articleShowCaseState.USER_ARTICLES:
      case articleShowCaseState.TAG_ARTICLES:
      case articleShowCaseState.ALL_ARTICLES:
        this.articleShowCaseState = state;
        break;
      default:
        this.articleShowCaseState = articleShowCaseState.ALL_ARTICLES;
    }
    this.saveState();
  },

  setOpenedTag(tag) {
    this.openedTag = tag;
    this.saveState();
  },

  setUserIdArticlesToShow(userId) {
    this.userIdArticlesToShow = userId;
    this.saveState();
  },

  setUsersToShow(users) {
    this.usersToShow = users;
    this.saveState();
  },

  clearState() {
    this.isLogged = false;
    this.isAdmin = false;
    this.userId = null;
    this.accessToken = null;
    this.articlesOpenedPage = 1;
    this.articleModifying = 0;
    this.articlesToShow = null;
    this.articleShowCaseState = articleShowCaseState.ALL_ARTICLES;
    this.openedTag = null;
    this.userIdArticlesToShow = null;
    this.usersToShow = null;
    this.saveState();
  },

  loadState() {
    try {
      const savedState = localStorage.getItem(APP_STATE_KEY);
      if (savedState) {
        Object.assign(this, JSON.parse(savedState));
      }
    } catch (error) {
      console.error("Failed to load state:", error);
    }
  },

  saveState() {
    try {
      localStorage.setItem(APP_STATE_KEY, JSON.stringify(this));
    } catch (error) {
      console.error("Failed to save state:", error);
    }
  },
};

export { config, state, articleShowCaseState };

if ('scrollRestoration' in history) {
  history.scrollRestoration = 'manual';
}

import ArticleShowcase from "./views/ArticleShowcase.js";
import ArticleDetail from "./views/ArticleDetail.js";
import ModifyArticle from "./views/ModifyArticle.js";
import Login from "./views/Login.js";
import Settings from "./views/Settings.js";
import { articleShowCaseState, state } from "./config.js";
import { setArticlesToShowBasedOnState } from "./utilities/utilities.js";

const pathToRegex = (path) =>
  new RegExp("^" + path.replace(/\//g, "\\/").replace(/:\w+/g, "(.+)") + "$");

const getParams = (match) => {
  const values = match.result.slice(1);
  const keys = Array.from(match.route.path.matchAll(/:(\w+)/g)).map(
    (result) => result[1]
  );

  return Object.fromEntries(
    keys.map((key, i) => {
      return [key, values[i]];
    })
  );
};

const navigateTo = async (url) => {
  history.pushState(null, null, url);
  await router();
};

let currentView = null;

const router = async () => {
  state.loadState();

  if (!state.articlesToShow || state.articlesToShow.length === 0) {
    state.setArticleShowcaseState(articleShowCaseState.ALL_ARTICLES);
    state.setArticlesOpenedPage(1);
  }

  const routes = [
    { path: "/", view: ArticleShowcase },
    { path: "/page/:page", view: ArticleShowcase },
    { path: "/article-detail/:id", view: ArticleDetail },
    { path: "/modify-article", view: ModifyArticle },
    { path: "/login", view: Login },
    { path: "/settings", view: Settings },
  ];

  const potentialMatches = routes.map((route) => {
    return {
      route: route,
      result: location.pathname.match(pathToRegex(route.path)),
    };
  });

  let match = potentialMatches.find(
    (potentialMatch) => potentialMatch.result !== null
  );

  if (!match) {
    match = {
      route: routes[0],
      result: [location.pathname],
    };
  }

  const params = getParams(match);

  if (match.route.path === "/page/:page") {
    const pageNum = parseInt(params.page) || 1;
    state.setArticlesOpenedPage(pageNum);
    await setArticlesToShowBasedOnState();
  } else if (match.route.path === "/") {
    state.setArticlesOpenedPage(1);
    await setArticlesToShowBasedOnState();
  }


  if (currentView) {
    currentView.onUnmount();
  }

  const view = new match.route.view(params);

  document.querySelector("#app").innerHTML = await view.getHtml();

  view.onMount();

  currentView = view;

  window._appCurrentView = view;
};

window.addEventListener("popstate", async (e) => {
  await router();
  window.scrollTo(0, 0);
});

window.addEventListener("load", () => {
  state.loadState();
});

window.addEventListener("beforeunload", () => {
  state.saveState();
});

document.addEventListener("DOMContentLoaded", () => {
  document.body.addEventListener("click", (e) => {
    if (e.target.matches("[data-link]")) {
      e.preventDefault();
      navigateTo(e.target.href);
    }
  });

  router();
});

export { navigateTo };
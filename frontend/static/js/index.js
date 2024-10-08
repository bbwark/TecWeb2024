import ArticleShowcase from "./views/ArticleShowcase.js";
import ArticleDetail from "./views/ArticleDetail.js";
import ModifyArticle from "./views/ModifyArticle.js";
import Login from "./views/Login.js";
import Settings from "./views/Settings.js";
import { articleShowCaseState, state } from "./config.js";
import { setArticlesToShowBasedOnState } from "./utilities.js";

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

const router = async () => {
  state.loadState();

  if (!state.articlesToShow || state.articlesToShow.length === 0) {
    state.setArticleShowcaseState(articleShowCaseState.ALL_ARTICLES);
    state.setArticlesOpenedPage(1);
  }

  const routes = [
    { path: "/", view: ArticleShowcase },
    { path: "/article-detail", view: ArticleDetail },
    { path: "/modify-article", view: ModifyArticle },
    { path: "/login", view: Login },
    { path: "/settings", view: Settings },
  ];

  // Test each route for potential match
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

  if (match.route.path === "/") {
    await setArticlesToShowBasedOnState();
  }
  let view = new match.route.view();

  document.querySelector("#app").innerHTML = await view.getHtml();
};

window.addEventListener("popstate", router);

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
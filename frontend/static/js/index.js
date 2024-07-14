import ArticleShowcase from "./views/ArticleShowcase.js";
import ArticleDetail from "./views/ArticleDetail.js";
import ModifyArticle from "./views/ModifyArticle.js";
import Login from "./views/Login.js";
import Settings from "./views/Settings.js";
import rest from "./rest.js";

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

const navigateTo = (url) => {
  history.pushState(null, null, url);
  router();
};

const router = async () => {
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

  let view = new match.route.view(await matchHandler(match, routes));

  document.querySelector("#app").innerHTML = await view.getHtml();
};

const matchHandler = async (match, routes) => {
  switch (match.route.path) {
    case routes[0].path:
      return await rest.getRecentArticles(1);

    default:
      break;
  }
};

window.addEventListener("popstate", router);

document.addEventListener("DOMContentLoaded", () => {
  document.body.addEventListener("click", (e) => {
    if (e.target.matches("[data-link]")) {
      e.preventDefault();
      navigateTo(e.target.href);
    }
  });

  router();
});

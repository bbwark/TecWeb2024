import { articleShowCaseState, state } from "./config.js";
import rest from "./rest.js";

function escapeHtml(unsafe) {
  return unsafe
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#039;");
}

async function setArticlesToShowBasedOnState() {
  switch (state.articleShowCaseState) {
    case articleShowCaseState.ALL_ARTICLES:
      state.setArticlesToShow(await rest.getRecentArticles(state.openedPage));
      break;
    case articleShowCaseState.TAG_ARTICLES:
      state.setArticlesToShow(
        await rest.getArticlesByTag(state.openedTag, state.openedPage)
      );
      break;
    case articleShowCaseState.USER_ARTICLES:
      state.setArticlesToShow(
        await rest.getArticlesByUserId(state.userId, state.openedPage)
      );
      break;
  }
}


function validatePassword(password) {
  const minLength = 8;
  const hasUpperCase = /[A-Z]/.test(password);
  const hasLowerCase = /[a-z]/.test(password);
  const hasNumber = /[0-9]/.test(password);
  const hasSpecialChar = /[!@#$%^&*(),.?":{}|<>_-]/.test(password);

  if (
    password.length >= minLength &&
    hasUpperCase &&
    hasLowerCase &&
    hasNumber &&
    hasSpecialChar
  ) {
    return true;
  }

  return false;
}

export { escapeHtml, setArticlesToShowBasedOnState, validatePassword };

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


function validatePassword(oldPassword, newPassword) {
  const minLength = 8;
  const hasUpperCase = /[A-Z]/.test(newPassword);
  const hasLowerCase = /[a-z]/.test(newPassword);
  const hasNumber = /[0-9]/.test(newPassword);
  const hasSpecialChar = /[!@#$%^&*(),.?":{}|<>]/.test(newPassword);

  if (oldPassword === newPassword) {
    return false;
  }

  if (
    newPassword.length >= minLength &&
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

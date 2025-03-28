import { articleShowCaseState, state } from "../config.js";
import rest from "../rest.js";
import { alertManager } from "./alertManager.js";

async function setArticlesToShowBasedOnState() {
  switch (state.articleShowCaseState) {
    case articleShowCaseState.ALL_ARTICLES:
      state.setArticlesToShow(
        await rest.getRecentArticles(state.articlesOpenedPage)
      );
      break;
    case articleShowCaseState.TAG_ARTICLES:
      state.setArticlesToShow(
        await rest.getArticlesByTag(state.openedTag, state.articlesOpenedPage)
      );
      break;
    case articleShowCaseState.USER_ARTICLES:
      state.setArticlesToShow(
        await rest.getArticlesByUserId(
          state.userIdArticlesToShow,
          state.articlesOpenedPage
        )
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

function encodeTags(tags) {
  return `#${tags.join("#")}#`;
}

function decodeTags(tags) {
  return tags.split("#").filter((tag) => tag.trim() !== "");
}

function showAlert(message, color, attachToId, secondaryMessages = [], options = {}) {
  return alertManager.show(message, color, attachToId, secondaryMessages, options);
}

function removeAlert(attachToId, afterDelay = 0, options = {}) {
  return alertManager.remove(attachToId, afterDelay, options);
}

function sanitizeHtml(input) {
  if (!input) return '';
  return input
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#039;');
}

export const navigateToArticle = (articleId) => {
  navigateTo(`/article-detail/${articleId}`);
};

export {
  setArticlesToShowBasedOnState,
  validatePassword,
  encodeTags,
  decodeTags,
  showAlert,
  removeAlert,
  sanitizeHtml
};

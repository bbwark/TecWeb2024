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

function showAlert(message, color, attachToId, secondaryMessages = []) {
  const container = document.querySelector("#"+attachToId);
  removeAlert(attachToId);

  let itemsSpecify = "";
  if (secondaryMessages.length > 0) {
    itemsSpecify = `
      <ul class="mt-1.5 list-disc list-inside">
        ${secondaryMessages.map((message) => `<li>${message}</li>`).join("")}
      </ul>`;
  }

  const colorClasses = {
    red: "text-red-800 bg-red-200",
    green: "text-green-800 bg-green-200",
    blue: "text-blue-800 bg-blue-200",
    gray: "text-gray-800 bg-gray-200",
  };
  const selectedColorClasses = colorClasses[color] || colorClasses.gray;

  const alertHtml = `
    <div class="flex p-4 mb-4 text-sm ${selectedColorClasses} rounded-lg" role="alert">
    <svg class="flex-shrink-0 inline w-4 h-4 me-3 mt-[2px]" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" fill="currentColor" viewBox="0 0 20 20">
      <path d="M10 .5a9.5 9.5 0 1 0 9.5 9.5A9.51 9.51 0 0 0 10 .5ZM9.5 4a1.5 1.5 0 1 1 0 3 1.5 1.5 0 0 1 0-3ZM12 15H8a1 1 0 0 1 0-2h1v-3H8a1 1 0 0 1 0-2h2a1 1 0 0 1 1 1v4h1a1 1 0 0 1 0 2Z"/>
    </svg>
    <div>
      <span class="font-medium">${message}</span>
      ${itemsSpecify}
    </div>
  </div>
`;

  container.insertAdjacentHTML("beforebegin", alertHtml);
}

function removeAlert(attachToId, afterDelay = 0) {
  const container = document.querySelector("#"+attachToId);
  const alertBox = container.parentElement.querySelector(`[role="alert"]`);
  if (alertBox) {
    if (afterDelay === 0) {
      alertBox.remove();
    } else {
      setTimeout(() => {
        if (alertBox) {
          alertBox.remove();
        }
      }, afterDelay);
    }
  }
}

export {
  escapeHtml,
  setArticlesToShowBasedOnState,
  validatePassword,
  encodeTags,
  decodeTags,
  showAlert,
  removeAlert,
};

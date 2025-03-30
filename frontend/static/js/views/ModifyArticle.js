import { state } from "../config.js";
import ArticleDTO from "../models/articleDTO.js";
import rest from "../rest.js";
import AbstractView from "./AbstractView.js";
import ArticleShowcase from "./ArticleShowcase.js";
import {
  removeAlert,
  setArticlesToShowBasedOnState,
  showAlert,
  sanitizeHtml
} from "../utilities/utilities.js";
import Login from "./Login.js";
import { navigateTo } from "../index.js";

export default class ModifyArticle extends AbstractView {
  constructor(params) {
    super(params);
    state.loadState();
    this.articleId = state.articleModifying;
    this.isNew = state.articleModifying === 0 ? true : false;
    this.setTitle(this.isNew ? "New Article" : "Edit Article");
  
    this.boundHandlers = {
      click: this.handleClick.bind(this),
      change: this.handleChange.bind(this),
      input: this.handleInput.bind(this)
    };
  }

  onMount() {
    const app = document.querySelector("#app");
    app.addEventListener('click', this.boundHandlers.click);
    app.addEventListener('change', this.boundHandlers.change);
    app.addEventListener('input', this.boundHandlers.input);
    console.log("ModifyArticle mounted: event listeners added");
  }
  
  onUnmount() {
    const app = document.querySelector("#app");
    app.removeEventListener('click', this.boundHandlers.click);
    app.removeEventListener('change', this.boundHandlers.change);
    app.removeEventListener('input', this.boundHandlers.input);
    console.log("ModifyArticle unmounted: event listeners removed");
  }

  async getHtml() {
    if (!state.isLogged) {
      state.clearState();
      history.pushState(null, null, "/login");
      return await new Login().getHtml();
    } else {
      let article = new ArticleDTO();
      if (this.articleId !== 0) {
        try {
          article = await rest.getArticleById(this.articleId);
        } catch (error) {
          showAlert("Failed to retrieve article", "red", "article-form");
          removeAlert("article-form", 5000);
        }
      }

      return `
  <div id="modify-article-view" class="min-h-screen flex items-center justify-center bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
      <div class="max-w-2xl w-full space-y-8">
          <div>
              <h1 class="text-3xl font-extrabold text-center text-gray-900">
                  ${this.isNew ? "Create New Article" : "Edit Article"}
              </h1>
          </div>
          <div id="article-form" class="mt-8 space-y-6 bg-white p-8 rounded-lg shadow-md">
              <div>
                  <label for="title" class="block text-sm font-medium text-gray-700">Title:</label>
                  <input type="text" id="title" name="title" value="${article.title}" 
                         class="mt-1 p-2 block w-full border border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500" 
                         required>
              </div>

              <div>
                  <label for="subtitle" class="block text-sm font-medium text-gray-700">Subtitle:</label>
                  <input type="text" id="subtitle" name="subtitle" value="${article.subtitle}" 
                         class="mt-1 p-2 block w-full border border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500" 
                         required>
              </div>
              
              <div>
                  <label for="content" class="block text-sm font-medium text-gray-700">Content (Markdown):</label>
                  <div class="text-xs text-gray-500 mb-1">
                      Supporta formattazione Markdown: ## Titoli, **grassetto**, *corsivo*, - liste, [link](url)
                  </div>
                  <textarea id="content" name="content" rows="10" 
                            class="font-mono mt-1 p-2 block w-full border border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500" 
                            required>${article.content}</textarea>
              </div>
              
              <div class="flex items-center">
                  <input type="checkbox" id="preview-checkbox" class="mr-2">
                  <label for="preview-checkbox" class="text-sm font-medium text-gray-700">Show Markdown Preview</label>
              </div>
              <div id="preview" class="p-4 bg-gray-100 rounded border border-gray-300 mb-4 overflow-auto max-h-96" style="display:none;"></div>
              
              <div>
                  <label for="tags" class="block text-sm font-medium text-gray-700">Tags:</label>
                  <input type="text" id="tags" name="tags" value="${article.tags.map((tag) => `#${tag}`).join(", ")}" 
                         class="mt-1 p-2 block w-full border border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500" 
                         required>
              </div>
              
              <div class="flex justify-between">
                  <button 
                      data-action="cancel-article" 
                      class="px-4 py-2 bg-gray-200 text-gray-800 rounded-md shadow-sm hover:bg-gray-300">
                      Cancel
                  </button>
                  <button 
                      data-action="save-article" 
                      data-is-new="${this.isNew}" 
                      data-article-id="${this.articleId}" 
                      class="px-4 py-2 bg-blue-600 text-white rounded-md shadow-sm hover:bg-blue-700">
                      ${this.isNew ? "Save" : "Update"}
                  </button>
              </div>
          </div>
      </div>
  </div>
`;
    }
  }

  async articleSaveButton(isNew, articleId = 0) {
    const title = document.getElementById("title").value;
    const subtitle = document.getElementById("subtitle").value;
    const content = document.getElementById("content").value;
    const tags = document.getElementById("tags").value;

    if (title && subtitle && content && tags) {
      const tagRegex = /#?[a-zA-Z0-9]+/g;
      const matches = tags.match(tagRegex);
      const transformedTags = matches
        .map((tag) => (tag.startsWith("#") ? tag.slice(1) : tag))
        .filter((tag, index, self) => self.indexOf(tag) === index);

      const article = {
        title: sanitizeHtml(title.trim()),
        subtitle: sanitizeHtml(subtitle.trim()),
        content: content.trim(),
        tags: transformedTags,
      };
      if (isNew) {
        article.userId = state.userId;
        await rest.createArticle(article);
      } else {
        await rest.updateArticle(articleId, article);
      }
      await setArticlesToShowBasedOnState();
      state.setArticleModifying(0);
      await navigateTo("/");
      showAlert("Article published successfully", "green", "header");
      removeAlert("header", 3000);
    } else {
      showAlert("Please fill in all fields", "red", "article-form");
      removeAlert("article-form", 5000);
    }

    
  }

  async articleCancelButton() {
    state.setArticleModifying(0);
    window.history.back();
  }

  async toggleMarkdownPreview() {
    const previewCheckbox = document.getElementById('preview-checkbox');
    const previewDiv = document.getElementById('preview');
    const contentTextarea = document.getElementById('content');
  
    if (previewCheckbox.checked) {
      const markdownContent = contentTextarea.value;
      const htmlContent = marked.parse(markdownContent);
      previewDiv.innerHTML = `
            <div class="relative">
              <span class="absolute top-0 right-0 text-xs text-gray-500 italic">Preview</span>
              <div id="markdown-content" class="prose prose-sm max-w-none pt-6">${htmlContent}</div>
            </div>
        `;
      previewDiv.style.display = 'block';
      
    } else {
      previewDiv.style.display = 'none';
    }
  }
  
  updateMarkdownPreview() {
    const contentTextarea = document.getElementById('content');
    const previewDiv = document.getElementById('preview');
    
    if (previewDiv.style.display !== 'none') {
      const markdownContent = contentTextarea.value;
      const htmlContent = marked.parse(markdownContent);
      
      const contentContainer = document.getElementById('markdown-content');
      if (contentContainer) {
        contentContainer.innerHTML = htmlContent;
      }
    }
  }

  handleClick(e) {
    if (!document.getElementById('modify-article-view')) return;
    
    const target = e.target.closest('[data-action]');
    if (!target) return;
    
    const action = target.dataset.action;
    
    switch(action) {
      case 'save-article':
        this.articleSaveButton(target.dataset.isNew === 'true', parseInt(target.dataset.articleId));
        break;
      case 'cancel-article':
        this.articleCancelButton();
        break;
    }
  }

  handleChange(e) {
    if (!document.getElementById('modify-article-view')) return;
    
    if (e.target.id === 'preview-checkbox') {
      this.toggleMarkdownPreview();
    }
  }

  handleInput(e) {
    if (!document.getElementById('modify-article-view')) return;
    
    if (e.target.id === 'content' && document.getElementById('preview-checkbox').checked) {
      this.updateMarkdownPreview();
    }
  }
}

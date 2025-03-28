/**
 * AlertManager - A centralized system for displaying and managing alerts in the application
 * 
 * This class provides functionality to show, remove, and track alerts throughout the 
 * application. It supports various customization options including positioning, styling,
 * and containment strategies.
 * 
 * @example
 * // Basic usage
 * alertManager.show("Operation completed", "green", "element-id");
 * 
 * // Advanced usage with custom options
 * alertManager.show("Login successful", "green", "header-id", [], {
 *   position: 'below',
 *   width: 'custom',
 *   maxWidth: 'max-w-4xl',
 *   useContainer: true
 * });
 */
class AlertManager {
    /**
     * Creates a new AlertManager instance
     * 
     * Initializes an internal map to track active alerts in the application.
     */
    constructor() {
      this.activeAlerts = new Map();
    }
    
    /**
     * Displays an alert with the specified message and options
     * 
     * @param {string} message - The main message to display in the alert
     * @param {string} color - The color scheme of the alert ("red", "green", "blue", "gray")
     * @param {string} attachToId - The ID of the element to attach the alert to
     * @param {string[]} secondaryMessages - Additional messages to display as a list
     * @param {Object} options - Configuration options for the alert
     * @param {string} [options.position='above'] - Where to position the alert relative to the element ('above' or 'below')
     * @param {string} [options.width='full'] - Width strategy for the alert ('full' or 'custom')
     * @param {string} [options.maxWidth=null] - CSS class for max-width when using custom width (e.g., 'max-w-4xl')
     * @param {string} [options.customClass=''] - Additional CSS classes to apply
     * @param {boolean} [options.useContainer=false] - Whether to use a dedicated container for the alert
     * @param {string} [options.containerId='alerts-container'] - ID for the container when useContainer is true
     * @returns {AlertManager} - Returns this instance for method chaining
     */
    show(message, color, attachToId, secondaryMessages = [], options = {}) {
      const container = document.querySelector("#" + attachToId);
      if (!container) return this;
      
      this.remove(attachToId, 0, options);
      
      const mergedOptions = this._getOptions(options);
      
      const alertHtml = this._createAlertHtml(message, color, attachToId, secondaryMessages, mergedOptions);
      this._displayAlert(container, alertHtml, mergedOptions);
      
      this.activeAlerts.set(attachToId, {
        element: document.querySelector(`[role="alert"][data-for="${attachToId}"]`),
        options: mergedOptions
      });
      
      return this;
    }
    
    /**
     * Removes an alert after an optional delay
     * 
     * @param {string} attachToId - The ID of the element the alert is attached to
     * @param {number} [afterDelay=0] - Delay in milliseconds before removing the alert (0 for immediate removal)
     * @param {Object} options - Configuration options matching those used to show the alert
     * @param {boolean} [options.useContainer=false] - Whether the alert uses a dedicated container
     * @param {string} [options.containerId='alerts-container'] - ID of the container if useContainer is true
     * @returns {AlertManager} - Returns this instance for method chaining
     */
    remove(attachToId, afterDelay = 0, options = {}) {
      const mergedOptions = this._getOptions(options);
      const alertElement = this._findAlertElement(attachToId, mergedOptions);
      
      if (alertElement) {
        this._removeElement(alertElement, afterDelay, mergedOptions);
        
        if (afterDelay === 0) {
          this.activeAlerts.delete(attachToId);
        } else {
          setTimeout(() => this.activeAlerts.delete(attachToId), afterDelay);
        }
      }
      
      return this;
    }
    
    /**
     * Removes all currently active alerts
     * 
     * @param {number} [afterDelay=0] - Delay in milliseconds before removing the alerts
     * @returns {AlertManager} - Returns this instance for method chaining
     */
    removeAll(afterDelay = 0) {
      this.activeAlerts.forEach((alertInfo, attachToId) => {
        this.remove(attachToId, afterDelay, alertInfo.options);
      });
      
      return this;
    }
    
    /**
     * Merges provided options with default options
     * 
     * @private
     * @param {Object} options - User-provided options
     * @returns {Object} - Merged options with defaults applied
     */
    _getOptions(options) {
      const defaultOptions = {
        position: 'above',
        width: 'full',
        maxWidth: null,
        customClass: '',
        useContainer: false,
        containerId: 'alerts-container'
      };
      
      return {...defaultOptions, ...options};
    }
    
    /**
     * Creates the HTML content for an alert
     * 
     * @private
     * @param {string} message - Main alert message
     * @param {string} color - Color scheme for the alert
     * @param {string} attachToId - ID of the element the alert is attached to
     * @param {string[]} secondaryMessages - Additional messages to display in a list
     * @param {Object} options - Configuration options
     * @returns {string} - HTML string for the alert
     */
    _createAlertHtml(message, color, attachToId, secondaryMessages, options) {
      // Create secondary content if provided
      let itemsSpecify = "";
      if (secondaryMessages.length > 0) {
        itemsSpecify = `
          <ul class="mt-1.5 list-disc list-inside">
            ${secondaryMessages.map((message) => `<li>${message}</li>`).join("")}
          </ul>`;
      }
      
      // Handle color classes
      const colorClasses = {
        red: "text-red-800 bg-red-200",
        green: "text-green-800 bg-green-200",
        blue: "text-blue-800 bg-blue-200",
        gray: "text-gray-800 bg-gray-200",
      };
      const selectedColorClasses = colorClasses[color] || colorClasses.gray;
      
      // Handle width classes
      let widthClasses = "";
      if (options.width === 'custom' && options.maxWidth) {
        widthClasses = `${options.maxWidth} ${options.customClass}`;
      }
      
      // Construct and return the alert HTML
      return `
        <div class="flex p-4 mb-4 text-sm ${selectedColorClasses} rounded-lg ${widthClasses}" role="alert" data-for="${attachToId}">
          <svg class="flex-shrink-0 inline w-4 h-4 me-3 mt-[2px]" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" fill="currentColor" viewBox="0 0 20 20">
            <path d="M10 .5a9.5 9.5 0 1 0 9.5 9.5A9.51 9.51 0 0 0 10 .5ZM9.5 4a1.5 1.5 0 1 1 0 3 1.5 1.5 0 0 1 0-3ZM12 15H8a1 1 0 0 1 0-2h1v-3H8a1 1 0 0 1 0-2h2a1 1 0 0 1 1 1v4h1a1 1 0 0 1 0 2Z"/>
          </svg>
          <div>
            <span class="font-medium">${message}</span>
            ${itemsSpecify}
          </div>
        </div>
      `;
    }
    
    /**
     * Handles the display strategy for the alert based on options
     * 
     * @private
     * @param {HTMLElement} container - The element to attach the alert to
     * @param {string} alertHtml - The HTML content of the alert
     * @param {Object} options - Configuration options
     */
    _displayAlert(container, alertHtml, options) {
      if (options.useContainer) {
        this._displayInContainer(container, alertHtml, options);
      } else {
        this._displayAdjacentToElement(container, alertHtml, options);
      }
    }
    
    /**
     * Displays an alert within a dedicated container
     * 
     * @private
     * @param {HTMLElement} container - The element to attach the alert to
     * @param {string} alertHtml - The HTML content of the alert
     * @param {Object} options - Configuration options
     */
    _displayInContainer(container, alertHtml, options) {
      let alertContainer = document.getElementById(options.containerId);
      if (!alertContainer) {
        const alertContainerHtml = `<div id="${options.containerId}" class="container mx-auto bg-transparent ${options.customClass}"></div>`;
        
        if (options.position === 'below') {
          container.insertAdjacentHTML('afterend', alertContainerHtml);
        } else {
          container.insertAdjacentHTML('beforebegin', alertContainerHtml);
        }
        
        alertContainer = document.getElementById(options.containerId);
      }
      
      alertContainer.innerHTML = alertHtml;
    }
    
    /**
     * Displays an alert directly adjacent to the target element
     * 
     * @private
     * @param {HTMLElement} container - The element to attach the alert to
     * @param {string} alertHtml - The HTML content of the alert
     * @param {Object} options - Configuration options
     */
    _displayAdjacentToElement(container, alertHtml, options) {
      const insertPosition = options.position === 'above' ? "beforebegin" : "afterend";
      container.insertAdjacentHTML(insertPosition, alertHtml);
    }
    
    /**
     * Finds the DOM element for an alert based on its attachment ID and options
     * 
     * @private
     * @param {string} attachToId - ID of the element the alert is attached to
     * @param {Object} options - Configuration options
     * @returns {HTMLElement|null} - The alert element if found, otherwise null
     */
    _findAlertElement(attachToId, options) {
      if (!options.useContainer) {
        const container = document.querySelector("#" + attachToId);
        if (container) {
          return container.parentElement.querySelector(`[role="alert"][data-for="${attachToId}"]`);
        }
      } else {
        const alertContainer = document.getElementById(options.containerId);
        if (alertContainer) {
          return alertContainer.querySelector(`[role="alert"][data-for="${attachToId}"]`);
        }
      }
      
      return null;
    }
    
    /**
     * Removes an alert element from the DOM
     * 
     * @private
     * @param {HTMLElement} element - The alert element to remove
     * @param {number} afterDelay - Delay in milliseconds before removal
     * @param {Object} options - Configuration options
     */
    _removeElement(element, afterDelay, options) {
      if (!element) return;
      
      if (afterDelay === 0) {
        element.remove();
        this._cleanupContainer(options);
      } else {
        setTimeout(() => {
          if (element && element.parentNode) {
            element.remove();
            this._cleanupContainer(options);
          }
        }, afterDelay);
      }
    }
    
    /**
     * Removes empty alert containers from the DOM
     * 
     * @private
     * @param {Object} options - Configuration options
     */
    _cleanupContainer(options) {
      if (options.useContainer) {
        const alertContainer = document.getElementById(options.containerId);
        if (alertContainer && alertContainer.children.length === 0) {
          alertContainer.remove();
        }
      }
    }
  }
  
  /**
   * Singleton instance of the AlertManager for use throughout the application
   * @type {AlertManager}
   */
  export const alertManager = new AlertManager();
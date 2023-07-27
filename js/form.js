class FormElement {
  /**
   * @param {string} attribute 
   */
  constructor(attribute) {
    const input = document.getElementById(attribute);
    const nextElement = input.nextElementSibling;
    const isFeedback = nextElement.className.includes("invalid-feedback");
    if (isFeedback) {
      input.addEventListener("focusin", () => nextElement.style.display = "none");
    }
    this.attribute = attribute;
    /** @type {HTMLInputElement} */
    this.input = input;
    /** @type {HTMLDivElement?} */
    this.feedback = isFeedback ? nextElement: null;
  }

  hideFeedback() {
    if (this.feedback) {
      this.feedback.style.display = "none";
      this.feedback.innerText = "";
    }
  }

  getInputValue() {
    switch (this.input.type) {
      case "radio": {
        return this.input.checked;
      }
      case "checkbox": {
        return this.input.checked;
      }
      case "number": {
        if (this.input.step === "1") {
          return parseInt(this.input.value);  
        }
        return parseFloat(this.input.value);
      }
      default: {
        return this.input.value;
      }
    }
  }

  setInputValue(value) {
    switch (this.input.type) {
      case "radio": {
        return this.input.checked = value;
      }
      case "checkbox": {
        return this.input.checked = value;
      }
      default: {
        return this.input.value = value;
      }
    }
  }

  displayError(msg) {
    if (this.feedback) {
      this.feedback.style.display = "block";
      this.feedback.innerText = msg;
    }
  }

  reset() {
    this.hideFeedback();
    switch (this.input.type) {
      case "checkbox": {
        return this.input.checked = false;
      }
      case "number": {
        return this.input.value = 0;
      }
      default: {
        return this.input.value = "";
      }
    }
  }

  getFieldName() {
    return this.attribute.replaceAll('_', ' ');
  }
}

class Form {
  /**
   * @param {string[]} attributes 
   */
  constructor(attributes = []) {
    this.elements = attributes.map(attribute => new FormElement(attribute));
  }

  reset() {
    this.elements.forEach(element => element.reset());
  }

  validate() {
    throw new Error("Method should be overridden");
  }

  /**
   * @param {{[x: string]: string | string[]}} errors 
   */
  displayErrors(errors = []) {
    for (const [attribute, messages] of Object.entries(errors)) {
      const element = this.elements.find(element => element.attribute === attribute);
      if (!element) continue;
      const msg = Array.isArray(messages) ? messages.pop() : messages;
      element.displayError(msg);
    }
  }

  loadFrom(data) {
    throw new Error("Method should be overridden");
  }
}

class UserForm extends Form {
  /**
   * @param {"create" | "update"} action 
   */
  constructor(action = "create") {
    super([
      "first_name",
      "last_name",
      "email",
      "username",
      "password",
      "role",
      "status",
    ]);
    this.action = action;
  }

  validate() {
    const result = {};
    let isValid = true;
    for (const element of this.elements) {
      const inputValue = element.getInputValue();
      switch (element.attribute) {
        case "role": {
          result["is_admin"] = inputValue === "Admin";
          break;
        }
        case "status": {
          result["is_active"] = inputValue;
          break;
        }
        default: {
          if (!inputValue) {
            if (this.action !== "update" || element.attribute !== "password") {
              isValid = false;
              element.displayError(`The ${element.getFieldName()} field is required.`);
            }
          } else {
            result[element.attribute] = inputValue;
          }
        }
      }
    }
    return isValid ? result : null;
  }

  loadFrom(data) {
    this.elements.forEach(e => e.hideFeedback());
    for (const [key, value] of Object.entries(data)) {
      if (key === "is_admin") {
        const roleElement = this.elements.find(e => e.attribute === "role");
        roleElement.setInputValue(value ? "Admin" : "User");
      } else if (key === "is_active") {
        const statusElement = this.elements.find(e => e.attribute === "status");
        statusElement.setInputValue(value);
      } else {
        const element = this.elements.find(e => e.attribute === key);
        if (!element) continue;
        element.setInputValue(value);
      }
    }
    this.action = "update";
  }
}

class ProductForm extends Form {
  constructor(action = "create") {
    super([
      "name",
      "price",
      "inventory",
    ]);
    this.action = action;
  }

  validate() {
    const result = {};
    let isValid = true;
    for (const element of this.elements) {
      const inputValue = element.getInputValue();
      switch (typeof inputValue) {
        case "string": {
          if (!inputValue) {
            isValid = false;
            element.displayError(`The ${element.getFieldName()} field is required.`);
          }
          break;
        }
        case "number": {
          if (inputValue <= 0) {
            isValid = false;
            element.displayError(`The ${element.getFieldName()} field must be greater than 0.`);
          }
          break;
        }
      }
      result[element.attribute] = inputValue;
    }
    return isValid ? result : null;
  }

  loadFrom(data) {
    this.elements.forEach(e => e.hideFeedback());
    for (const [key, value] of Object.entries(data)) {
      const element = this.elements.find(e => e.attribute === key);
      if (!element) continue;
      element.setInputValue(value);
    }
    this.action = "update";
  }
}

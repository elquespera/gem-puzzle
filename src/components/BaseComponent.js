const computeElements = (...elements) => {
  if (!elements) return undefined;
  let result = elements
    .map((element) => {
      if (element && element.element) {
        return element.element;
      }
      if (element instanceof Node) {
        return element;
      }
      return undefined;
    })
    .filter((element) => element !== undefined);

  if (result.length > 1) {
    const frag = document.createDocumentFragment();
    frag.append(...result);
    result = [frag];
  }
  return result;
};

class BaseComponent {
  constructor(selector) {
    this.selector = selector || 'div';
    const classes = this.selector.split('.');
    this.element = document.createElement(classes[0] === '' ? 'div' : classes[0]);
    classes.shift();
    if (classes.length > 0) {
      this.element.classList.add(...classes);
    }
  }

  get text() {
    return this.element.innerHTML;
  }

  set text(text) {
    if (text === this.text) return;
    this.element.innerHTML = text;
  }

  get classList() {
    return this.element.classList;
  }

  append(...elements) {
    this.element.append(...computeElements(...elements));
  }

  replace(...elements) {
    this.element.replaceChildren(...computeElements(...elements));
  }

  addEventListener(event, callback) {
    if (!callback) return;
    this.element.addEventListener(event, callback);
  }

  onclick(callback) {
    this.addEventListener('click', callback);
  }
}

export default BaseComponent;

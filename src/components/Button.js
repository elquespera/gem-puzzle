import BaseComponent from './BaseComponent';

class Button extends BaseComponent {
  constructor(text, options = {}) {
    let tag = 'button';
    if (options.primary) tag += '.primary';
    if (options.checkbox) tag += '.checkbox';
    super(tag);

    this._checked = false;
    if (options.icon) {
      this.append(new BaseComponent(`span.icon.${options.icon}`));
      this.element.title = text;
    }

    this.buttonText = new BaseComponent('span.button-text');
    this.buttonText.text = text;
    this.append(this.buttonText);

    if (options.checked) this.checked = true;
    if (options.checkbox) {
      this.checkbox = new BaseComponent('span.checkbox-body');
      this.append(this.checkbox);
    }
  }

  get checked() {
    return this._checked;
  }

  set checked(checked) {
    this.setChecked(checked);
  }

  setChecked(checked) {
    this._checked = checked;
    this.classList.toggle('checked', checked);
  }

  set text(text) {
    this.buttonText.text = text;
  }

  get text() {
    return this.buttonText.text;
  }
}

export default Button;

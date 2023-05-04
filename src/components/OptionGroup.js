import BaseComponent from './BaseComponent';
import Button from './Button';

class OptionGroup extends BaseComponent {
  constructor(options, onchange) {
    super('.option-group');
    this._onchange = onchange;
    if (!Array.isArray(options)) return;
    this.options = options.map((text) => new Button(text));
    this.options.forEach((option) => option.onclick(() => this.optionChange(option.text)));
    this.append(...this.options);
  }

  optionChange(option) {
    if (this.checked === option) return;
    this.options.forEach((button) => button.setChecked(button.text === option));
    if (this._onchange) this._onchange(option);
  }

  set checked(option) {
    this.optionChange(option);
  }

  get checked() {
    const checkedOption = this.options.find((option) => option.checked);
    if (checkedOption) return checkedOption.text;
    return null;
  }
}
export default OptionGroup;

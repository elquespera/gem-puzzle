import BaseComponent from './BaseComponent';
import Button from './Button';

const defaultButton = {
  title: 'Close',
  focus: true,
  primary: false,
  preventClose: false,
  onclick: null,
};

class Dialog extends BaseComponent {
  constructor(title, body, buttons = [defaultButton]) {
    super('.dialog');
    this.dialogWrapper = new BaseComponent('.dialog-wrapper');
    let dialogBody;
    if (body instanceof BaseComponent) {
      dialogBody = body;
    } else {
      dialogBody = new BaseComponent('div');
      dialogBody.text = body;
    }
    this.dialogTitle = new BaseComponent('h2');
    this.dialogTitle.text = title;

    this.buttonsWrapper = new BaseComponent('.buttons-wrapper');
    let buttonList = buttons;
    if (typeof buttons === 'string') {
      buttonList = [{ ...defaultButton, title: buttons }];
    }
    this.buttons = buttonList.map((button) => {
      const component = new Button(button.title, { primary: button.primary });
      component.onclick(() => this.buttonClick(button));
      component.data = button;
      return component;
    });
    this.buttonsWrapper.append(...this.buttons);

    this.dialogWrapper.append(this.dialogTitle, dialogBody, this.buttonsWrapper);
    this.append(this.dialogWrapper);
    this.clickListener = this.bodyClick.bind(this);
    this.keyListener = this.bodyKeyDown.bind(this);
  }

  buttonClick(button) {
    if (button.preventClose) {
      if (button.onclick) button.onclick(button.title);
    } else {
      this.close();
    }
  }

  show(callback) {
    this.callback = callback;
    document.body.prepend(this.element);
    document.body.classList.add('dialog-open');
    document.body.addEventListener('click', this.clickListener);
    document.body.addEventListener('keydown', this.keyListener);
    this.buttons.forEach((button) => {
      if (button.data.focus) button.element.focus();
    });
  }

  close() {
    document.body.classList.remove('dialog-open');
    document.body.removeEventListener('click', this.clickListener);
    document.body.removeEventListener('keydown', this.keyListener);
    this.element.remove(this.element);
    if (this.callback) this.callback();
  }

  bodyClick(event) {
    if (event.target === this.element) this.close();
  }

  bodyKeyDown(event) {
    if (event.key === 'Escape') this.close();
  }
}

export default Dialog;

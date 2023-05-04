import BaseComponent from './BaseComponent';

class Footer extends BaseComponent {
  constructor() {
    super('footer');

    const links = [
      ['github', 'GitHub', 'https://github.com/elquespera'],
      ['portfolio', 'Portfolio', 'https://pavegrinkevich.com'],
      ['rss', 'Rolling Scopes School', 'https://rss.school']]
      .map(([className, text, href]) => {
        const linkBody = new BaseComponent('a.footer-link');
        linkBody.element.href = href;
        const linkIcon = new BaseComponent(`.icon.${className}`);
        const linkText = new BaseComponent('.hint');
        linkText.text = text;
        linkBody.append(linkIcon, linkText);
        return linkBody;
      });
    this.append(...links);
  }
}

const footer = new Footer();

export default footer;

/**
 * Anchor JS
 * @version 1.0.1
 * @author Fariborz Jafarzadeh
 * @license MIT
 * @email fariborzj2@gmail.com
 */

class Anchor {
  constructor(listSelector, options) {
    this.list = document.querySelector(listSelector);
    this.contentClass = options.contentClass;
    this.activeClass = options.activeClass;
    this.headClass = options.headClass;
    this.listHead = options.listHead;
    this.defaultFontSize = options.defaultFontSize || {};
    this.defaultFontWeight = options.defaultFontWeight || {};
    this.offsetTop = options.offsetTop || 100;

    this.core = new AnchorCore(options);
    this.init();
  }
  
  init() {
    const contentElement = document.querySelector(`.${this.contentClass}`);
    const headings = contentElement.querySelectorAll(this.listHead.join(','));
  
    headings.forEach((heading, index) => {
      const headingTag = heading.tagName.toLowerCase();
      const headingId = this.core.generateHeadingId(index);
      heading.setAttribute('id', headingId);
  
      const styles = this.core.getHeadingStyles(headingTag);
  
      const listItem = document.createElement('li');
      const anchorLink = document.createElement('a');
      anchorLink.setAttribute('href', `#${headingId}`);
      anchorLink.classList.add('anchor-link');
  
      const span = document.createElement('span');
      span.style.fontWeight = styles.fontWeight;
      span.style.fontSize = styles.fontSize;
      span.textContent = heading.textContent;
  
      anchorLink.appendChild(span);
      listItem.appendChild(anchorLink);
      this.list.querySelector('ul').appendChild(listItem);
    });
  
    this.bindScroll();
    this.bindClick();
  }
  
  bindScroll() {
    const contentElement = document.querySelector(`.${this.contentClass}`);
    const headings = Array.from(contentElement.querySelectorAll(this.listHead.join(','))).map(h => ({
      id: h.getAttribute('id'),
      offsetTop: h.getBoundingClientRect().top + window.scrollY
    }));
  
    window.addEventListener('scroll', () => {
      const scrollTop = window.scrollY || document.documentElement.scrollTop;
      const activeHeadingId = this.core.getActiveHeading(scrollTop, headings);
  
      // Remove active class from all list items
      this.list.querySelectorAll('li').forEach((li) => {
        li.classList.remove(this.activeClass);
      });
  
      // Add active class to the current list item
      if (activeHeadingId) {
        const currentLink = this.list.querySelector(`a[href="#${activeHeadingId}"]`);
        if (currentLink && currentLink.parentElement) {
          currentLink.parentElement.classList.add(this.activeClass);
        }
      }
  
      // Remove head class from all headings
      contentElement.querySelectorAll(this.listHead.join(',')).forEach((h) => h.classList.remove(this.headClass));
  
      // Add head class to the current heading
      if (activeHeadingId) {
        const activeHeadingElement = document.getElementById(activeHeadingId);
        if (activeHeadingElement) {
          activeHeadingElement.classList.add(this.headClass);
        }
      }
    });
  }
  
  bindClick() {
    this.list.querySelectorAll('li a').forEach((anchor) => {
      anchor.addEventListener('click', (e) => {
        e.preventDefault();
        const href = anchor.getAttribute('href');
        const targetElement = document.querySelector(href);
        if (targetElement) {
          const offsetTop = targetElement.getBoundingClientRect().top + window.scrollY - this.offsetTop;
          window.scrollTo({
            top: offsetTop,
            behavior: 'smooth'
          });
        }
      });
    });
  }
}

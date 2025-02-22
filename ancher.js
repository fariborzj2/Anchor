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
  
    this.init();
  }
  
  init() {
    const contentElement = document.querySelector(`.${this.contentClass}`);
    const headings = contentElement.querySelectorAll(this.listHead.join(','));
  
    headings.forEach((heading, index) => {
      const headingTag = heading.tagName.toLowerCase();
      const headingId = `heading-${index + 1}`;
      heading.setAttribute('id', headingId);
  
      const fontSize = this.defaultFontSize[headingTag] || '14px';
      const fontWeight = this.defaultFontWeight[headingTag] || 'normal';
  
      const listItem = document.createElement('li');
      const anchorLink = document.createElement('a');
      anchorLink.setAttribute('href', `#${headingId}`);
      anchorLink.classList.add('anchor-link');
  
      const span = document.createElement('span');
      span.style.fontWeight = fontWeight;
      span.style.fontSize = fontSize;
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
    const headings = contentElement.querySelectorAll(this.listHead.join(','));
  
    window.addEventListener('scroll', () => {
      const scrollTop = window.scrollY || document.documentElement.scrollTop;
  
      headings.forEach((heading) => {
        const headingId = heading.getAttribute('id');
        const offsetTop = heading.getBoundingClientRect().top + scrollTop - this.offsetTop;
  
        if (scrollTop >= offsetTop) {
          // Remove active class from all list items
          this.list.querySelectorAll('li').forEach((li) => {
            li.classList.remove(this.activeClass);
          });
  
          // Add active class to the current list item
          const currentLink = this.list.querySelector(`a[href="#${headingId}"]`);
          if (currentLink && currentLink.parentElement) {
            currentLink.parentElement.classList.add(this.activeClass);
          }
  
          // Remove head class from all headings
          headings.forEach((h) => h.classList.remove(this.headClass));
  
          // Add head class to the current heading
          heading.classList.add(this.headClass);
        }
      });
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

// This file will contain the core logic for the ancher.js library.
// It will be framework-agnostic and will not contain any DOM manipulation code.

(function() {
  'use strict';

  class AnchorCore {
    constructor(options) {
      this.contentClass = options.contentClass;
      this.activeClass = options.activeClass;
      this.headClass = options.headClass;
      this.listHead = options.listHead;
      this.defaultFontSize = options.defaultFontSize || {};
      this.defaultFontWeight = options.defaultFontWeight || {};
      this.offsetTop = options.offsetTop || 100;
    }

    generateHeadingId(index) {
      return `heading-${index + 1}`;
    }

    getHeadingStyles(headingTag) {
      const fontSize = this.defaultFontSize[headingTag] || '14px';
      const fontWeight = this.defaultFontWeight[headingTag] || 'normal';
      return { fontSize, fontWeight };
    }

    getActiveHeading(scrollTop, headings) {
      let activeHeadingId = null;
      headings.forEach((heading) => {
        const headingId = heading.id;
        const offsetTop = heading.offsetTop - this.offsetTop;
        if (scrollTop >= offsetTop) {
          activeHeadingId = headingId;
        }
      });
      return activeHeadingId;
    }
  }

  // Attach to window for global access
  if (typeof window !== 'undefined') {
    window.AnchorCore = AnchorCore;
  }
})();

<template>
  <div id="anchor-list-vue">
    <ul>
      <li v-for="item in anchorItems" :key="item.id" :class="{ [activeClass]: item.id === activeHeadingId }">
        <a :href="`#${item.id}`" @click.prevent="handleAnchorClick(item.id)">
          <span :style="{ fontWeight: item.fontWeight, fontSize: item.fontSize }">{{ item.text }}</span>
        </a>
      </li>
    </ul>
  </div>
</template>

<script>
import AnchorCore from './anchor-core.js'; // Assuming anchor-core.js is in the same directory or accessible via build system

export default {
  name: 'AnchorVue',
  props: {
    contentSelector: {
      type: String,
      required: true,
    },
    activeClass: {
      type: String,
      default: 'active',
    },
    headClass: {
      type: String,
      default: 'highlight',
    },
    listHead: {
      type: Array,
      default: () => ['h1', 'h2', 'h3', 'h4', 'h5', 'h6'],
    },
    defaultFontSize: {
      type: Object,
      default: () => ({}),
    },
    defaultFontWeight: {
      type: Object,
      default: () => ({}),
    },
    offsetTop: {
      type: Number,
      default: 100,
    },
  },
  data() {
    return {
      anchorItems: [],
      activeHeadingId: null,
      core: null,
      headingsMap: [], // Store headings with their original offsetTop
    };
  },
  mounted() {
    this.core = new AnchorCore({
      contentClass: this.contentSelector.substring(1), // Remove leading '.' or '#' if present for AnchorCore
      activeClass: this.activeClass,
      headClass: this.headClass,
      listHead: this.listHead,
      defaultFontSize: this.defaultFontSize,
      defaultFontWeight: this.defaultFontWeight,
      offsetTop: this.offsetTop,
    });
    this.initializeAnchors();
    window.addEventListener('scroll', this.handleScroll);
  },
  beforeUnmount() {
    window.removeEventListener('scroll', this.handleScroll);
  },
  methods: {
    initializeAnchors() {
      const contentElement = document.querySelector(this.contentSelector);
      if (!contentElement) {
        console.warn(`[AnchorVue] Content element not found: ${this.contentSelector}`);
        return;
      }
      const headings = contentElement.querySelectorAll(this.listHead.join(','));
      this.headingsMap = []; // Reset
      const tempAnchorItems = [];

      headings.forEach((heading, index) => {
        const headingTag = heading.tagName.toLowerCase();
        const headingId = this.core.generateHeadingId(index);
        heading.setAttribute('id', headingId);

        const styles = this.core.getHeadingStyles(headingTag);
        tempAnchorItems.push({
          id: headingId,
          text: heading.textContent,
          fontWeight: styles.fontWeight,
          fontSize: styles.fontSize,
        });
        // Store initial offsetTop relative to the document for scroll calculation
        this.headingsMap.push({ id: headingId, offsetTop: heading.getBoundingClientRect().top + window.scrollY });
      });
      this.anchorItems = tempAnchorItems;
      this.handleScroll(); // Initial check
    },
    handleScroll() {
      const scrollTop = window.scrollY || document.documentElement.scrollTop;

      // The getActiveHeading method in AnchorCore expects heading objects with id and an offsetTop relative to the viewport or a consistent reference.
      // We will adjust the stored offsetTop for AnchorCore's calculation method.
      // For simplicity, we'll use the same logic as in the original ancher.js for determining active state based on current scroll position.
      let currentActiveId = null;
      for (let i = this.headingsMap.length - 1; i >= 0; i--) {
        const headingInfo = this.headingsMap[i];
        if (scrollTop >= (headingInfo.offsetTop - this.offsetTop)) {
          currentActiveId = headingInfo.id;
          break;
        }
      }

      if (this.activeHeadingId !== currentActiveId) {
        this.activeHeadingId = currentActiveId;

        // Update headClass on actual heading elements
        const contentElement = document.querySelector(this.contentSelector);
        if (contentElement) {
            contentElement.querySelectorAll(this.listHead.join(',')).forEach(h => {
                h.classList.remove(this.headClass);
            });
            if (this.activeHeadingId) {
                const activeEl = document.getElementById(this.activeHeadingId);
                if (activeEl) {
                    activeEl.classList.add(this.headClass);
                }
            }
        }
      }
    },
    handleAnchorClick(headingId) {
      const targetElement = document.getElementById(headingId);
      if (targetElement) {
        const targetOffsetTop = targetElement.getBoundingClientRect().top + window.scrollY - this.offsetTop;
        window.scrollTo({
          top: targetOffsetTop,
          behavior: 'smooth',
        });
      }
    },
  },
};
</script>

<style scoped>
#anchor-list-vue ul {
  list-style: none;
  padding: 0;
  margin: 0;
}

#anchor-list-vue li {
  margin: 10px 0;
}

#anchor-list-vue a {
  text-decoration: none;
  color: #333;
  font-size: 14px; /* Default, can be overridden by props */
  transition: color 0.3s ease;
}

#anchor-list-vue a:hover {
  color: #007bff;
}

#anchor-list-vue .active a { /* Assuming activeClass prop default is 'active' */
  color: #007bff;
  font-weight: bold;
}
</style>

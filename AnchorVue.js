// This file is a plain JavaScript version of AnchorVue.vue for direct browser use.

// Assuming AnchorCore is already loaded globally via <script src="./anchor-core.js"></script>
// or available as an ES module if this script itself is loaded as a module.
// For simplicity with global script loading, we expect window.AnchorCore.

const AnchorVueComponent = {
  name: 'AnchorVue',
  template: `
  <div id="anchor-list-vue-js">
    <ul>
      <li v-for="item in anchorItems" :key="item.id" :class="{ [activeClassComputed]: item.id === activeHeadingId }">
        <a :href="config.baseUrl + '#' + item.id" @click.prevent="handleAnchorClick(item.id)">
          <span :style="{ fontWeight: item.fontWeight, fontSize: item.fontSize }">{{ item.text }}</span>
        </a>
      </li>
    </ul>
  </div>
  `,
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
      headingsMap: [],
      // Base URL for anchor links, useful if the page has a <base> tag
      config: {
          baseUrl: ''
      }
    };
  },
  computed: {
    // Props are directly accessible in the template, so activeClassComputed is not strictly needed
    // unless there's more complex logic.
    activeClassComputed() {
      return this.activeClass;
    }
  },
  mounted() {
    // Ensure AnchorCore is available
    if (!window.AnchorCore) {
      console.error("[AnchorVue] AnchorCore not found. Make sure anchor-core.js is loaded before this component.");
      return;
    }
    this.core = new window.AnchorCore({
      // contentClass in AnchorCore does not expect '.' or '#'
      contentClass: this.contentSelector.startsWith('.') || this.contentSelector.startsWith('#') ? this.contentSelector.substring(1) : this.contentSelector,
      activeClass: this.activeClass,
      headClass: this.headClass,
      listHead: this.listHead,
      defaultFontSize: this.defaultFontSize,
      defaultFontWeight: this.defaultFontWeight,
      offsetTop: this.offsetTop,
    });

    // Determine base URL. If <base href="..."> exists, prepend it to fragment identifiers.
    const baseTag = document.querySelector('base');
    if (baseTag && baseTag.href) {
        // Ensure trailing slash for proper concatenation if needed, though for #hash it might not matter.
        this.config.baseUrl = baseTag.href.replace(window.location.origin, '');
    }


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
      this.headingsMap = [];
      const tempAnchorItems = [];

      headings.forEach((heading, index) => {
        const headingTag = heading.tagName.toLowerCase();
        // Use a unique ID that is less likely to clash if multiple instances or other scripts manipulate IDs.
        const headingId = this.core.generateHeadingId(index) + '-' + Math.random().toString(36).substr(2, 9);
        heading.setAttribute('id', headingId);

        const styles = this.core.getHeadingStyles(headingTag);
        tempAnchorItems.push({
          id: headingId,
          text: heading.textContent,
          fontWeight: styles.fontWeight,
          fontSize: styles.fontSize,
        });
        this.headingsMap.push({ id: headingId, offsetTop: heading.getBoundingClientRect().top + window.scrollY, element: heading });
      });
      this.anchorItems = tempAnchorItems;
      this.handleScroll(); // Initial check to set active state
    },
    handleScroll() {
      const scrollTop = window.scrollY || document.documentElement.scrollTop;
      let currentActiveId = null;

      // Iterate from bottom to top to find the last heading that is above the scroll threshold
      for (let i = this.headingsMap.length - 1; i >= 0; i--) {
        const headingInfo = this.headingsMap[i];
        // Check if the top of the heading is at or above the scroll threshold
        if (scrollTop >= (headingInfo.offsetTop - this.offsetTop)) {
          currentActiveId = headingInfo.id;
          break;
        }
      }

      if (this.activeHeadingId !== currentActiveId) {
        // Remove headClass from previously active heading element
        if (this.activeHeadingId) {
            const oldActiveElement = this.headingsMap.find(h => h.id === this.activeHeadingId);
            if (oldActiveElement && oldActiveElement.element) {
                oldActiveElement.element.classList.remove(this.headClass);
            }
        }

        this.activeHeadingId = currentActiveId;

        // Add headClass to newly active heading element
        if (this.activeHeadingId) {
            const newActiveElement = this.headingsMap.find(h => h.id === this.activeHeadingId);
            if (newActiveElement && newActiveElement.element) {
                newActiveElement.element.classList.add(this.headClass);
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
        // Optionally, force active state update upon click, though scroll event should handle it.
        // this.activeHeadingId = headingId;
      }
    },
  },
};

// If using Vue globally (e.g. via CDN), register the component:
// Vue.createApp({}).component('anchor-vue', AnchorVueComponent);
// This registration will be done in demo-vue.html

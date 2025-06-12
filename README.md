# Anchor JS

![License](https://img.shields.io/badge/license-MIT-blue.svg)
![Version](https://img.shields.io/badge/version-1.1.0-green.svg) <!-- Updated version -->

**Anchor JS** is a lightweight and simple JavaScript library for automatically generating navigation menus based on the headings (e.g., `<h1>`, `<h2>`, `<h3>`) present on a webpage. It allows you to easily create dynamic navigation menus for different sections of your page. This library now also supports Vue and React.

---

## Core Concept: `anchor-core.js`

The foundation of Anchor JS is `anchor-core.js`. This script contains the framework-agnostic logic for:
- Identifying headings in your content.
- Generating unique IDs for these headings.
- Calculating styles (like font size and weight) based on heading types.
- Determining which heading is currently active based on scroll position.

`anchor-core.js` does not perform any DOM manipulation itself but provides the necessary data and calculations for the different framework-specific implementations (vanilla JS, Vue, and React) to build and manage the navigation menu.

---

## Features

- Automatically generates a navigation menu based on headings (`<h1>`, `<h2>`, `<h3>`, etc.).
- Supports active class highlighting for the current section.
- Smooth scrolling to different sections of the page.
- Highly customizable with various options.
- Available in Vanilla JS, Vue, and React versions.

---

## Installation & Usage

Below are instructions on how to use each version of Anchor JS. Ensure `anchor-core.js` is always included before the main script for each version (e.g., `ancher.js`, `AnchorVue.js`, `AnchorReact.js`).

### 1. Vanilla JS

This is the original implementation.

**Files needed:**
- `anchor-core.js`
- `ancher.js`

**HTML Setup:**

1.  Include the scripts in your HTML file:
    ```html
    <script src="path/to/anchor-core.js"></script>
    <script src="path/to/ancher.js"></script>
    ```

2.  Add the required HTML structure for your content and the navigation list:
    ```html
    <div class="content"> <!-- Your content container -->
      <h1>Section 1</h1>
      <p>Content for section 1...</p>
      <h2>Section 1.1</h2>
      <p>Content for subsection 1.1...</p>
      <h1>Section 2</h1>
      <p>Content for section 2...</p>
    </div>

    <div id="anchor-list"> <!-- Container for the navigation menu -->
      <ul></ul>
    </div>
    ```

3.  Initialize Anchor JS in your script:
    ```javascript
    const options = {
      contentClass: 'content', // Class of the content container
      activeClass: 'active',   // Class for the active menu item in the list
      headClass: 'highlight',  // Class for the currently active heading in the content
      listHead: ['h1', 'h2', 'h3'], // Headings to include
      defaultFontSize: { h1: '18px', h2: '16px', h3: '14px' },
      defaultFontWeight: { h1: 'bold', h2: 'normal' },
      offsetTop: 100 // Offset from the top when scrolling to an element
    };

    // Assuming #anchor-list is the selector for your navigation menu container
    new Anchor('#anchor-list', options);
    ```

**Demo:** See `demo.html` for a working example.

### 2. Vue.js Version

A Vue component that wraps the Anchor JS functionality.

**Files needed:**
- `anchor-core.js`
- `AnchorVue.js` (contains the `AnchorVueComponent` definition)

**HTML Setup (`demo-vue.html`):**

1.  Include Vue.js (e.g., from a CDN), `anchor-core.js`, and `AnchorVue.js`:
    ```html
    <script src="https://unpkg.com/vue@3/dist/vue.global.js"></script>
    <script src="path/to/anchor-core.js"></script>
    <script src="path/to/AnchorVue.js"></script>
    ```
    *Note: `AnchorVue.js` creates a global component definition `AnchorVueComponent`.*

2.  Set up your Vue application and HTML structure:
    ```html
    <div id="app">
      <div id="anchor-nav"> <!-- Container for the Vue component -->
        <anchor-vue
          content-selector=".content"
          active-class="active"
          head-class="highlight"
          :list-head="['h1', 'h2', 'h3']"
          :default-font-size="{ h1: '18px', h2: '16px', h3: '14px' }"
          :default-font-weight="{ h1: 'bold', h2: 'normal' }"
          :offset-top="120">
        </anchor-vue>
      </div>

      <div class="content">
        <h1>Section 1</h1>
        <p>...</p>
        <h2>Subsection 1.1</h2>
        <p>...</p>
      </div>
    </div>

    <script>
      const app = Vue.createApp({});
      // AnchorVue.js makes AnchorVueComponent globally available
      app.component('anchor-vue', AnchorVueComponent);
      app.mount('#app');
    </script>
    ```

**Demo:** See `demo-vue.html` for a working example. The component `AnchorVue.js` includes its template and styles.

### 3. React Version

A React component for integrating Anchor JS into React applications.

**Files needed:**
- `anchor-core.js`
- `AnchorReact.js` (contains the `AnchorReact` component)

**HTML Setup (`demo-react.html`):**

1.  Include React, ReactDOM, PropTypes (if using prop validation), Babel (for JSX in `<script type="text/babel">`), `anchor-core.js`, and `AnchorReact.js`:
    ```html
    <script src="https://unpkg.com/react@17/umd/react.development.js"></script>
    <script src="https://unpkg.com/react-dom@17/umd/react-dom.development.js"></script>
    <script src="https://unpkg.com/prop-types@15.7.2/prop-types.js"></script>
    <script src="https://unpkg.com/@babel/standalone@7.14.7/babel.min.js"></script>

    <script src="path/to/anchor-core.js"></script>
    <script src="path/to/AnchorReact.js"></script>
    ```
    *Note: `AnchorReact.js` defines a global `AnchorReact` component.*

2.  Set up your React rendering and HTML structure:
    ```html
    <div id="anchor-nav-react"> <!-- React component will be rendered here -->
    </div>

    <div class="content">
      <h1>Section 1</h1>
      <p>...</p>
      <h2>Subsection 1.1</h2>
      <p>...</p>
    </div>

    <script type="text/babel">
      const reactContainer = document.getElementById('anchor-nav-react');
      const anchorProps = {
        contentSelector: '.content',
        activeClass: 'active',
        headClass: 'highlight',
        listHead: ['h1', 'h2', 'h3'],
        // ... other props
        offsetTop: 120
      };
      ReactDOM.render(
        React.createElement(AnchorReact, anchorProps),
        reactContainer
      );
    </script>
    ```

**Demo:** See `demo-react.html` for a working example. Styles for the component are included in `demo-react.html`.

---

## Common Options

All versions (Vanilla JS, Vue, React) accept a similar set of options/props to customize behavior:

| Option/Prop         | Type   | Default                                  | Description                                                                                   |
| ------------------- | ------ | ---------------------------------------- | --------------------------------------------------------------------------------------------- |
| `contentSelector`   | String | (required)                               | CSS selector for the container where headings are located (e.g., `'.content'`).                |
| `activeClass`       | String | `'active'`                               | CSS class applied to the active menu item in the navigation list.                             |
| `headClass`         | String | `'highlight'`                            | CSS class applied to the active heading element within the content.                           |
| `listHead`          | Array  | `['h1', 'h2', 'h3', 'h4', 'h5', 'h6']`   | Array of heading tag names (lowercase) to include in the navigation menu.                     |
| `defaultFontSize`   | Object | `{}`                                     | Object mapping heading tags to font sizes (e.g., `{ h1: '20px', h2: '18px' }`).                |
| `defaultFontWeight` | Object | `{}`                                     | Object mapping heading tags to font weights (e.g., `{ h1: 'bold', h2: 'normal' }`).           |
| `offsetTop`         | Number | `100`                                    | Offset (in pixels) from the top of the viewport when scrolling to and highlighting sections.   |

*Note: For Vue and React, props are typically passed using kebab-case for HTML attributes (e.g., `content-selector`) which are then received as camelCase by the component (e.g., `contentSelector`). Refer to the respective demo files for exact prop usage.*

---

## License

[MIT License](https://opensource.org/licenses/mit-license) © Fariborz Jafarzadeh

## Contribution
Contributions are welcome! Fork the repository, make your changes, and submit a pull request. Please ensure any new features or changes are also reflected in all relevant versions (Vanilla JS, Vue, React) and their demos if applicable.

## Support
For any inquiries or issues, feel free to contact the author at fariborzj2@gmail.com.

# Anchor JS

![License](https://img.shields.io/badge/license-MIT-blue.svg)
![Version](https://img.shields.io/badge/version-1.0.0-green.svg)

**Anchor JS** is a lightweight and simple JavaScript library for automatically generating navigation menus based on the headings (e.g., `<h1>`, `<h2>`, `<h3>`) present on a webpage. It allows you to easily create dynamic navigation menus for different sections of your page.

---

## Features

- Automatically generates a navigation menu based on headings (`<h1>`, `<h2>`, `<h3>`, etc.).
- Supports active class highlighting for the current section.
- Smooth scrolling to different sections of the page.
- Highly customizable with various options.

---

## Installation

You can include Anchor JS in your project via CDN or by downloading the script locally.

### Download Locally

   1.Download the anchor.js file from the releases page.
   2.Include it in your project:

Add the following script tag to your HTML file:

```html
<script src="path/to/anchor.js"></script>
```

## Usage
### Basic Setup

1. Add the required HTML structure:
```html
<div class="content">
  <h1>Section 1</h1>
  <p>Content for section 1...</p>
  <h2>Section 1.1</h2>
  <p>Content for subsection 1.1...</p>
  <h1>Section 2</h1>
  <p>Content for section 2...</p>
</div>

<ul id="anchor-list"></ul>
```

2. Initialize Anchor JS:
```js
const options = {
  contentClass: 'content', // Class of the content container
  activeClass: 'active',   // Class for the active menu item
  headClass: 'highlight',  // Class for the active heading
  listHead: ['h1', 'h2'],  // Headings to include in the menu
  defaultFontSize: {       // Default font sizes for headings
    h1: '24px',
    h2: '20px'
  },
  defaultFontWeight: {     // Default font weights for headings
    h1: 'bold',
    h2: 'normal'
  },
  offsetTop: 100           // Offset for scroll positioning
};

const anchor = new Anchor('#anchor-list', options);
```

### Customization
You can customize the behavior of Anchor JS by passing different options during initialization. Refer to the Options section for more details.


## License

[MIT License](https://opensource.org/licenses/mit-license) © Fariborz Jafarzadeh

## Contribution
Contributions are welcome! Fork the repository, make your changes, and submit a pull request.

## Support
For any inquiries or issues, feel free to contact the author at fariborzj2@gmail.com.

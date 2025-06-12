// AnchorReact.js - React component for Anchor navigation

// Assuming AnchorCore is loaded globally (window.AnchorCore)
// Assuming React and PropTypes are loaded globally

const AnchorReact = (props) => {
  const {
    contentSelector,
    activeClass = 'active',
    headClass = 'highlight',
    listHead = ['h1', 'h2', 'h3', 'h4', 'h5', 'h6'],
    defaultFontSize = {},
    defaultFontWeight = {},
    offsetTop = 100,
  } = props;

  const [anchorItems, setAnchorItems] = React.useState([]);
  const [activeHeadingId, setActiveHeadingId] = React.useState(null);
  const coreRef = React.useRef(null); // To store the AnchorCore instance
  const headingsMapRef = React.useRef([]); // To store heading info {id, offsetTop, element}

  React.useEffect(() => {
    if (!window.AnchorCore) {
      console.error("[AnchorReact] AnchorCore not found. Make sure anchor-core.js is loaded.");
      return;
    }

    coreRef.current = new window.AnchorCore({
      contentClass: contentSelector.startsWith('.') || contentSelector.startsWith('#') ? contentSelector.substring(1) : contentSelector,
      activeClass: activeClass, // Though AnchorCore might not use this directly for React state
      headClass: headClass,
      listHead: listHead,
      defaultFontSize: defaultFontSize,
      defaultFontWeight: defaultFontWeight,
      offsetTop: offsetTop,
    });

    const contentElement = document.querySelector(contentSelector);
    if (!contentElement) {
      console.warn(`[AnchorReact] Content element not found: ${contentSelector}`);
      return;
    }

    const headings = contentElement.querySelectorAll(listHead.join(','));
    const tempAnchorItems = [];
    const tempHeadingsMap = [];

    headings.forEach((heading, index) => {
      const headingTag = heading.tagName.toLowerCase();
      const headingId = coreRef.current.generateHeadingId(index) + '-' + Math.random().toString(36).substr(2, 9);
      heading.setAttribute('id', headingId);

      const styles = coreRef.current.getHeadingStyles(headingTag);
      tempAnchorItems.push({
        id: headingId,
        text: heading.textContent,
        fontWeight: styles.fontWeight,
        fontSize: styles.fontSize,
      });
      tempHeadingsMap.push({ id: headingId, offsetTop: heading.getBoundingClientRect().top + window.scrollY, element: heading });
    });

    setAnchorItems(tempAnchorItems);
    headingsMapRef.current = tempHeadingsMap;

    // Initial scroll check
    handleScroll();

    window.addEventListener('scroll', handleScroll);
    return () => {
      window.removeEventListener('scroll', handleScroll);
    };
  }, [contentSelector, listHead, defaultFontSize, defaultFontWeight, offsetTop, activeClass, headClass]); // Re-run if these props change

  const handleScroll = () => {
    const scrollTop = window.scrollY || document.documentElement.scrollTop;
    let currentActiveId = null;
    const localHeadingsMap = headingsMapRef.current;

    for (let i = localHeadingsMap.length - 1; i >= 0; i--) {
      const headingInfo = localHeadingsMap[i];
      if (scrollTop >= (headingInfo.offsetTop - offsetTop)) { // Use component's offsetTop
        currentActiveId = headingInfo.id;
        break;
      }
    }

    setActiveHeadingId(prevActiveId => {
      if (prevActiveId !== currentActiveId) {
        // Remove headClass from previously active heading
        if (prevActiveId) {
          const oldActiveElement = localHeadingsMap.find(h => h.id === prevActiveId);
          if (oldActiveElement && oldActiveElement.element) {
            oldActiveElement.element.classList.remove(headClass);
          }
        }
        // Add headClass to newly active heading
        if (currentActiveId) {
          const newActiveElement = localHeadingsMap.find(h => h.id === currentActiveId);
          if (newActiveElement && newActiveElement.element) {
            newActiveElement.element.classList.add(headClass);
          }
        }
      }
      return currentActiveId;
    });
  };

  const handleAnchorClick = (e, headingId) => {
    e.preventDefault();
    const targetElement = document.getElementById(headingId);
    if (targetElement) {
      const targetOffsetTop = targetElement.getBoundingClientRect().top + window.scrollY - offsetTop;
      window.scrollTo({
        top: targetOffsetTop,
        behavior: 'smooth',
      });
    }
  };

  // Determine base URL for anchor links, useful if the page has a <base> tag
  let baseUrl = '';
  if (typeof window !== 'undefined') {
    const baseTag = document.querySelector('base');
    if (baseTag && baseTag.href) {
        baseUrl = baseTag.href.replace(window.location.origin, '');
    }
  }

  return React.createElement(
    'div',
    { id: 'anchor-list-react' },
    React.createElement(
      'ul',
      null,
      anchorItems.map(item =>
        React.createElement(
          'li',
          {
            key: item.id,
            className: item.id === activeHeadingId ? activeClass : ''
          },
          React.createElement(
            'a',
            {
              href: baseUrl + '#' + item.id,
              onClick: (e) => handleAnchorClick(e, item.id)
            },
            React.createElement(
              'span',
              { style: { fontWeight: item.fontWeight, fontSize: item.fontSize } },
              item.text
            )
          )
        )
      )
    )
  );
};

AnchorReact.propTypes = {
  contentSelector: PropTypes.string.isRequired,
  activeClass: PropTypes.string,
  headClass: PropTypes.string,
  listHead: PropTypes.arrayOf(PropTypes.string),
  defaultFontSize: PropTypes.object,
  defaultFontWeight: PropTypes.object,
  offsetTop: PropTypes.number,
};

export type FrontendResourceSubtopic = {
  id: string
  title: string
  seoTitle: string
  oneLiner: string
  importance: string
  commonQuestions: string[]
  conceptDescription: string[]
  codeExample: {
    language: string
    caption: string
    snippet: string
  }
  stepByStep: string[]
  realWorldUseCase: string
  diagramHint?: string
  commonMistakes: string[]
  interviewQuestions: string[]
  keyTakeaways: string[]
  quickLinks: Array<{ label: string; url: string }>
}

export type FrontendResourceTopic = {
  id: string
  trackId: 'junior' | 'mid' | 'senior'
  title: string
  summary: string
  subtopics: FrontendResourceSubtopic[]
}

export const frontendResourceTopics: FrontendResourceTopic[] = [
  {
    id: 'core-web-foundations',
    trackId: 'junior',
    title: 'Core Web Foundations',
    summary:
      'Master the HTML, CSS, and foundational JavaScript concepts that most recruiters treat as table stakes for 1–3 year roles.',
    subtopics: [
      {
        id: 'semantic-html',
        title: 'Semantic HTML & Document Structure',
        seoTitle: 'Master Semantic HTML — The Backbone of Accessible Interfaces',
        oneLiner: 'Semantic HTML conveys meaning to browsers, assistive tech, and search engines.',
        importance:
          'Hiring managers frequently ask how you structure layouts, build accessible navigation, and improve SEO without JavaScript.',
        commonQuestions: [
          'What does semantic HTML mean and why is it better than using <div> for everything?',
          'How do you choose between <section>, <article>, and <div>?',
          'Explain how semantic markup improves accessibility and SEO.'
        ],
        conceptDescription: [
          'Semantic elements such as <header>, <main>, <nav>, <article>, and <footer> describe purpose rather than appearance.',
          'Screen readers and search engines rely on this structure to create outlines, navigation landmarks, and relevance scores.',
          'ARIA roles supplement semantics but should not replace native HTML meaning.'
        ],
        codeExample: {
          language: 'HTML',
          caption: 'Structuring a blog layout with semantic regions',
          snippet: `<header>
  <nav aria-label="Primary">
    <a href="#articles">Articles</a>
    <a href="#newsletter">Newsletter</a>
  </nav>
</header>
<main>
  <article>
    <header>
      <h1>Master Semantic HTML</h1>
      <p>Updated: Nov 2025</p>
    </header>
    <p>...</p>
    <footer>
      <p>Written by Priya Singh</p>
    </footer>
  </article>
</main>
<aside>
  <section aria-labelledby="newsletter">
    <h2 id="newsletter">Stay Updated</h2>
    <form>...</form>
  </section>
</aside>
<footer>
  <small>&copy; 2025 MockAce</small>
</footer>`
        },
        stepByStep: [
          '<header> defines the site-level introduction with a navigable landmark.',
          'The <main> element wraps the core content for skip links and screen readers.',
          '<article> encapsulates self-contained entries that could stand alone.',
          'Using <header>/<footer> inside article scopes metadata to the content, not the page.',
          'The <aside> contains complementary information and newsletter signup.'
        ],
        realWorldUseCase:
          'Building blog or docs sites (e.g., knowledge bases, product manuals) where SEO ranking and screen-reader friendliness directly impact discovery.',
        diagramHint:
          'Visualize the DOM tree with landmarks to demonstrate how assistive tech builds navigation lists.',
        commonMistakes: [
          'Relying on <div> for everything and patching semantics later with ARIA roles.',
          'Skipping heading hierarchy (jumping from <h1> to <h4>) which confuses outline algorithms.',
          'Placing multiple <main> elements on the same page.'
        ],
        interviewQuestions: [
          'Define semantic HTML and explain its impact on accessibility.',
          'How would you reorganize a div-heavy layout to be semantic?',
          'When should you use <section> vs <article>?'
        ],
        keyTakeaways: [
          'Semantic elements communicate intent and improve accessibility, SEO, and maintainability.',
          'Use headings sequentially and rely on landmarks (<header>, <nav>, <main>, <footer>).',
          'ARIA can enhance semantics but should not be the primary conveyer of meaning.'
        ],
        quickLinks: [
          { label: 'MDN: HTML elements reference', url: 'https://developer.mozilla.org/en-US/docs/Web/HTML/Element' },
          { label: 'WebAIM: Semantic Structure', url: 'https://webaim.org/techniques/semanticstructure/' }
        ]
      },
      {
        id: 'css-layouts',
        title: 'CSS Layout Systems',
        seoTitle: 'Flexbox vs Grid — Choosing the Right Layout System',
        oneLiner: 'Modern layouts rely on Flexbox and CSS Grid to build responsive, maintainable designs.',
        importance:
          'Even junior interviews evaluate whether you can translate wireframes into responsive layouts and explain Flexbox/Grid decisions.',
        commonQuestions: [
          'When do you reach for Flexbox vs Grid?',
          'Explain the CSS box model and how it influences layout debugging.',
          'How would you center a card both vertically and horizontally?'
        ],
        conceptDescription: [
          'Flexbox is one-dimensional (rows or columns) and excels at distributing space along a single axis.',
          'Grid is two-dimensional and better for full page layouts or when you need precise row/column placement.',
          'Understanding the box model (content, padding, border, margin) is foundational for both systems.'
        ],
        codeExample: {
          language: 'CSS',
          caption: 'Responsive card gallery using CSS Grid',
          snippet: `.card-grid {
  display: grid;
  gap: 1.5rem;
  grid-template-columns: repeat(auto-fit, minmax(240px, 1fr));
}

.card {
  padding: 1.5rem;
  border-radius: 1rem;
  background: var(--surface);
  transition: transform 200ms ease;
}

.card:hover {
  transform: translateY(-4px);
}`
        },
        stepByStep: [
          'Set display: grid to enable two-dimensional control.',
          'Use repeat(auto-fit, minmax()) to create responsive columns without media queries.',
          'Gap provides consistent spacing between cards.',
          'Hover transform adds affordance without affecting layout flow.'
        ],
        realWorldUseCase:
          'Constructing dashboards, cards, or marketing tiles that must reflow gracefully from desktop to mobile.',
        diagramHint:
          'Sketch a grid showing how auto-fit condenses columns as screen width shrinks.',
        commonMistakes: [
          'Using floats or manual calc() widths for layouts that Flexbox/Grid handle automatically.',
          'Forgetting that padding contributes to element width unless box-sizing:border-box is set.',
          'Mixing Flex children order without considering accessibility (reading order).'
        ],
        interviewQuestions: [
          'Describe scenarios where CSS Grid is more appropriate than Flexbox.',
          'How does the box model change when box-sizing is set to border-box?',
          'What does justify-content do in Flexbox vs Grid?'
        ],
        keyTakeaways: [
          'Flexbox = one dimension, Grid = two dimensions.',
          'Master the box model to debug spacing issues quickly.',
          'Responsive layouts often combine Grid for outer structure and Flexbox for internal alignment.'
        ],
        quickLinks: [
          { label: 'CSS-Tricks: Flexbox Guide', url: 'https://css-tricks.com/snippets/css/a-guide-to-flexbox/' },
          { label: 'MDN: Grid Layout', url: 'https://developer.mozilla.org/en-US/docs/Web/CSS/CSS_Grid_Layout' }
        ]
      },
      {
        id: 'js-foundations',
        title: 'JavaScript Foundations (ES6+)',
        seoTitle: 'ES6 Foundations — Variables, Scope, and the Event Loop',
        oneLiner: 'Understanding modern JavaScript structure prepares you for async and React-centric questions.',
        importance:
          'Recruiters want assurance that you can reason about scope, hoisting, and asynchronous execution without relying on frameworks.',
        commonQuestions: [
          'Explain the difference between var, let, and const.',
          'What is the event loop and how does it handle microtasks vs macrotasks?',
          'How does destructuring improve readability?'
        ],
        conceptDescription: [
          'let/const respect block scope and prevent accidental global leakage, while var is function scoped and hoisted.',
          'Promises and async/await build on the event loop, scheduling microtasks (Promise callbacks) before macrotasks (setTimeout).',
          'Destructuring, spread, and rest operators provide expressive patterns for working with objects/arrays.'
        ],
        codeExample: {
          language: 'JavaScript',
          caption: 'Event loop scheduling with microtasks and macrotasks',
          snippet: `console.log('start');

setTimeout(() => console.log('timeout'), 0);

Promise.resolve()
  .then(() => console.log('microtask'))
  .then(() => console.log('microtask 2'));

console.log('end');
// Output: start, end, microtask, microtask 2, timeout`
        },
        stepByStep: [
          'Synchronous logs run first: "start" then "end".',
          'The resolved Promise schedules microtasks that flush before the event loop continues.',
          'setTimeout schedules a macrotask that executes after microtasks are complete.'
        ],
        realWorldUseCase:
          'Debugging React state updates or async data fetching pipelines relies on mental models of the event loop and microtask queue.',
        commonMistakes: [
          'Assuming async/await blocks the thread — it simply sugar coats Promises.',
          'Mixing var and let in the same scope leading to unexpected hoisting behavior.',
          'Forgetting to handle Promise rejections, causing unhandled rejection warnings.'
        ],
        interviewQuestions: [
          'Walk through how the event loop executes a mix of synchronous code, Promises, and setTimeout.',
          'Demonstrate how you would clone an object deeply vs shallow copy.',
          'Explain why const does not make objects immutable.'
        ],
        keyTakeaways: [
          'Prefer let/const for predictable scoping and avoid var in modern code.',
          'Microtasks (Promises) flush before macrotasks (timeouts, IO).',
          'Destructuring and spread/rest operators reduce boilerplate and clarify intent.'
        ],
        quickLinks: [
          { label: 'Jake Archibald: In The Loop', url: 'https://www.youtube.com/watch?v=cCOL7MC4Pl0' },
          { label: 'MDN: Promise microtask queue', url: 'https://developer.mozilla.org/en-US/docs/Web/API/HTML_DOM_API/Microtask_guide' }
        ]
      },
      {
        id: 'accessibility',
        title: 'Accessibility & ARIA Fundamentals',
        seoTitle: 'Build Inclusive Interfaces with Semantic Roles and Keyboard Support',
        oneLiner: 'Accessibility ensures everyone can use your UI—often a first-round elimination topic.',
        importance:
          'Companies expect you to ship features usable with screen readers, keyboards, and assistive technology. Understanding ARIA complements semantic HTML.',
        commonQuestions: [
          'When do you use role="button" vs a native <button>?',
          'How do you make custom components keyboard navigable?',
          'Explain the difference between aria-label, aria-labelledby, and aria-describedby.'
        ],
        conceptDescription: [
          'Use native controls (<button>, <a>, <input>) whenever possible—they have built-in accessibility behavior.',
          'ARIA should only enhance semantics (ARIA: Accessible Rich Internet Applications). Use roles, states, and properties when native semantics are insufficient.',
          'Keyboard support (tabindex, Enter/Space handlers) is mandatory for custom interactive elements.'
        ],
        codeExample: {
          language: 'HTML',
          caption: 'Accessible custom toggle button with ARIA',
          snippet: `<button
  id="theme-toggle"
  class="theme-toggle"
  role="switch"
  aria-checked="false"
>
  Dark mode
</button>

<script>
  const toggle = document.getElementById('theme-toggle');
  toggle.addEventListener('click', () => {
    const enabled = toggle.getAttribute('aria-checked') === 'true';
    toggle.setAttribute('aria-checked', String(!enabled));
    document.documentElement.classList.toggle('dark', !enabled);
  });
</script>`
        },
        stepByStep: [
          'Native <button> control is used—no need for role="button". switch role clarifies toggle behavior to assistive tech.',
          'aria-checked communicates state (on/off) to screen readers.',
          'Keyboard activation is automatically handled by the <button>; custom elements would require adding keyup/keydown handlers.'
        ],
        realWorldUseCase:
          'Toggle dark mode or feature flags via accessible switches so that keyboard and screen-reader users can participate in experiments.',
        commonMistakes: [
          'Using <div role="button"> without adding keyboard handlers or focus styles.',
          'Misusing aria-hidden on interactive elements, hiding them from screen readers.',
          'Forgetting to update aria- attributes when state changes.'
        ],
        interviewQuestions: [
          'How do you make a non-button element act like a button for assistive tech?',
          'Describe the difference between aria-label and aria-labelledby.',
          'What does tabindex=-1 do? When is it appropriate?'
        ],
        keyTakeaways: [
          'Prefer semantic HTML; ARIA augments semantics when necessary.',
          'Ensure focus management and keyboard support for all interactive UI.',
          'Screen readers rely on accurate states (aria-checked, aria-expanded) to communicate state transitions.'
        ],
        quickLinks: [
          { label: 'ARIA Authoring Practices Guide', url: 'https://www.w3.org/WAI/ARIA/apg/' },
          { label: 'WebAIM Keyboard Accessibility', url: 'https://webaim.org/techniques/keyboard/' }
        ]
      },
      {
        id: 'forms-validation',
        title: 'HTML Forms & Native Validation',
        seoTitle: 'Upgrade Forms with HTML5 Validation and Accessible Error Messaging',
        oneLiner: 'Native form validation reduces JavaScript bugs and improves UX from day one.',
        importance:
          'Many interview exercises include login/signup forms. Showing you know native validation attributes shows attention to detail.',
        commonQuestions: [
          'How would you validate email/number inputs without JavaScript?',
          'Explain the purpose of required, pattern, and inputmode.',
          'How can you connect custom error messages to form fields?'
        ],
        conceptDescription: [
          'HTML5 inputs include built-in types (email, number, url, date) with browser-level validation.',
          'Attributes like required, min, max, minlength, pattern reduce custom JS.',
          'Constraint Validation API (checkValidity, reportValidity, validity object) provides programmatic control.'
        ],
        codeExample: {
          language: 'HTML',
          caption: 'Native validation with custom error messaging',
          snippet: `<form id="signup" novalidate>
  <label>
    Email
    <input type="email" name="email" required aria-describedby="email-error" />
  </label>
  <span id="email-error" role="alert" class="error" hidden></span>
  <button type="submit">Create account</button>
</form>

<script>
  const form = document.getElementById('signup');
  const email = form.elements.email;
  const errorEl = document.getElementById('email-error');

  form.addEventListener('submit', (event) => {
    if (!email.checkValidity()) {
      event.preventDefault();
      errorEl.textContent = email.validationMessage;
      errorEl.hidden = false;
      email.focus();
    }
  });
</script>`
        },
        stepByStep: [
          'type="email" and required trigger browser validation when the form is submitted.',
          'aria-describedby associates the error message with the input for screen readers.',
          'Using checkValidity prevents submission and shows validationMessage in a custom styled span.'
        ],
        realWorldUseCase:
          'Signup, subscription, or checkout flows where early validation feedback reduces drop-off.',
        commonMistakes: [
          'Using JS regex when pattern attribute would suffice.',
          'Not adding novalidate when you need full custom control (prevent double messaging).',
          'Forgetting to expose error messages to assistive tech (role="alert" or aria-live).'
        ],
        interviewQuestions: [
          'How does the Constraint Validation API help with forms?',
          'What’s inputmode used for on mobile devices?',
          'Explain how you would handle synchronous vs asynchronous validation (e.g., username availability).'
        ],
        keyTakeaways: [
          'Native validation covers many scenarios with minimal code.',
          'Accessibility requires linking errors to inputs and providing focus management.',
          'Use Constraint Validation API for programmatic checks and custom UX.'
        ],
        quickLinks: [
          { label: 'MDN: Form validation', url: 'https://developer.mozilla.org/en-US/docs/Learn/Forms/Form_validation' },
          { label: 'WebAIM: Forms and errors', url: 'https://webaim.org/techniques/forms/' }
        ]
      },
      {
        id: 'seo-basics',
        title: 'SEO Basics for Frontend Engineers',
        seoTitle: 'Meta Tags, Headings & Structured Content That Rank',
        oneLiner: 'SEO-ready markup improves discoverability and is often evaluated in landing-page interviews.',
        importance:
          'Even modern SPAs need strong meta tags, canonical links, and heading hierarchy to avoid search penalties.',
        commonQuestions: [
          'Which meta tags are critical for SEO and social sharing?',
          'How do you structure headings (<h1>-<h6>) on complex pages?',
          'Explain breadcrumbs or structured data markup usage.'
        ],
        conceptDescription: [
          'Use <title>, meta description, and Open Graph tags to control SERP and social previews.',
          'Maintain a logical headings outline starting with a single <h1> per page.',
          'Add canonical URLs to prevent duplicate content issues in multi-route SPAs.'
        ],
        codeExample: {
          language: 'HTML',
          caption: 'Essential head tags for SEO and social share',
          snippet: `<head>
  <title>MockAce Frontend Interview Prep</title>
  <meta name="description" content="Curated frontend interview resources for every experience level." />
  <link rel="canonical" href="https://mockace.com/frontend-resources" />

  <!-- Open Graph / social -->
  <meta property="og:title" content="MockAce Frontend Interview Prep" />
  <meta property="og:description" content="Practice modules, mock interviews, and deep dives." />
  <meta property="og:image" content="https://mockace.com/og-cover.png" />
  <meta property="og:type" content="website" />
</head>`
        },
        stepByStep: [
          '<title> is the primary page title in SERPs; keep it concise and descriptive.',
          'Meta description influences search snippets but not ranking—use compelling copy.',
          'Open Graph tags control preview cards in Slack, LinkedIn, etc., increasing click-through.',
          'Canonical URL ensures search engines treat the page as authoritative even if multiple routes exist.'
        ],
        realWorldUseCase:
          'Marketing teams rely on accurate meta tags to drive organic traffic; failing to set them can drop conversions drastically.',
        commonMistakes: [
          'Multiple <h1> elements break heading semantics.',
          'Missing canonical tags leading to duplicate content penalties.',
          'Large SPAs lacking SSR fallback, causing search bots to index blank pages.'
        ],
        interviewQuestions: [
          'Which meta tags do you always include for a marketing landing page?',
          'How does Next.js improve SEO out of the box compared to client-only SPAs?',
          'Explain how you would support dynamic OG tags per route.'
        ],
        keyTakeaways: [
          'SEO basics are part of frontend engineering responsibilities.',
          'Meta tags + proper heading structure provide immediate SEO wins.',
          'Canonical URLs and social meta tags improve user acquisition metrics.'
        ],
        quickLinks: [
          { label: 'Google Search Central: SEO Starter Guide', url: 'https://developers.google.com/search/docs/fundamentals/seo-starter-guide' },
          { label: 'Open Graph Protocol', url: 'https://ogp.me/' }
        ]
      },
      {
        id: 'display-basics',
        title: 'Display Types: Block, Inline, Inline-Block',
        seoTitle: 'Demystifying Block vs Inline vs Inline-Block Elements',
        oneLiner: 'Understanding display behaviors is essential for layout and debugging.',
        importance:
          'Interviewers love asking debugging or layout questions where display values cause spacing glitches.',
        commonQuestions: [
          'What’s the difference between display: inline and display: inline-block?',
          'Why might margins collapse and how do you prevent it?',
          'How do block-level elements behave compared to inline elements?'
        ],
        conceptDescription: [
          'Block elements occupy the full width available and start on a new line.',
          'Inline elements flow with text and respect only horizontal padding/margins.',
          'Inline-block elements combine inline flow with block-level box model support.'
        ],
        codeExample: {
          language: 'CSS',
          caption: 'Comparing display values',
          snippet: `.block-example {
  display: block;
  width: 200px;
  margin: 0 auto;
}

.inline-example span {
  display: inline;
  padding: 0 8px;
}

.badge {
  display: inline-block;
  padding: 4px 12px;
  background: #4C1D95;
  color: white;
  border-radius: 9999px;
}`
        },
        stepByStep: [
          'display: block elements expand to the container width and accept vertical margins.',
          'display: inline elements follow text flow; vertical padding does not affect line height by default.',
          'display: inline-block allows precise sizing while staying inline with text.'
        ],
        realWorldUseCase:
          'Badges, buttons, and nav items often use inline-block to combine text flow with custom sizing.',
        commonMistakes: [
          'Expecting inline elements to respect width/height.',
          'Forgetting to remove whitespace between inline-block elements (e.g., using font-size:0 or comments).',
          'Misinterpreting margin collapse between block elements.'
        ],
        interviewQuestions: [
          'How would you vertically center inline text next to an icon?',
          'Explain margin collapsing and when it occurs.',
          'Difference between visibility:hidden and display:none?'
        ],
        keyTakeaways: [
          'Choose block for full-width structural elements, inline for text flow, inline-block for hybrid use cases.',
          'Margin collapsing affects block-level elements; knowledge helps debug spacing issues.',
          'Whitespace between inline-block elements can create unexpected gaps.'
        ],
        quickLinks: [
          { label: 'MDN: display property', url: 'https://developer.mozilla.org/en-US/docs/Web/CSS/display' },
          { label: 'CSS Tricks: Inline vs Inline-block', url: 'https://css-tricks.com/inline-blocks/' }
        ]
      },
      {
        id: 'canvas-svg',
        title: 'Canvas & SVG Essentials',
        seoTitle: 'Canvas vs SVG — Rendering Graphics in Modern Frontends',
        oneLiner: 'Rendering charts, signatures, or complex illustrations requires knowing when to use Canvas vs SVG.',
        importance:
          'Even junior roles might ask how you render data visualizations; the best engineers know trade-offs.',
        commonQuestions: [
          'When would you choose Canvas over SVG?',
          'How do you animate SVG shapes?',
          'Explain hit detection differences between Canvas and SVG.'
        ],
        conceptDescription: [
          'SVG is vector-based, resolution independent, and part of the DOM; great for icons, logos, and interactive charts.',
          'Canvas provides immediate-mode bitmap rendering, ideal for dynamic pixel manipulation, games, or large datasets.',
          'SVG elements support CSS styling and DOM events; Canvas requires manual redraws and event math.'
        ],
        codeExample: {
          language: 'HTML',
          caption: 'Rendering the same shape via SVG and Canvas',
          snippet: `<div class="viz">
  <svg width="140" height="140" aria-label="SVG circle">
    <circle cx="70" cy="70" r="45" fill="#4C1D95" />
  </svg>

  <canvas id="circle-canvas" width="140" height="140" aria-label="Canvas circle"></canvas>
</div>

<script>
  const ctx = document.getElementById('circle-canvas').getContext('2d');
  ctx.fillStyle = '#4C1D95';
  ctx.beginPath();
  ctx.arc(70, 70, 45, 0, Math.PI * 2);
  ctx.fill();
</script>`
        },
        stepByStep: [
          'SVG nodes exist in the DOM; you can target and animate them with CSS or SMIL.',
          'Canvas draws pixels to a bitmap; updating visuals requires manually redrawing each frame.',
          'SVG scales without losing fidelity, while Canvas output can pixelate when scaled.'
        ],
        realWorldUseCase:
          'Use SVG for interactive charts or icons (e.g., D3, icon systems) and Canvas for signature pads, games, or large particle systems.',
        commonMistakes: [
          'Expecting Canvas-drawn shapes to expose DOM events without custom hit testing.',
          'Animating thousands of SVG nodes when Canvas or WebGL would perform better.',
          'Using Canvas for logos that must remain crisp at any resolution.'
        ],
        interviewQuestions: [
          'How would you animate an SVG path draw-on effect?',
          'Explain hit detection differences between Canvas and SVG.',
          'How do you export Canvas drawings or make them accessible?'
        ],
        keyTakeaways: [
          'SVG offers semantic, accessible, resolution-independent graphics tied to the DOM.',
          'Canvas excels at high-performance, pixel-based rendering but needs manual interaction handling.',
          'Choose based on interactivity, scalability, and performance requirements.'
        ],
        quickLinks: [
          { label: 'MDN: Canvas', url: 'https://developer.mozilla.org/en-US/docs/Web/API/Canvas_API' },
          { label: 'MDN: SVG', url: 'https://developer.mozilla.org/en-US/docs/Web/SVG' }
        ]
      },
      {
        id: 'css-selectors-specificity',
        title: 'CSS Selectors & Specificity',
        seoTitle: 'Mastering CSS Selectors, Specificity, and the Cascade',
        oneLiner: 'Controlling selector specificity prevents overrides from spiraling out of control.',
        importance:
          'Interviewers want to know you understand why styles override each other, especially in large codebases.',
        commonQuestions: [
          'Order these selectors by specificity: .cta, button.cta, #hero .cta button?',
          'How do inline styles compare in specificity vs important?',
          'What strategies keep specificity manageable?'
        ],
        conceptDescription: [
          'Specificity is calculated from selector components: inline styles > IDs > classes/attributes > elements.',
          'Source order matters when specificity ties; later declarations win.',
          'Avoid the !important crutch—refactor selectors or use utility classes instead.'
        ],
        codeExample: {
          language: 'CSS',
          caption: 'Comparing specificity scores',
          snippet: `/* 0-1-0 */
#hero button {
  background: #4C1D95;
}

/* 0-0-2 */
.cta.primary {
  background: #6366F1;
}

<!-- inline style wins -->
<button class="cta primary" style="background:#EC4899">Book</button>`
        },
        stepByStep: [
          'Compute specificity as (a, b, c): IDs, classes/attributes/pseudo-classes, elements/pseudo-elements.',
          'Use browser devtools to inspect which rule wins and why.',
          'Adopt naming conventions (BEM, utilities) to keep selectors shallow and predictable.'
        ],
        realWorldUseCase:
          'When migrating legacy CSS to a design system you must tame specificity to avoid regressions.',
        commonMistakes: [
          'Chaining IDs and classes leading to overly specific rules.',
          'Sprinkling !important everywhere instead of fixing selector strategy.',
          'Depending on DOM structure (e.g., .card ul li a) that breaks with markup changes.'
        ],
        interviewQuestions: [
          'How would you reset specificity that has grown too high?',
          'Explain CSS cascade layers and how they interact with specificity.',
          'What debugging steps do you take when a style is not applied?'
        ],
        keyTakeaways: [
          'Specificity determines which rule wins when selectors conflict.',
          'Prefer shallow, consistent selectors and avoid !important whenever possible.',
          'Understanding cascade layers, specificity, and source order keeps large stylesheets maintainable.'
        ],
        quickLinks: [
          { label: 'MDN: Specificity', url: 'https://developer.mozilla.org/en-US/docs/Web/CSS/Specificity' },
          { label: 'CSS-Tricks: Specifics on CSS Specificity', url: 'https://css-tricks.com/specifics-on-css-specificity/' }
        ]
      },
      {
        id: 'css-box-model',
        title: 'CSS Box Model Deep Dive',
        seoTitle: 'Margins, Borders, Padding, and Content Dimensions Explained',
        oneLiner: 'Mastering the box model prevents layout glitches and scrollbars.',
        importance:
          'Every layout issue ties back to how the browser sizes boxes; interviews test your mental model.',
        commonQuestions: [
          'What does box-sizing: border-box do?',
          'Why do margins collapse and when?',
          'How do you center a block element horizontally?'
        ],
        conceptDescription: [
          'The box model includes content, padding, border, and margin; width/height target the content box by default.',
          'box-sizing: border-box makes width/height include padding and border, simplifying responsive layouts.',
          'Vertical margin collapse occurs between block elements; padding or borders prevent it.'
        ],
        codeExample: {
          language: 'CSS',
          caption: 'Comparing content-box vs border-box sizing',
          snippet: `.card {
  width: 320px;
  padding: 24px;
  border: 2px solid rgba(99,102,241,0.45);
  margin: 16px auto;
}

.card.border-box {
  box-sizing: border-box; /* total width stays 320px */
}

.card.content-box {
  box-sizing: content-box; /* total width expands by padding + border */
}`
        },
        stepByStep: [
          'Set box-sizing: border-box globally for predictable sizing.',
          'Use padding for internal spacing; use margin to separate siblings.',
          'Debug layout issues by temporarily adding outline: 1px solid red to visualize box boundaries.'
        ],
        realWorldUseCase:
          'Design systems rely on consistent spacing tokens; correct box-model usage keeps cards, modals, and inputs aligned.',
        commonMistakes: [
          'Mixing content-box and border-box components leading to misaligned grids.',
          'Relying on margin for internal spacing, shrinking interactive hit targets.',
          'Ignoring margin collapse which causes unexpected overlaps in stacked sections.'
        ],
        interviewQuestions: [
          'How do you prevent margin collapse in vertical stacks?',
          'Explain the difference between padding and margin regarding background painting.',
          'When might you use outline instead of border?'
        ],
        keyTakeaways: [
          'box-sizing: border-box is the modern default for layout sanity.',
          'Margins affect external spacing; padding affects internal spacing.',
          'Visual debugging makes box-model issues obvious and quick to fix.'
        ],
        quickLinks: [
          { label: 'MDN: Box model', url: 'https://developer.mozilla.org/en-US/docs/Learn/CSS/Building_blocks/The_box_model' },
          { label: 'Josh Comeau: Understand the Box Model', url: 'https://www.joshwcomeau.com/css/box-model/' }
        ]
      },
      {
        id: 'css-positioning',
        title: 'CSS Positioning Strategies',
        seoTitle: 'Static, Relative, Absolute, Fixed, and Sticky Positioning',
        oneLiner: 'Positioning modes unlock tooltips, sticky headers, and complex overlays.',
        importance:
          'Many UI bugs come from misunderstood positioning contexts, so interviewers probe these fundamentals.',
        commonQuestions: [
          'How does position: absolute determine its containing block?',
          'When should you prefer position: sticky over fixed?',
          'Explain stacking context and z-index issues.'
        ],
        conceptDescription: [
          'position: static is the default flow; relative offsets the element without removing it from flow.',
          'Absolute elements position themselves relative to the nearest ancestor with position other than static.',
          'Fixed anchors to the viewport; sticky toggles between relative and fixed once a scroll threshold is crossed.'
        ],
        codeExample: {
          language: 'CSS',
          caption: 'Sticky header with absolute tooltip',
          snippet: `.page-header {
  position: sticky;
  top: 0;
  background: rgba(15,23,42,0.85);
  backdrop-filter: blur(12px);
  z-index: 20;
}

.tooltip {
  position: relative;
}

.tooltip span {
  position: absolute;
  top: 100%;
  left: 50%;
  transform: translate(-50%, 10px);
  background: #111827;
  color: white;
  padding: 8px 12px;
  border-radius: 8px;
  white-space: nowrap;
}`
        },
        stepByStep: [
          'Create positioning context by setting position: relative on parent containers.',
          'Use sticky for elements that should remain in flow but stick after scrolling a threshold.',
          'Keep an eye on stacking contexts created by transforms, filters, and opacity.'
        ],
        realWorldUseCase:
          'Dropdowns, modals, and sticky navigation bars all depend on precise positioning behavior.',
        commonMistakes: [
          'Forgetting to position the parent, so absolutely positioned children anchor to the document body.',
          'Using fixed when sticky would be more user-friendly on long-scrolling content.',
          'Relying solely on z-index without understanding stacking context rules.'
        ],
        interviewQuestions: [
          'How would you center an absolute element within its parent?',
          'Describe how position: sticky behaves inside overflow-hidden containers.',
          'Why might z-index: 9999 still not bring an element to the front?'
        ],
        keyTakeaways: [
          'Choose the positioning mode based on desired scroll and flow behavior.',
          'Sticky is ideal for headers or in-table labels that should stay visible.',
          'Stacking context nuances explain most z-index bugs.'
        ],
        quickLinks: [
          { label: 'MDN: position', url: 'https://developer.mozilla.org/en-US/docs/Web/CSS/position' },
          { label: 'CSS-Tricks: Sticky Positioning', url: 'https://css-tricks.com/how-nested-position-sticky-elements-are-misunderstood/' }
        ]
      },
      {
        id: 'css-flexbox-grid',
        title: 'Flexbox vs CSS Grid Layouts',
        seoTitle: 'Choosing Flexbox or Grid for Responsive Interfaces',
        oneLiner: 'Flexbox excels at one-dimensional layouts, Grid shines for two-dimensional designs.',
        importance:
          'Layout questions are common in interviews; knowing when to reach for each tool matters.',
        commonQuestions: [
          'When do you pick Grid over Flexbox?',
          'How do you create equal-height cards with Flexbox?',
          'Explain implicit vs explicit grid tracks.'
        ],
        conceptDescription: [
          'Flexbox lays out items along a primary axis, perfect for nav bars, toolbars, and form rows.',
          'Grid defines rows and columns simultaneously, ideal for dashboards or galleries.',
          'Both support gap, alignment, and responsive reordering through media queries or auto-placement.'
        ],
        codeExample: {
          language: 'CSS',
          caption: 'Responsive cards with CSS Grid and Flexbox fallback',
          snippet: `.card-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(240px, 1fr));
  gap: 1.5rem;
}

@supports not (display: grid) {
  .card-grid {
    display: flex;
    flex-wrap: wrap;
    gap: 1.5rem;
  }
  .card-grid > * {
    flex: 1 1 240px;
  }
}`
        },
        stepByStep: [
          'Use minmax with auto-fit/auto-fill for fluid Grid layouts without hard breakpoints.',
          'Provide graceful degradation using @supports to fall back to Flexbox when needed.',
          'Apply justify-content / align-items (Flexbox) or justify-items / align-content (Grid) to control alignment.'
        ],
        realWorldUseCase:
          'Marketing landing pages use Flexbox for hero layouts, while analytics dashboards lean on Grid for complex data cards.',
        commonMistakes: [
          'Overusing Flexbox for two-dimensional layouts leading to brittle nested structures.',
          'Ignoring that flex items shrink by default, causing squished controls.',
          'Not defining explicit grid tracks, leaving auto-placement to create unpredictable layouts.'
        ],
        interviewQuestions: [
          'How do you maintain equal column widths and gutters across breakpoints?',
          'Explain the difference between auto-fit and auto-fill in Grid.',
          'How would you center a login form vertically using Flexbox?'
        ],
        keyTakeaways: [
          'Flexbox handles one-dimensional flows; Grid handles two-dimensional arrangements.',
          'The gap property works in both layout systems, reducing the need for margin hacks.',
          'Combining both tools delivers resilient, responsive interfaces.'
        ],
        quickLinks: [
          { label: 'Flexbox Froggy', url: 'https://flexboxfroggy.com/' },
          { label: 'Grid Garden', url: 'https://cssgridgarden.com/' }
        ]
      },
      {
        id: 'responsive-design',
        title: 'Responsive Design & Media Queries',
        seoTitle: 'Mobile-First Workflows with Media Queries and Fluid Layouts',
        oneLiner: 'Responsive design ensures your UI adapts across devices and viewports.',
        importance:
          'Most interviews include responsive requirements; failing this is a red flag for frontend engineers.',
        commonQuestions: [
          'What is mobile-first CSS and why is it preferable?',
          'How do you handle responsive typography?',
          'Explain container queries and when they help over media queries.'
        ],
        conceptDescription: [
          'Start with mobile styles (no media query) and layer enhancements for larger screens.',
          'Use fluid units (%, vw, clamp) for typography and spacing to reduce breakpoint count.',
          'Combine responsive images (srcset, sizes) with CSS for performance-conscious design.'
        ],
        codeExample: {
          language: 'CSS',
          caption: 'Mobile-first layout with fluid typography',
          snippet: `.layout {
  display: flex;
  flex-direction: column;
  gap: 1.5rem;
}

@media (min-width: 768px) {
  .layout {
    flex-direction: row;
  }
}

.heading {
  font-size: clamp(1.75rem, 2vw + 1rem, 2.75rem);
}`
        },
        stepByStep: [
          'Define base mobile styles; add min-width media queries where the layout breaks.',
          'Use clamp/min/max for fluid typography and spacing tokens.',
          'Test across devices and leverage devtools device emulators—responsive design is about UX, not just layout.'
        ],
        realWorldUseCase:
          'Booking flows, marketing pages, and dashboards must work on phones, tablets, and desktops to retain users.',
        commonMistakes: [
          'Using desktop-first CSS then overriding everything for mobile.',
          'Choosing device-specific breakpoints instead of content-driven thresholds.',
          'Ignoring responsive image techniques, leading to slow mobile experiences.'
        ],
        interviewQuestions: [
          'How do you test responsiveness quickly in the browser?',
          'Explain the purpose of the viewport meta tag.',
          'What is the sizes attribute in responsive images used for?'
        ],
        keyTakeaways: [
          'Mobile-first CSS reduces override complexity.',
          'Fluid typography and responsive images improve usability across devices.',
          'Content-driven breakpoints lead to resilient responsive layouts.'
        ],
        quickLinks: [
          { label: 'MDN: Using Media Queries', url: 'https://developer.mozilla.org/en-US/docs/Web/CSS/Media_Queries/Using_media_queries' },
          { label: 'Every Layout', url: 'https://every-layout.dev/' }
        ]
      },
      {
        id: 'css-animations',
        title: 'CSS Transitions, Animations, and Transforms',
        seoTitle: 'Craft Delightful Motion with CSS Transitions and Keyframes',
        oneLiner: 'Micro-interactions improve UX when you understand CSS animation primitives.',
        importance:
          'Animation questions test whether you can communicate state changes and feedback through motion.',
        commonQuestions: [
          'How do transitions differ from animations?',
          'Which CSS properties are safe to animate for performance?',
          'Explain how to orchestrate staggered animations.'
        ],
        conceptDescription: [
          'Transitions animate property changes triggered by events (hover, focus, JS class toggles).',
          'Animations run keyframes autonomously, useful for looping or sequenced motion.',
          'Use transform and opacity for GPU-accelerated motion; avoid animating layout properties when possible.'
        ],
        codeExample: {
          language: 'CSS',
          caption: 'Button hover transition and keyframe pulse',
          snippet: `.cta-button {
  display: inline-flex;
  align-items: center;
  gap: 0.5rem;
  padding: 0.9rem 1.6rem;
  background: linear-gradient(135deg, #6366F1, #8B5CF6);
  color: white;
  border-radius: 9999px;
  transition: transform 200ms ease, box-shadow 200ms ease;
}

.cta-button:hover {
  transform: translateY(-2px) scale(1.02);
  box-shadow: 0 12px 30px rgba(99, 102, 241, 0.35);
}

.cta-button--pulse {
  animation: pulse 2.4s ease-in-out infinite;
}

@keyframes pulse {
  0%, 100% { box-shadow: 0 0 0 0 rgba(99,102,241,0.45); }
  50% { box-shadow: 0 0 0 20px rgba(99,102,241,0); }
}`
        },
        stepByStep: [
          'Use transition for lightweight state changes triggered by hover/focus.',
          'Reach for keyframes when you need looping, sequencing, or more complex easing.',
          'Prefer transform/opacity for smooth performance; respect prefers-reduced-motion for accessibility.'
        ],
        realWorldUseCase:
          'Modals, dropdowns, and skeleton loaders rely on subtle animations to convey state transitions.',
        commonMistakes: [
          'Animating layout properties (top, left, width) causing layout thrash.',
          'Ignoring prefers-reduced-motion, leading to accessibility issues.',
          'Running too many simultaneous animations without staggering.'
        ],
        interviewQuestions: [
          'How do you disable or reduce animations for users with motion sensitivity?',
          'What does animation-fill-mode: forwards do?',
          'How would you coordinate animation sequences between parent and child elements?'
        ],
        keyTakeaways: [
          'Transitions and animations have distinct use cases; choose based on state vs timeline control.',
          'Transform and opacity animations are the most performant.',
          'Accessibility requires honoring user motion preferences.'
        ],
        quickLinks: [
          { label: 'MDN: Using CSS transitions', url: 'https://developer.mozilla.org/en-US/docs/Web/CSS/CSS_transitions/Using_CSS_transitions' },
          { label: 'Web.dev: Animation Performance', url: 'https://web.dev/animations-guide/' }
        ]
      },
      {
        id: 'css-pseudo',
        title: 'Pseudo-classes and Pseudo-elements',
        seoTitle: 'Enhance Interactions with CSS Pseudo-classes and Pseudo-elements',
        oneLiner: 'Pseudo selectors let you style element states and generate content without additional markup.',
        importance:
          'Interview take-home tasks expect accessible focus states and custom list styles achieved via pseudo selectors.',
        commonQuestions: [
          'Difference between pseudo-class and pseudo-element?',
          'How do you style focus without affecting mouse interaction?',
          'How can you create custom list bullets without extra markup?'
        ],
        conceptDescription: [
          'Pseudo-classes (:hover, :focus-visible, :nth-child) target element states or positions in the DOM.',
          'Pseudo-elements (::before, ::after, ::marker) create virtual elements for decoration or structure.',
          'Accessible styling uses :focus-visible and :focus-within to indicate keyboard focus clearly.'
        ],
        codeExample: {
          language: 'CSS',
          caption: 'Accessible focus underline and custom markers',
          snippet: `.nav-link {
  position: relative;
  padding: 0.5rem 0.75rem;
}

.nav-link::after {
  content: '';
  position: absolute;
  left: 0;
  bottom: 0;
  width: 100%;
  height: 2px;
  transform: scaleX(0);
  transform-origin: left;
  transition: transform 180ms ease;
  background: currentColor;
}

.nav-link:hover::after,
.nav-link:focus-visible::after {
  transform: scaleX(1);
}

ul.highlighted li::marker {
  color: #8B5CF6;
  font-weight: 600;
}`
        },
        stepByStep: [
          'Use :focus-visible to show focus styles only for keyboard/tab interactions.',
          'Create decorative elements with ::before/::after instead of extra DOM nodes.',
          'Target repeating patterns using structural pseudo-classes like :nth-child.'
        ],
        realWorldUseCase:
          'Navigation menus, alerts, and timelines rely on pseudo selectors for interaction and decoration.',
        commonMistakes: [
          'Removing outlines without providing an accessible alternative.',
          'Forgetting to define content for pseudo-elements, resulting in nothing rendering.',
          'Overusing :nth-child leading to brittle selectors tied to DOM order.'
        ],
        interviewQuestions: [
          'How does :focus-visible differ from :focus?',
          'How would you style every third card differently without additional classes?',
          'What pseudo-element can replace custom bullet icons?'
        ],
        keyTakeaways: [
          'Pseudo-classes capture dynamic element states; pseudo-elements create extra decoration layers.',
          'Accessible focus styling is a must for keyboard navigation.',
          'Nth-child selectors enable powerful patterns when used carefully.'
        ],
        quickLinks: [
          { label: 'MDN: Pseudo-classes', url: 'https://developer.mozilla.org/en-US/docs/Web/CSS/Pseudo-classes' },
          { label: 'MDN: Pseudo-elements', url: 'https://developer.mozilla.org/en-US/docs/Web/CSS/Pseudo-elements' }
        ]
      },
      {
        id: 'css-variables-preprocessors',
        title: 'CSS Variables & Preprocessors',
        seoTitle: 'Design Tokens with CSS Custom Properties and Preprocessors',
        oneLiner: 'Combine CSS custom properties with preprocessors to scale design tokens.',
        importance:
          'Design systems and theming rely on variables—knowing runtime (CSS var) and build-time (SASS) approaches is critical.',
        commonQuestions: [
          'When would you choose CSS variables over SASS variables?',
          'How do you theme an application dynamically?',
          'Explain scope differences for custom properties.'
        ],
        conceptDescription: [
          'CSS custom properties (--color-primary) live in the DOM, can be updated at runtime, and inherit.',
          'Preprocessor variables (e.g., $color-primary) are resolved at build time, enabling loops, mixins, and conditionals.',
          'Combine both: preprocessors generate structured CSS while custom properties handle runtime theming.'
        ],
        codeExample: {
          language: 'CSS',
          caption: 'Using CSS variables with SASS helpers',
          snippet: `:root {
  --color-primary: #6366F1;
  --spacing-lg: 2.5rem;
}

.dark-theme {
  --color-primary: #A855F7;
}

.button {
  $shadow-color: rgba(99, 102, 241, 0.35);
  background: var(--color-primary, #6366F1);
  padding: var(--spacing-lg, 2rem);
  box-shadow: 0 12px 28px $shadow-color;
}`
        },
        stepByStep: [
          'Define global tokens as CSS custom properties on :root.',
          'Override tokens within .light-theme/.dark-theme containers for theming.',
          'Use preprocessors for mixins and loops that output CSS utilizing those tokens.'
        ],
        realWorldUseCase:
          'Theme toggles, customer branding, and white-label products depend on runtime adjustable properties.',
        commonMistakes: [
          'Expecting SASS variables to update at runtime—they are compile-time only.',
          'Forgetting custom properties inherit, resulting in unintended overrides deep in the DOM.',
          'Overnesting in preprocessors, generating overly specific selectors.'
        ],
        interviewQuestions: [
          'How do you polyfill CSS variables for older browsers?',
          'Explain the difference between var(--token, fallback) vs preprocessor defaults.',
          'How would you apply dark mode purely with CSS variables?'
        ],
        keyTakeaways: [
          'CSS custom properties enable dynamic theming; preprocessors provide authoring ergonomics.',
          'Custom properties inherit and can be changed at runtime via class toggles or JS.',
          'Use both tools together to scale design systems responsibly.'
        ],
        quickLinks: [
          { label: 'MDN: Using CSS custom properties', url: 'https://developer.mozilla.org/en-US/docs/Web/CSS/Using_CSS_custom_properties' },
          { label: 'Sass Official Guide', url: 'https://sass-lang.com/guide' }
        ]
      },
      {
        id: 'css-architecture',
        title: 'CSS Architecture & Methodologies',
        seoTitle: 'BEM, Utility-First, and Scalable CSS Architectures',
        oneLiner: 'A consistent architecture keeps styles maintainable as teams scale.',
        importance:
          'Interviewers assess whether you can prevent CSS from devolving into specificity wars on large teams.',
        commonQuestions: [
          'Compare BEM with utility-first approaches like Tailwind.',
          'How do you prevent global CSS collisions?',
          'Explain CSS Modules or scoped CSS techniques.'
        ],
        conceptDescription: [
          'BEM (Block__Element--Modifier) names classes to communicate structure and avoid collisions.',
          'Utility-first frameworks (Tailwind) provide single-purpose classes generated from design tokens.',
          'CSS Modules, scoped styles, and Shadow DOM encapsulate styles per component for isolation.'
        ],
        codeExample: {
          language: 'CSS',
          caption: 'Contrasting BEM and utility-first snippets',
          snippet: `/* BEM */
.card__header {
  padding: 1.25rem;
  border-bottom: 1px solid var(--app-card-border);
}

.card__header--highlighted {
  background: rgba(99,102,241,0.08);
}

<!-- Utility-first (Tailwind style) -->
<header class="p-5 border-b border-slate-200 bg-indigo-50/40">
  ...
</header>`
        },
        stepByStep: [
          'Pick an architecture that matches team size, tooling, and product needs.',
          'Document naming conventions and enforce them via lint rules or PR guidelines.',
          'Favor composition (mixins, utilities) instead of deep selector nesting to keep CSS readable.'
        ],
        realWorldUseCase:
          'Large companies (Shopify, Airbnb) rely on defined methodologies to scale styles across teams and products.',
        commonMistakes: [
          'Mixing multiple methodologies without guidance, creating duplicated patterns.',
          'Using deeply nested selectors tied to fragile markup structures.',
          'Ignoring documentation, forcing teammates to guess class semantics.'
        ],
        interviewQuestions: [
          'How would you migrate a legacy CSS codebase to a new architecture?',
          'What are the pros and cons of utility-first CSS for long-lived products?',
          'Explain how CSS Modules or CSS-in-JS enforce encapsulation.'
        ],
        keyTakeaways: [
          'Architecture choice impacts scalability, performance, and developer experience.',
          'BEM emphasizes readability and naming; utility-first emphasizes speed and consistency.',
          'Scoped solutions (Modules, CSS-in-JS) reduce conflicts but add tooling requirements.'
        ],
        quickLinks: [
          { label: 'BEM Methodology', url: 'https://en.bem.info/methodology/quick-start/' },
          { label: 'Tailwind CSS Philosophy', url: 'https://tailwindcss.com/docs/utility-first' }
        ]
      },
      {
        id: 'css-in-js',
        title: 'CSS-in-JS & Modern Styling Libraries',
        seoTitle: 'Styled Components, Emotion, and Runtime Styling Strategies',
        oneLiner: 'CSS-in-JS unlocks dynamic styling, co-location, and theming in component libraries.',
        importance:
          'React-heavy teams expect you to know trade-offs of Styled Components, Emotion, or CSS Modules.',
        commonQuestions: [
          'When would you choose CSS-in-JS over traditional stylesheets?',
          'How do theme providers work in Styled Components?',
          'Explain zero-runtime CSS-in-JS solutions such as Vanilla Extract or Linaria.'
        ],
        conceptDescription: [
          'CSS-in-JS co-locates styles with logic, generating scoped class names automatically.',
          'Libraries like Styled Components provide theming via React context and dynamic props.',
          'Modern solutions offer compile-time extraction to reduce runtime cost when needed.'
        ],
        codeExample: {
          language: 'TypeScript',
          caption: 'Styled Components with variant props',
          snippet: `import styled from 'styled-components';

const Button = styled.button<{ variant?: 'primary' | 'ghost' }>\`
  padding: 0.75rem 1.5rem;
  border-radius: 9999px;
  background: \${({ variant, theme }) =>
    variant === 'ghost' ? 'transparent' : theme.colors.primary};
  color: \${({ variant, theme }) =>
    variant === 'ghost' ? theme.colors.primary : theme.colors.onPrimary};
  border: 1px solid \${({ theme }) => theme.colors.primary};
\`;

export const CTAButton = () => (
  <Button variant="primary">Book Session</Button>
);`
        },
        stepByStep: [
          'Wrap your app with ThemeProvider to expose shared design tokens.',
          'Use component props to toggle variants rather than duplicating styled definitions.',
          'Evaluate runtime vs compile-time libraries based on performance and DX needs.'
        ],
        realWorldUseCase:
          'Design systems built for React (e.g., Atlassian, Shopify Polaris) lean on CSS-in-JS for themable component APIs.',
        commonMistakes: [
          'Generating dynamic styles per render without memoization, hurting performance.',
          'Forgetting to memoize theme objects, triggering unnecessary re-renders.',
          'Using CSS-in-JS for static marketing pages where plain CSS is simpler and faster.'
        ],
        interviewQuestions: [
          'How do you avoid specificity conflicts in CSS-in-JS?',
          'Explain how server-side rendering works with Styled Components.',
          'What trade-offs exist between runtime and compile-time CSS-in-JS libraries?'
        ],
        keyTakeaways: [
          'CSS-in-JS co-locates styles with components, simplifying theming and variants.',
          'Consider performance—runtime solutions add overhead, compile-time tools reduce it.',
          'SSR support and caching strategies are essential for production-grade CSS-in-JS.'
        ],
        quickLinks: [
          { label: 'Styled Components Docs', url: 'https://styled-components.com/docs' },
          { label: 'Emotion Documentation', url: 'https://emotion.sh/docs/introduction' }
        ]
      }
    ]
  },
  {
    id: 'javascript-es6-core',
    trackId: 'junior',
    title: 'JavaScript (ES6+) — Core Concepts',
    summary:
      'Strengthen your fundamentals in scope, async control flow, and modern syntax so you can tackle whiteboard and live-coding rounds confidently.',
    subtopics: [
      {
        id: 'js-variables-let-const-var',
        title: 'Variables: let, const, and var',
        seoTitle: 'Choosing Between let, const, and var in Modern JavaScript',
        oneLiner: 'Understand declaration keywords so your state behaves predictably.',
        importance:
          'Interviewers check if you know how scoping and reassignment differ between var, let, and const—critical when writing modular, bug-free code.',
        commonQuestions: [
          'When should you reach for const instead of let?',
          'How does var behave inside loops or conditionals?',
          'Can you reassign objects declared with const?'
        ],
        conceptDescription: [
          'let and const are block scoped, preventing accidental leakage outside loops or conditionals.',
          'const protects against reassignment but still allows object mutation; use it for values that should not be reassigned.',
          'var is function scoped and hoisted, which can introduce subtle bugs in asynchronous code.'
        ],
        codeExample: {
          language: 'JavaScript',
          caption: 'Block versus function scope with different declarations',
          snippet: `function demo() {
  if (true) {
    var legacy = 'var';
    let modern = 'let';
    const constant = 'const';
  }

  console.log(legacy); // "var"
  console.log(typeof modern); // ReferenceError
}

demo();`
        },
        stepByStep: [
          'var declarations are hoisted to the top of the function and remain accessible outside the block.',
          'let and const are confined to the block; accessing them before declaration triggers the temporal dead zone.',
          'Favor const for defaults, use let for values that must change, and avoid var in modern codebases.'
        ],
        realWorldUseCase:
          'React components rely on predictable scoping; using let/const prevents data leaks across renders or hooks.',
        commonMistakes: [
          'Using var in loops with asynchronous callbacks resulting in unexpected shared values.',
          'Misunderstanding that const only locks the binding, not the object contents.',
          'Redeclaring let within the same scope which throws a SyntaxError.'
        ],
        interviewQuestions: [
          'Why might a for loop with var log the same value for every iteration?',
          'How does the temporal dead zone affect let and const?',
          'When is it acceptable to use var in modern projects?'
        ],
        keyTakeaways: [
          'Prefer const by default, use let when reassignment is required.',
          'Avoid var to prevent function-scope leaks and hoisting surprises.',
          'Remember const does not freeze object contents—use Object.freeze for immutability.'
        ],
        quickLinks: [
          { label: 'MDN: let', url: 'https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Statements/let' },
          { label: 'MDN: var', url: 'https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Statements/var' }
        ]
      },
      {
        id: 'js-hoisting-scope',
        title: 'Hoisting and Scope Rules',
        seoTitle: 'Master Hoisting and Scope (Block vs Function) in JavaScript',
        oneLiner: 'Predict variable lifetime by understanding how the engine hoists declarations.',
        importance:
          'Whiteboard questions often expose bugs caused by hoisting and scope confusion—mastery here shows strong fundamentals.',
        commonQuestions: [
          'What gets hoisted and what does not?',
          'How do function declarations differ from function expressions when hoisted?',
          'Explain block scope versus function scope with examples.'
        ],
        conceptDescription: [
          'Hoisting conceptually moves declarations (not initializations) to the top of their scope.',
          'let/const reside in a temporal dead zone until execution reaches the declaration.',
          'Function declarations are hoisted fully, while function expressions follow variable hoisting rules.'
        ],
        codeExample: {
          language: 'JavaScript',
          caption: 'Temporal dead zone and hoisting behaviors',
          snippet: `console.log(typeof future); // ReferenceError
let future = 'ready';

console.log(oldSchool); // undefined
var oldSchool = 'legacy';

greet(); // "Hello!"
function greet() {
  console.log('Hello!');
}`
        },
        stepByStep: [
          'Accessing let or const before declaration throws because they are in the temporal dead zone.',
          'var declarations hoist but initialize to undefined, avoiding immediate crashes yet hiding bugs.',
          'Function declarations hoist completely, enabling calls before their definition.'
        ],
        realWorldUseCase:
          'Bundling tools may reorder code; understanding hoisting prevents initialization bugs in shared modules.',
        commonMistakes: [
          'Assuming hoisting applies to class expressions or arrow functions—they follow variable rules.',
          'Expecting let declarations to be available before their line of code.',
          'Using hoisting intentionally rather than writing clear, top-down declarations.'
        ],
        interviewQuestions: [
          'Why does typeof letVariable throw an error before declaration?',
          'How do you explain the temporal dead zone to a teammate?',
          'What is the difference between hoisting a function declaration and a function expression?'
        ],
        keyTakeaways: [
          'Only declarations hoist; initializations still happen in place.',
          'let and const live in a temporal dead zone before execution reaches them.',
          'Write declarations near their usage to avoid relying on hoisting quirks.'
        ],
        quickLinks: [
          { label: 'MDN: Hoisting', url: 'https://developer.mozilla.org/en-US/docs/Glossary/Hoisting' },
          { label: 'Explained Visually: Temporal Dead Zone', url: 'https://2ality.com/2015/10/const.html' }
        ]
      },
      {
        id: 'js-closures-lexical',
        title: 'Closures and Lexical Environments',
        seoTitle: 'Closures in JavaScript — Encapsulating State with Lexical Scope',
        oneLiner: 'Closures keep functions connected to the variables of their creation context.',
        importance:
          'Closures power React hooks, event handlers, and async logic—interviewers expect you to reason about them fluently.',
        commonQuestions: [
          'Define a closure in plain language.',
          'How do closures relate to memory usage?',
          'Show how closures help create private state.'
        ],
        conceptDescription: [
          'A closure forms when an inner function retains access to its outer lexical scope after the outer function returns.',
          'Lexical scoping means functions inherit scope based on where they are defined, not where they are invoked.',
          'Closures enable encapsulation, currying, and module patterns without classes.'
        ],
        codeExample: {
          language: 'JavaScript',
          caption: 'Creating a counter with private state via closure',
          snippet: `function createCounter() {
  let count = 0;
  return {
    increment: () => ++count,
    decrement: () => --count,
    reset: () => (count = 0)
  };
}

const counter = createCounter();
counter.increment(); // 1
console.log(counter.increment()); // 2
console.log(counter.count); // undefined (not exposed)`
        },
        stepByStep: [
          'createCounter executes once and initializes count.',
          'Returned functions keep a reference to count through the closure.',
          'Even after createCounter finishes, the enclosed functions share the preserved lexical environment.'
        ],
        realWorldUseCase:
          'React hooks rely on closures to preserve state across renders; custom hooks mimic this pattern.',
        commonMistakes: [
          'Using var in loops with async callbacks, causing all closures to share the final value.',
          'Leaking memory by retaining closures referencing large DOM nodes unnecessarily.',
          'Confusing closure scope (definition) with call-site scope (execution).'
        ],
        interviewQuestions: [
          'How would you explain closures to a non-JS engineer?',
          'Show how to fix a var-based loop where setTimeout logs the wrong index.',
          'What debugging steps help when a closure captures stale values?'
        ],
        keyTakeaways: [
          'Closures are functions remembering their creation scope.',
          'Use closures for encapsulation, memoization, and async callbacks.',
          'Beware of unintended captures leading to stale or oversized references.'
        ],
        quickLinks: [
          { label: 'MDN: Closures', url: 'https://developer.mozilla.org/en-US/docs/Web/JavaScript/Closures' },
          { label: 'Frontend Masters: JavaScript Scope & Closures', url: 'https://frontendmasters.com/courses/javascript-hard-parts-v2/' }
        ]
      },
      {
        id: 'js-event-loop',
        title: 'Event Loop, Microtasks, and Macrotasks',
        seoTitle: 'Demystifying the JavaScript Event Loop (Microtasks vs Macrotasks)',
        oneLiner: 'Predict async execution order to avoid race conditions and UI glitches.',
        importance:
          'Understanding scheduling is essential for debugging async bugs, React state updates, and performance.',
        commonQuestions: [
          'What is the difference between the microtask queue and macrotask queue?',
          'Why does Promise.then run before setTimeout?',
          'How does the call stack interact with the event loop?'
        ],
        conceptDescription: [
          'The call stack executes synchronous code; asynchronous callbacks queue for later execution.',
          'Microtasks (Promises, queueMicrotask) run immediately after the current call stack clears.',
          'Macrotasks (setTimeout, DOM events) run on each tick after microtasks complete.'
        ],
        codeExample: {
          language: 'JavaScript',
          caption: 'Execution order of sync code, microtasks, and macrotasks',
          snippet: `console.log('sync');

setTimeout(() => console.log('timeout'), 0);

Promise.resolve()
  .then(() => console.log('microtask 1'))
  .then(() => console.log('microtask 2'));

console.log('done');
// Output: "sync", "done", "microtask 1", "microtask 2", "timeout"`
        },
        stepByStep: [
          'Synchronous logs run first until the call stack empties.',
          'Resolved Promises queue microtasks that execute before any macrotask.',
          'The timeout callback executes afterward on the next event loop tick.'
        ],
        realWorldUseCase:
          'When coordinating UI updates and API responses, knowledge of task ordering prevents double renders or stale data.',
        commonMistakes: [
          'Assuming setTimeout with zero delay runs immediately.',
          'Forgetting that long microtask chains can starve the UI thread.',
          'Relying on event loop order instead of explicit control flow (await or queueMicrotask).'
        ],
        interviewQuestions: [
          'Explain why Promise.then runs before setTimeout.',
          'How would you schedule a callback after the browser paints?',
          'What tools help visualize the event loop when debugging?'
        ],
        keyTakeaways: [
          'Microtasks always run before macrotasks on the same tick.',
          'Use async/await to write readable event loop scheduling.',
          'Avoid blocking the call stack or flooding microtasks to keep UIs responsive.'
        ],
        quickLinks: [
          { label: 'Jake Archibald: In The Loop', url: 'https://www.youtube.com/watch?v=cCOL7MC4Pl0' },
          { label: 'MDN: Concurrency model and Event Loop', url: 'https://developer.mozilla.org/en-US/docs/Web/JavaScript/EventLoop' }
        ]
      },
      {
        id: 'js-promises-async-await',
        title: 'Promises and async/await',
        seoTitle: 'Master Promises and async/await for Asynchronous JavaScript',
        oneLiner: 'Structure async flows with Promises and async/await to keep code readable.',
        importance:
          'Most modern APIs return Promises; interviews evaluate how you chain, catch, and coordinate async operations.',
        commonQuestions: [
          'How do you handle errors in async/await?',
          'What is Promise.all versus Promise.allSettled?',
          'Show how to convert a callback API to Promises.'
        ],
        conceptDescription: [
          'Promises represent eventual completion or failure of asynchronous operations.',
          'async functions implicitly return Promises and allow await to pause execution until fulfillment.',
          'Promise utilities (all, race, allSettled, any) help coordinate parallel tasks.'
        ],
        codeExample: {
          language: 'JavaScript',
          caption: 'Fetching data with async/await and error handling',
          snippet: `async function loadProfile(userId) {
  try {
    const response = await fetch(\`/api/users/\${userId}\`);
    if (!response.ok) throw new Error('Network error');
    return await response.json();
  } catch (error) {
    console.error('Failed to load profile', error);
    throw error;
  }
}`
        },
        stepByStep: [
          'Mark the function async to automatically wrap the return value in a Promise.',
          'Await the fetch call to pause until the Promise fulfills or rejects.',
          'Wrap logic in try/catch to surface errors and rethrow if necessary.'
        ],
        realWorldUseCase:
          'Data fetching in React (or any SPA) relies on Promises; proper handling avoids unhandled rejections and inconsistent UI.',
        commonMistakes: [
          'Forgetting to await asynchronous calls, leading to unresolved Promise objects.',
          'Not handling Promise rejections, causing uncaught errors.',
          'Blocking parallel requests by awaiting sequentially instead of using Promise.all.'
        ],
        interviewQuestions: [
          'How do you run multiple async operations in parallel?',
          'Demonstrate converting a callback-based API to Promise/async.',
          'Explain the difference between await inside and outside try/catch.'
        ],
        keyTakeaways: [
          'async/await is syntactic sugar over Promises—errors still propagate as rejections.',
          'Use Promise utilities for batching or racing async tasks.',
          'Always handle errors to avoid crashing the event loop.'
        ],
        quickLinks: [
          { label: 'MDN: Using Promises', url: 'https://developer.mozilla.org/en-US/docs/Web/JavaScript/Guide/Using_promises' },
          { label: 'MDN: async function', url: 'https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Statements/async_function' }
        ]
      },
      {
        id: 'js-callbacks',
        title: 'Callbacks and Callback Hell',
        seoTitle: 'Avoiding Callback Hell with Control Flow Patterns',
        oneLiner: 'Callbacks are foundational, but you must tame nesting and error handling.',
        importance:
          'Legacy codebases and browser APIs still rely on callbacks; interviews test if you can refactor them safely.',
        commonQuestions: [
          'What is callback hell and how do you avoid it?',
          'How do you propagate errors in callback-based APIs?',
          'Demonstrate converting callbacks to Promises.'
        ],
        conceptDescription: [
          'Callbacks pass a function into another function to be invoked later when work completes.',
          'Deeply nested callbacks become hard to read; modularizing or promisifying improves clarity.',
          'Node-style callbacks use error-first signatures: callback(err, result).'
        ],
        codeExample: {
          language: 'JavaScript',
          caption: 'Promisifying a callback-style API',
          snippet: `const fs = require('fs');
const readFilePromise = (path) =>
  new Promise((resolve, reject) => {
    fs.readFile(path, 'utf8', (error, data) => {
      if (error) reject(error);
      else resolve(data);
    });
  });

readFilePromise('./notes.txt')
  .then((text) => console.log(text))
  .catch((err) => console.error(err));`
        },
        stepByStep: [
          'Wrap the callback API in a new Promise that resolves or rejects appropriately.',
          'Inside the original callback, call resolve on success or reject on error.',
          'Consumers can now use .then/.catch or async/await instead of nested callbacks.'
        ],
        realWorldUseCase:
          'Migration projects often convert callback-heavy Node services to Promise-based APIs for consistency with modern frontend code.',
        commonMistakes: [
          'Forgetting to handle errors in callback chains, causing silent failures.',
          'Nesting callbacks instead of composing helpers that return Promises.',
          'Mixing callbacks and async/await, leading to double invocations.'
        ],
        interviewQuestions: [
          'Explain middleware patterns that avoid callback hell.',
          'How would you make a callback API composable with async/await?',
          'What libraries help manage complex callback flows (e.g., async.js)?'
        ],
        keyTakeaways: [
          'Callbacks are foundation of async JS; understand them before abstracting.',
          'Promisify or modularize callbacks to flatten nested logic.',
          'Always handle errors explicitly in callback signatures.'
        ],
        quickLinks: [
          { label: 'Node.js Docs: Callbacks', url: 'https://nodejs.org/en/learn/asynchronous-work/what-are-callbacks' },
          { label: 'Bluebird: Promisification Guide', url: 'http://bluebirdjs.com/docs/working-with-callbacks.html' }
        ]
      },
      {
        id: 'js-this-binding',
        title: 'The this Keyword and Binding',
        seoTitle: 'Demystifying this Binding in JavaScript',
        oneLiner: 'Predict what this points to in functions, classes, and callbacks.',
        importance:
          'Misunderstanding this leads to broken event handlers and class methods—interviewers expect precise explanations.',
        commonQuestions: [
          'How is this determined in regular functions versus arrow functions?',
          'What do bind, call, and apply do?',
          'How does this behave inside class constructors?'
        ],
        conceptDescription: [
          'this is set based on call-site: implicit object calls, explicit binding, new binding, or default (undefined in strict mode).',
          'Arrow functions capture lexical this from their defining scope and cannot be rebound.',
          'bind returns a new function with this and optional arguments pre-set.'
        ],
        codeExample: {
          language: 'JavaScript',
          caption: 'Comparing function invocation patterns',
          snippet: `const counter = {
  count: 0,
  inc() {
    this.count += 1;
  }
};

const standalone = counter.inc;
standalone(); // TypeError in strict mode (this undefined)

const bound = counter.inc.bind(counter);
bound(); // counter.count = 1`
        },
        stepByStep: [
          'Method extraction loses implicit binding; this becomes undefined (strict) or window (sloppy).',
          'Use bind (or arrow functions) to preserve the intended this context.',
          'Arrow functions inherit this from the surrounding scope, ideal for callbacks.'
        ],
        realWorldUseCase:
          'React class components required binding event handlers; understanding this ensures compatibility with legacy code.',
        commonMistakes: [
          'Using arrow functions as methods when dynamic this is required.',
          'Forgetting to bind handlers when passing methods to event listeners.',
          'Assuming this points to the DOM element inside plain callbacks (depends on call-site).'
        ],
        interviewQuestions: [
          'Explain the four rules of this binding.',
          'How does this behave inside class fields versus prototype methods?',
          'When would you avoid arrow functions because of lexical this?'
        ],
        keyTakeaways: [
          'this depends on how a function is called, not where it is defined (unless arrow).',
          'bind/call/apply let you control this explicitly.',
          'Arrow functions capture lexical this, making them ideal for callbacks that need surrounding context.'
        ],
        quickLinks: [
          { label: 'MDN: this', url: 'https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Operators/this' },
          { label: 'You Don’t Know JS: this & Object Prototypes', url: 'https://github.com/getify/You-Dont-Know-JS/tree/2nd-ed/this%20%26%20Object%20Prototypes' }
        ]
      },
      {
        id: 'js-prototypes-inheritance',
        title: 'Prototypes and Inheritance',
        seoTitle: 'Prototype Chain and Inheritance Patterns in JavaScript',
        oneLiner: 'Understand how objects delegate behavior through the prototype chain.',
        importance:
          'Even in class-based code, prototypes power inheritance; interviewers expect you to trace the chain.',
        commonQuestions: [
          'How does the prototype chain resolve method lookups?',
          'What is Object.create used for?',
          'How do classes relate to constructor functions and prototypes?'
        ],
        conceptDescription: [
          'Every object has an internal [[Prototype]] reference to another object or null.',
          'Property lookup walks the prototype chain until a match is found or the chain ends.',
          'ES6 classes are syntactic sugar over constructor functions that manipulate prototypes.'
        ],
        codeExample: {
          language: 'JavaScript',
          caption: 'Using Object.create for prototype inheritance',
          snippet: `const vehicle = {
  start() {
    return \`\${this.name} starting...\`;
  }
};

const car = Object.create(vehicle);
car.name = 'Roadster';
console.log(car.start()); // "Roadster starting..."
console.log(Object.getPrototypeOf(car) === vehicle); // true`
        },
        stepByStep: [
          'Object.create sets the prototype of the new object to vehicle.',
          'Calling car.start looks for start on car, then delegates to vehicle.',
          'Properties like name live directly on car, demonstrating delegation rather than copying.'
        ],
        realWorldUseCase:
          'Frameworks and polyfills still use prototypes under the hood; debugging requires understanding the chain.',
        commonMistakes: [
          'Shadowing prototype methods unintentionally with own properties.',
          'Mutating built-in prototypes (Array.prototype) causing global side effects.',
          'Confusing __proto__ (accessor) with prototype (constructor property).'
        ],
        interviewQuestions: [
          'How would you implement classical inheritance using prototypes?',
          'Explain the difference between prototype and __proto__.',
          'How do you extend an object without breaking the prototype chain?'
        ],
        keyTakeaways: [
          'Prototype chains enable property delegation without copying.',
          'Classes compile down to constructor functions manipulating prototypes.',
          'Use Object.create for clean delegation patterns.'
        ],
        quickLinks: [
          { label: 'MDN: Prototypes', url: 'https://developer.mozilla.org/en-US/docs/Learn/JavaScript/Objects/Object_prototypes' },
          { label: 'JavaScript.info: Prototypal inheritance', url: 'https://javascript.info/prototype-inheritance' }
        ]
      },
      {
        id: 'js-destructuring-spread-rest',
        title: 'Destructuring, Spread, and Rest',
        seoTitle: 'Write Cleaner Code with Destructuring, Spread, and Rest Operators',
        oneLiner: 'Modern syntax reduces boilerplate when working with arrays and objects.',
        importance:
          'Interviewers expect you to transform data succinctly; these operators appear constantly in React props and Node services.',
        commonQuestions: [
          'How does object destructuring handle missing properties?',
          'What is the difference between spread and rest?',
          'How can you rename variables during destructuring?'
        ],
        conceptDescription: [
          'Destructuring extracts values from arrays/objects into variables in a single statement.',
          'The spread operator (...) expands iterables or objects into new arrays/objects.',
          'The rest operator collects remaining properties or arguments into an array/object.'
        ],
        codeExample: {
          language: 'JavaScript',
          caption: 'Combining spread and rest in practical code',
          snippet: `const user = { id: 7, name: 'Aisha', role: 'mentor', active: true };
const { id, name, ...profile } = user;
console.log(id, name); // 7, "Aisha"
console.log(profile); // { role: 'mentor', active: true }

const team = ['Priya', 'Leo', 'Marcus'];
const [lead, ...members] = team;
console.log(lead); // "Priya"
console.log(members); // ["Leo", "Marcus"]`
        },
        stepByStep: [
          'Destructure id and name, collecting the rest into profile via rest.',
          'Array destructuring pulls the first element into lead and the remainder into members.',
          'Spread/rest syntax keeps code immutable by creating new objects instead of mutating originals.'
        ],
        realWorldUseCase:
          'React props destructuring, Redux reducers, and API response normalization all leverage these operators.',
        commonMistakes: [
          'Mutating existing objects when intending to clone (forgetting to use spread).',
          'Using array destructuring on non-iterables resulting in TypeError.',
          'Confusing spread in function calls (expansion) with rest parameters (collection).'
        ],
        interviewQuestions: [
          'How do you set default values while destructuring?',
          'Explain how to rename variables during object destructuring.',
          'What happens when you spread undefined or null?'
        ],
        keyTakeaways: [
          'Destructuring improves readability and reduces boilerplate.',
          'Spread creates new arrays/objects; rest gathers remaining values.',
          'Use defaults and renaming to make destructuring resilient to API changes.'
        ],
        quickLinks: [
          { label: 'MDN: Destructuring assignment', url: 'https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Operators/Destructuring_assignment' },
          { label: 'MDN: Spread syntax', url: 'https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Operators/Spread_syntax' }
        ]
      },
      {
        id: 'js-modules-import-export',
        title: 'Modules: import and export',
        seoTitle: 'Modular JavaScript with ES Modules (import/export)',
        oneLiner: 'Organize code into modules to improve reuse and maintainability.',
        importance:
          'Every modern build tool relies on ES modules; knowing default vs named exports is essential.',
        commonQuestions: [
          'Difference between default and named exports?',
          'How do modules behave in the browser versus Node?',
          'What is tree-shaking and how do modules enable it?'
        ],
        conceptDescription: [
          'ESM uses static import/export syntax enabling bundlers to analyze dependencies at build time.',
          'Default exports allow importing with any name; named exports must match and use braces.',
          'Modules execute in strict mode and have their own scope, preventing global pollution.'
        ],
        codeExample: {
          language: 'JavaScript',
          caption: 'Combining default and named exports',
          snippet: `// utils/math.js
export const sum = (a, b) => a + b;
export const mean = (numbers) => numbers.reduce(sum, 0) / numbers.length;
export default { sum, mean };

// usage
import math, { sum } from './utils/math.js';
console.log(sum(2, 3)); // 5
console.log(math.mean([2, 3, 4])); // 3`
        },
        stepByStep: [
          'Define named exports for individual helpers.',
          'Provide a default export when consumers need a bundle of utilities.',
          'Importing modules triggers single execution; caching ensures the module is evaluated once.'
        ],
        realWorldUseCase:
          'Component libraries, utility packages, and bundlers depend on modules to tree-shake unused code.',
        commonMistakes: [
          'Mixing CommonJS require with ES modules without proper tooling.',
          'Forgetting file extensions in native browser imports.',
          'Using default exports excessively, making refactors harder.'
        ],
        interviewQuestions: [
          'How do you export multiple utilities from one file?',
          'Explain live bindings and how they differ from CommonJS exports.',
          'What are the caveats of using modules in Node without transpilation?'
        ],
        keyTakeaways: [
          'Use named exports for clarity; default exports for single primary values.',
          'Modules execute once and provide live bindings.',
          'ESM enables tree-shaking, improving bundle size.'
        ],
        quickLinks: [
          { label: 'MDN: import', url: 'https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Statements/import' },
          { label: 'MDN: export', url: 'https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Statements/export' }
        ]
      },
      {
        id: 'js-template-literals',
        title: 'Template Literals',
        seoTitle: 'Template Literals for Safer String Interpolation',
        oneLiner: 'Use backticks to compose strings, inject variables, and build tagged templates.',
        importance:
          'Template literals reduce concatenation bugs and enable multi-line strings, often required in coding challenges.',
        commonQuestions: [
          'How do template literals handle expressions and multi-line strings?',
          'What are tagged templates used for?',
          'How can you avoid XSS when using template strings?'
        ],
        conceptDescription: [
          'Template literals use backticks (`) and ${} placeholders for expressions.',
          'They support multi-line strings without escape characters.',
          'Tagged templates process literals and expressions through a custom function for sanitization or formatting.'
        ],
        codeExample: {
          language: 'JavaScript',
          caption: 'Interpolating variables and using tagged templates',
          snippet: `const user = { name: 'Ravi', sessions: 5 };
console.log(\`Hi \${user.name}, you have \${user.sessions} sessions left.\`);

function highlight(strings, ...values) {
  return strings.reduce(
    (acc, str, index) => \`\${acc}\${str}<strong>\${values[index] ?? ''}</strong>\`,
    ''
  );
}

const message = highlight\`Next session with \${user.name} in \${user.sessions} days\`;
console.log(message);`
        },
        stepByStep: [
          'Use ${} to inject variables or expressions directly into strings.',
          'Leverage multi-line support for better readability in markup or SQL queries.',
          'Tagged templates give you control over how interpolated values are transformed or sanitized.'
        ],
        realWorldUseCase:
          'Building UI strings, generating HTML fragments, and constructing SQL queries benefit from template literals.',
        commonMistakes: [
          'Using regular quotes, leading to concatenation and escape clutter.',
          'Assuming template literals automatically sanitize HTML—tagged templates are required.',
          'Forgetting that expressions inside ${} execute immediately, potentially throwing errors.'
        ],
        interviewQuestions: [
          'How do tagged templates help prevent XSS?',
          'What happens if you nest template literals?',
          'Can template literals be used for internationalization placeholders?'
        ],
        keyTakeaways: [
          'Template literals improve readability and reduce string bugs.',
          'Tagged templates enable advanced use cases like sanitization or custom formatting.',
          'Treat interpolated values carefully to avoid injection vulnerabilities.'
        ],
        quickLinks: [
          { label: 'MDN: Template literals', url: 'https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Template_literals' },
          { label: 'JavaScript.info: Tagged templates', url: 'https://javascript.info/tagged-templates' }
        ]
      }
    ]
  },
  {
    id: 'javascript-es6-advanced',
    trackId: 'junior',
    title: 'JavaScript (ES6+) — Advanced Patterns',
    summary:
      'Master browser event strategies, performance tuning, and platform APIs that interviewers expect from engineers with 2–4 years of experience.',
    subtopics: [
      {
        id: 'js-closures',
        title: 'Closures and Scope',
        seoTitle: 'Master Closures and Lexical Scope in JavaScript',
        oneLiner: 'Understand how functions remember the environment in which they were created.',
        importance:
          'Closures underpin callbacks, functional patterns, and module encapsulation; interviewers love to test this.',
        commonQuestions: [
          'What is a closure and why is it useful?',
          'How do closures relate to private variables?',
          'Can closures cause memory leaks?'
        ],
        conceptDescription: [
          'A closure is a function that captures variables from its surrounding lexical scope, allowing it to access these variables even after the outer function has returned.',
          'Closures enable the creation of private variables by returning inner functions that reference outer variables.',
          'They are critical in asynchronous programming (e.g., callbacks, event handlers) where you need to remember certain state.',
          'Closures can unintentionally keep memory alive if not handled correctly, which can be relevant in performance-sensitive applications.'
        ],
        codeExample: {
          language: 'JavaScript',
          caption: 'Using closure to create a private counter',
          snippet: `function createCounter() {
      let count = 0; // private variable
      return function() {
        count++;
        return count;
      }
    }
    
    const counter = createCounter();
    console.log(counter()); // 1
    console.log(counter()); // 2`
        },
        stepByStep: [
          'Define an outer function with a local variable.',
          'Return an inner function that uses the local variable.',
          'Invoke the outer function to get a reference to the inner function.',
          'Calling the inner function accesses and modifies the outer variable, maintaining state.'
        ],
        realWorldUseCase:
          'Implementing private state in modules, like maintaining a counter or caching data within a function.',
        commonMistakes: [
          'Assuming closures are garbage collected immediately even when references exist.',
          'Confusing scope chain order when multiple nested closures reference the same variable.'
        ],
        interviewQuestions: [
          'Write a function that demonstrates a closure creating private state.',
          'Explain what happens when a loop uses var and closures inside it.'
        ],
        keyTakeaways: [
          'Closures capture variables by reference from the lexical scope.',
          'They are powerful for encapsulation and persistent state.',
          'Beware of memory retention due to lingering references.'
        ],
        quickLinks: [
          { label: 'MDN: Closures', url: 'https://developer.mozilla.org/en-US/docs/Web/JavaScript/Closures' }
        ]
      },
      {
        id: 'js-this-binding',
        title: '`this` and Context',
        seoTitle: 'Mastering this Keyword and Execution Context in JS',
        oneLiner: 'Know who “this” really refers to in every call.',
        importance:
          'Misunderstanding this is a common source of bugs in JavaScript; essential for OOP and event handling.',
        commonQuestions: [
          'What does `this` refer to in a function vs method?',
          'How does `bind`, `call`, and `apply` change context?',
          'What is `this` in arrow functions?'
        ],
        conceptDescription: [
          '`this` refers to the object that is executing the current function. Its value is determined at runtime based on how the function is called.',
          'Global function calls: in non-strict mode, `this` is the global object; in strict mode, `this` is undefined.',
          'Method calls: `this` refers to the object before the dot.',
          'Arrow functions do not have their own `this` — they capture `this` from the enclosing lexical scope.',
          'Explicitly changing context: `call` and `apply` invoke a function with a specific `this` value; `bind` returns a new function permanently bound.'
        ],
        codeExample: {
          language: 'JavaScript',
          caption: '`this` behavior examples',
          snippet: `const obj = {
      value: 10,
      getValue: function() { return this.value; }
    };
    
    const get = obj.getValue;
    console.log(get()); // undefined (strict mode)
    
    const boundGet = get.bind(obj);
    console.log(boundGet()); // 10`
        },
        stepByStep: [
          'Call a function normally → observe global or undefined `this`.',
          'Call as a method → `this` points to object.',
          'Use bind → permanently tie function to object context.',
          'Arrow functions inherit `this` from their surrounding scope.'
        ],
        realWorldUseCase:
          'Event handlers in React or DOM manipulation need careful handling of `this` to maintain component state.',
        commonMistakes: [
          'Using `this` inside nested functions without binding.',
          'Arrow functions not suitable for object methods if dynamic `this` is needed.'
        ],
        interviewQuestions: [
          'Explain the difference in `this` for regular vs arrow functions.',
          'Implement a function that borrows a method from another object.'
        ],
        keyTakeaways: [
          '`this` depends on call site, not lexical declaration (except arrows).',
          'Use bind, call, or apply to control context when needed.',
          'Arrow functions provide predictable `this` in closures.'
        ],
        quickLinks: [
          { label: 'MDN: this', url: 'https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Operators/this' }
        ]
      },
      {
        id: 'js-deep-vs-shallow-copy',
        title: 'Deep Copy vs Shallow Copy',
        seoTitle: 'Avoid Mutations with Proper Deep and Shallow Copy Techniques',
        oneLiner: 'Know how references propagate to avoid accidental mutations.',
        importance:
          'State management (React, Redux) depends on immutability; shallow copies can hide nested mutations.',
        commonQuestions: [
          'What is a shallow copy, and when is it sufficient?',
          'How do you deep clone objects safely?',
          'Why does JSON.parse(JSON.stringify()) sometimes fail?'
        ],
        conceptDescription: [
          'A shallow copy duplicates only top-level properties of an object, while references to nested objects remain shared between copies.',
          'A deep copy creates a completely new structure, recursively duplicating nested objects, arrays, and primitives to prevent accidental mutations.',
          'Shallow copies are often sufficient when the object is flat or when nested data is immutable (frozen or never mutated).',
          'Deep copies are essential in state management systems (like Redux or Vuex) where immutability ensures predictable state updates and change detection.',
          'The structuredClone API is the safest modern browser-native method for deep copying, as it supports complex types like Maps, Sets, and Dates (but not functions).',
          'JSON.parse(JSON.stringify()) works for basic objects but fails with non-serializable types such as Dates, functions, undefined, and circular references.',
          'Third-party libraries like Lodash’s cloneDeep can handle most cases but may add overhead, so use only when necessary.',
          'In interviews, expect to explain reference equality versus structural equality, and demonstrate when shallow copies cause unexpected bugs.'
        ],
        codeExample: {
          language: 'JavaScript',
          caption: 'Comparing shallow and deep cloning',
          snippet: `const original = { user: { name: 'Dev' }, tags: ['js'] };
    const shallow = { ...original };
    const deep = structuredClone(original);
    
    shallow.user.name = 'Changed';
    console.log(original.user.name); // "Changed" — shared reference
    
    deep.tags.push('ts');
    console.log(original.tags); // ['js'] — untouched`
        },
        stepByStep: [
          'Use spread/Object.assign for shallow copies when nested references are immutable.',
          'structuredClone provides a browser-native deep clone with limitations (no functions).',
          'Falls back to libraries when data includes functions, Dates, Maps, or circular references.'
        ],
        realWorldUseCase:
          'Redux reducers rely on cloning to produce new state objects without mutating previous ones.',
        commonMistakes: [
          'Using spread and assuming nested objects are cloned.',
          'Deep cloning large structures unnecessarily, hurting performance.',
          'Ignoring non-serializable values that structuredClone cannot handle.'
        ],
        interviewQuestions: [
          'When is a shallow copy acceptable in state updates?',
          'How would you deep clone while preserving Dates and Maps?',
          'Explain the difference between reference equality and structural equality.'
        ],
        keyTakeaways: [
          'Choose shallow or deep copy based on whether nested data can mutate.',
          'structuredClone is a modern native solution but has limitations.',
          'Immutability helps with change detection and debugging.'
        ],
        quickLinks: [
          { label: 'MDN: structuredClone', url: 'https://developer.mozilla.org/en-US/docs/Web/API/structuredClone' },
          { label: 'Immer.js Immutability', url: 'https://immerjs.github.io/immer/' }
        ]
      },
      {
        id: 'js-functional-programming',
        title: 'Functional Programming: map, filter, reduce',
        seoTitle: 'Functional Array Patterns with map, filter, and reduce',
        oneLiner: 'Transform data declaratively using array combinators.',
        importance:
          'Coding exercises often require manipulating arrays; functional methods communicate intent clearly.',
        commonQuestions: [
          'How do map, filter, and reduce differ?',
          'When would you choose reduce over other methods?',
          'How do these methods help avoid mutations?'
        ],
        conceptDescription: [
          'Functional array methods allow you to manipulate data immutably and declaratively—an essential skill for clean, predictable JavaScript code.',
          'map transforms each array element using a callback, returning a new array of the same length.',
          'filter evaluates each element against a predicate and returns only those that pass, preserving order and immutability.',
          'reduce accumulates results into a single value—numbers, arrays, or objects—enabling complex aggregations and transformations.',
          'Functional programming discourages side effects, making your data flow predictable and easier to test.',
          'Because these methods return new arrays, they avoid in-place mutation and are preferred in frameworks that rely on immutability (React, Redux, etc.).',
          'Chaining map/filter/reduce operations promotes readability and composability, though interviewers may ask about performance trade-offs of multiple iterations.',
          'Interviewers often challenge candidates to implement one method (like map) using another (like reduce) to test deep conceptual understanding.'
        ],
        codeExample: {
          language: 'JavaScript',
          caption: 'Chaining functional helpers to prepare UI data',
          snippet: `const sessions = [
      { mentor: 'Aisha', rating: 4.8, completed: true },
      { mentor: 'Leo', rating: 4.1, completed: false },
      { mentor: 'Priya', rating: 4.9, completed: true }
    ];
    
    const topMentors = sessions
      .filter((session) => session.completed)
      .map((session) => session.mentor)
      .reduce((acc, mentor) => {
        acc.add(mentor);
        return acc;
      }, new Set());
    
    console.log([...topMentors]);`
        },
        stepByStep: [
          'Filter sessions to those that are completed.',
          'Map the results to mentor names.',
          'Use reduce with a Set accumulator to deduplicate mentors.'
        ],
        realWorldUseCase:
          'Preparing analytics dashboards, transforming API payloads, and computing aggregates for UI components.',
        commonMistakes: [
          'Mutating accumulators inside map/filter instead of returning new values.',
          'Using reduce when simpler helpers (map/filter) would suffice.',
          'Forgetting to supply an initial value to reduce, causing bugs with empty arrays.'
        ],
        interviewQuestions: [
          'Implement map using reduce.',
          'How do you short-circuit reduce when a condition is met?',
          'What is the difference between imperative loops and functional chains?'
        ],
        keyTakeaways: [
          'Functional helpers create expressive, chainable transformations.',
          'Avoid side effects inside callbacks to keep functions pure.',
          'Always provide explicit initial values for reduce to handle empty arrays.'
        ],
        quickLinks: [
          { label: 'MDN: Array.prototype.map', url: 'https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Array/map' },
          { label: 'MDN: Array.prototype.reduce', url: 'https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Array/reduce' }
        ]
      },
      {
        id: 'js-memory-leaks-gc',
        title: 'Memory Leaks and Garbage Collection',
        seoTitle: 'Prevent Memory Leaks with JavaScript Garbage Collection Insights',
        oneLiner: 'Keep apps fast by understanding how garbage collection tracks references.',
        importance:
          'Interviewers assess whether you can diagnose performance regressions caused by leaked listeners or caches.',
        commonQuestions: [
          'How does the garbage collector decide when to free memory?',
          'What patterns commonly cause memory leaks in SPAs?',
          'How can you profile memory usage in the browser?'
        ],
        conceptDescription: [
          'JavaScript uses garbage collection (GC) to automatically reclaim memory occupied by objects that are no longer reachable from the root scope.',
          'A memory leak occurs when objects remain referenced unintentionally, preventing GC from freeing their memory even though they’re no longer needed.',
          'Common leak sources include event listeners not removed on unmount, global variables, circular references, or stale cache entries.',
          'WeakMap and WeakRef are tools that hold “weak” references, allowing GC to collect objects even when still used as keys or wrapped references.',
          'Profiling memory leaks involves taking heap snapshots and comparing retained objects before and after simulated user flows.',
          'Long-lived SPAs are particularly vulnerable to leaks since detached DOM nodes or timers can persist indefinitely if not cleaned up properly.',
          'Modern frameworks (React, Vue) rely on component lifecycle hooks to perform cleanups that avoid leaks in UI-heavy apps.',
          'In interviews, expect to describe how GC works (mark-and-sweep algorithm) and how WeakMap can help create self-cleaning data structures.'
        ],
        codeExample: {
          language: 'JavaScript',
          caption: 'Cleaning up event listeners to avoid leaks',
          snippet: `function attachTracking(node) {
      const handler = () => console.log('clicked');
      node.addEventListener('click', handler);
    
      return () => {
        node.removeEventListener('click', handler);
      };
    }
    
    const detach = attachTracking(button);
    // Later when the component unmounts
    detach();`
        },
        stepByStep: [
          'Register listeners or intervals in setup logic.',
          'Return cleanup functions to remove references when components unmount.',
          'Use DevTools Performance/Memory panels to identify detached DOM nodes still retained.'
        ],
        realWorldUseCase:
          'Single-page apps with long lifetimes must clean up listeners, timers, and caches to avoid crashing users with limited memory.',
        commonMistakes: [
          'Forgetting to remove event listeners when DOM nodes are removed.',
          'Caching large API responses without eviction policies.',
          'Creating accidental global variables that keep objects reachable.'
        ],
        interviewQuestions: [
          'What tools do you use to detect memory leaks in Chrome?',
          'Explain how WeakMap helps when tracking DOM elements.',
          'How would you design a cache that avoids unbounded growth?'
        ],
        keyTakeaways: [
          'Garbage collection frees memory for unreachable objects; avoid long-lived references.',
          'Always clean up listeners, intervals, and observers when components unmount.',
          'Use WeakMap/WeakRef for caches tied to objects that should be garbage collected.'
        ],
        quickLinks: [
          { label: 'MDN: Memory Management', url: 'https://developer.mozilla.org/en-US/docs/Web/JavaScript/Memory_Management' },
          { label: 'Chrome DevTools: Memory leaks', url: 'https://developer.chrome.com/docs/devtools/memory-problems/' }
        ]
      },
      {
        id: 'js-web-apis-storage',
        title: 'Web APIs: Fetch and Storage',
        seoTitle: 'Fetch API and Web Storage (localStorage/sessionStorage) Essentials',
        oneLiner: 'Interact with the network and persist lightweight data on the client.',
        importance:
          'Interviewers expect you to manage API calls and browser storage for tokens, feature flags, or caching.',
        commonQuestions: [
          'What are differences between fetch and XMLHttpRequest?',
          'How do you store auth tokens securely in the browser?',
          'When should you use sessionStorage over localStorage?'
        ],
        conceptDescription: [
          'The Fetch API provides a modern, promise-based way to perform network requests with cleaner syntax and better error handling than XMLHttpRequest.',
          'Fetch supports streaming responses, custom headers, and AbortController for canceling requests—critical for single-page apps where users navigate mid-request.',
          'Web Storage APIs (localStorage and sessionStorage) offer synchronous key-value persistence, ideal for lightweight caching or user settings.',
          'localStorage persists indefinitely per domain, while sessionStorage lasts only for the current tab session.',
          'For large or structured data, IndexedDB is a better choice since Web Storage is limited to ~5MB per origin.',
          'Never store sensitive information like JWTs in localStorage—it’s vulnerable to XSS attacks; prefer HttpOnly cookies or encrypted IndexedDB.',
          'Storage operations should be wrapped in try/catch blocks to handle quota errors and unavailability (e.g., Safari Private mode).',
          'Interviewers may ask you to design a caching layer using fetch + localStorage that auto-expires or refreshes stale data.'
        ],
        codeExample: {
          language: 'JavaScript',
          caption: 'Fetch data and cache in localStorage',
          snippet: `async function fetchUser(userId) {
      const cached = localStorage.getItem(userId);
      if (cached) return JSON.parse(cached);
    
      const response = await fetch(\`https://api.example.com/users/\${userId}\`);
      const data = await response.json();
      localStorage.setItem(userId, JSON.stringify(data));
      return data;
    }`
        },
        stepByStep: [
          'Check localStorage for existing data.',
          'If missing, call fetch to retrieve from network.',
          'Store serialized response in localStorage for next time.',
          'Return the data for use in your UI.'
        ],
        realWorldUseCase:
          'Caching API responses in SPAs for offline support or performance optimization.',
        commonMistakes: [
          'Storing sensitive info in localStorage.',
          'Forgetting to JSON.stringify/parse complex objects.',
          'Ignoring storage quota limitations and exceptions.'
        ],
        interviewQuestions: [
          'Explain the difference between localStorage, sessionStorage, and IndexedDB.',
          'How would you cancel an ongoing fetch request if user navigates away?'
        ],
        keyTakeaways: [
          'Use Fetch API for promise-based network calls.',
          'localStorage/sessionStorage are simple key-value stores for small, non-sensitive data.',
          'Always consider size, expiration, and security when using web storage.'
        ],
        quickLinks: [
          { label: 'MDN: Fetch', url: 'https://developer.mozilla.org/en-US/docs/Web/API/Fetch_API' },
          { label: 'MDN: Web Storage', url: 'https://developer.mozilla.org/en-US/docs/Web/API/Web_Storage_API' }
        ]
      },
      {
        id: 'js-event-loop-async',
        title: 'Event Loop and Asynchronous JS',
        seoTitle: 'Mastering Event Loop, Promises, and Async/Await in JavaScript',
        oneLiner: 'Understand how JS handles concurrency and scheduling.',
        importance:
          'Essential for debugging performance, avoiding race conditions, and writing responsive applications.',
        commonQuestions: [
          'What is the difference between microtasks and macrotasks?',
          'How does async/await relate to Promises?',
          'Why does setTimeout sometimes execute after other synchronous code?'
        ],
        conceptDescription: [
          'JavaScript has a single-threaded runtime but achieves concurrency via the event loop.',
          'The call stack executes functions synchronously; asynchronous operations are queued in the event loop.',
          'Tasks are divided into macrotasks (setTimeout, setInterval, I/O) and microtasks (Promises, process.nextTick in Node).',
          'Microtasks run immediately after the current stack, before the next macrotask, giving Promises higher priority over setTimeout.',
          'Async/await is syntactic sugar over Promises: async functions always return a Promise, and await pauses execution until the Promise resolves without blocking the main thread.',
          'Understanding this helps prevent race conditions, ensures proper sequencing of UI updates, and avoids unhandled promise rejections.',
          'Interviews often test with tricky examples combining setTimeout, Promise.resolve, and async/await to see if candidates know execution order.'
        ],
        codeExample: {
          language: 'JavaScript',
          caption: 'Event loop ordering',
          snippet: `console.log('Start');
    
    setTimeout(() => console.log('Timeout'), 0);
    
    Promise.resolve().then(() => console.log('Promise'));
    
    console.log('End');
    
    // Output:
    // Start
    // End
    // Promise
    // Timeout`
        },
        stepByStep: [
          'Synchronous code runs immediately (console.log Start/End).',
          'setTimeout is queued as a macrotask.',
          'Promise.then is queued as a microtask.',
          'Microtasks run after the stack is empty but before the next macrotask.'
        ],
        realWorldUseCase:
          'Handling API responses, animations, and debouncing events while keeping the UI responsive.',
        commonMistakes: [
          'Expecting setTimeout(fn, 0) to execute immediately.',
          'Blocking the main thread inside async functions, preventing UI updates.',
          'Confusing microtask and macrotask ordering.'
        ],
        interviewQuestions: [
          'Explain output of mixed setTimeout and Promises.',
          'Rewrite a callback-based function using async/await.'
        ],
        keyTakeaways: [
          'JS executes synchronous code first; async operations are queued.',
          'Microtasks have higher priority than macrotasks.',
          'Async/await is syntactic sugar over Promises.'
        ],
        quickLinks: [
          { label: 'MDN: Event Loop', url: 'https://developer.mozilla.org/en-US/docs/Web/JavaScript/EventLoop' },
          { label: 'JS Event Loop Visualizer', url: 'https://loupe.dev/' }
        ]
      },
      {
        id: 'js-prototypal-inheritance',
        title: 'Prototypes and Inheritance',
        seoTitle: 'Understand Prototypes, __proto__, and Inheritance in JavaScript',
        oneLiner: 'Master the object chain that powers JS inheritance.',
        importance:
          'Core concept for object-oriented JS, performance optimization, and interview questions on class vs prototype.',
        commonQuestions: [
          'How does prototype chain resolution work?',
          'Difference between class syntax and prototype-based inheritance?',
          'What happens when you add a property to a prototype?'
        ],
        conceptDescription: [
          'Every JS object has an internal [[Prototype]] reference, accessible via __proto__ or Object.getPrototypeOf().',
          'When accessing a property, JS searches the object itself first, then up the prototype chain until found or reaching null.',
          'Prototype inheritance allows methods and properties to be shared across instances efficiently.',
          'ES6 class syntax is syntactic sugar over prototypes.',
          'Modifying the prototype after instances are created affects those instances because they refer to the shared prototype.',
          'Understanding prototypes is critical for debugging inheritance issues, memory optimization, and method overriding.'
        ],
        codeExample: {
          language: 'JavaScript',
          caption: 'Prototype inheritance example',
          snippet: `function Person(name) {
      this.name = name;
    }
    Person.prototype.greet = function() {
      return 'Hello, ' + this.name;
    };
    
    const alice = new Person('Alice');
    console.log(alice.greet()); // Hello, Alice
    
    console.log(alice.__proto__ === Person.prototype); // true`
        },
        stepByStep: [
          'Create a constructor function with instance properties.',
          'Add methods to the constructor prototype.',
          'New instances reference the prototype for shared methods.',
          'Accessing properties searches instance first, then prototype.'
        ],
        realWorldUseCase:
          'Sharing methods between many object instances without duplicating memory in libraries or frameworks.',
        commonMistakes: [
          'Adding instance-specific data to the prototype, causing shared state.',
          'Confusing __proto__ and prototype of a function.',
          'Overwriting prototype after creating instances without resetting constructor.'
        ],
        interviewQuestions: [
          'Implement inheritance without using class syntax.',
          'Explain method resolution order in the prototype chain.'
        ],
        keyTakeaways: [
          'Prototypes allow efficient method sharing.',
          'Every object has a prototype chain ending with null.',
          'Class syntax is sugar; under the hood, it uses prototypes.'
        ],
        quickLinks: [
          { label: 'MDN: Prototype', url: 'https://developer.mozilla.org/en-US/docs/Learn/JavaScript/Objects/Object_prototypes' }
        ]
      },
      {
        id: 'js-es6-modules',
        title: 'ES6 Modules',
        seoTitle: 'Import and Export ES6 Modules Effectively',
        oneLiner: 'Split code into reusable modules using modern syntax.',
        importance:
          'Module systems improve code maintainability and are expected in modern JS frameworks.',
        commonQuestions: [
          'Difference between default and named exports?',
          'How does tree-shaking work with ES6 modules?',
          'Can you dynamically import a module at runtime?'
        ],
        conceptDescription: [
          'ES6 modules allow encapsulating code and exporting only what’s necessary, reducing global scope pollution.',
          'Named exports allow multiple values to be exported from a module and imported selectively.',
          'Default exports provide a single main export per module, imported with any name.',
          'Modules are always in strict mode, have their own scope, and support static analysis for tree-shaking.',
          'Dynamic imports (import()) enable loading modules asynchronously, useful for code splitting in large apps.',
          'Understanding modules is crucial for modern front-end frameworks like React, Angular, and Vue, which rely on them for component structure and bundling.'
        ],
        codeExample: {
          language: 'JavaScript',
          caption: 'ES6 named and default exports',
          snippet: `// utils.js
    export function add(a, b) { return a + b; }
    export default function multiply(a, b) { return a * b; }
    
    // main.js
    import multiply, { add } from './utils.js';
    console.log(add(2, 3)); // 5
    console.log(multiply(2, 3)); // 6`
        },
        stepByStep: [
          'Create a module file with named/default exports.',
          'Import the necessary functions or classes in another file.',
          'Use static imports for main functionality; use dynamic imports for optional features.'
        ],
        realWorldUseCase:
          'Building a component library where each component is a separate module, allowing selective imports to optimize bundle size.',
        commonMistakes: [
          'Mixing CommonJS (require/module.exports) and ES6 import/export syntax.',
          'Using dynamic import incorrectly without handling promises.',
          'Relying on default exports when multiple exports are needed.'
        ],
        interviewQuestions: [
          'Explain tree-shaking and how ES6 modules support it.',
          'Demonstrate dynamic import with async/await.'
        ],
        keyTakeaways: [
          'ES6 modules provide scoped, reusable code.',
          'Named vs default exports dictate import patterns.',
          'Dynamic imports help with lazy loading and performance optimization.'
        ],
        quickLinks: [
          { label: 'MDN: ES6 Modules', url: 'https://developer.mozilla.org/en-US/docs/Web/JavaScript/Guide/Modules' }
        ]
      }
    ]
  },
  {
    id: 'react-fundamentals',
    trackId: 'junior',
    title: 'React Fundamentals',
    summary:
      'Build confidence with core React patterns—components, state, hooks, routing, and performance habits that interviewers expect from modern frontend engineers.',
    subtopics: [
      {
        id: 'react-basics-intro',
        title: 'React Basics & SPA Concepts',
        seoTitle: 'Introduction to React and Single-Page Applications',
        oneLiner: 'Understand how React renders UI and why SPAs feel fast.',
        importance:
          'Most frontend interviews start by gauging your grasp of React’s component model and the SPA architecture it powers.',
        commonQuestions: [
          'What problem does React solve compared to vanilla JS or jQuery?',
          'How does a Single-Page Application differ from a Multi-Page Application?',
          'What is JSX and how is it transformed?'
        ],
        conceptDescription: [
          'React builds declarative UIs using components that map state to markup.',
          'Single-Page Applications load once, then update the view via client-side routing and state changes.',
          'JSX is syntactic sugar compiled to React.createElement (or the modern JSX runtime) that outputs JavaScript objects.',
          'React batches updates and reconciles differences using the virtual DOM for efficient rendering.'
        ],
        codeExample: {
          language: 'tsx',
          caption: 'Hello world component in React',
          snippet: `import React from 'react';

export function HelloMessage() {
  return (
    <section>
      <h1>Welcome to MockAce!</h1>
      <p>React renders this component in the browser.</p>
    </section>
  );
}`
        },
        stepByStep: [
          'Import React (needed for older setups; new JSX transforms may inject automatically).',
          'Define a function that returns JSX describing the UI.',
          'Export the component so it can be rendered with ReactDOM.createRoot.',
          'Browser receives a single HTML shell; React handles updates without full page reloads.'
        ],
        realWorldUseCase:
          'Dashboards, SaaS products, and internal tools rely on SPA patterns to deliver desktop-like responsiveness.',
        commonMistakes: [
          'Forgetting to wrap multiple JSX siblings in a single parent.',
          'Mixing imperative DOM manipulation with React’s declarative rendering causing conflicts.',
          'Ignoring initial HTML/SEO requirements when adopting SPAs.'
        ],
        interviewQuestions: [
          'Explain how React components get turned into DOM nodes.',
          'Why do SPAs often rely on client-side routing?',
          'How would you server render the initial HTML for SEO?'
        ],
        keyTakeaways: [
          'React treats UI as a function of state—components re-render when state changes.',
          'SPAs load once and rely on client-side updates for snappy UX.',
          'JSX compiles to JavaScript, making components easy to reason about.'
        ],
        quickLinks: [
          { label: 'React Docs: Thinking in React', url: 'https://react.dev/learn/thinking-in-react' },
          { label: 'MDN: Single-page application', url: 'https://developer.mozilla.org/en-US/docs/Glossary/SPA' }
        ]
      },
      {
        id: 'react-props-state',
        title: 'Props and State Management Basics',
        seoTitle: 'Understanding Props, State, and Immutability in React',
        oneLiner: 'Manage data flow with predictable props and local component state.',
        importance:
          'Props/state questions appear in nearly every React interview—they reveal how you reason about data flow.',
        commonQuestions: [
          'How do props differ from state?',
          'Why must state updates be immutable?',
          'How do you share state between siblings?'
        ],
        conceptDescription: [
          'Props are read-only inputs passed from parent to child components.',
          'State lives inside a component and triggers re-renders when updated via setState/useState.',
          'Immutability ensures React can detect changes (by reference) and keeps render logic predictable.',
          'Lifting state up means moving state to the closest common ancestor to share data across siblings.'
        ],
        codeExample: {
          language: 'tsx',
          caption: 'Props and state in a simple counter',
          snippet: `type CounterProps = { label?: string };

export function Counter({ label = 'Sessions completed' }: CounterProps) {
  const [count, setCount] = React.useState(0);

  return (
    <div>
      <p>{label}: {count}</p>
      <button onClick={() => setCount((prev) => prev + 1)}>Increment</button>
    </div>
  );
}`
        },
        stepByStep: [
          'Declare props via a TypeScript type or PropTypes/defaultProps in JS.',
          'Use useState to create a state variable and updater function.',
          'Update state using the setter with functional updates to avoid stale closures.',
          'Pass props down to children; lift state up when siblings must coordinate.'
        ],
        realWorldUseCase:
          'Interactive dashboards track metrics in local state and pass formatting options via props.',
        commonMistakes: [
          'Mutating arrays/objects directly instead of creating new copies.',
          'Overusing lifting state when context or specialized stores are better suited.',
          'Passing large prop objects causing unnecessary re-renders.'
        ],
        interviewQuestions: [
          'How do props flow in React? Can a child modify props?',
          'Show how to merge state updates when dealing with objects.',
          'When would you convert local state into a global store?'
        ],
        keyTakeaways: [
          'Props flow top-down and are read-only; state is local and mutable via setState hooks.',
          'Always treat state as immutable to leverage React’s change detection.',
          'Lift state up when multiple components need the same source of truth.'
        ],
        quickLinks: [
          { label: 'React Docs: State and Lifecycle', url: 'https://react.dev/learn/state-a-components-memory' },
          { label: 'React Docs: Lifting State Up', url: 'https://react.dev/learn/sharing-state-between-components' }
        ]
      },
      {
        id: 'react-core-hooks',
        title: 'Core Hooks: useState, useEffect, useContext',
        seoTitle: 'Mastering React Core Hooks for State and Side Effects',
        oneLiner: 'Hooks enable stateful logic in functional components.',
        importance:
          'Modern React interviews expect fluency with hooks—they replaced most class component patterns.',
        commonQuestions: [
          'When does useEffect run and how do dependencies work?',
          'How do you avoid stale closures in hook callbacks?',
          'When would you use useContext instead of prop drilling?'
        ],
        conceptDescription: [
          'useState manages local state—call the setter with new or derived values.',
          'useEffect schedules side effects after render; dependency arrays control when it re-runs.',
          'Cleanup functions inside useEffect prevent memory leaks (listeners, timers).',
          'useContext reads values from React context providers for lightweight global state.'
        ],
        codeExample: {
          language: 'tsx',
          caption: 'Fetching data with useEffect and context consumption',
          snippet: `const UserContext = React.createContext({ name: 'Guest' });

export function UserGreeting() {
  const user = React.useContext(UserContext);
  const [quote, setQuote] = React.useState('');

  React.useEffect(() => {
    let active = true;
    fetch('https://api.quotable.io/random')
      .then((res) => res.json())
      .then((data) => {
        if (active) setQuote(data.content);
      });
    return () => {
      active = false;
    };
  }, []);

  return <p>Hello {user.name}! Quote of the day: {quote}</p>;
}`
        },
        stepByStep: [
          'Create state with useState; rely on functional updates when the new value depends on previous state.',
          'Run asynchronous side effects inside useEffect and clean up subscriptions/timers.',
          'Use an empty dependency array to run once on mount; include dependencies to keep values fresh.',
          'Consume context with useContext where prop drilling becomes noisy.'
        ],
        realWorldUseCase:
          'Dashboard widgets fetch data in effects while global user preferences live in a context provider.',
        commonMistakes: [
          'Leaving out dependencies causing stale values or missing updates.',
          'Calling hooks conditionally or in loops—hooks must run in consistent order.',
          'Not cancelling async work in useEffect, leading to state updates on unmounted components.'
        ],
        interviewQuestions: [
          'Why must hooks be called at the top level of a component?',
          'Explain how to debounce an effect using the dependency array.',
          'When is useLayoutEffect preferred over useEffect?'
        ],
        keyTakeaways: [
          'useState + useEffect cover most component state/side-effect needs.',
          'Dependency arrays dictate when effects run; manage cleanup carefully.',
          'useContext replaces prop drilling for shared, lightweight global state.'
        ],
        quickLinks: [
          { label: 'React Docs: Using the Effect Hook', url: 'https://react.dev/learn/synchronizing-with-effects' },
          { label: 'React Docs: useContext', url: 'https://react.dev/reference/react/useContext' }
        ]
      },
      {
        id: 'react-conditional-lists',
        title: 'Conditional Rendering and Lists',
        seoTitle: 'Render Conditional UI and Lists in React',
        oneLiner: 'Control what renders using expressions, ternaries, and keyed lists.',
        importance:
          'Displaying collections and conditionally showing UI is core to nearly every React component.',
        commonQuestions: [
          'When should you use && vs ternaries?',
          'Why do list items need keys?',
          'Why are index keys discouraged?'
        ],
        conceptDescription: [
          'JSX supports inline conditionals via ternary operators, logical &&, or early returns.',
          'Map over arrays to render lists; provide a stable key to help React track items.',
          'Keys allow React to match previous and next render output, improving reconciliation.',
          'Avoid index keys when list order changes—they cause incorrect UI updates.'
        ],
        codeExample: {
          language: 'tsx',
          caption: 'Rendering a list with conditional badges',
          snippet: `type Session = { id: string; title: string; completed: boolean };

export function SessionList({ sessions }: { sessions: Session[] }) {
  if (!sessions.length) {
    return <p>No sessions scheduled.</p>;
  }

  return (
    <ul>
      {sessions.map((session) => (
        <li key={session.id}>
          {session.title}
          {session.completed && <span className="badge">Completed</span>}
        </li>
      ))}
    </ul>
  );
}`
        },
        stepByStep: [
          'Return early when there is no data (null/placeholder).',
          'Map through the array to render list items.',
          'Use stable keys (database ID, slug) to help React reuse DOM nodes.',
          'Use inline logical operators or ternaries to show optional UI.'
        ],
        realWorldUseCase:
          'Candidate dashboards show lists of upcoming sessions, toggling badges when status changes.',
        commonMistakes: [
          'Using array index as key on dynamic lists causing animations/glitches.',
          'Returning arrays without keys leading to React warnings.',
          'Complex nested conditionals that hurt readability—prefer helper components.'
        ],
        interviewQuestions: [
          'Explain why keys are important in React list rendering.',
          'How do you conditionally render multiple components cleanly?',
          'What pitfalls exist when using index as key?'
        ],
        keyTakeaways: [
          'Use conditional expressions or early returns to control rendering.',
          'Always provide stable keys when mapping lists.',
          'Avoid index keys when list items can be reordered or removed.'
        ],
        quickLinks: [
          { label: 'React Docs: Rendering Lists', url: 'https://react.dev/learn/rendering-lists' },
          { label: 'React Docs: Conditional Rendering', url: 'https://react.dev/learn/conditional-rendering' }
        ]
      },
      {
        id: 'react-forms-controlled',
        title: 'Forms and Controlled Components',
        seoTitle: 'Build Controlled Forms in React',
        oneLiner: 'Sync form inputs with component state for validation and UX.',
        importance:
          'Handling forms is a classic interview task that surfaces your ability to manage state updates and validation.',
        commonQuestions: [
          'What is a controlled component?',
          'How do you handle multiple form fields efficiently?',
          'How do you prevent default form submission behavior?'
        ],
        conceptDescription: [
          'Controlled components bind input values to state and update via onChange handlers.',
          'React updates state on every keystroke; use derived state to validate user input.',
          'Prevent default form submission to avoid page reloads and handle data in JavaScript.',
          'Manage multiple inputs by using computed property names or reducers.'
        ],
        codeExample: {
          language: 'tsx',
          caption: 'Controlled form with multiple fields',
          snippet: `type FormState = { name: string; email: string; notes: string };

export function BookingForm() {
  const [form, setForm] = React.useState<FormState>({ name: '', email: '', notes: '' });

  const handleChange = (event: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = event.target;
    setForm((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = (event: React.FormEvent) => {
    event.preventDefault();
    if (!form.email.includes('@')) {
      alert('Please enter a valid email');
      return;
    }
    console.log('Submitting form', form);
  };

  return (
    <form onSubmit={handleSubmit}>
      <input name="name" value={form.name} onChange={handleChange} placeholder="Name" />
      <input name="email" value={form.email} onChange={handleChange} placeholder="Email" />
      <textarea name="notes" value={form.notes} onChange={handleChange} />
      <button type="submit">Book</button>
    </form>
  );
}`
        },
        stepByStep: [
          'Create state to hold form field values.',
          'Bind each input’s value to state and update with onChange.',
          'Use event.preventDefault to handle submit in React.',
          'Perform validation before sending data to APIs.'
        ],
        realWorldUseCase:
          'Session booking flows capture user input and run validation before hitting backend APIs.',
        commonMistakes: [
          'Leaving inputs uncontrolled (no value prop) while still using state—React warns about switching modes.',
          'Creating separate handlers for each input instead of composing them.',
          'Allowing validation to mutate state directly, causing inconsistent values.'
        ],
        interviewQuestions: [
          'Explain controlled vs uncontrolled components.',
          'How would you manage form state for dozens of fields?',
          'How do you integrate third-party form libraries with React?'
        ],
        keyTakeaways: [
          'Controlled components keep form state in sync with React state for predictable updates.',
          'Prevent default form submission to handle data with JavaScript.',
          'Reuse change handlers and maintain immutability when updating state.'
        ],
        quickLinks: [
          { label: 'React Docs: Forms', url: 'https://react.dev/learn/managing-state#forms' },
          { label: 'React Docs: Controlled Components', url: 'https://react.dev/reference/react-dom/components/input#controlling-an-input-with-a-state-variable' }
        ]
      },
      {
        id: 'react-routing-basics',
        title: 'Routing with React Router',
        seoTitle: 'Getting Started with React Router v6',
        oneLiner: 'Handle navigation in SPAs using declarative routes.',
        importance:
          'Route configuration is a staple interview topic—candidates must know how to structure multi-page flows.',
        commonQuestions: [
          'How do you define nested routes?',
          'What is the difference between Link and NavLink?',
          'How do you implement a fallback 404 page?'
        ],
        conceptDescription: [
          'React Router v6 uses element-based routes with <Routes> and <Route> components.',
          'Link/NavLink render anchor tags that prevent page reloads and update history.',
          'Route params provide dynamic segments accessible via useParams.',
          'useNavigate enables programmatic navigation (e.g., after form submission).'
        ],
        codeExample: {
          language: 'tsx',
          caption: 'React Router v6 basic configuration',
          snippet: `import { BrowserRouter, Routes, Route, Link, useNavigate } from 'react-router-dom';

function App() {
  return (
    <BrowserRouter>
      <nav>
        <Link to="/">Home</Link>
        <Link to="/sessions">Sessions</Link>
      </nav>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/sessions" element={<Sessions />} />
        <Route path="/sessions/:id" element={<SessionDetail />} />
        <Route path="*" element={<NotFound />} />
      </Routes>
    </BrowserRouter>
  );
}

function Sessions() {
  const navigate = useNavigate();
  return <button onClick={() => navigate('/sessions/new')}>Book Session</button>;
}`
        },
        stepByStep: [
          'Wrap your app in BrowserRouter (or MemoryRouter/HashRouter for special cases).',
          'Use Routes with Route elements to declare paths and components.',
          'Add dynamic segments (:id) for detail pages, read values with useParams.',
          'Provide a wildcard (*) route for 404 handling; use useNavigate for imperative redirects.'
        ],
        realWorldUseCase:
          'Booking workflows rely on nested routes (overview/detail/confirmation) within the same SPA shell.',
        commonMistakes: [
          'Forgetting to include a fallback route causing blank pages on unknown paths.',
          'Calling useNavigate outside of router context, leading to runtime errors.',
          'Using anchor tags instead of Link, triggering full page reloads.'
        ],
        interviewQuestions: [
          'How do you guard routes for authenticated users?',
          'Explain the difference between Link and NavLink.',
          'How would you preload data before navigation completes?'
        ],
        keyTakeaways: [
          'React Router declaratively maps paths to components.',
          'Link/NavLink update history without triggering server navigation.',
          'Always include error/fallback routes to improve UX.'
        ],
        quickLinks: [
          { label: 'React Router Docs: Getting Started', url: 'https://reactrouter.com/en/main/start/tutorial' },
          { label: 'React Router Docs: Navigation', url: 'https://reactrouter.com/en/main/hooks/use-navigate' }
        ]
      },
      {
        id: 'react-component-communication',
        title: 'Component Communication Patterns',
        seoTitle: 'Parent/Child Communication and Lifting State in React',
        oneLiner: 'Share data across components with props, callbacks, and context.',
        importance:
          'Interviewers look for clean patterns when components need to talk to each other.',
        commonQuestions: [
          'How does data flow from child to parent?',
          'When should you lift state vs use context?',
          'How do sibling components share data?'
        ],
        conceptDescription: [
          'Parent-to-child communication happens via props; pass data down as component inputs.',
          'Child-to-parent communication leverages callback props the parent passes down.',
          'Sibling components share data by lifting state to their common ancestor.',
          'Context API or external stores help when data is needed across deep component trees.'
        ],
        codeExample: {
          language: 'tsx',
          caption: 'Child-to-parent communication with callbacks',
          snippet: `function RatingSelector({ onChange }: { onChange: (value: number) => void }) {
  return (
    <div>
      {[1, 2, 3, 4, 5].map((value) => (
        <button key={value} onClick={() => onChange(value)}>
          {value}
        </button>
      ))}
    </div>
  );
}

export function FeedbackCard() {
  const [rating, setRating] = React.useState<number | null>(null);

  return (
    <section>
      <h2>Rate your mock session</h2>
      <RatingSelector onChange={setRating} />
      {rating && <p>Thanks! You rated this session {rating}/5.</p>}
    </section>
  );
}`
        },
        stepByStep: [
          'Parent passes a callback prop to the child.',
          'Child calls the callback with new data (value, event).',
          'Parent updates its state in response and re-renders, passing down derived props.',
          'For siblings, store shared state in parent or context.'
        ],
        realWorldUseCase:
          'Mentor feedback forms capture ratings via child components and aggregate results in the parent view.',
        commonMistakes: [
          'Creating new callback functions inline without memoization leading to re-renders.',
          'Overusing context for local communication when lifting state is simpler.',
          'Attempting to mutate parent props from the child (React warns against this).'
        ],
        interviewQuestions: [
          'How do you avoid prop drilling when many components need the same data?',
          'When would you choose context over Redux or Zustand?',
          'Explain the difference between controlled and uncontrolled child components.'
        ],
        keyTakeaways: [
          'Props and callbacks enable unidirectional data flow.',
          'Lift state up to share data between siblings.',
          'Use context or state libraries for global cross-tree communication.'
        ],
        quickLinks: [
          { label: 'React Docs: Passing Data Deeply with Context', url: 'https://react.dev/learn/passing-data-deeply-with-context' },
          { label: 'React Docs: Sharing State Between Components', url: 'https://react.dev/learn/sharing-state-between-components' }
        ]
      },
      {
        id: 'react-performance-basics',
        title: 'Basic Performance Optimization',
        seoTitle: 'Optimize React Components with memo, useMemo, and Lazy Loading',
        oneLiner: 'Prevent unnecessary renders with memoization and code splitting.',
        importance:
          'Interviewers often probe performance awareness—especially for lists, dashboards, and expensive computations.',
        commonQuestions: [
          'When should you use React.memo?',
          'How do useMemo and useCallback differ?',
          'How do you split code for faster initial loads?'
        ],
        conceptDescription: [
          'React.memo memoizes functional components and skips re-renders when props are shallowly equal.',
          'useMemo caches expensive computations between renders; useCallback memoizes function references.',
          'Lazy loading via React.lazy + Suspense loads components on demand, reducing initial bundle size.',
          'Always measure before optimizing—premature memoization can add complexity.'
        ],
        codeExample: {
          language: 'tsx',
          caption: 'Memoizing components and splitting code',
          snippet: `const AnalyticsPanel = React.lazy(() => import('./AnalyticsPanel'));

const ScoreList = React.memo(function ScoreList({ scores }: { scores: number[] }) {
  const average = React.useMemo(() => {
    return scores.reduce((sum, value) => sum + value, 0) / scores.length || 0;
  }, [scores]);

  return (
    <div>
      <h3>Average Score: {average.toFixed(2)}</h3>
      <ul>{scores.map((score) => <li key={score}>{score}</li>)}</ul>
    </div>
  );
});

export function Dashboard({ scores }: { scores: number[] }) {
  return (
    <React.Suspense fallback={<p>Loading analytics…</p>}>
      <ScoreList scores={scores} />
      <AnalyticsPanel />
    </React.Suspense>
  );
}`
        },
        stepByStep: [
          'Wrap components with React.memo when they receive stable props.',
          'Use useMemo/useCallback for expensive calculations or to stabilize dependency arrays.',
          'Load non-critical components lazily via React.lazy and display fallback UI with Suspense.',
          'Profile the app to ensure optimizations provide real benefits.'
        ],
        realWorldUseCase:
          'Enterprise dashboards memoize tables and lazily load advanced analytics panels to keep initial render fast.',
        commonMistakes: [
          'Over-memoizing components that always re-render due to new prop references.',
          'Ignoring dependency arrays causing memoized values to become stale.',
          'Using lazy loading without Suspense fallback, resulting in runtime errors.'
        ],
        interviewQuestions: [
          'When does React.memo hurt more than help?',
          'How do you avoid recreating callback props on every render?',
          'What strategies improve performance for large lists (e.g., virtualization)?'
        ],
        keyTakeaways: [
          'Memoization tools (React.memo/useMemo/useCallback) reduce unnecessary work.',
          'Lazy loading defers non-essential code until needed.',
          'Always profile to verify performance improvements.'
        ],
        quickLinks: [
          { label: 'React Docs: Memoizing Results', url: 'https://react.dev/learn/escape-hatches#memoizing-results' },
          { label: 'React Docs: Code Splitting', url: 'https://react.dev/reference/react/lazy' }
        ]
      },
      {
        id: 'react-error-handling',
        title: 'Error Handling in React Components',
        seoTitle: 'Handling Errors and Fallback UI in React',
        oneLiner: 'Plan for failures with try/catch, graceful fallbacks, and error awareness.',
        importance:
          'Reliable apps anticipate errors—junior interviews test whether you can defend against common failure modes.',
        commonQuestions: [
          'How do you handle errors inside async functions?',
          'What is an Error Boundary in React?',
          'How do you show fallback UI on API failures?'
        ],
        conceptDescription: [
          'Wrap async logic in try/catch blocks and show user-friendly messages on failure.',
          'Error boundaries (class components or libraries) catch rendering errors and display fallback UI.',
          'Render conditional states (loading/error/empty) to keep feedback clear.',
          'Log errors to monitoring tools for observability (Sentry, LogRocket).'
        ],
        codeExample: {
          language: 'tsx',
          caption: 'Handling async errors with fallback UI',
          snippet: `export function MentorList() {
  const [mentors, setMentors] = React.useState<string[] | null>(null);
  const [error, setError] = React.useState<string | null>(null);

  React.useEffect(() => {
    let active = true;
    async function loadMentors() {
      try {
        const res = await fetch('/api/mentors');
        if (!res.ok) throw new Error('Failed to load mentors');
        const data = await res.json();
        if (active) setMentors(data.mentors);
      } catch (err) {
        if (active) setError((err as Error).message);
      }
    }
    loadMentors();
    return () => {
      active = false;
    };
  }, []);

  if (error) return <p role="alert">{error}</p>;
  if (!mentors) return <p>Loading mentors…</p>;
  return <ul>{mentors.map((mentor) => <li key={mentor}>{mentor}</li>)}</ul>;
}`
        },
        stepByStep: [
          'Initialize loading/error state before the fetch begins.',
          'Use try/catch to capture network or parsing errors.',
          'Show feedback for loading, success, and error states.',
          'Clean up asynchronous work to avoid updating unmounted components.'
        ],
        realWorldUseCase:
          'Candidate dashboards surface API errors with friendly copy and avoid blank screens when something fails.',
        commonMistakes: [
          'Not handling rejected Promises, resulting in console warnings.',
          'Displaying raw error objects to users rather than user-friendly messages.',
          'Misunderstanding that error boundaries only catch render errors, not async errors.'
        ],
        interviewQuestions: [
          'Explain how error boundaries differ from try/catch.',
          'How do you display fallback UI for failed API calls?',
          'What tools help capture client-side errors in production?'
        ],
        keyTakeaways: [
          'Handle async errors with try/catch and show fallback UI.',
          'Use error boundaries (or libraries) to catch render-time exceptions.',
          'Provide clear loading, empty, and error states for great UX.'
        ],
        quickLinks: [
          { label: 'React Docs: Handling Errors', url: 'https://react.dev/learn/keeping-components-pure#handling-errors' },
          { label: 'React Docs: Error Boundaries', url: 'https://react.dev/reference/react/Component#catching-rendering-errors-with-an-error-boundary' }
        ]
      },
      {
        id: 'react-project-practice',
        title: 'Project Structure and Practical Skills',
        seoTitle: 'Organizing React Projects and Working with APIs',
        oneLiner: 'Adopt conventions that keep React projects maintainable.',
        importance:
          'Interviewers appreciate candidates who know how to structure real-world React apps beyond toy examples.',
        commonQuestions: [
          'How do you organize components, pages, and shared utilities?',
          'Which HTTP client do you prefer and why?',
          'How do you integrate UI libraries with React?'
        ],
        conceptDescription: [
          'Use a predictable folder structure (e.g., src/components, src/pages, src/hooks, src/utils).',
          'Choose fetch or Axios for API calls—encapsulate logic in services for reuse.',
          'Manage state locally for small apps; adopt global stores only when cross-cutting concerns appear.',
          'Adopt UI libraries (MUI, Chakra, Tailwind) to speed delivery while adhering to design systems.'
        ],
        codeExample: {
          language: 'tsx',
          caption: 'Example project layout and data-fetching utility',
          snippet: `// src/services/api.ts
export async function apiGet<T>(endpoint: string): Promise<T> {
  const response = await fetch(\`\${import.meta.env.VITE_API_URL}/\${endpoint}\`);
  if (!response.ok) throw new Error('API error');
  return response.json() as Promise<T>;
}

// src/pages/Dashboard.tsx
import { useEffect, useState } from 'react';
import { apiGet } from '../services/api';

export function Dashboard() {
  const [stats, setStats] = useState<{ sessions: number } | null>(null);

  useEffect(() => {
    apiGet<{ sessions: number }>('stats').then(setStats).catch(console.error);
  }, []);

  return <section>{stats ? <p>Sessions: {stats.sessions}</p> : <p>Loading…</p>}</section>;
}`
        },
        stepByStep: [
          'Create dedicated folders for reusable components and domain-specific pages.',
          'Centralize API logic to handle base URLs, headers, and error handling consistently.',
          'Keep state colocated until multiple areas need the same data.',
          'Integrate UI libraries thoughtfully, customizing theme tokens to match product branding.'
        ],
        realWorldUseCase:
          'Interview booking portals organize code by feature modules, centralize API calls, and adopt Tailwind for rapid UI iteration.',
        commonMistakes: [
          'Dumping all components into one folder causing naming collisions.',
          'Sprinkling fetch calls throughout components leading to duplicated logic.',
          'Over-architecting state management before the need arises.'
        ],
        interviewQuestions: [
          'How would you scale a React project as the team grows?',
          'When do you reach for Redux or other global state libraries?',
          'How do you handle environment-specific configuration in React apps?'
        ],
        keyTakeaways: [
          'Maintain a clear folder structure to improve onboarding and collaboration.',
          'Encapsulate API calls and state logic for reuse and testability.',
          'Leverage UI libraries but align them with your design system.'
        ],
        quickLinks: [
          { label: 'React Docs: Project Structure', url: 'https://react.dev/learn/start-a-new-react-project#project-structure' },
          { label: 'Axios GitHub', url: 'https://github.com/axios/axios' }
        ]
      },
      {
        id: 'react-interview-focus',
        title: 'Interview-Focused Topics',
        seoTitle: 'Key React Topics You Must Nail in Interviews',
        oneLiner: 'Review the React concepts most frequently tested in interviews.',
        importance:
          'This checklist helps you prioritize revision before technical interviews and live coding rounds.',
        commonQuestions: [
          'Functional vs class components—when to use each?',
          'Compare useState and useEffect usage.',
          'How do you handle form state and validation in React?'
        ],
        conceptDescription: [
          'Modern React favors functional components with hooks; classes remain relevant mainly for legacy code or error boundaries.',
          'useState handles local state while useEffect runs side effects tied to render cycles.',
          'Props drilling vs context: context reduces passing props through intermediate components but shouldn’t replace all props.',
          'React Router fundamentals: configure routes, handle params, and provide fallbacks for unknown paths.'
        ],
        codeExample: {
          language: 'tsx',
          caption: 'Functional vs class component comparison',
          snippet: `// Functional component with hooks
export function Greeting({ name }: { name: string }) {
  const [count, setCount] = React.useState(0);
  return (
    <div>
      <p>Hello {name}</p>
      <button onClick={() => setCount((prev) => prev + 1)}>Clicked {count} times</button>
    </div>
  );
}

// Legacy class component equivalent
export class GreetingClass extends React.Component<{ name: string }, { count: number }> {
  state = { count: 0 };
  render() {
    return (
      <div>
        <p>Hello {this.props.name}</p>
        <button onClick={() => this.setState(({ count }) => ({ count: count + 1 }))}>
          Clicked {this.state.count} times
        </button>
      </div>
    );
  }
}`
        },
        stepByStep: [
          'Review functional components with hooks—they’re the default approach.',
          'Understand how useState and useEffect interact and avoid anti-patterns (e.g., infinite loops).',
          'Practice controlled forms, conditional rendering, and list rendering tasks.',
          'Be prepared to discuss routing, context, and when to adopt state management libraries.'
        ],
        realWorldUseCase:
          'Interview whiteboard challenges frequently test counter components, list rendering, and form handling to gauge React fluency.',
        commonMistakes: [
          'Memorizing API methods without understanding underlying concepts (e.g., how dependency arrays work).',
          'Overusing context to avoid prop drilling, causing unnecessary re-renders.',
          'Neglecting to handle loading/error states in simple coding challenges.'
        ],
        interviewQuestions: [
          'Walk me through the lifecycle of useEffect.',
          'How would you refactor prop drilling in a nested component tree?',
          'Explain how React Router handles nested routes and 404s.'
        ],
        keyTakeaways: [
          'Functional components with hooks dominate modern React codebases.',
          'Mastering state, effects, forms, and routing covers most junior interview scenarios.',
          'Context is a powerful tool to mitigate prop drilling but should be applied judiciously.'
        ],
        quickLinks: [
          { label: 'React Docs: Quick Start', url: 'https://react.dev/learn' },
          { label: 'React Router Tutorial', url: 'https://reactrouter.com/en/main/start/tutorial' }
        ]
      }
    ]
  }
]


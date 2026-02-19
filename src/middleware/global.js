/**
 * Helper function to get the current greeting based on the time of day.
 */
const getCurrentGreeting = () => {
  const currentHour = new Date().getHours();
  if (currentHour < 12) return 'Good Morning!';
  if (currentHour < 18) return 'Good Afternoon!';
  return 'Good Evening!';
};

/**
 * Express middleware helper that adds head asset management functionality to routes.
 *
 * Adds these methods to the response object:
 * - res.addStyle(css, priority)  -> register CSS/link tags for <head>
 * - res.addScript(js, priority)  -> register script tags
 *
 * Adds these template helpers via res.locals:
 * - renderStyles()  -> outputs all styles sorted by priority (high -> low)
 * - renderScripts() -> outputs all scripts sorted by priority (high -> low)
 */
const setHeadAssetsFunctionality = (res) => {
  res.locals.styles = [];
  res.locals.scripts = [];

  res.addStyle = (css, priority = 0) => {
    res.locals.styles.push({ content: css, priority });
  };

  res.addScript = (js, priority = 0) => {
    res.locals.scripts.push({ content: js, priority });
  };

  res.locals.renderStyles = () => {
    return res.locals.styles
      .sort((a, b) => b.priority - a.priority)
      .map((item) => item.content)
      .join('\n');
  };

  res.locals.renderScripts = () => {
    return res.locals.scripts
      .sort((a, b) => b.priority - a.priority)
      .map((item) => item.content)
      .join('\n');
  };
};

/**
 * Middleware to add local variables to res.locals for use in all templates.
 * Templates can access these values but are not required to use them.
 */
const addLocalVariables = (req, res, next) => {
  // Must be first so routes can use res.addStyle/res.addScript
  setHeadAssetsFunctionality(res);

  // Set current year for use in templates
  res.locals.currentYear = new Date().getFullYear();

  // Make NODE_ENV available to all templates
  res.locals.NODE_ENV = process.env.NODE_ENV?.toLowerCase() || 'production';

  // Make req.query available to all templates
  res.locals.queryParams = { ...req.query };

  // Set greeting based on time of day
  res.locals.greeting = getCurrentGreeting();

  // Randomly assign a theme class to the body
  const themes = ['blue-theme', 'green-theme', 'red-theme'];
  const randomTheme = themes[Math.floor(Math.random() * themes.length)];
  res.locals.bodyClass = randomTheme;

  // Convenience variable for UI state based on session state
  res.locals.isLoggedIn = false;
  if (req.session && req.session.user) {
      res.locals.isLoggedIn = true;
  }

  // Continue to the next middleware or route handler
  next();
};

export { addLocalVariables };
import { Router } from 'express';

// Import statements for controllers and middleware
import { addDemoHeaders } from '../middleware/demo/headers.js';
import { catalogPage, courseDetailPage } from './catalog/catalog.js';
import { homePage, aboutPage, demoPage, testErrorPage } from './index.js';
import { facultyListPage, facultyDetailPage } from './faculty/faculty.js';
import {
  showContactForm,
  handleContactSubmission,
  showContactResponses
} from './forms/contact.js';
import {
  showRegistrationForm,
  processRegistration,
  showAllUsers,
  showEditAccountForm,
  processEditAccount,
  processDeleteAccount
} from './forms/registration.js';
import {
  showLoginForm,
  processLogin,
  processLogout,
  showDashboard
} from './forms/login.js';
import { requireLogin } from '../middleware/auth.js';
import {
  contactValidation,
  registrationValidation,
  loginValidation,
  updateAccountValidation
} from '../middleware/validation/forms.js';

// Create a new router instance
const router = Router();

/**
 * Router-level middleware (section assets)
 * These run after global middleware and before route handlers.
 */
router.use('/catalog', (req, res, next) => {
  res.addStyle('<link rel="stylesheet" href="/css/catalog.css">');
  next();
});

router.use('/faculty', (req, res, next) => {
  res.addStyle('<link rel="stylesheet" href="/css/faculty.css">');
  next();
});

// Add contact-specific styles to all contact routes
router.use('/contact', (req, res, next) => {
    res.addStyle('<link rel="stylesheet" href="/css/contact.css">');
    next();
});

// Add registration-specific styles to all registration routes
router.use('/register', (req, res, next) => {
    res.addStyle('<link rel="stylesheet" href="/css/registration.css">');
    next();
});

// Add login-specific styles to all login routes
router.use('/login', (req, res, next) => {
    res.addStyle('<link rel="stylesheet" href="/css/login.css">');
    next();
});

// Home and basic pages
router.get('/', homePage);
router.get('/about', aboutPage);

// Course catalog routes
router.get('/catalog', catalogPage);
router.get('/catalog/:slugId', courseDetailPage);

// Demo page with special middleware
router.get('/demo', addDemoHeaders, demoPage);

// Route to trigger a test error
router.get('/test-error', testErrorPage);

// Faculty directory routes
router.get('/faculty', facultyListPage);
router.get('/faculty/:slugId', facultyDetailPage);

// Contact form routes
router.get('/contact', showContactForm);
router.post('/contact', contactValidation, handleContactSubmission);
router.get('/contact/responses', showContactResponses);

// Registration routes
router.get('/register', showRegistrationForm);
router.post('/register', registrationValidation, processRegistration);
router.get('/register/list', showAllUsers);
router.get('/register/:id/edit', requireLogin, showEditAccountForm);
router.post('/register/:id/edit', requireLogin, updateAccountValidation, processEditAccount);
router.post('/register/:id/delete', requireLogin, processDeleteAccount);

// Login routes (form and submission)
router.get('/login', showLoginForm);
router.post('/login', loginValidation, processLogin);

// Authentication-related routes at root level
router.get('/logout', processLogout);
router.get('/dashboard', requireLogin, showDashboard);

export default router;

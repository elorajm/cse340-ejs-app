import { Router } from 'express';
import { body, validationResult } from 'express-validator';
import bcrypt from 'bcrypt';
import { emailExists, saveUser, getAllUsers } from '../../models/forms/registration.js';
const router = Router();
/**
 * Validation rules for user registration
 */
const registrationValidation = [
    body('name')
        .trim()
        .isLength({ min: 2 })
        .withMessage('Name must be at least 2 characters'),
    body('email')
        .trim()
        .isEmail()
        .normalizeEmail()
        .withMessage('Must be a valid email address'),
    body('emailConfirm')
        .trim()
        .custom((value, { req }) => value === req.body.email)
        .withMessage('Email addresses must match'),
    body('password')
        .isLength({ min: 8 })
        .matches(/[0-9]/)
        .withMessage('Password must contain at least one number')
        .matches(/[!@#$%^&*]/)
        .withMessage('Password must contain at least one special character'),
    body('passwordConfirm')
        .custom((value, { req }) => value === req.body.password)
        .withMessage('Passwords must match')
];
/**
 * Display the registration form page.
 */
const showRegistrationForm = (req, res) => {
    res.render('forms/registration/form', {
        title: 'User Registration'
    });
};
/**
 * Handle user registration with validation and password hashing.
 */
const processRegistration = async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        // Store each validation error as a separate flash message
        errors.array().forEach(error => {
            req.flash('error', error.msg);
        });
        return res.redirect('/register');
    }
    const { name, email, password } = req.body;
    try {
        const exists = await emailExists(email);
        if (exists) {
            req.flash('warning', 'An account with that email already exists. Please log in or use a different email.');
            return res.redirect('/register');
        }
        const hashedPassword = await bcrypt.hash(password, 10);
        await saveUser(name, email, hashedPassword);
        req.flash('success', 'Registration successful! You can now log in.');
        res.redirect('/login');
    } catch (error) {
        console.error('Error registering user:', error);
        req.flash('error', 'Unable to register at this time. Please try again later.');
        res.redirect('/register');
    }
};
/**
 * Display all registered users.
 */
const showAllUsers = async (req, res) => {
    // Initialize users as empty array
    let users = [];
    try {
        users = await getAllUsers();
    } catch (error) {
        console.error('Error retrieving users:', error);
        // users remains empty array on error
    }
    res.render('forms/registration/list', {
        title: 'Registered Users',
        users
    });
};
/**
 * GET /register - Display the registration form
 */
router.get('/', showRegistrationForm);
/**
 * POST /register - Handle registration form submission with validation
 */
router.post('/', registrationValidation, processRegistration);
/**
 * GET /register/list - Display all registered users
 */
router.get('/list', showAllUsers);
export default router;

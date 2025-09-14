import { Router } from 'express';
import * as userController from '../controllers/user.controller.js';
import { body } from 'express-validator';
import * as authMiddleware from '../middleware/auth.middleware.js';

const router = Router();

// ✅ Register Route
router.post(
  '/register',
  [
    body('email').isEmail().withMessage('Email must be a valid email address'),
    body('password').isLength({ min: 6 }).withMessage('Password must be at least 6 characters long'),
  ],
  userController.createUserController
);

// ✅ Login Route
router.post(
  '/login',
  [
    body('email').isEmail().withMessage('Email must be a valid email address'),
    body('password').isLength({ min: 6 }).withMessage('Password must be at least 6 characters long'),
  ],
  userController.loginController
);

// ✅ Forgot Password Route
router.post(
  '/forgot-password',
  [
    body('email').isEmail().withMessage('Enter a valid email'),
    body('newPassword').isLength({ min: 6 }).withMessage('Password must be at least 6 characters long'),
    body('confirmPassword')
      .custom((value, { req }) => value === req.body.newPassword)
      .withMessage('Passwords do not match'),
  ],
  userController.forgotPasswordController
);

// ✅ Profile Route (Protected)
router.get('/profile', authMiddleware.authUser, userController.profileController);

// ✅ Logout Route (Protected)
router.get('/logout', authMiddleware.authUser, userController.logoutController);

// ✅ Get All Users (Protected)
router.get('/all', authMiddleware.authUser, userController.getAllUsersController);

export default router;

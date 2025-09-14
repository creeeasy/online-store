// controllers/authController.ts (Refactored)
import { Request, Response, NextFunction } from 'express';
import { body } from 'express-validator';
import User from '../models/User';
import { generateToken } from '../utils/jwt';
import { AuthRequest, UserPayload } from '../types';
import { ResponseHandler, asyncHandler, validateRequest } from '../utils/responseHandler';

// @desc    Register user
// @route   POST /api/auth/register
// @access  Public
export const register = [
  // Validation
  body('username')
    .isLength({ min: 3 })
    .withMessage('Username must be at least 3 characters long'),
  body('email').isEmail().withMessage('Please include a valid email'),
  body('password')
    .isLength({ min: 6 })
    .withMessage('Password must be at least 6 characters long'),

  validateRequest, // Add validation middleware

  asyncHandler(async (req: Request, res: Response) => {
    const { username, email, password, role } = req.body;

    // Check if user exists
    const existingUser = await User.findOne({
      $or: [{ email }, { username }],
    });

    if (existingUser) {
      return ResponseHandler.error(
        res,
        'User already exists with this email or username',
        400,
        [{
          field: existingUser.email === email ? 'email' : 'username',
          message: `${existingUser.email === email ? 'Email' : 'Username'} already exists`,
          value: existingUser.email === email ? email : username,
          location: 'body'
        }],
        'USER_ALREADY_EXISTS'
      );
    }

    // Create user
    const user = await User.create({
      username,
      email,
      password,
      role: role || 'user',
    });

    // Generate token
    const token = generateToken({
      id: user._id.toString(),
      role: user.role,
    });

    const userData = {
      token,
      user: {
        id: user._id.toString(),
        username: user.username,
        email: user.email,
        role: user.role,
      },
    };

    return ResponseHandler.success(
      res,
      userData,
      'User registered successfully',
      201
    );
  }),
];

// @desc    Login user
// @route   POST /api/auth/login
// @access  Public
export const login = [
  // Validation
  body('email').isEmail().withMessage('Please include a valid email'),
  body('password').exists().withMessage('Password is required'),

  validateRequest,

  asyncHandler(async (req: Request, res: Response) => {
    const { email, password } = req.body;

    // Check for user
    const user = await User.findOne({ email }).select('+password');

    if (!user) {
      return ResponseHandler.unauthorized(res, 'Invalid credentials');
    }

    // Check if password matches
    const isMatch = await user.comparePassword(password);

    if (!isMatch) {
      return ResponseHandler.unauthorized(res, 'Invalid credentials');
    }

    // Generate token
    const token = generateToken({
      id: user._id.toString(),
      role: user.role,
    });

    const userData = {
      token,
      user: {
        id: user._id.toString(),
        username: user.username,
        email: user.email,
        role: user.role,
      },
    };

    return ResponseHandler.success(res, userData, 'Login successful');
  }),
];

// @desc    Get current user
// @route   GET /api/auth/me
// @access  Private
export const getMe = asyncHandler(async (req: AuthRequest, res: Response) => {
  const user = await User.findById(req.user?.id);

  if (!user) {
    return ResponseHandler.notFound(res, 'User');
  }

  const userData = {
    user: {
      id: user._id.toString(),
      username: user.username,
      email: user.email,
      role: user.role,
    },
  };

  return ResponseHandler.success(res, userData, 'User profile retrieved successfully');
});

export const validateToken = asyncHandler(async (req: AuthRequest, res: Response) => {
  const userData = {
    user: {
      id: req.user?.id,
      role: req.user?.role,
    },
  };

  return ResponseHandler.success(res, userData, 'Token is valid');
});

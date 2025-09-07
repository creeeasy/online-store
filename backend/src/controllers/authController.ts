import { Request, Response, NextFunction } from 'express';
import { body, validationResult } from 'express-validator';
import User from '../models/User';
import { generateToken } from '../utils/jwt';
import { AuthRequest, UserPayload } from '../types';

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

  async (req: Request, res: Response, next: NextFunction) => {
    try {
      const errors = validationResult(req);
      if (!errors.isEmpty()) {
        return res.status(400).json({
          success: false,
          message: 'Validation failed',
          errors: errors.array(),
        });
      }

      const { username, email, password, role } = req.body;

      // Check if user exists
      const existingUser = await User.findOne({
        $or: [{ email }, { username }],
      });
      console.log(email,username)
      console.log(existingUser)
      if (existingUser) {
        return res.status(400).json({
          success: false,
          message: 'User already exists with this email or username',
        });
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

      res.status(201).json({
        success: true,
        message: 'User registered successfully',
        data: {
          token,
          user: {
            id: user._id.toString(),
            username: user.username,
            email: user.email,
            role: user.role,
          },
        },
      });
    } catch (error) {
      next(error);
    }
  },
];

// @desc    Login user
// @route   POST /api/auth/login
// @access  Public
export const login = [
  // Validation
  body('email').isEmail().withMessage('Please include a valid email'),
  body('password').exists().withMessage('Password is required'),

  async (req: Request, res: Response, next: NextFunction) => {
    try {
      const errors = validationResult(req);
      if (!errors.isEmpty()) {
        return res.status(400).json({
          success: false,
          message: 'Validation failed',
          errors: errors.array(),
        });
      }

      const { email, password } = req.body;

      // Check for user
      const user = await User.findOne({ email }).select('+password');

      if (!user) {
        return res.status(401).json({
          success: false,
          message: 'Invalid credentials',
        });
      }

      // Check if password matches
      const isMatch = await user.comparePassword(password);

      if (!isMatch) {
        return res.status(401).json({
          success: false,
          message: 'Invalid credentials',
        });
      }

      // Generate token
      const token = generateToken({
        id: user._id.toString(),
        role: user.role,
      });

      res.json({
        success: true,
        message: 'Login successful',
        data: {
          token,
          user: {
            id: user._id.toString(),
            username: user.username,
            email: user.email,
            role: user.role,
          },
        },
      });
    } catch (error) {
      next(error);
    }
  },
];

// @desc    Get current user
// @route   GET /api/auth/me
// @access  Private
export const getMe = async (req: AuthRequest, res: Response, next: NextFunction) => {
  try {
    const user = await User.findById(req.user?.id);

    if (!user) {
      return res.status(404).json({
        success: false,
        message: 'User not found',
      });
    }

    res.json({
      success: true,
      data: {
        user: {
          id: user._id.toString(),
          username: user.username,
          email: user.email,
          role: user.role,
        },
      },
    });
  } catch (error) {
    next(error);
  }
};

export const validateToken = async (req: AuthRequest, res: Response, next: NextFunction) => {
  try {
    // If protect middleware passed, token is valid
    res.json({
      success: true,
      message: 'Token is valid',
      data: {
        user: {
          id: req.user?.id,
          role: req.user?.role,
        },
      },
    });
  } catch (error) {
    next(error);
  }
};
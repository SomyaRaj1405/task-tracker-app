const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const authService = require('../services/authService');

// Basic email validation regex
const EMAIL_REGEX = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

const authController = {
  /**
   * Registers a new user
   * POST /auth/signup
   */
  signup: async (req, res, next) => {
    try {
      const { name, email, password } = req.body;

      // 1. Basic validation
      if (!name || !name.trim()) {
        return res.status(400).json({ status: 'error', message: 'Name is required.' });
      }
      if (!email || !email.trim()) {
        return res.status(400).json({ status: 'error', message: 'Email address is required.' });
      }
      if (!EMAIL_REGEX.test(email)) {
        return res.status(400).json({ status: 'error', message: 'Please provide a valid email address.' });
      }
      if (!password || password.length < 6) {
        return res.status(400).json({ status: 'error', message: 'Password must be at least 6 characters long.' });
      }

      // 2. Check if user already exists
      const existingUser = await authService.findUserByEmail(email);
      if (existingUser) {
        return res.status(409).json({ status: 'error', message: 'An account with this email address already exists.' });
      }

      // 3. Hash the password securely
      const salt = await bcrypt.genSalt(10);
      const hashedPassword = await bcrypt.hash(password, salt);

      // 4. Create user record
      const newUser = await authService.createUser(name.trim(), email.trim(), hashedPassword);

      // 5. Generate JWT token
      const token = jwt.sign(
        { id: newUser.id, email: newUser.email },
        process.env.JWT_SECRET || 'super_secret_key_for_velotask_auth_2026_antigravity',
        { expiresIn: '24h' }
      );

      res.status(201).json({
        status: 'success',
        message: 'Account created successfully.',
        data: {
          user: newUser,
          token
        }
      });
    } catch (error) {
      next(error);
    }
  },

  /**
   * Logs in an existing user
   * POST /auth/login
   */
  login: async (req, res, next) => {
    try {
      const { email, password } = req.body;

      // 1. Validation
      if (!email || !email.trim()) {
        return res.status(400).json({ status: 'error', message: 'Email address is required.' });
      }
      if (!password) {
        return res.status(400).json({ status: 'error', message: 'Password is required.' });
      }

      // 2. Find user in database
      const user = await authService.findUserByEmail(email);
      if (!user) {
        return res.status(401).json({ status: 'error', message: 'Invalid email address or password.' });
      }

      // 3. Verify password hash
      const isMatch = await bcrypt.compare(password, user.password);
      if (!isMatch) {
        return res.status(401).json({ status: 'error', message: 'Invalid email address or password.' });
      }

      // 4. Generate JWT token
      const token = jwt.sign(
        { id: user.id, email: user.email },
        process.env.JWT_SECRET || 'super_secret_key_for_velotask_auth_2026_antigravity',
        { expiresIn: '24h' }
      );

      res.status(200).json({
        status: 'success',
        message: 'Logged in successfully.',
        data: {
          user: {
            id: user.id,
            name: user.name,
            email: user.email,
            created_at: user.created_at
          },
          token
        }
      });
    } catch (error) {
      next(error);
    }
  }
};

module.exports = authController;

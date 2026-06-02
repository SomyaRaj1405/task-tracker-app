const jwt = require('jsonwebtoken');

const authMiddleware = (req, res, next) => {
  const authHeader = req.headers.authorization;

  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    return res.status(401).json({
      status: 'error',
      message: 'Access denied. No authentication token provided.'
    });
  }

  const token = authHeader.split(' ')[1];

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET || 'super_secret_key_for_velotask_auth_2026_antigravity');
    
    // Attach decoded user info (id, email) to the request object
    req.user = decoded;
    next();
  } catch (error) {
    console.error('JWT Verification Error:', error.message);
    
    // Check for specific token errors
    if (error.name === 'TokenExpiredError') {
      return res.status(401).json({
        status: 'error',
        message: 'Authentication session expired. Please log in again.'
      });
    }
    
    return res.status(401).json({
      status: 'error',
      message: 'Invalid authentication token. Authorization failed.'
    });
  }
};

module.exports = authMiddleware;

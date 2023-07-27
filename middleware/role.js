const role = (allowedRoles) => {
    return (req, res, next) => {
      const userRole = req?.user?.role; // Assuming the authenticated user is stored in req.user
 
      if (allowedRoles.includes(userRole)) {
        next(); // User has the required role, proceed to the next middleware/controller
      } else {
        res.status(403).json({ error: 'Unauthorized' });
      }
    };
  };
  
  module.exports = role;
  
async function roleMiddleware(req, res, next) {
  try {
    if (!req.user.role) {
      return res.status(403).json({ success: false, message: "Forbidden" });
    }

    // Allow both admin and organizer roles instead of just admin
    if (!["admin", "organizer"].includes(req.user.role)) {
      return res.status(403).json({ 
        success: false, 
        message: `Forbidden: Role '${req.user.role}' not allowed. Required: admin or organizer` 
      });
    }

    next();
  } catch (error) {
    return res.status(403).json({ success: false, message: "Forbidden" });
  }
}

export default roleMiddleware;
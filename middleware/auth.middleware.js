const createError = require("http-errors");
const protect = (req, res, next) => {
  try {
    const { user } = req.session;

    if (!user) throw createError.Unauthorized();
    // return res.status(401).json({ status: "fail", message: "unauthorized" });

    req.user = user;

    next();
  } catch (error) {
    next(error);
  }
};

module.exports = protect;

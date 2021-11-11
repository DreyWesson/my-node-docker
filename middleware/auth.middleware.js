const protect = (req, res, next) => {
  console.log(req.session);
  const { user } = req.session;

  if (!user) {
    return res.status(401).json({ status: "fail", message: "unauthorized" });
  }

  req.user = user;

  next();
};

module.exports = protect;

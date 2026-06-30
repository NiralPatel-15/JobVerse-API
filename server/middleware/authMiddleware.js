module.exports = (req, res, next) => {
  try {
    // your auth logic
    next();
  } catch (err) {
    res.status(401).json({ error: "Unauthorized" });
  }
};

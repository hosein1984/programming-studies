function log(req, res, next) {
  console.log(`Custom logger middleware. Url: ${req.url}`);
  next();
}

module.exports = { log };

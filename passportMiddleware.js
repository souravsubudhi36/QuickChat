const servicepassport = require("./passport");
const jwt = require("jwt-simple");
const local = require("passport-local");
const passport = require("passport");

const requireAuth = passport.authenticate("jwt", { session: false });
const requiresignin = passport.authenticate("local", {
  session: false
});

const secret = process.env.SECRET || "k2enfoe4nfewf89ubwkeufkebfebuf";

function createtoken(userName) {
  const timestamp = new Date().getTime();
  return jwt.encode({ sub: userName, iat: timestamp }, secret);
}

module.exports = {
  requireAuth,
  requiresignin,
  createtoken
};

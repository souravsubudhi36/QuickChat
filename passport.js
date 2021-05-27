const passport = require("passport");
const jwtstrat = require("passport-jwt").Strategy;
const extractjwt = require("passport-jwt").ExtractJwt;

const local = require("passport-local");
const secret = process.env.SECRET || "k2enfoe4nfewf89ubwkeufkebfebuf";

const client = require("./redis");

const locallogin = new local(
  { usernameField: "username" },
  async (username, password, done) => {
    console.log(username, password);
    const pass = await client.hget("auth", username);
    console.log(pass);
    if (pass && pass === password) {
      return done(null, username);
    } else {
      return done(null, false);
    }
  }
);

const jwtoptions = {
  jwtFromRequest: extractjwt.fromHeader("authorization"),
  secretOrKey: secret
};

const jwtLogin = new jwtstrat(jwtoptions, async function(payload, done) {
  const user = await client.hget("auth", payload.sub);
  if (user) {
    return done(null, payload.sub);
  } else {
    return done(null, false);
  }
});

passport.use(jwtLogin);
passport.use(locallogin);

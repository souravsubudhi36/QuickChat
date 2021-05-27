const passportUtil = require("../passportMiddleware");
const client = require("../redis");

module.exports = app => {
  app.post("/api/signup", async (req, res) => {
    if (!req.body.username || !req.body.password) {
      res.status(400).send({ error: "Please provide username and password" });
    }
    const isPresent = await client.hget("auth", req.body.username);
    if (!isPresent) {
      client.hset("auth", req.body.username, req.body.password);
      res.send({ token: passportUtil.createtoken(req.body.username) });
    } else {
      res.status(400).send("Username exists");
    }
  });

  app.post("/api/signin", passportUtil.requiresignin, (req, res) => {
    res.send({ token: passportUtil.createtoken(req.user) });
  });
};

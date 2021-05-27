const passportUtil = require("../passportMiddleware");
const client = require("../redis");

module.exports = app => {
  app.get("/api/queue", passportUtil.requireAuth, async (req, res) => {
    const data = await client.lrange(req.user, 0, -1);
    client.del(req.user);
    res.send(data);
  });

  app.post("/api/userexist", async (req, res) => {
    const user = await client.hget("online", req.body.username);
    const exist = user ? true : false;
    res.send(exist);
  });
};

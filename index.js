//setup
const app = require("express")();
const express = require("express");
const http = require("http").createServer(app);
const io = require("socket.io")(http);

// helpers
const jwt = require("socketio-jwt");
const bodyParser = require("body-parser");
const client = require("./redis");
// secret key
const secret = process.env.SECRET || "k2enfoe4nfewf89ubwkeufkebfebuf";

//middlewares
app.use(bodyParser.json({ type: "*/*" }));
io.use(
  jwt.authorize({
    secret,
    timeout: 15000,
    handshake: true
  })
);

//routes
const authRoutes = require("./routes/auth");
const appRoutes = require("./routes/app");

authRoutes(app);
appRoutes(app);

//sockets
const relaySocket = require("./sockets/relay");

io.on("connection", socket => {
  // handle presence
  client.hset("online", socket.decoded_token.sub, socket.id);

  relaySocket(socket);

  socket.on("disconnect", () => {
    client.hset("online", socket.decoded_token.sub, false);
  });
});

// setup
if (process.env.NODE_ENV === "production") {
  app.use(express.static("client/build"));

  const path = require("path");
  app.get("*", (req, res) => {
    res.sendFile(path.resolve(__dirname, "client", "build", "index.html"));
  });
}

http.listen(process.env.PORT || 5000);

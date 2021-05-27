const client = require("../redis");

module.exports = socket => {
  socket.on("new conversation", data => {
    //for each participant
    data.participants.forEach(async rec => {
      // if current user, skip iteration
      if (rec === socket.decoded_token.sub) return;

      // check if online
      const online = await client.hget("online", rec);

      if (online && online !== "false") {
        // online, emit
        socket.to(online).emit("new conversation", data);
      } else {
        // add to message queue
        client.rpush(rec, JSON.stringify(data));
      }
    });
  });

  socket.on("message", data => {
    console.log("new message", socket.decoded_token.sub);
    // for each recipient
    data.recipients.forEach(async rec => {
      // if current user, skip this iteration
      if (rec === socket.decoded_token.sub) return;
      // check if online
      const online = await client.hget("online", rec);

      if (online && online !== "false") {
        // person is online, emit message
        socket.to(online).emit("message", data);
      } else {
        // perosn if offline add to message queue
        client.rpush(rec, JSON.stringify(data));
      }
    });
  });

  socket.on("remove from conversation", async data => {
    const online = await client.hget("online", data.user);

    if (online && online !== "false") {
      // person is online, emit message
      socket.to(online).emit("you are removed", {
        conversation: data.conversation
      });
    } else {
      // perosn if offline add to message queue
      client.rpush(
        data.user,
        JSON.stringify({
          removed: true,
          conversation: data.conversation
        })
      );
    }

    data.recipients.forEach(async rec => {
      if (rec === socket.decoded_token.sub) return;
      if (rec === data.user) return;

      // check if online
      const online = await client.hget("online", rec);

      if (online && online !== "false") {
        // person is online, emit message
        socket.to(online).emit("remove from conversation", {
          user: data.user,
          conversation: data.conversation
        });
      } else {
        // perosn if offline add to message queue
        client.rpush(
          rec,
          JSON.stringify({
            user: data.user,
            conversation: data.conversation,
            add: false
          })
        );
      }
    });
  });

  socket.on("add to conversation", async data => {
    const online = await client.hget("online", data.user);

    if (online && online !== "false") {
      // person is online, emit message
      socket.to(online).emit("new conversation", {
        participants: [...data.recipients, data.user],
        conversation: data.conversation
      });
    } else {
      // perosn if offline add to message queue
      client.rpush(
        data.user,
        JSON.stringify({
          participants: [...data.recipients, data.user],
          conversation: data.conversation,
          add: true
        })
      );
    }

    data.recipients.forEach(async rec => {
      if (rec === socket.decoded_token.sub) return;
      // check if online
      const online = await client.hget("online", rec);

      if (online && online !== "false") {
        // person is online, emit message
        socket.to(online).emit("add to conversation", {
          user: data.user,
          conversation: data.conversation
        });
      } else {
        // perosn if offline add to message queue
        client.rpush(
          rec,
          JSON.stringify({
            user: data.user,
            conversation: data.conversation,
            add: true
          })
        );
      }
    });
  });
};

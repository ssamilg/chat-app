var http = require("http");
var express = require("express");
var app = express();
var server = http.createServer(app);
var io = require("socket.io").listen(server);

app.get("/", (req, res) => {
  res.sendFile("./index.html", { root: __dirname });
});

io.on("connection", function (socket) {
  console.log("A user connected");

  socket.on("message", function (msg) {
    io.emit("message", {
      user: 'USER',
      message: msg,
    });
  });
  socket.on("disconnect", function () {
    console.log("A user disconnected");
  });
});

const port = 8000;
server.listen(port, () => {
  console.log("Server is listening on:" + port + " now...");
});

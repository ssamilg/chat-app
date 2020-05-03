const app = require("express")();
const http = require("http").Server(app);
const io = require("socket.io")(http);
const mongoose = require("mongoose");

let users = [];
let messages = [];

mongoose.connect("mongodb://127.0.0.1:27017/chatApp", { useNewUrlParser: true, useUnifiedTopology: true });

const ChapSchema = mongoose.Schema({
  username: String,
  message: String,
});

const ChatModel = mongoose.model("chat", ChapSchema);

ChatModel.find((err, result) => {
  if (err) throw err;

  messages = result;
});

app.get("/", (req, res) => {
  res.sendFile("./index.html", { root: __dirname });
});

io.on("connection", (socket) => {
//Logged-in users
  socket.emit('loggedIn', {
    users: users.map(s => s.username),
    messages: messages
  });

//New User joined
  socket.on("newUser", (username) => {
    console.log(`${username} connected.`);
    socket.username = username;
    users.push(socket);

    io.emit('userOnline', socket.username)
  });

  //Disconnect
  socket.on("disconnect", () => {
    console.log(`${socket.username} disconnected.`);
    io.emit('userLeft', socket.username);
    users.splice(users.indexOf(socket), 1);
  });

  //Send message
  socket.on("message", (msg) => {
    let message = new ChatModel({
      username: socket.username,
      message: msg,      
    });

    message.save((err, result) => {
      if (err) throw err;
      
      messages.push(result);
    });
    // messages.push(message);
    
    //Logged-in users recieve message
    io.emit("message", result);

  });

});

const port = 8000;
http.listen(port, () => {
  console.log("Server is listening on:" + port + " now...");
});

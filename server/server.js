const app = require("express")();
const http = require("http").Server(app);
const io = require("socket.io")(http);
const mongoose = require("mongoose");
const morgan = require("morgan");
const bodyParser = require("body-parser");
const cors = require("cors");
require("dotenv/config");

let users = [];
let messages = [];

//DB Configs
// mongoose.connect("mongodb://127.0.0.1:27017/chatApp", { useNewUrlParser: true, useUnifiedTopology: true }, () => {
//   console.log('db connected');
// });
mongoose.connect(process.env.DB_CONNECTION, { useNewUrlParser: true, useUnifiedTopology: true }, () => {
  console.log('db connected');
});

//Middlewares
app.use(morgan('dev'));
app.use(bodyParser.json());
app.use(cors());

//Routes
app.use('/users', require('./routes/UserRoute'));

// {
//   const MessageSchema = mongoose.Schema({
//     connect: String,
//     messageFrom: Int32Array,
//     messageTo: Int32Array,
//     dateSend: Date,
//   });
//   const RoomSchema = mongoose.Schema({
//     title: String,
//     description: String,
//     dateCreated: Date,
//   });

//   const MessageModel = mongoose.model("message", MessageSchema);
//   const RoomModel = mongoose.model("room", RoomSchema);
// }


const ChatSchema = mongoose.Schema({
  username: String,
  message: String,
});

const ChatModel = mongoose.model("chat", ChatSchema);


ChatModel.find((err, result) => {
  if (err) throw err;

  messages = result;
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
    io.emit("message", message);

  });

});

const port = process.env.PORT || 4000;
http.listen(port, () => {
  console.log("Server is listening on:" + port + " now...");
});

const app = require("express")();
const http = require("http").Server(app);
const io = require("socket.io")(http);
const mongoose = require("mongoose");
const morgan = require("morgan");
const bodyParser = require("body-parser");
const cors = require("cors");
const moment = require("moment");
require("dotenv/config");

const MessageModel = require("./models/MessageModel");
const UserModel = require("./models/UserModel");

let allUsers = [];
let users = [];
let messages = [];
let room = 'all';

//DB Configs
mongoose.connect(process.env.DB_CONNECTION, { useNewUrlParser: true, useUnifiedTopology: true }, () => {
  console.log('db connected');
});

//Middlewares
app.use(morgan('dev'));
app.use(bodyParser.json());
app.use(cors());

//Routes
app.use('/users', require('./routes/UserRoute'));
app.use('/chat', require('./routes/MessageRoute'));

MessageModel.find({ messageTo: room },(err, result) => {
  if (err) throw err;

  messages = result;
});

UserModel.find((err, result) => {
  if (err) throw err;

  allUsers = result.map(u => u.username);
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
    socket.room = room;
    users.push(socket);

    io.emit('userOnline', socket.username)
  });

  //Change Room
  socket.on("joinRoom", async newRoom => {
    const roomMessages = await MessageModel.find({ messageTo: newRoom });
    messages = roomMessages;
    socket.room = newRoom;
    io.emit("synchMessages", messages);
  });

  //Disconnect
  socket.on("disconnect", () => {
    console.log(`${socket.username} disconnected.`);
    io.emit('userLeft', socket.username);
    users.splice(users.indexOf(socket), 1);
  });

  //Send message
  socket.on("message", (msg) => {
    const message = new MessageModel({
      messageFrom: socket.username,
      messageTo: socket.room,
      content: msg,
      dateSend: Date.now(),      
    });

    message.save((err, result) => {
      if (err) throw err;
      
      messages.push(result);
    });
    
    //Logged-in users recieve message
    io.emit("message", message);
  });

});

const port = process.env.PORT;
http.listen(port, () => {
  console.log("Server is listening on:" + port + " now...");
});

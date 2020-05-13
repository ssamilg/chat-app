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

let users = [];
let messages = [];
let room = 'Global';

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



io.on("connection", async (socket) => {
//Logged-in users
  // let allUsers = await UserModel.find();
  // allUsers = allUsers.map(u => u.username);

  socket.emit('loggedIn', {
    users: users,
    // messages: messages
  });

  //New User joined
  socket.on("newUser", async (user) => {
    console.log(`${user.username} connected.`);
    await UserModel.updateOne({username: user.username}, { $set: {socket: socket.id}});
    const onlineUser = {
      socket: socket.id,
      username: user.username,
    };
    users.push(onlineUser);
    io.emit('userOnline', onlineUser)
  });

  // //Change Room
  // socket.on("joinRoom", async newRoom => {
  //   const roomMessages = await MessageModel.find({ messageTo: newRoom });
  //   messages = roomMessages;
  //   socket.room = newRoom;
  //   io.emit("roomMessages", messages);
  // });
  // Private Chat
  socket.on("joinPM", async (params) => {
    const pmMessages = await MessageModel.find({
      $or: [{ messageTo: params.messageTo, messageFrom: params.messageFrom },
             { messageTo: params.messageFrom, messageFrom: params.messageTo }]});
    messages = pmMessages;
    // socket.room = params.messageTo;
    io.emit("pmMessages", pmMessages);
  });

  //Disconnect
  socket.on("disconnect", () => {
    console.log(`${socket.username} disconnected.`);
    io.emit('userLeft', socket.username);
    users.splice(users.indexOf(socket), 1);
  });

  //Send message
  socket.on("message", (data) => {
    const message = new MessageModel({
      messageFrom: data.messageFrom,
      messageTo: data.messageTo,
      content: data.content,
      dateSend: Date.now(),      
    });

    message.save((err, result) => {
      if (err) throw err;
      
      messages.push(result);
    });
    console.log(data);

    if (data.targetSocket) {
      //if there is a socket send only to that user
      io.to(data.targetSocket).emit("message", message);
      io.to(data.senderSocket).emit("message", message);
    } else {
      //Logged-in users recieve message
      io.emit("message", message);
    }
  });

});

const port = process.env.PORT;
http.listen(port, () => {
  console.log("Server is listening on:" + port + " now...");
});

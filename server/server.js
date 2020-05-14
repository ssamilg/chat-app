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
const RoomModel = require("./models/RoomModel");

// let offlineUsers = [];
let onlineUsers = [];
let messages = [];
// let rooms = [];

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

// MessageModel.find({ messageTo: room },(err, result) => {
//   if (err) throw err;

//   messages = result;
// });

io.on("connection", async (socket) => {
  //Logged-in users
  let offlineUsers = await UserModel.find();
  const rooms = await RoomModel.find();
 
  offlineUsers = offlineUsers.map(u => u.username);
  socket.emit('loggedIn', ({
    socket: socket.id,
    offlineUsers: offlineUsers,
    onlineUsers: onlineUsers,
    rooms: rooms,
  }));

  //New User joined
  socket.on("newUser", async (user) => {
    console.log(`${user.username} connected.`);
    await UserModel.updateOne({username: user.username}, { $set: {socket: socket.id}});

    onlineUsers.push(user.username);
    io.emit('userOnline', (user.username));
  });

  //User Disconnect
  socket.on("disconnect", async (err) => {
    const user = await UserModel.findOne({socket: socket.id});
    if(user) {
      console.log(`${user.username} disconnected.`);
      onlineUsers.splice(onlineUsers.indexOf(user.username), 1);
      io.emit('userLeft', (user.username));
    }
  });

  // Create Room
  socket.on('createRoom', async (data) => {    
    const room = new RoomModel({
      title: data.title,
      description: data.description,
      dateCreated: Date.now(),
      createdBy: data.createdBy,
    });

    room.save((err, result) => {
      if (err) throw err;
    });
    const dbRooms = await RoomModel.find();
    io.emit('getRooms', (dbRooms));
  });

  // Join Room
  socket.on('joinRoom', async (data) => {
    await RoomModel.findById((data.roomId), async (err, result) => {
      if (err) throw err;
      
      if (!result.members.some((element) => { return element === data.username })) {
        result.members.push(data.username);
      }
      
      await result.save(async () => {
        if (err) throw err;
        const user = await UserModel.findOne({username: data.username});

        socket.join(data.roomId);
        // io.to(data.roomId).emit('userJoinedRoom', {
        //   user: user.username,
        //   room: result.title,
        // });
        const roomMessages = await MessageModel.find({ messageTo: data.roomTitle});
        io.to(data.roomId).emit("roomMessages", roomMessages);
      });
    });
  });

  // Private Chat
  socket.on("joinPM", async (params) => {
    const pmMessages = await MessageModel.find({
      $or: [{ messageTo: params.messageTo, messageFrom: params.messageFrom },
             { messageTo: params.messageFrom, messageFrom: params.messageTo }]});

    io.to(params.userSocket).emit("pmMessages", pmMessages);
  });

  socket.on('joinGlobal', async () => {
    const globalMessages = await MessageModel.find({ messageTo: 'global' });
    io.emit('getGlobalMessages', globalMessages);
  });
  //Send message
  socket.on("sendMessage", async (data) => {
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

    let socketId = await UserModel.findOne({ username: data.messageTo });
    
    if (socketId) {
      socketId = socketId.socket;
      io.to(socketId).emit("getMessage", message);
      console.log('pm');      
      } else {
      const room = await RoomModel.findOne({ title: data.messageTo });
      if (room) {
        io.to(room._id).emit('getMessage', message);
        console.log('room');      
      } else {
        io.emit('getMessage', message);
      }
    }
      //if there is a socket send only to that user
    //   io.to(data.targetSocket).emit("getMessage", message);
    // } else if (data.messageTo === 'global') {
    //   //Logged-in users recieve message
    //   socket.broadcast.emit("getMessage", message);
    // }
  });
});

const port = process.env.PORT;
http.listen(port, () => {
  console.log("Server is listening on:" + port + " now...");
});

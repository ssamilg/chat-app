const express = require("express");
const app = express();
const http = require("http").Server(app);
const io = require("socket.io")(http);
const mongoose = require("mongoose");
const morgan = require("morgan");
const cors = require("cors");
require("dotenv/config");

//DB Configs
mongoose.connect(process.env.DB_CONNECTION, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
  useCreateIndex: true,
}, () => {
  console.log('db connected');
});

//Middlewares
app.use(morgan('dev'));
app.use(express.json());
app.use(cors());

//Routes
app.use('/users', require('./routes/UserRoute'));
app.use('/chat', require('./routes/MessageRoute'));

// Models
const MessageModel = require("./models/MessageModel");
const UserModel = require("./models/UserModel");
const RoomModel = require("./models/RoomModel");
// const { users } = require("./controllers/UserController");

let onlineUsers = [];
let messages = [];
let users = [];

const toggleUserIsOnline = (user) => {
  if (user) {
    const foundUser = users.find((u) => u._id.toString() === user._id.toString());
    const index = users.indexOf(foundUser);
  
    if (index !== -1) {
      users[index].isOnline = !users[index].isOnline;
    } else {
      console.log('User Error !');
    }
  } else {
    console.log('Invalid user !');
  }
};

const fetchMessages = async (messageFrom, messageTo) => {
  const messages = await MessageModel.find({
    $or: [
      { messageTo: messageTo, messageFrom: messageFrom },
      { messageTo: messageFrom, messageFrom: messageTo },
    ],
  });

  console.log('messages');
  console.log(messages);
};

io.on("connection", async (socket) => {
  //Logged-in users
  // let users = await UserModel.find();
  UserModel.find().select('username + isOnline + socket + name + surname + dateCreated')
    .then((data) => {
      users = data;
    });
  const rooms = await RoomModel.find();
 
  socket.emit('loggedIn', ({
    socket: socket.id,
    users,
    rooms,
  }));

  //New User joined
  socket.on("newUser", async (user) => {
    console.log(`${user.username} connected.`);

    await UserModel.updateOne({_id: user._id}, { $set: {socket: socket.id, isOnline: true }});

    toggleUserIsOnline(user);
    io.emit('usersChanged', (users));
  });

  //User Disconnect
  socket.on("disconnect", async (err) => {
    const user = await UserModel.findOne({socket: socket.id});
    await UserModel.updateOne({_id: user._id}, { $set: {socket: null, isOnline: false }});

    if(user) {
      console.log(`${user.username} disconnected.`);

      toggleUserIsOnline(user);
      io.emit('usersChanged', (users));
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
    
    console.log('params');      
    console.log(params);      
    fetchMessages(params.messageFrom, params.messageTo);
    io.to(params.userSocket).emit("pmMessages", pmMessages);
  });

  socket.on('joinGlobal', async () => {
    const globalMessages = await MessageModel.find({ messageTo: 'global' });
    io.emit('getGlobalMessages', globalMessages);
  });

  //Send message
  socket.on("sendMessage", async (data) => {
    const message = new MessageModel({
      ...data,
      dateSend: Date.now(),      
    });

    message.save((err, result) => {
      if (err) throw err;
      
      messages.push(result);
    });

    let socketId = await UserModel.findOne({ _id: data.messageTo });
    
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

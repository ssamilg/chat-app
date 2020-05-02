const app = require("express")();
const http = require("http").Server(app);
const io = require("socket.io")(http);
let users = [];
let messages = [];
let index = 0;

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
    let message = {
      id: index,
      username: socket.username,
      message: msg,
    }

    messages.push(message);
    
    //Logged-in users recieve message
    io.emit("message", {message});

    index++;
  });

});

const port = 8000;
http.listen(port, () => {
  console.log("Server is listening on:" + port + " now...");
});

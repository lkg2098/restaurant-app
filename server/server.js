const express = require("express");
require("dotenv").config();
const bodyParser = require("body-parser");
const { exit } = require("process");
const http = require("http");
const cors = require("cors");
const { Server } = require("socket.io");

const indexRouter = require("./routes/index");
const usersRouter = require("./routes/users");

const app = express();

app.use(cors());
const server = http.createServer(app);
const io = new Server(server, {
  cors: {
    origin: "http://localhost:3000",
    methods: ["GET", "POST"],
  },
});
// parse application/x-www-form-urlencoded
app.use(bodyParser.urlencoded({ extended: false }));

// parse application/json
app.use(bodyParser.json());

app.use("/", indexRouter);
app.use("/users", usersRouter);

const port = process.env.PORT || 3000;

app.closeServer = () => {
  server.close();
};

io.on("connection", (socket) => {
  console.log("user connected");
  socket.on("disconnect", function () {
    console.log("user disconnected");
  });
});
server.listen(port, () => {
  console.log(`Server is listening on port ${port}`);
});

module.exports = app;

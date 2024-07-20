const express = require("express");
require("dotenv").config();
const bodyParser = require("body-parser");
const { exit } = require("process");
const http = require("http");
const cors = require("cors");
const { Server } = require("socket.io");

const indexRouter = require("./routes/index");
const usersRouter = require("./routes/users");
const mealsRouter = require("./routes/meals");
const restaurantsRouter = require("./routes/restaurants");

const app = express();

app.use(cors());
const server = http.createServer(app);
const io = new Server(server, {
  cors: {
    origin: "https://tastebuds-4mr3.onrender.com",
    methods: ["GET", "POST"],
  },
});
// parse application/x-www-form-urlencoded
app.use(bodyParser.urlencoded({ extended: false }));

// parse application/json
app.use(bodyParser.json());

app.use("/", indexRouter);
app.use("/users", usersRouter);
app.use("/meals", mealsRouter);
app.use("/restaurants", restaurantsRouter);

const port = process.env.PORT || 3000;

app.closeServer = () => {
  server.close();
};

io.on("connection", (socket) => {
  console.log("user connected");
  socket.on("joinMeal", (mealId) => {
    socket.join(mealId);
    console.log(`in meal ${mealId}`);
  });
  socket.on("leaveMeal", (mealId) => {
    socket.leave(mealId);
    console.log(`exited meal ${mealId}`);
  });

  socket.on("like", (meal, restaurant) => {
    console.log(restaurant);
    if (restaurant.score != 1) {
      socket.to(meal).emit("newResData", restaurant, 1);
    } else {
      socket.to(meal).emit("match", restaurant);
    }
  });

  socket.on("dislike", (meal, restaurant) => {
    console.log(restaurant);
    socket.to(meal).emit("newResData", restaurant, 0);
  });

  socket.on("requestData", (meal) => {
    console.log(meal);
    io.to(meal).emit("sendData", "someData");
  });
  socket.on("disconnect", () => {
    console.log("user disconnected");
  });
});
server.listen(port, () => {
  console.log(`Server is listening on port ${port}`);
});

module.exports = app;

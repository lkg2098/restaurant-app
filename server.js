const express = require("express");
const { exit } = require("process");
const app = express();
const indexRouter = require("./routes/index");
const usersRouter = require("./routes/users");

app.use("/", indexRouter);
app.use("/users", usersRouter);

const port = process.env.PORT || 3000;

app.listen(port, () => {
  console.log(`Server is listening on port ${port}`);
});

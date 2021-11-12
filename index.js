const express = require("express");
const cors = require("cors");
const morgan = require("morgan");

require("dotenv").config();
const postRouter = require("./routes/posts.route.js");
const userRouter = require("./routes/users.route.js");
const { retryConnect, runRedis } = require("./config/db.js");

// Connect to DB
retryConnect();

const app = express();

app.use(runRedis);
app.use(express.json());
app.use(morgan("dev"));
app.enable("trust proxy");
app.use(cors({}));

app.use("/api/v1/posts", postRouter);
app.use("/api/v1/users", userRouter);

const port = process.env.PORT || 3000;
app.get("/api/v1", (req, res) => res.send("Hello World"));

app.listen(port, () => {
  console.log(`Listening on port ${port}`);
});

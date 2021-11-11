const express = require("express");

require("dotenv").config();
const postRouter = require("./routes/posts.route.js");
const retryConnect = require("./config/db.js");

// Connect to DB
retryConnect();

const app = express();
app.use(express.json());
app.use("/api/v1/posts", postRouter);
// app.use("/api/v1/user")

const port = process.env.PORT || 3000;
app.get("/", (req, res) => res.send("Hello World"));

app.listen(port, () => {
  console.log(`Listening on port ${port}`);
});

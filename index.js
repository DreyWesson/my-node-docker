const app = require("express")();
const mongoose = require("mongoose");
const {
  MONGO_USER,
  MONGO_IP,
  MONGO_PORT,
  MONGO_PASSWORD,
} = require("./config");

mongoose
  .connect(
    `mongodb://${MONGO_USER}:${MONGO_PASSWORD}@${MONGO_IP}:${MONGO_PORT}/?authSource=admin`
  )
  .then(() => console.log("DB connected"))
  .catch((e) => console.log(e));

const port = process.env.PORT || 3000;
app.get("/", (req, res) => res.send("Hello World"));

app.listen(port, () => {
  console.log(`Listening on port ${port}`);
});

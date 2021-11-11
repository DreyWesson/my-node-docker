const mongoose = require("mongoose");
require("dotenv").config();

const { MONGO_USER, MONGO_IP, MONGO_PORT, MONGO_PASSWORD } = process.env;

const mongoURL = `mongodb://${MONGO_USER}:${MONGO_PASSWORD}@${
  MONGO_IP || "mongo"
}:${MONGO_PORT || 27017}/?authSource=admin`;

module.exports = retryConnect = () => {
  mongoose
    .connect(mongoURL, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    })
    .then(() => console.log("DB connected"))
    .catch((e) => {
      console.log(e);
      setTimeout(retryConnect, 5000);
    });
};

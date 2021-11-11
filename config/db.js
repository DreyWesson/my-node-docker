const mongoose = require("mongoose");
const session = require("express-session");
const redis = require("redis");
let RedisStore = require("connect-redis")(session);
require("dotenv").config();

// MONGODB
const {
  MONGO_USER,
  MONGO_IP,
  MONGO_PORT,
  MONGO_PASSWORD,
  REDIS_URL,
  SESSION_SECRET,
  REDIS_PORT,
} = process.env;
const mongoURL = `mongodb://${MONGO_USER}:${MONGO_PASSWORD}@${
  MONGO_IP || "mongo"
}:${MONGO_PORT || 27017}/?authSource=admin`;

exports.retryConnect = () =>
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

// REDIS
let redisClient = redis.createClient({
  host: REDIS_URL || "redis",
  port: REDIS_PORT || 6379,
});
redisClient.on("error", function (error) {
  console.error(error);
});
redisClient.on("connect", () => console.log("Redis client connected"));

exports.runRedis = session({
  store: new RedisStore({ client: redisClient }),
  secret: SESSION_SECRET,
  cookie: {
    secure: false,
    resave: false,
    saveUninitialized: false,
    httpOnly: true,
    maxAge: 60 * 1000,
  },
});

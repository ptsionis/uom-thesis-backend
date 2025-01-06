require("dotenv").config();
require("./models/friendModel");
require("./models/userModel");
require("./models/questionModel");
require("./models/pendingQuestionModel");

const express = require("express");
const app = express();
const http = require("http");
const server = http.createServer(app);
const session = require("express-session");
const cors = require("cors");
const port = process.env.PORT || 8000;
const passport = require("./config/passportConfig");
const corsOptions = {
  origin: process.env.CLIENT_ORIGIN,
  methods: ["GET", "POST", "DELETE", "UPDATE", "PUT", "PATCH"],
  credentials: true,
};
const socketConfig = require("./config/socketConfig");
const io = socketConfig(server, corsOptions);
const socketUserEvents = require("./events/socketUserEvents");
const socketFriendsEvents = require("./events/socketFriendsEvents");
const socketConnectEvents = require("./events/socketConnectEvents");
const socketChallengeEvents = require("./events/socketChallengeEvents");
const socketGameEvents = require("./events/socketGameEvents");
const socketPendingQuestionEvents = require("./events/socketPendingQuestionEvents");
const socketQuestionEvents = require("./events/socketQuestionEvents");
const authRoutes = require("./routes/authRoutes");
const onlyForHandshake = require("./middleware/socketMiddleware");

const sessionMiddleware = session({
  secret: process.env.PASSPORT_KEY,
  resave: false,
  saveUninitialized: false,
});

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cors(corsOptions));
app.use(sessionMiddleware);
app.use(passport.initialize());
app.use(passport.session());
app.use("/auth", authRoutes);

io.engine.use(onlyForHandshake(sessionMiddleware));
io.engine.use(onlyForHandshake(passport.session()));
io.engine.use(
  onlyForHandshake((req, res, next) => {
    if (req.user) {
      next();
    } else {
      res.writeHead(401);
      res.end();
    }
  }),
);

const onlineIdsToSockets = new Map();

socketUserEvents(io);
socketFriendsEvents(io, onlineIdsToSockets);
socketConnectEvents(io, onlineIdsToSockets);
socketChallengeEvents(io, onlineIdsToSockets);
socketGameEvents(io, onlineIdsToSockets);
socketPendingQuestionEvents(io, onlineIdsToSockets);
socketQuestionEvents(io, onlineIdsToSockets);

server.listen(port);

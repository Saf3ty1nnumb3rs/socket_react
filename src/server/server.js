const path = require("path"); //built in to npm
const express = require("express");
const router = express.Router({
  mergeParams: true
});
const logger = require("morgan");
const bodyParser = require("body-parser");
const multer = require("multer");
const moment = require("moment");
const { Users } = require("./utils/users");
const { Rooms } = require("./utils/rooms");
//const { storage, fileFilter, upload } = require("./utils/storageHelpers").upload;

const app = express();
const http = require("http").Server(app);
const io = (module.exports.io = require("socket.io")(http, {
  pingInterval: 5000,
  pingTimeout: 10000
}));
const publicPath = path.join(`${__dirname}`, "../../build");
const PORT = process.env.PORT || 3001;

const users = new Users();
const rooms = new Rooms();

const SocketManager = require("./utils/SocketManager.js");

console.log("Path", publicPath);
console.log("Path2", publicPath + "/index.html");
app.use(logger("dev"));
app.use(bodyParser.json());
app.use(function(req, res, next) {
  res.header("Access-Control-Allow-Origin", "*");
  res.header("Access-Control-Allow-Headers", "X-Requested-With");
  res.header("Access-Control-Allow-Headers", "Content-Type");
  res.header("Access-Control-Allow-Methods", "PUT, GET, POST, DELETE, OPTIONS");
  next();
});

const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, "./public/img/userPics");
  },
  filename: (req, file, cb) => {
    cb(null, new Date().toISOString() + file.originalname);
  }
});

const fileFilter = (req, file, cb) => {
  if (
    file.mimetype === "image/jpeg" ||
    file.mimetype === "image/png" ||
    file.mimetype === "image/gif"
  ) {
    cb(null, true);
  } else {
    cb(new Error("Unsupported file format"), false);
  }
};

const upload = multer({
  storage,
  limits: {
    fileSize: 1024 * 1024 * 5
  },
  fileFilter
});

app.post("/api/userPic", upload.single("userPic"), (req, res) => {
  users.updatePic(req.body.id, req.file.filename);
  console.log(req.data);
  console.log(res);

  res.send(req.file);
});

io.on("connection", SocketManager);
if (process.env.NODE_ENV === "production") {

  app.use(express.static('build'))
  app.get("*", (req, res) => {
    res.sendFile(path.join(`${__dirname}/build/index.html`));

    console.log("SERVING REACT APP");
  });
}
http.listen(PORT, () => {
  console.log(`Server is up on port ${PORT}`);
});

module.exports = { http, app };

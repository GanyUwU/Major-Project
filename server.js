const express = require("express");
const path = require("path");
const bodyParser = require("body-parser");
var cors = require("cors");

/*const { mongo, default: mongoose } = require('mongoose')
const mongoose = require('mongoose')*/
const mongoose = require("mongoose");
const User = require("./model/user");

const ward = require("./ward");
const grievance = require("./grievances");
const prabhag = require("./prabhag");
const jwt = require("jsonwebtoken");
const encryptPassword = require("./utils/password");
const JWT_SECRET = "hefjweif@#$%^rjewokfjewiofwekfjweoifiwejfoewi";
const { uuid } = require("uuidv4");

mongoose.connect("mongodb://localhost:27017/aplamanus", {
  useNewUrlParser: true,
  useUnifiedTopology: true,
});
const app = express();
app.use("/", express.static(path.join(__dirname, "/home")));
//register
app.use("/", express.static(path.join(__dirname, "/static")));
app.use(bodyParser.json());
app.use(cors());

//password change
app.post("/api/change-password", async (req, res) => {
  const { token, newpassword } = req.body;
  try {
    const user = jwt.verify(token, JWT_SECRET);

    const _id = user.id;
    const hashedPassword = encryptPassword(newpassword);

    await User.updateOne(
      { _id },
      {
        $set: { password: hashedPassword },
      }
    );
    res.json({ status: "ok" });
  } catch (error) {
    res.json({ status: "error", error: ";" });
    console.log(error);
  }
});
//login page
app.post("/api/login", async (req, res) => {
  const { username, password } = req.body;
  const user = await User.findOne({ username }).lean();
  const hashedPassword = encryptPassword(password);
  if (!user) {
    return res.json({ status: "error", error: "invalid username/password" });
  }

  if (hashedPassword === user.password) {
    //username password combo is success

    const token = jwt.sign(
      {
        id: user._id,
        username: user.username,
      },
      JWT_SECRET
    );
    console.log(user);
    return res.json({ status: "ok", data: token, userData: user });
  } else {
    res.json({ status: "error", error: "invalid username / password" });
  }
});

app.post("/api/login/admin", async (req, res) => {
  const { username, password } = req.body;
  const user = await User.findOne({ username }).lean();
  const hashedPassword = encryptPassword(password);
  if (!user) {
    return res.json({ status: "error", error: "invalid username/password" });
  }
  console.log(hashedPassword, user.password);
  if (hashedPassword === user.password) {
    //username password combo is success

    const token = jwt.sign(
      {
        id: user._id,
        username: user.username,
      },
      JWT_SECRET
    );

    return res.json({ status: "ok", data: token });
  } else {
    res.json({ status: "error", error: "invalid username / password" });
  }
});

app.post("/api/register", async (req, res) => {
  const {
    username,
    password: plainTextPassword,
    email,
    gender,
    prabhag,
    wardId,
    type,
  } = req.body;
  //verification
  if (!username || typeof username !== "string") {
    return res.json({ status: "error", error: "Invalid userrname" });
  }

  //if (!plainTextPassword || typeof plainTextPassword !== "string") {
   // return res.json({ status: "error", error: "Invalid password" });
 // }

  if (plainTextPassword.length < 8) {
    return res.json({ status: "error", error: "Invalid password" });
  }
  const password = encryptPassword(plainTextPassword);
  const userType = type === "representative" ? "representative" : "citizen";
  const id = uuid();
  try {
    const response = await User.create({
      username,
      password,
      email,
      gender,
      prabhag: type === "representative" ? null : prabhag,
      type: userType,
      wardId,
      id,
    });
    if (type === "representative") {
      ward.addWardtoRepresentative(req, res, wardId, id);
    }
    console.log("User created successfully", response);
  } catch (error) {
    console.log(error);
    if (error.code === 11000) {
      //duplicate key
      return res.json({
        status: "error",
        error: "Already in use email or username",
      });
    }
    throw error;
  }

  res.json({ status: "ok" });
});
app.get("/api/ward", async (req, res) => {
  ward.getWards(req, res);
});
app.post("/api/ward/add", async (req, res) => {
  ward.addNewWard(req, res);
});
app.get("/api/prabhag", async (req, res) => {
  prabhag.getPrabhags(req, res);
});
app.post("/api/prabhag/add", async (req, res) => {
  prabhag.addNewPrabhag(req, res);
});

app.get("/api/grievances/:wardId", async (req, res) => {
  grievance.getGrievances(req, res);
});

app.post("/api/grievances/add", async (req, res) => {
  grievance.addNewGrievance(req, res);
});

app.get("/api/metadata", async (req, res) => {
  const results = await prabhag.prabhagSchema.aggregate([
    {
      $lookup: {
        from: "ward",
        localField: "id",
        foreignField: "wardId",
        as: "ward",
        pipeline: [
          {
            $lookup: {
              from: "registers",
              localField: "representativeId",
              foreignField: "id",
              as: "user",
            },
          },
        ],
      },
    },
  ]);
  console.log(results)
  return res.json({
    status: "ok",
    data: results,
  });
});
//localhost server
app.listen(9000, "localhost", () => {
  console.log("server up at 9000");
});

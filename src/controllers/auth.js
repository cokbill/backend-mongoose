// const {validationResult} = require('express-validator')
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");

const User = require("../models/user");
const UserToken = require("../models/UserToken");

exports.signup = (req, res, next) => {
  const email = req.body.email;
  const name = req.body.name;
  const ps = req.body.password;

  console.log(req.body);

  bcrypt.hash(ps, 8, function (err, hash) {
    if (err) {
      console.log(err);
    }

    const newUser = new User({
      email: email,
      password: hash,
      name: name,
    });

    newUser.save().then((result) => {
      res.json({
        message: "User sukses registrasi",
        userId: result._id,
        password: result.password,
      });
    });
  });
};

exports.login = (req, res, next) => {
  const emailP = req.body.email;
  const pswd = req.body.password;

  let loggedUser;
  //mencari user yg sedang login
  User.findOne({ email: emailP })
    .then((userFound) => {
      if (!userFound) {
        const error = new Error("User dengan email tersebut tidak ditemukan");
        error.statusCode = 433;
        res.status(400).send({ message: error.message, status: "Gagal" });
        throw error;
      }

      loggedUser = userFound;
      return bcrypt.compare(pswd, loggedUser.password);
    })
    .then((isEqual) => {
      if (!isEqual) {
        const error = new Error("Password salah");
        error.statusCode = 424;
        res.status(400).send({ message: error.message, status: "Gagal" });
        throw error;
      }

      return generateTokens(loggedUser);

    })
        .then((result) => {
          const { accessToken, refreshToken } = result;

          res
            .cookie("refreshToken", refreshToken, {
              httpOnly: true,
              secure: true,
              samSite: "strict",
              maxAge: 604800000, //7hari
            })
            .header("Authorization", accessToken)
            .json({
              accessToken: accessToken,
              refreshToken: refreshToken,
              userId: loggedUser._id.toString(),
            });
        })
        .catch((err) => console.log(err));

      // const token = jwt.sign(
      //   {
      //     email: loggedUser.email,
      //     userId: loggedUser._id.toString(),
      //   },
      //   "myprivate54321",
      //   { expiresIn: "1h" }
      // );

      // res.json({ jwttoken: token, userId: loggedUser._id.toString() });
};

exports.logout = (req, res, next) => {
  try {
    UserToken.findOneAndDelet({ token: req.cookies["refreshToken"] }).then(
      (refToken) => {
        if (!refToken)
          res
            .header("Clear-Site-Data", "cookies", "storage")
            .status(200)
            .json({ error: false, message: "Logged Out Sucessfully" });
        else
          res
            .header("Clear-Site-Data", "cookies", "storage")
            .status(200)
            .json({ error: false, message: "Logged Out Sucessfully" });
      }
    );
  } catch (err) {
    console.log(err);
    res.status(500).json({ error: true, message: "Internal Server Error" });
  }
};

const generateTokens = (user) => {
  try {
    const payload = {
      email: user.email,
      userId: user._id.toString(),
      roles: user.roles,
    };

    const accessToken = jwt.sign(
      payload,
      process.env.ACCESS_TOKEN_PRIVATE_KEY,
      { expiresIn: "14m" }
    );

    const refreshToken = jwt.sign(
      payload,
      process.env.REFRESH_TOKEN_PRIVATE_KEY,
      { expiresIn: "30d" }
    );

    UserToken.findOneAndDelete({ userId: user._id })

      .then((userToken) => {})
      .catch((err) => console.log(err));

    const newtoken = new UserToken({ userId: user._id, token: refreshToken });

    return newtoken
      .save()
      .then((res) => {
        console.log("Login and new usertoken stored");

        return { accessToken, refreshToken };
      })
      .catch((err) => console.log(err));
  } catch (err) {
    console.log(err);
    return Promise.reject(err);
  }
};
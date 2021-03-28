const express = require("express");
const router = express.Router({ mergeParams: true })
const User = require('../models/user');
const ErrorClass = require("../utily/errorclass")
const catchAsync = require("../utily/catchAsync");
const { UserSchema } = require("../schema.js");
const passport = require('passport');
const { ifLoggedIn, isLoggedIn } = require("../middleware")
const userController = require("../controllers/userController")





router.route("/register")
  .get(ifLoggedIn, userController.getRegister)
  .post(ifLoggedIn, catchAsync(userController.register))

router.route("/login")
  .get(ifLoggedIn, userController.getLogin)
  .post(ifLoggedIn, passport.authenticate('local', { failureRedirect: '/login', failureFlash: true }), userController.login)

router.get("/reset", isLoggedIn, userController.getReset)

router.get("/logout", isLoggedIn, userController.getLogout)



// router.post("/reset", isLoggedIn, passport.authenticate('local', { failureRedirect: '/reset', failureFlash: true }), catchAsync(async (req, res) => {
//   try {
//     const { newpassword, username } = req.body;
//     const user = await User.find({ username })
//     console.log(user)
//     const reguser = await User.register(user, newpassword) //this takes user model which includes email and username alongside a password (hernsocool) and hashes it
//     req.login(user, function (err) {
//       if (err) { return next(err); }
//       req.flash("success", "Account was successfully created.")
//       res.redirect('/camps')
//     });

//   }
//   catch (e) {
//     req.flash("error", e.message)
//     res.redirect('/register')
//   }
// }))




module.exports = router
const User = require('../models/user');


module.exports.getRegister = (req, res) => {
  res.render('User/register')
}

module.exports.getLogin = (req, res) => {
  res.render('User/login')
}


module.exports.getReset = (req, res) => {
  res.render('User/reset')
}

module.exports.getLogout = (req, res) => {
  req.logout();
  req.flash("success", "successfully signed off")
  res.redirect('/camps')
}

module.exports.register = async (req, res) => {
  try {
    const { email, password, username } = req.body;
    const user = new User({ email, username })
    const reguser = await User.register(user, password) //this takes user model which includes email and username alongside a password (hernsocool) and hashes it
    req.login(user, function (err) {
      if (err) { return next(err); }
      req.flash("success", "Account was successfully created.")
      res.redirect('/camps')
    });

  }
  catch (e) {
    req.flash("error", e.message)
    res.redirect('/register')
  }
}

module.exports.login = (req, res) => {
  req.flash("success", "welcome back")
  const redirectTo = req.session.returnTo || "/camps"
  delete req.session.returnTo;
  res.redirect(redirectTo)
}
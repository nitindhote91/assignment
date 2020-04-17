var express = require('express');
var router = express.Router();
var User = require('../config/user.schema');
let session;

router.get('/', async function (req, res, next) {
  session = req.session;
  if (session.email) {
    res.redirect('/dashboard');
  }
  res.render('index.ejs', { title: 'Login', error: '', body: null });
});

router.post('/', async function (req, res, next) {
  try {
    session = req.session;
    if (session.email) {
      return res.redirect('/dashboard');
    }
    const login = await User.module.findOne(req.body);
    if (login) {
      session.email = login.email;
      // res.end('done');
      res.redirect("/dashboard");
    } else {
      res.render('index.ejs', {
        title: 'Login',
        error: "username and password doesn't match please try with another credentail",
        body: req.body
      });
    }
  } catch (err) {
    res.render('index.ejs', { title: 'Login', error: err, body: req.body });
  }
});

router.get('/register', function (req, res, next) {
  session = req.session;
  if (session.email) {
    return res.redirect('/dashboard');
  }
  res.render('register.ejs', { title: 'Register', error: null, body: null });
});

router.post('/register', async function (req, res, next) {
  try {
    session = req.session;
    if (session.email) {
      return res.redirect('/dashboard');
    }
    let err = "";
    const emailExist = await User.module.findOne({ email: req.body.email });
    if (emailExist) {
      err = `${err} Email Already exist`;
    }
    const userNameExist = await User.module.findOne({ username: req.body.username });
    if (userNameExist) {
      err = `${err} User name already exist`;
    }
    if (!emailExist && !userNameExist) {
      const userSchema = await new User.module(req.body);
      const register = await userSchema.save();
      if (register) {
        res.redirect('/');
      }
    } else {
      res.render('register.ejs', { title: 'Register', error: err, body: req.body });
    }
  } catch (err) {
    res.render('register.ejs', { title: 'Register', error: err, body: req.body });
  }
});

router.get('/dashboard', function (req, res, next) {
  session = req.session;
  if (!session.email) {
    return res.redirect('/');
  }
  res.render('dashboard.ejs', { title: 'Dashboard' });
});

router.get('/logout', (req, res) => {
  req.session.destroy((err) => {
    if (err) {
      return console.log(err);
    }
    res.redirect('/');
  });

});

module.exports = router;

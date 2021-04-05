'use strict';
const express = require('express');
const app = express();
const passport = require('./utils/pass');
const port = 3000;
const loggedIn = (req, res, next) => {
  if (req.user) {
    next();
  } else {
    res.redirect('/form');
  }
};
const username = 'foo';
const password = 'bar';
const cookieParser = require('cookie-parser')
const session = require('express-session')
const parser = require('body-parser');
const urlencodedParser = parser.urlencoded({extended: false});



app.set('views', './views');
app.set('view engine', 'pug');

app.use(session({secret: 'very secret'}));

app.use(passport.initialize());
app.use(passport.session());


app.get('/', (req, res) => {
  res.render('home');
});

app.get('/setCookie/:clr', (req, res) => {
  app.use(cookieParser); // setting this on top-level doesn't work
  res.cookie('color', req.params.clr).send('cookie set');
});

app.get('/deleteCookie', (req, res) => {
  app.use(cookieParser)
  res.clearCookie('color')
  res.send('cookie deleted')
});

app.get('/form', (req, res) => {
  res.render('form');
});

app.get('/secret', loggedIn, (req, res) => {
  res.render('secret');
});

app.post('/login', urlencodedParser,
    passport.authenticate('local', {failureRedirect: '/form'}),
    (req, res) => {
      console.log('success');
      res.redirect('/secret');
    });

app.get('/logout', (req, res) => {
  req.logout();
  res.redirect('/form');
});


app.listen(port, () => console.log(`Example app listening on port ${port}!`));

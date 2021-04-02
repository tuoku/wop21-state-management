'use strict';
const express = require('express');
const app = express();
const port = 3000;
const username = 'foo';
const password = 'bar';
const cookieParser = require('cookie-parser')
const session = require('express-session')
const parser = require('body-parser');
const urlencodedParser = parser.urlencoded({extended: false});



app.set('views', './views');
app.set('view engine', 'pug');

app.use(session({secret: 'very secret'}));


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

app.get('/secret', (req, res) => {
  if(!req.session.logged){
    res.render('form')
  } else {
    res.render('secret')
  }
});

app.post('/login', urlencodedParser, (req, res) => {
  console.log(req.body)
  if(req.body.username === username && req.body.password === password){
    console.log('correct login')
    req.session.logged = true
    console.log(req.session.logged)
    res.render('secret')
  } else {
    console.log('incorrect login')
    req.session.logged = false
    console.log(req.session.logged)
    res.render('form')
  }
})

app.listen(port, () => console.log(`Example app listening on port ${port}!`));

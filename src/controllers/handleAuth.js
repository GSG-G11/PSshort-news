const { join } = require('path');
const { writeFileSync } = require('fs');
const { genSaltSync, hashSync } = require('bcryptjs');
const data = require('../models/data.json');

const getHomePage = (req, res, next) => {
  try {
    res.sendFile(join(__dirname, '..', '..', 'public', 'news.html'));
  } catch (err) {
    next(err);
  }
};

const getRegisterPage = (req, res, next) => {
  try {
    res.sendFile(join(__dirname, '..', '..', 'public', 'register.html'));
  } catch (err) {
    next(err);
  }
};

const handleMiddleware = (req, res) => {
  res.redirect('/home');
};

const addUser = (req, res, next) => {
  const { users } = data;
  const { email, password } = req.body;

  const salt = genSaltSync(10);
  const hashPassword = hashSync(password.trim(), salt);

  // get the Id of the last user to generate a new Id
  const newUserId = users.length <= 0 ? 1 : users[users.length - 1].id + 1;

  const newUser = {
    id: newUserId,
    email: email.trim(),
    password: hashPassword,
  };

  // add the new User to the data object
  data.users.push(newUser);

  try {
    writeFileSync(
      join(__dirname, '..', 'models', 'data.json'),
      `${JSON.stringify(data, null, 2)}\n`,
    );
    res.cookie('session_id', '$N4NpoN4020$N4NpoB8hZzGxGGJhvFeW');
    res.redirect('/home');
  } catch (err) {
    next(err);
  }
};

const logout = (req, res, next) => {
  try {
    res.clearCookie('session_id');
    res.redirect('/');
  } catch (err) {
    next(err);
  }
};

module.exports = {
  getHomePage,
  handleMiddleware,
  addUser,
  getRegisterPage,
  logout,
};

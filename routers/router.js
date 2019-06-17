'use strict';

const express = require('express');
const User = require('../controller/user.js');
const UserInfo = require('../controller/userInfo.js');
const Task = require('../controller/task.js');
const Folder = require('../controller/folder.js');

const router = express.Router();

router.get('/', function(req, res, next) {
  res.type('html')
  res.sendFile('/index.html')
})


// 登录验证
router.get(function(req, res, next) {
  if(req.session.username) {
    next();
  } else {
    res.redirect('/');
  }
})


router.post('/login', User.login);

router.post('/addTask', Task.addTask);

router.get('/getTaskList', Task.getTasks);

router.get('/getFolderList', Folder.getFolders);

router.get('/getSelfInfo', UserInfo.getUserInfo);

router.post('/modifySelfInfo/:itemName', UserInfo.modifySelfInfo);



module.exports = router;
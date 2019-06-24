'use strict';

const UserModel = require('../models/user.js');
const UserInfoModel = require('../models/userInfo.js');
const cryptoRandomString = require('crypto-random-string');
const md5 = require('md5');

class User {
  constructor() {
    this.login = this.login.bind(this);
    this.createUser = this.createUser.bind(this);
    this.tLogin = this.tLogin.bind(this);
  }

  async login(req, res, next){
    const form = req.body;
    const username = form.username,
          password = form.password;
    if(!username || !password){
      res.send({
        success: false,
        type: 'FORM_DATA_ERROR',
        message: 'Form data error!'
      })
      return;
    }
    try {
      const user = await UserModel.findOne({username});
      if(!user){
        this.createUser(req, res, next);
        return;
      } else if(user.password.toString() !== username.toString()) {
        res.send({
          success: false,
          type: 'WRONG_PASSWORD',
          message: 'Error password.'
        })
        return;
      } else {
        req.session.username = username;
        const userInfoQuery = await UserInfoModel.findOne({username})
          .then(userInfo => {
            const U_token = cryptoRandomString({length: 10, type: 'base64'})+md5(username);
            UserModel.update(user, {U_token}, (err, docs) => {
              if(err) {
                console.log(err);
              }
            })
            res.cookie('U_token', U_token, {httpOnly: true});
            res.send({
              success: true,
              type: 'GET_USERINFO_SUCCESSFULLY',
              message: 'Get userInfo successfully',
              user: {
                username: userInfo.username,
                photo: userInfo.photo,
                level: userInfo.level
              }
            });
          });
        // if(!userInfoQuery) {
        //   res.send({
        //     success: false,
        //     type: 'USER_NOT_FOUND',
        //     message: 'We can not find this user'
        //   })
        //   return;
        // }
        // userInfoQuery.then(userinfo => {
        //   if(err) {
        //     res.send({
        //       success: false,
        //       type: 'DATABASE_ERROR_USERINFOQUERT',
        //       message: err.message
        //     })
        //   } else {
        //     res.send({
        //       success: true,
        //       type: 'GET_USERINFO_SUCCESSFULLY',
        //       message: 'Get userInfo successfully',
        //       ...userInfo
        //     })
        //   }
        // })
      }
    } catch(err) {
      res.send({
        success: false,
        type: 'DATABASE_ERROR',
        message: err.message
      })
      return;
    }

  }

  async tLogin(req, res, next) {
    const form = req.body;
    const U_token = req.cookies.U_token;
    if(!U_token) {
      res.send({
        success: false,
        type: 'FORM_DATA_ERROR',
        message: 'Form data error!'
      })
      return;
    }
    await UserModel.findOne({U_token}).then(user => {
      if(!user) {
        res.send({
          success: false,
          type: 'USER_NOT_FOUND',
          message: 'User not found.'
        })
        return;
      } else {
        req.session.username = user.username;
        const username = user.username;
        console.log(username || 'no username')
        const userInfoQuery = UserInfoModel.findOne({username})
          .then(userInfo => {
            const U_token = cryptoRandomString({length: 10, type: 'base64'})+md5(username);
            UserModel.updateOne(user, {U_token}, (err, docs) => {
              if(err) {
                console.log(err);
              }
            })
            res.cookie('U_token', U_token, {httpOnly: true});
            res.send({
              success: true,
              type: 'GET_USERINFO_SUCCESSFULLY',
              message: 'Get userInfo successfully',
              user: {
                username: userInfo.username,
                photo: userInfo.photo,
                level: userInfo.level
              }
            });
          });
      }
    });

    
  }

  async createUser(req, res, next) {
    const form = req.body;
    const {username, password} = form;
    if(!username || !password) {
      res.send({
        success: false,
        type: 'MISSING_USERNAME_OR_PASSWORD',
        message: 'Missing username or password'
      })
      return;
    }
    try {
      const user = await UserModel.findOne({username});
      if(user){
        throw new Error('The user already exists');
      }
    } catch(err) {
      res.send({
        success: false,
        type: 'USER_ALREADY_EXISTS',
        message: err.message
      })
      return;
    }
    const date = new Date(Date.now());
    const user = {
      username,
      password
    }
    console.log(`create`);
    try {
      await UserModel.create(user);
    } catch(err) {
      res.send({
        success: false,
        type: 'WRONG_FORMAT_OF_USERNAME_OR_PASSWORD',
        message: err.message
      })
      return;
    }
    const userInfo = {
      username,
      createDate: date,
      photo: "",
      level: 1
    }
    await UserInfoModel.create(userInfo);
    res.send({
      success: true,
      type: 'CREATE_NEW_USER',
      message: 'Create new user.',
      user: {
        username,
        photo: userInfo.photo,
        level: userInfo.level
      }
    })
    return;
  }
}

module.exports = new User()
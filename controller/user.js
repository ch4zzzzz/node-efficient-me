'use strict';

const UserModel = require('../models/user.js');
const UserInfoModel = require('../models/userInfo.js');

class User {
  constructor() {
    this.login = this.login.bind(this);
    this.createUser = this.createUser.bind(this);
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
        res.send({
          success: false,
          type: 'USER_NOT_FIND',
          message: 'This user does not exist.'
        })
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
            res.send({
              success: true,
              type: 'GET_USERINFO_SUCCESSFULLY',
              message: 'Get userInfo successfully',
              user: {
                username: userInfo.username,
                photo: userInfo.photo,
                level: userInfo.level
              }
            })
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
      createDate: date
    }
    await UserInfoModel.create(userInfo);
    res.send({
      success: true,
      type: 'CREATE_NEW_USER',
      message: 'Create new user.'
    })
    return;
  }
}

module.exports = new User()
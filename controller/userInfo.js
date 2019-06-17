'use strict';

const UserInfoModel = require('../models/userInfo.js');

class UserInfo{
  constructor() {
    this.getUserInfo = this.getUserInfo.bind(this);
  }

  async getUserInfo(req, res, next) {
    const username = req.session.username;
    if(!username) {
      res.send({
        success: false,
        type: 'USERNAME_UNDEFINED',
        message: 'Wrong, try to get userInfo without username!'
      })
      return;
    }
    const userInfoQuery = await UserInfoModel.findOne({username})
      .then(userInfo => {
        res.send({
          success: true,
          type: 'GET_USERINFO_SUCCESSFULLY',
          message: 'Get userInfo successfully',
          user: userInfo
        })
      })

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

  async modifySelfInfo(req, res, next) {
    const value = req.body.value;
    if(value==undefined){
      res.send({
        success: false,
        type: 'VALUE_UNDEFINED',
        message: 'Value undefined.'
      })
      return;
    }
    const itemName = req.params.itemName;
    if(!itemName) {
      res.send({
        success: false,
        type: 'ITEM_NAME_UNDEFINED',
        message: 'Item name undefined.'
      })
      return;
    }
    const username = req.session.username;
    if(!username) {
      res.send({
        success: false,
        type: 'NOT_LOGGED_IN',
        message: 'Not logged in.'
      });
      return;
    }
    try {
      await UserInfoModel.update({username},
          {[itemName]: value});
    } catch(err) {
      res.send({
        success: false,
        type: 'DATABASE_ERROR',
        message: 'Database error'
      })
      return;
    }
    res.send({
      success: true,
      type: 'MODIFY_USERINFO_SUCCESSFULLY',
      message: 'Modify userInfo successfully'
    })

  }
}

module.exports = new UserInfo();
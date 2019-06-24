'use strict';

const FolderModel = require('../models/folder.js');

class Folder {
  constructor() {
    this.getFolders = this.getFolders.bind(this);
  }

  async getFolders(req, res, next) {
    const username = req.session.username;
    if(!username) {
      res.send({
        success: false,
        type: 'NOT_LOGGED_IN',
        message: 'Not logged in.'
      })
      return;
    }
    await FolderModel.find({username}, 'folderName')
      .then(folders => {
        res.send({
          success: true,
          type: 'GOT_FOLDERS',
          message: 'Got folders',
          folderList: folders
        })
      })
  }

  async addFolder(req, res, next) {
    const username = req.session.username;
    if(!username) {
      res.send({
        success: false,
        type: 'NOT_LOGGED_IN',
        message: 'Not logged in.'
      })
      return;
    }
    const folderName = req.body.folderName;
    try {
      await FolderModel.create({
        folderName,
        username
      })
    } catch(err) {
      res.send({
        success: false,
        type: 'DATABASE_ERROR',
        message: err.message
      })
      return;
    }
    res.send({
      success: true,
      type: 'ADD_FOLDER_SUCCESSFULLY',
      message: 'Add folder successfully.'
    })
  }
}

module.exports = new Folder();
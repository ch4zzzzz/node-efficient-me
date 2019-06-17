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
}

module.exports = new Folder();
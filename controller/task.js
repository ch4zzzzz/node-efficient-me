'use strict';

const TaskModel = require('../models/task.js');

class Task {
  constructor(){
    this.addTask = this.addTask.bind(this);
    this.getTasks = this.getTasks.bind(this);
  }

  async addTask(req, res, next) {
    const username = req.session.username;
    if(!username) {
      res.send({
        success: false,
        type: 'NOT_LOGGED_IN',
        message: 'Not logged in.'
      });
      return;
    }
    const form = req.body;
    const {name, date, folderName} = form;
    if(!name) {
      res.send({
        success: false,
        type: 'MISSING_TASK_NAME',
        message: 'Missing task name.'
      });
      return;
    }
    const task = {
      name,
      date,
      folderName,
      username
    };
    let id;
    try {
      await TaskModel.create(task)
        .then(task => {
          id = task._id;
        });
    } catch(err) {
      res.send({
        success: false,
        type: 'WRONG_FORMAT_OF_TASK',
        message: err.message
      })
      return;
    }

    res.send({
      success: true,
      type: 'ADD_TASK_SUCCESSFULLY',
      message: 'Add task successfully',
      id
    })
    return;
  }

  async getTasks(req, res, next) {
    const username = req.session.username;
    if(!username) {
      res.send({
        success: false,
        type: 'NOT_LOGGED_IN',
        message: 'Not logged in'
      })
      return;
    }
    await TaskModel.find({username}, 'name _id folderName date complete')
      .then(tasks => {
        const retTasks = [];
        tasks.forEach(function(element){
          const {name, _id: id, folderName, date, complete} = element
          retTasks.push({
            name,
            id,
            folderName,
            date,
            complete
          });
        })
        res.send({
          success: true,
          type: 'GOT_TASKS',
          message: 'Got tasks',
          taskList: retTasks
        })
      })
  }
}

module.exports = new Task();
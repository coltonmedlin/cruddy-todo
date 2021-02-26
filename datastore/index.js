const fs = require('fs');
const path = require('path');
const _ = require('underscore');
const counter = require('./counter');

var items = {};

// Public API - Fix these CRUD functions ///////////////////////////////////////

exports.create = (text, callback) => {
  counter.getNextUniqueId((err, id) => {
    let filePath = path.join(exports.dataDir, `${id}.txt`);
    fs.writeFile(filePath, text, (err) => {
      if (err) {
        throw ('error writing counter');
      } else {
        callback(null, { id, text });
      }
    });
  });
};

const getFileNames = () => {
  return new Promise((resolve, reject) => {
    let todos = [];
    fs.readdir(exports.dataDir, (err, files) => {
      if (err) {
        reject(err);
      } else {
        files.forEach(file => {
          file = file.slice(0, 5);
          todos.push(file);
        });
        resolve(todos);
      }
    });
  });
};

const getTodo = (file) => {
  return new Promise((resolve, reject) => {
    let filePath = path.join(exports.dataDir, `${file}.txt`);
    fs.readFile(filePath, 'utf8', (err, data) => {
      if (err) {
        reject(err);
      } else {
        let todo = {id: file, text: data};
        resolve(todo);
      }
    });
  });
};

exports.readAll = (callback) => {
  getFileNames()
    .then((files) => {
      let promises = files.map(getTodo);
      Promise.all(promises)
        .then(todos => {
          callback(null, todos);
        })
        .catch(err => {
          callback(err);
        });
    });
};

exports.readOne = (id, callback) => {
  let filePath = path.join(exports.dataDir, `${id}.txt`);
  fs.readFile(filePath, 'utf8', (err, data) => {
    if (err) {
      callback(new Error(`No item with id: ${id}`));
    } else {
      callback(null, { id, text: data });
    }
  });
};



exports.update = (id, text, callback) => {
  let filePath = path.join(exports.dataDir, `${id}.txt`);
  fs.stat(filePath, (err, stats) => {
    if (err) {
      callback(new Error(`No item with id: ${id}`));
    } else {
      fs.writeFile(filePath, text, (err) => {
        if (err) {
          throw ('error writing counter');
        } else {
          callback(null, { id, text });
        }
      });
    }
  });
};

// ✓ should not change the counter
// 1) should delete todo file by id
// ✓ should return an error for non-existant id



exports.delete = (id, callback) => {
  let filePath = path.join(exports.dataDir, `${id}.txt`);
  fs.stat(filePath, (err, stats) => {
    if (err) {
      callback(new Error(`No item with id: ${id}`));
    } else {
      fs.unlink(filePath, (err) => {
        if (err) {
          callback(new Error(`could not delete file with id: ${id}`));
        } else {
          callback();
        }
      });
    }
  });




  // if (!item) {
  //   // report an error if item not found
  //   callback(new Error(`No item with id: ${id}`));
  // } else {
  //   callback();
  //}
};

// Config+Initialization code -- DO NOT MODIFY /////////////////////////////////

exports.dataDir = path.join(__dirname, 'data');

exports.initialize = () => {
  if (!fs.existsSync(exports.dataDir)) {
    fs.mkdirSync(exports.dataDir);
  }
};

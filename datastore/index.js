const fs = require('fs');
const path = require('path');
const _ = require('underscore');
const counter = require('./counter');
const Promise = require('bluebird');

var items = {};

// Public API - Fix these CRUD functions ///////////////////////////////////////


exports.create = (text, callback) => {
  //get the next id for a new file
  counter.getNextUniqueId((err, id) => {
    //double check for errors
    if (err) {
      throw ('Could not obtain uniq id');
    } else {
      //create the file path: current director + id + .txt
      var filePath = path.join(exports.dataDir, `${id}.txt`);
      //create the file using fs.writeFile: file path, the text, or err
      fs.writeFile(filePath, text, (err) => {
        //if err, throw error
        if (err) {
          throw ('Could not create file');
        } else {
        //otherwise
          callback(null, { id, text });
          //call callback on something?
        }
      });
    }
  });

};

readFileForPromise = Promise.promisify(fs.readFile);
//changed this from exports.readAll = (callback) => {
exports.readAll =  function (callback) {
  //use fs.readdir to read the contents of the directory: takes the directory path, and callback
  fs.readdir(exports.dataDir, (err, fileNames) => {
    //callback gets: err and files: an array of the names of the files in the directory
    //if err, throw err
    if (err) {
      throw ('Error obtaining file list');
    }
    //otherwise map through the data, turn each item into an object of form: {id: 'id', text: 'id'}
    var data = _.map(fileNames, (file) => {
      var id = (file.split('.')[0]);
      var filePath = path.join(exports.dataDir, file);
      return readFileForPromise(filePath)
        .then((text) =>{
          return { id: id, text: text.toString() };
        });
    });
    //call callback with err, mapped array
    // callback(null, data);
    Promise.all(data)
      .then(items => callback(null, items), err => callback(err));

  });

};

exports.readOne = (id, callback) => {

  var filePath = path.join(exports.dataDir, `${id}.txt`);

  //call fs.readfile, takes: filepath, (err, file data)
  fs.readFile(filePath, 'utf8', (err, data) => {
    //if error, call callback with error
    if (err) {
      callback(new Error(`No item with id: ${id}`));
    } else {
      //else call the callback with id/text from file data
      callback(null, { id, text: data.toString() });
    }
  });

};


exports.update = (id, text, callback) => {
  var filePath = path.join(exports.dataDir, `${id}.txt`);
  //call writeFile: takes filePath, text, callback w/ error
  fs.exists(filePath, (exist) => {
    if (!exist) {
      callback(new Error(`No item with id: ${id}`));
    } else {
      fs.writeFile(filePath, text, (err) => {
        //need to throw error if the id's filePath doesn't current exist
        if (err) {
          callback(new Error(`No item with id: ${id}`));
        } else {
          callback(null, { id, text });
        }
      });
    }
  });
};

exports.delete = (id, callback) => {
  var filePath = path.join(exports.dataDir, `${id}.txt`);

  //use fs.unlink: filePath, callback w/ err
  fs.unlink(filePath, (err) => {
    //if error, throw eror
    if (err) {
      callback(new Error(`No item with id: ${id}`));
    } else {
      //else callback()
      callback();
    }
  });

};

// Config+Initialization code -- DO NOT MODIFY /////////////////////////////////
//__dirname/'data'
exports.dataDir = path.join(__dirname, 'data');


exports.initialize = () => {
  if (!fs.existsSync(exports.dataDir)) {
    fs.mkdirSync(exports.dataDir);
  }
};

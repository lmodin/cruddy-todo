const fs = require('fs');
const path = require('path');
const sprintf = require('sprintf-js').sprintf;

var counter = 0;

// Private helper functions ////////////////////////////////////////////////////

// Zero padded numbers can only be represented as strings.
// If you don't know what a zero-padded number is, read the
// Wikipedia entry on Leading Zeros and check out some of code links:
// https://www.google.com/search?q=what+is+a+zero+padded+number%3F

const zeroPaddedNumber = (num) => {
  return sprintf('%05d', num);
};

const readCounter = (callback) => {
  //readFile takes the filepath, callback with error or data received from reading file
  fs.readFile(exports.counterFile, (err, fileData) => {
    if (err) {
      callback(null, 0);
    } else {
      //fileData is what we get from reading the file
      //Number turns the string into the number
      callback(null, Number(fileData));
    }
  });
};

const writeCounter = (count, callback) => {
  var counterString = zeroPaddedNumber(count);
  //writeFile takes filePath, string, callback with error
  fs.writeFile(exports.counterFile, counterString, (err) => {
    if (err) {
      throw ('error writing counter');
    } else {
      //apply callback on stringed argument
      callback(null, counterString);
    }
  });
};

// Public API - Fix this function //////////////////////////////////////////////

exports.getNextUniqueId = (callback = () => {}) => {
  //call readCounter to see if that already exists
  //if it already exists we'll get the current number, otherwise we'll get 0
  readCounter((err, number) => {
    if (err) {
      throw ('error');
    } else {
    //call writeCounter with the current number + 1
      writeCounter((number + 1), (err, counterString) => {
        //calls this function as long as there aren't any errors
        //should call callback on string
        callback (err, counterString);
      });
    }
  });
};



// Configuration -- DO NOT MODIFY //////////////////////////////////////////////

exports.counterFile = path.join(__dirname, 'counter.txt');

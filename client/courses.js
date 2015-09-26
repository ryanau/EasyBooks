var EventEmitter = require('eventemitter3');
var objectAssign = require('object-assign');


var Courses = function(){
  this.courses = [];
};

objectAssign(Courses.prototype, EventEmitter.prototype);

Courses.prototype.addToCourses = function(data){
	var i = 0
	var status = true
	this.courses.forEach(function(course) {
		if (course[0] === data[0] && course[1] === data[1]) {
			this.courses.splice(i, 1)
			status = false
		};
		i++
	}.bind(this));
	if (status == true) {
	  this.courses.push(data);
	}

  this.emit('change');
  return this;
};

Courses.prototype.empty = function () {
	this.courses = [];
}

module.exports = Courses;


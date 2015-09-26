var EventEmitter = require('eventemitter3');
var objectAssign = require('object-assign');


var Courses = function(){
  this.courses = [];
};

objectAssign(Courses.prototype, EventEmitter.prototype);

Courses.prototype.addToCourses = function(data){
	var i = 0
	this.courses.forEach(function(user) {
		if (user.user_id == data.user_id) {
			this.courses.splice(i, 1)
		};
		i++
	}.bind(this));
  this.courses.push(data);
  this.emit('change');
  return this;
};

Courses.prototype.empty = function () {
	this.courses = [];
}

module.exports = Courses;


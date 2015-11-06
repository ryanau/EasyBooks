var React = require('react');
var $ = require('jquery');
var Select = require('react-select');

var mui = require('material-ui');
var ThemeManager = new mui.Styles.ThemeManager();

var Courses = require('../courses.js');

AddSubscription = React.createClass({
	getInitialState: function () {
	  return {
	    courses: [{value: "1", label: "Loading..."}],
	  }
	},
	componentDidMount: function () {
	  this.loadCourses();
	},
	loadCourses: function () {
	  $.ajax({
	    url: this.props.origin + '/courses',
	    type: 'GET',
	    dataType: 'json',
	    crossDomain: true,
	    headers: {'Authorization': localStorage.getItem('jwt-easybooks')},
	    success: function (response) {
	      this.setState({
	        courses: response.courses,
	      });
	    }.bind(this),
	    error: function (error) {
	      window.location = "/"
	    }.bind(this),
	  });
	},
	updateSubscription: function () {
		var data = {courses: this.state.subscriptionBasket.courses};
		$.ajax({
			url: this.props.origin + '/subscriptions',
			type: 'PUT',
			data: data,
			dataType: 'json',
			crossDomain: true,
			headers: {'Authorization': localStorage.getItem('jwt-easybooks'),
			},
			success: function (response) {
				this.refs.subscriptionsUpdated.show();
				this.loadSubcriptions();
				this.setTimeout(function () {
					this.redirectToHome();
				}, 1000)
			}.bind(this),
			error: function (error) {
				window.location = "/"
			}.bind(this),
		});
	},
	searchChange: function (value) {
		var data = {course_selected: value};
		$.ajax({
			url: this.props.origin + '/subscriptions',
			type: 'POST',
			data: data,
			dataType: 'json',
			crossDomain: true,
			headers: {'Authorization': localStorage.getItem('jwt-easybooks'),
			},
			success: function (response) {
				this.props.reload();
			}.bind(this),
			error: function (error) {
				window.location = "/"
			}.bind(this),
		});
	},
	render: function () {
		var searchOptions = this.state.courses;
		return (
			<div>
				<Select
				  name="form-field-name"
				  value="Please type the course name or use the dropdown menu"
				  options={searchOptions}
				  onChange={this.searchChange}
				  searchable={true}/>
			</div>
		)
	}
});

module.exports = AddSubscription;
var React = require('react');
var $ = require('jquery');
var Dropzone = require('react-dropzone');
var Courses = require('../courses.js');

var mui = require('material-ui');
var ThemeManager = new mui.Styles.ThemeManager();
var FlatButton = mui.FlatButton;
var RaisedButton = mui.RaisedButton;
var Dialog = mui.Dialog;
var TextField = mui.TextField;
var Snackbar = mui.Snackbar;
var Paper = mui.Paper;

var Course = require('./Course.jsx');

ScheduleUploader = React.createClass({
	childContextTypes: {
	  muiTheme: React.PropTypes.object
	},
	getChildContext: function () {
	  return {
	    muiTheme: ThemeManager.getCurrentTheme()
	  };
	},
	getInitialState: function () {
		return {
			courseBasket: new Courses,
			courses: null,
		}
	},
	componentDidMount: function(){
	  this.state.courseBasket.on('change', this.coursesChanged);
	},
	componentWillUnmount: function(){
	  this.state.courseBasket.off('change');
	},
	coursesChanged: function(){
	  this.forceUpdate();
	},
	uploadSubscription: function () {
		var data = {
			courses: this.state.courseBasket.courses,
		};
		$.ajax({
			url: this.props.origin + '/subscriptions',
			type: 'POST',
			data: data,
			dataType: 'json',
			crossDomain: true,
			headers: {'Authorization': localStorage.getItem('jwt'),
			},
			success: function (response) {
				console.log(response)
			}.bind(this),
			error: function (error) {
				window.location = "/"
			}.bind(this),
		});
	},
	uploadCalendar: function (file) {
		var data = new FormData();
		data.append("calendar", file[0]);
		$.ajax({
			url: this.props.origin + '/parse_calendar',
			type: 'POST',
			data: data,
			dataType: 'json',
			processData: false,
			contentType: false,
			crossDomain: true,
			headers: {'Authorization': localStorage.getItem('jwt'),
			},
			success: function (response) {
				this.setState({
					courses: response.courses
				});
			}.bind(this),
			error: function (error) {
				window.location = "/"
			}.bind(this),
		});
	},
	render: function () {
		if (this.state.courses != null) {
			var courses = this.state.courses.map(function (course, index) {
				return (
					<Course key={index} course={course} courseBasket={this.state.courseBasket}/>
				)
			}.bind(this))
			var uploadButton = 
				<FlatButton
				  label="Subscribe Class Alert"
				  onClick={this.uploadSubscription}
				  secondary={true}/> 
		} else {
			var courses = "Loading...";
		}
		return (
			<div>
				<h1>Calendar uploader</h1>
				<div id="drop">
				<Paper zDepth={2}>
					<Dropzone onDrop={this.uploadCalendar} multiple={false}>
	          <div><h3>Drag or click here to upload your calendar file</h3></div>
	        </Dropzone>
				</Paper>
				{courses}
				{uploadButton}
				</div>
			</div>
		)
	},
});

module.exports = ScheduleUploader;
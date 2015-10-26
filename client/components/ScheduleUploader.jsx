var React = require('react');
var $ = require('jquery');
var Dropzone = require('react-dropzone');
var Courses = require('../courses.js');
var Router = require('react-router');
var Navigation = Router.Navigation;
var Link = Router.Link;


var mui = require('material-ui');
var ThemeManager = new mui.Styles.ThemeManager();
var Dialog = mui.Dialog;
var TextField = mui.TextField;
var Snackbar = mui.Snackbar;
var Paper = mui.Paper;

var Panel = require('react-bootstrap').Panel;
var Button = require('react-bootstrap').Button;
var ButtonToolbar = require('react-bootstrap').ButtonToolbar;

var Course = require('./Course.jsx');

ScheduleUploader = React.createClass({
	mixins: [ Navigation ],
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
			warning: null,
		}
	},
	componentDidMount: function(){
	  this.state.courseBasket.on('change', this.coursesChanged);
	},
	componentWillUnmount: function(){
		this.state.courseBasket.empty();
	  this.state.courseBasket.off('change');
	},
	coursesChanged: function(){
	  this.forceUpdate();
	},
	uploadSubscription: function () {
		var data = {
			courses: this.state.courseBasket.courses,
		};
		if (data.courses.length != 0) {
			$.ajax({
				url: this.props.origin + '/subscriptions',
				type: 'POST',
				data: data,
				dataType: 'json',
				crossDomain: true,
				headers: {'Authorization': localStorage.getItem('jwt-easybooks'),
				},
				success: function (response) {
					this.transitionTo('/', {postId: response.post_id});
				}.bind(this),
				error: function (error) {
					window.location = "/"
				}.bind(this),
			});
		} else {
			this.setState({
				warning: "Please subscribe to at least one class!"
			})
		}
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
			headers: {'Authorization': localStorage.getItem('jwt-easybooks'),
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
			}.bind(this));
			var uploadButton = 
				<Button onClick={this.uploadSubscription} bsStyle="success">Subscribe to Courses</Button>
			var warning = this.state.warning;
		} else {
			var courses = "Loading...";
		}
		return (
			<div>
				<Panel header="Schedule Uploader">
				<div id="drop">
				<Paper zDepth={2}>
					<Dropzone onDrop={this.uploadCalendar} multiple={false}>
	          <div><h3>Drag or click here to upload your calendar file</h3></div>
	        </Dropzone>
				</Paper>
				</div>
				{courses}
				{uploadButton}
				{warning}
				</Panel>
			</div>
		)
	},
});

module.exports = ScheduleUploader;
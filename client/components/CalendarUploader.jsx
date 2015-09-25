var React = require('react');
var $ = require('jquery');
var Dropzone = require('react-dropzone');

var mui = require('material-ui');
var ThemeManager = new mui.Styles.ThemeManager();
var FlatButton = mui.FlatButton;
var RaisedButton = mui.RaisedButton;
var Dialog = mui.Dialog;
var TextField = mui.TextField;
var Snackbar = mui.Snackbar;
var Paper = mui.Paper;



CalendarUploader = React.createClass({
	childContextTypes: {
	  muiTheme: React.PropTypes.object
	},
	getChildContext: function () {
	  return {
	    muiTheme: ThemeManager.getCurrentTheme()
	  };
	},
	uploadCalendar: function (file) {
		console.log(file[0])
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

			}.bind(this),
			error: function (error) {
				window.location = "/"
			}.bind(this),
		});
	},
	render: function () {
		return (
			<div>
				<h1>Calendar uploader</h1>
				<div id="drop">
				<Paper zDepth={2}>
					<Dropzone onDrop={this.uploadCalendar} multiple={false}>
	          <div><h3>Drag or click here to upload your calendar file</h3></div>
	        </Dropzone>
				</Paper>
				</div>
			</div>
		)
	},
});

module.exports = CalendarUploader;
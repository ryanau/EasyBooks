var React = require('react');
var $ = require('jquery');

var mui = require('material-ui');
var ThemeManager = new mui.Styles.ThemeManager();
var FlatButton = mui.FlatButton;
var RaisedButton = mui.RaisedButton;
var TextField = mui.TextField;

LogIn = React.createClass({
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
			email: null,
			passowrd: null,
		}
	},
	handleFirstName: function (e) {
		this.setState({first_name: e.target.value})
	},
	handleLastName: function (e) {
		this.setState({last_name: e.target.value})
	},
	handleEmail: function (e) {
		this.setState({email: e.target.value})
	},
	handlePassword: function (e) {
		this.setState({password: e.target.value})
	},
	handleSubmit: function () {
		var data = {
			email: this.state.email,
			password: this.state.password,
		};
		$.ajax({
			url: this.props.origin + '/login',
			type: 'GET',
			data: data,
			dataType: 'json',
			success: function (response) {
				jwt = response.token;
				if (jwt) {
					localStorage.setItem('jwt-easybooks', jwt);
				};
				window.location = "/"
			}.bind(this),
			error: function (error) {
				window.location = "/"
			}.bind(this),
		});
	},
	render: function () {
		return (
			<div>
				<TextField
					onChange={this.handleEmail}
				  floatingLabelText="Email" 
				  hintText="Required"/>
				<TextField
					onChange={this.handlePassword}
				  floatingLabelText="Password" 
				  hintText="Required"
				  type="password"/>
				<FlatButton
				  label="Log In"
				  onClick={this.handleSubmit}/>
			</div>
		)
	},
});

module.exports = LogIn;
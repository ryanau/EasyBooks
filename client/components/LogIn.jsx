var React = require('react');
var $ = require('jquery');

var mui = require('material-ui');
var ThemeManager = new mui.Styles.ThemeManager();
var FlatButton = mui.FlatButton;
var RaisedButton = mui.RaisedButton;
var Dialog = mui.Dialog;
var TextField = mui.TextField;
var Snackbar = mui.Snackbar;

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
		this.setState({
			first_name: e.target.value
		})
	},
	handleLastName: function (e) {
		this.setState({
			last_name: e.target.value
		})
	},
	handleEmail: function (e) {
		this.setState({
			email: e.target.value
		})
	},
	handlePassword: function (e) {
		this.setState({
			password: e.target.value
		})
	},
	closeModal: function () {
		this.refs.logInDialog.dismiss();
	},
	openModal: function () {
		this.refs.logInDialog.show();
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
					localStorage.setItem('jwt', jwt);
				};
				window.location = "/"
			}.bind(this),
			error: function (error) {
				window.location = "/"
			}.bind(this),
		});
	},
	render: function () {
		var DialogAction = [
			<div>
			<FlatButton
			  label="Cancel"
			  onClick={this.closeModal}/>
			<FlatButton
			  label="Log In"
			  onClick={this.handleSubmit}/> 
			</div>
		]
		var logInDialog = 
			<Dialog
				ref="logInDialog"
				title="Log In"
				actions={DialogAction}
				modal={true}>
	  		<TextField
	  			onChange={this.handleEmail}
	  		  floatingLabelText="Email" 
	  		  hintText="Required"/>
	  		<TextField
	  			onChange={this.handlePassword}
	  		  floatingLabelText="Password" 
	  		  hintText="Required"
	  		  type="password"/>
			</Dialog>
		return (
			<div>
				{logInDialog}
				<RaisedButton
					secondary={true}
				  label="Log In"
				  onClick={this.openModal}/>
			</div>
		)
	},
});

module.exports = LogIn;
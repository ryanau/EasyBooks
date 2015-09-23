var React = require('react');
var $ = require('jquery');

var mui = require('material-ui');
var ThemeManager = new mui.Styles.ThemeManager();
var FlatButton = mui.FlatButton;
var RaisedButton = mui.RaisedButton;
var Dialog = mui.Dialog;
var TextField = mui.TextField;
var Snackbar = mui.Snackbar;

SignUp = React.createClass({
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
			first_name: null,
			last_name: null,
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
		this.refs.signUpDialog.dismiss();
	},
	openModal: function () {
		this.refs.signUpDialog.show();
	},
	handleSubmit: function () {
		var data = {
			first_name: this.state.first_name,
			last_name: this.state.last_name,
			email: this.state.email,
			password: this.state.password,
		};
		$.ajax({
			url: this.props.origin + '/users',
			type: 'POST',
			data: data,
			dataType: 'json',
			crossDomain: true,
			headers: {'Authorization': sessionStorage.getItem('jwt'),
			},
			success: function (response) {
				jwt = response.token;
				if (jwt) {
					localStorage.setItem('jwt', jwt);
				};
				window.location = "/"
				console.log('signed up');
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
			  label="Sign Up"
			  onClick={this.handleSubmit}/> 
			</div>
		]
		var signUpDialog = 
  		<Dialog
  			ref="signUpDialog"
  			title="Sign Up"
  			actions={DialogAction}
  			modal={false}>
	  		<TextField
	  			onChange={this.handleFirstName}
	  		  floatingLabelText="First Name" 
	  		  hintText="Required"/>
	  		<TextField
	  			onChange={this.handleLastName}
	  		  floatingLabelText="Last Name" 
	  		  hintText="Required"/>
	  		<TextField
	  			onChange={this.handleEmail}
	  		  floatingLabelText="Email" 
	  		  hintText="Required"/>
	  		<TextField
	  			onChange={this.handlePassword}
	  		  floatingLabelText="Password" 
	  		  hintText="Required"/>

  		</Dialog>
		var signUpBox = (
			<div>
				<h1>SignUp</h1>
				<p>First Name: <input onChange={this.handleFirstName} value={this.state.first_name} /></p>
				<p>Last Name: <input onChange={this.handleLastName} value={this.state.last_name} /></p>
				<p>Email: <input onChange={this.handleEmail} value={this.state.email} /></p>
				<p>Password: <input onChange={this.handlePassword} value={this.state.password} /></p>
				<button onClick={this.handleSubmit}>Sign Up</button>
			</div>
		)
		return (
			<div>
				{signUpDialog}
				<FlatButton
				  label="Sign Up"
				  onClick={this.openModal}/>
			</div>
		)
	},
});

module.exports = SignUp;
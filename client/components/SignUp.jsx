var React = require('react');
var $ = require('jquery');

var mui = require('material-ui');
var ThemeManager = new mui.Styles.ThemeManager();
var FlatButton = mui.FlatButton;
var RaisedButton = mui.RaisedButton;
var Dialog = mui.Dialog;
var TextField = mui.TextField;
var Snackbar = mui.Snackbar;
var DropDownMenu = mui.DropDownMenu;

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
			phone: null,
			university: "1",
			universities: [{payload: "1", text: "Loading"}],
			warning: null,
		}
	},
	componentDidMount: function () {
		this.loadUniversities();
	},
	loadUniversities: function () {
		$.ajax({
			url: this.props.origin + '/universities',
			type: 'GET',
			dataType: 'json',
			success: function (response) {
				universities = response.data
				this.setState({
					universities: universities,
				});
			}.bind(this),
			error: function (error) {
				window.location = "/"
			}.bind(this),
		});
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
	handlePhone: function (e) {
		this.setState({
			phone: e.target.value
		})
	},
	closeModal: function () {
		this.refs.signUpDialog.dismiss();
		this.setState({
			warning: null,
		});
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
			phone: this.state.phone,
			university: this.state.university,
		};
		if (data.first_name == null || data.last_name == null || data.email == null || data.password == null || data.phone == null) {
			this.setState({
				warning: "Please fill out all required fields."
			});
		} else {
			$.ajax({
				url: this.props.origin + '/users',
				type: 'POST',
				data: data,
				dataType: 'json',
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
		}
	},
	handleDropDownMenu: function (e, selectedIndex, menuItem) {
		this.setState({
			university: menuItem.payload
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
		];
		var universityList = this.state.universities;
		console.log(this.state.warning)
		if (this.state.warning != null) {
			var warning = this.state.warning;
		}
		var signUpDialog = 
  		<Dialog
  			ref="signUpDialog"
  			title="Sign Up"
  			actions={DialogAction}
  			modal={true}>
	  		<div>
	  		<TextField
	  			onChange={this.handleFirstName}
	  		  floatingLabelText="First Name" 
	  		  hintText="Required"/>
	  		</div>
	  		<div>
	  		<TextField
	  			onChange={this.handleLastName}
	  		  floatingLabelText="Last Name" 
	  		  hintText="Required"/>
	  		</div>
	  		<div>
	  		<TextField
	  			onChange={this.handlePhone}
	  		  floatingLabelText="Phone Number" 
	  		  hintText="Required"/>
	  		<div>
	  		<DropDownMenu menuItems={universityList} autoScrollBodyContent={true} onChange={this.handleDropDownMenu}/>
	  		</div>
	  		</div>
	  		<div>
	  		<TextField
	  			onChange={this.handleEmail}
	  		  floatingLabelText="Email" 
	  		  hintText="Required"/>
	  		</div>
	  		<div>
	  		<TextField
	  			onChange={this.handlePassword}
	  		  floatingLabelText="Password" 
	  		  hintText="Required"
	  		  type="password"/>
	  		</div>
	  		{warning}
  		</Dialog>
		return (
			<div>
				{signUpDialog}
				<RaisedButton
					secondary={true}
				  label="Sign Up"
				  onClick={this.openModal}/>
			</div>
		);
	},
});

module.exports = SignUp;
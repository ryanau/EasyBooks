var React = require('react');
var $ = require('jquery');

var mui = require('material-ui');
var ThemeManager = new mui.Styles.ThemeManager();
var FlatButton = mui.FlatButton;
var RaisedButton = mui.RaisedButton;
var TextField = mui.TextField;
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
			first_name: "",
			last_name: "",
			email: "",
			passowrd: "",
			phone: "",
			university: "1",
			universities: [{payload: "1", text: "Loading"}],
			warning: "",
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
	handleSubmit: function () {
		var data = {
			first_name: this.state.first_name,
			last_name: this.state.last_name,
			email: this.state.email,
			password: this.state.password,
			phone: this.state.phone,
			university: this.state.university,
		};
		if (data.first_name == "" || data.last_name == "" || data.email == "" || data.password == "" || data.phone == "") {
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
						localStorage.setItem('jwt-easybooks', jwt);
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
		var universityList = this.state.universities;
		if (this.state.warning != "") {
			var warning = this.state.warning;
		}
		return (
			<div>
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
				<DropDownMenu menuItems={universityList} autoScrollBodyContent={true} onChange={this.handleDropDownMenu}/>
				<div>
				<TextField
					onChange={this.handlePhone}
				  floatingLabelText="Phone Number" 
				  hintText="Required"/>
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
				<FlatButton
				  label="Sign Up"
				  onClick={this.handleSubmit}/>
				{warning}
			</div>
		);
	},
});

module.exports = SignUp;
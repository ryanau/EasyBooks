var React = require('react');
var $ = require('jquery');


LogIn = React.createClass({
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
			crossDomain: true,
			headers: {'Authorization': sessionStorage.getItem('jwt'),
			},
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
		var signUpBox = (
			<div>
				<h1>LogIn</h1>
				<p>Email: <input onChange={this.handleEmail} value={this.state.email} /></p>
				<p>Password: <input onChange={this.handlePassword} value={this.state.password} /></p>
				<button onClick={this.handleSubmit}>Log In</button>
			</div>
		)
		return (
			<div>
				{signUpBox}
			</div>
		)
	},
});

module.exports = LogIn;
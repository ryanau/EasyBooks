var React = require('react');
var $ = require('jquery');


SignUp = React.createClass({
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
				{signUpBox}
			</div>
		)
	},
});

module.exports = SignUp;
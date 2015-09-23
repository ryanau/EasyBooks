var React = require('react');
var Router = require('react-router');
var RouteHandler = Router.RouteHandler;
var SignUp = require('./SignUp.jsx');
var LogIn = require('./LogIn.jsx');
var $ = require('jquery');


App = React.createClass({
	getDefaultProps: function() {
    return {

      // comment the following line when in development
      // origin: '/api',

      // comment the following line when deploying to heroku
      origin: 'http://localhost:3000/api'
    }
  },
  getInitialState: function () {
    return {
      signedIn: false,
      current_user: {id: null, first_name: null},
    }
  },
  componentDidMount: function () {
  	if (!!localStorage.getItem('jwt')) {
			this.currentUserFromAPI();
  	};
  },
  currentUserFromAPI: function () {
    $.ajax({
      url: this.props.origin + '/current_user',
      type: 'GET',
      dataType: 'json',
      crossDomain: true,
      headers: {'Authorization': localStorage.getItem('jwt'),
      },
      success: function (response) {
        this.setState({
          signedIn: true, 
          currentUser: {id: response.id, first_name: response.first_name},
        });
      }.bind(this),
      error: function(error) {
        window.location = "/"
      }.bind(this),
    });

  },
	render: function () {
		return (
			<div>
				<SignUp origin={this.props.origin} readFromAPI={this.readFromAPI}/>
				<LogIn origin={this.props.origin} readFromAPI={this.readFromAPI}/>
			</div>
		)
	},
});

module.exports = App;
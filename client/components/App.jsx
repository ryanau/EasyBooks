var React = require('react');
var Router = require('react-router');
var RouteHandler = Router.RouteHandler;
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
        <div className="container">
          <RouteHandler origin={this.props.origin} currentUser={this.state.currentUser} signedIn={this.state.signedIn}/>
        </div>
			</div>
		)
	},
});

module.exports = App;
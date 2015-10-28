var React = require('react');
var Router = require('react-router');
var RouteHandler = Router.RouteHandler;
var Uri = require('jsuri');
var $ = require('jquery');

var NavBar = require('./NavBar.jsx');


App = React.createClass({
	getDefaultProps: function() {
    return {

      // comment the following line when in development
      origin: '/api',

      // comment the following line when deploying to heroku
      // origin: 'http://localhost:3000/api'
    }
  },
  getInitialState: function () {
    return {
      signedIn: false,
      currentUser: {id: null, first_name: null, last_name: null, pic: null, completed: false},
      mode: "development",
    }
  },
  componentWillMount: function () {
    var jwt = new Uri(location.search).getQueryParamValue('jwt');
    if (!!jwt) {localStorage.setItem('jwt-easybooks', jwt);}
  },
  componentDidMount: function () {
    if (!!localStorage.getItem('jwt-easybooks')) {this.currentUserFromAPI();}
    this.checkEnvironment();
  },
  checkEnvironment: function () {
    $.ajax({
      url: this.props.origin + '/environment',
      type: 'GET',
      dataType: 'json',
      crossDomain: true,
      headers: {'Authorization': localStorage.getItem('jwt-easybooks'),
      },
      success: function (response) {
        this.setState({
          mode: response.mode
        });
      }.bind(this),
      error: function(error) {
        window.location = "/"
      }.bind(this),
    });
  },
  currentUserFromAPI: function () {
    $.ajax({
      url: this.props.origin + '/current_user',
      type: 'GET',
      dataType: 'json',
      crossDomain: true,
      headers: {'Authorization': localStorage.getItem('jwt-easybooks'),
      },
      success: function (response) {
        this.setState({
          signedIn: true, 
          currentUser: {id: response.id, first_name: response.first_name, last_name: response.last_name, pic: response.pic, completed: response.completed},
          mode: response.mode
        });
      }.bind(this),
      error: function(error) {
        localStorage.removeItem('jwt-easybooks');
        location = '/';
      }.bind(this),
    });
  },
	render: function () {
		return (
			<div>
        <NavBar signedIn={this.state.signedIn} currentUser={this.state.currentUser}/>
        <div className="mT100">
          <RouteHandler origin={this.props.origin} currentUser={this.state.currentUser} signedIn={this.state.signedIn} mode={this.state.mode}/>
        </div>
			</div>
		);
	},
});

module.exports = App;
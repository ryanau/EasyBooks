var React = require('react');
var Router = require('react-router');
var RouteHandler = Router.RouteHandler;
var Uri = require('jsuri');
var $ = require('jquery');
var Navigation = Router.Navigation;

var NavBar = require('./NavBar.jsx');

App = React.createClass({
  mixins: [ Navigation ],
	getDefaultProps: function() {
    return {

      // comment the following line when in development
      origin: '/api/v1',

      // comment the following line when deploying to heroku
      // origin: 'http://localhost:3000/api/v1',
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
    var venmo_status = new Uri(location.search).getQueryParamValue('venmo_status');
    if (venmo_status) {
      this.transitionTo('/venmo_close_window');
    } else {
      if (localStorage.getItem('jwt-easybooks')) {
        this.setState({
          signedIn: true,
        })
      }
      var jwt = new Uri(location.search).getQueryParamValue('jwt');
      if (!!jwt) {localStorage.setItem('jwt-easybooks', jwt);}
    }
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
          currentUser: {id: response.id, first_name: response.first_name, last_name: response.last_name, pic: response.pic, completed: response.completed, venmo_linked: response.venmo_linked},
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
    if ($(window).width() < 768) {
      var margin = "mT100"
    } else {
      var margin = "mT50"
    }
		return (
			<div>
        <NavBar signedIn={this.state.signedIn} currentUser={this.state.currentUser} origin={this.props.origin}/>
        <div className={margin}>
          <RouteHandler origin={this.props.origin} currentUser={this.state.currentUser} signedIn={this.state.signedIn} mode={this.state.mode}/>
        </div>
			</div>
		);
	},
});

module.exports = App;
var React = require('react');
var $ = require('jquery');
var Router = require('react-router');
var Link = Router.Link;

var mui = require('material-ui');
var ThemeManager = new mui.Styles.ThemeManager();
var RaisedButton = mui.RaisedButton;

var Alert = require('react-bootstrap').Alert;

var MarketPlace = require('./MarketPlace.jsx');

Dashboard = React.createClass({
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
			starred: null,
		}
	},
	componentDidMount: function () {
		this.loadStarred();
	},
	loadStarred: function () {
		$.ajax({
			url: this.props.origin + '/stars/starred',
			type: 'GET',
			dataType: 'json',
			crossDomain: true,
			headers: {'Authorization': localStorage.getItem('jwt-easybooks')},
			success: function (response) {
				this.setState({
					starred: response.starred,
				})
			}.bind(this),
			error: function (error) {
				window.location = "/"
			}.bind(this),
		});
	},
	render: function () {
  	if (this.state.starred == false) {
  		var followReminder =
			<Alert bsStyle="info">
				<h4>Watch a post!</h4>
		  	<p>You are not watching a post. Watch a post and get connected if it is your turn!</p>
		  </Alert>
  	}
		return (
			<div className="container col-md-8 col-md-offset-2">
				{followReminder}
				<h3>Welcome Back {this.props.currentUser.first_name}</h3>
				<MarketPlace origin={this.props.origin} currentUser={this.props.currentUser}/>
			</div>
		)
	},
});

module.exports = Dashboard;
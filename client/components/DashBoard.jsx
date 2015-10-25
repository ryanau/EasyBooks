var React = require('react');
var $ = require('jquery');
var Router = require('react-router');
var Link = Router.Link;

var mui = require('material-ui');
var ThemeManager = new mui.Styles.ThemeManager();
var RaisedButton = mui.RaisedButton;

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
	render: function () {
		return (
			<div>
				<h3>Welcome Back {this.props.currentUser.first_name}</h3>
				<MarketPlace origin={this.props.origin} currentUser={this.props.currentUser}/>
			</div>
		)
	},
});

module.exports = Dashboard;
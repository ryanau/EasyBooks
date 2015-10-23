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
			<div id="dashboard">
				<h1>DashBoard</h1>
				<h3>Welcome Back {this.props.currentUser.first_name}</h3>
				<RaisedButton
					containerElement={<Link to="/schedule" />}
					linkButton={true}
					secondary={true}
					label={('no', 'Upload Your Schedule')}/>
				<RaisedButton
					containerElement={<Link to="/subscriptions" />}
					linkButton={true}
					secondary={true}
					label={('no', 'Subscriptions')}/>
				<RaisedButton
					containerElement={<Link to="/postdashboard" />}
					linkButton={true}
					secondary={true}
					label={('no', 'Your Posts')}/>
				<MarketPlace origin={this.props.origin} currentUser={this.props.currentUser}/>
			</div>
		)
	},
});

module.exports = Dashboard;
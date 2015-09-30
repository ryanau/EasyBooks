var React = require('react');
var $ = require('jquery');
var Router = require('react-router');
var Link = Router.Link;

var mui = require('material-ui');
var ThemeManager = new mui.Styles.ThemeManager();
var RaisedButton = mui.RaisedButton;
var Tabs = mui.Tabs;
var Tab = mui.Tab;

var StarredPosts = require('./postdashboard/StarredPosts.jsx');
var ActivePosts = require('./postdashboard/ActivePosts.jsx');
var ArchivedPosts = require('./postdashboard/ArchivedPosts.jsx');


PostDashBoard = React.createClass({
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
				<h4>Post DashBoard</h4>
				<Tabs>
					<Tab label="Starred Posts" >
						<StarredPosts origin={this.props.origin} />
					</Tab>
				  <Tab label="Active Posts" >
				    <ActivePosts origin={this.props.origin} />
				  </Tab>
				  <Tab label="Archived Posts" >
				    <ArchivedPosts origin={this.props.origin} />
				  </Tab>
				</Tabs>
			</div>
		)
	},
});

module.exports = PostDashBoard;
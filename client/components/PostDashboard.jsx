var React = require('react');
var $ = require('jquery');
var Router = require('react-router');
var Link = Router.Link;

var mui = require('material-ui');
var ThemeManager = new mui.Styles.ThemeManager();

var Tab = require('react-bootstrap').Tab;
var Tabs = require('react-bootstrap').Tabs;
var Panel = require('react-bootstrap').Panel;

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
			<div className="container col-md-8 col-md-offset-2">
				<Panel header="Your Posts" bsStyle="info">
					<Tabs defaultActiveKey={1}>
					  <Tab eventKey={1} title="Active">
					    <ActivePosts origin={this.props.origin} currentUser={this.props.currentUser}/>
					  </Tab>
					  <Tab eventKey={2} title="Sold">
					    <ArchivedPosts origin={this.props.origin} currentUser={this.props.currentUser}/>
					  </Tab>
					</Tabs>
				</Panel>
			</div>
		)
	},
});

module.exports = PostDashBoard;
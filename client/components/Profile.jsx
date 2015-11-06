var React = require('react');
var $ = require('jquery');
var Router = require('react-router');
var Navigation = Router.Navigation;
var moment = require('moment');

var Panel = require('react-bootstrap').Panel;
var Button = require('react-bootstrap').Button;
var ButtonToolbar = require('react-bootstrap').ButtonToolbar;
var Glyphicon = require('react-bootstrap').Glyphicon;
var Label = require('react-bootstrap').Label;

var Comments = require('./Comments.jsx');

Profile = React.createClass({
	render: function () {
		return (
			<div className="container col-md-8 col-md-offset-2">
				<Panel header="Your Profile" bsStyle="info">
				</Panel>
			</div>
		)
	},
});

module.exports = Profile;
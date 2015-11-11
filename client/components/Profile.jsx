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
	getInitialState: function () {
		return {
			credit_count: null,
		}
	},
	componentDidMount: function () {
		this.loadCreditCount();
	},
	reloadCreditCount: function () {
		this.loadCreditCount();
	},
	loadCreditCount: function () {
		$.ajax({
		  url: this.props.origin + '/credits/count',
		  type: 'GET',
		  dataType: 'json',
		  crossDomain: true,
		  headers: {'Authorization': localStorage.getItem('jwt-easybooks')},
		  success: function (response) {
		    this.setState({
		    	credit_count: response.credit_count,
		    });
		  }.bind(this),
		  error: function (error) {
		    window.location = "/"
		  }.bind(this),
		});	
	},
	render: function () {
		// var creditCount = !this.state.credit_count? "Loading..." : this.state.credit_count;
		if (this.state.credit_count == null) {
			var creditCount = "Loading..."
		} else {
			var creditCount = this.state.credit_count;
		}
		return (
			<div className="container col-md-8 col-md-offset-2">
				<Panel header="Your Profile" bsStyle="info">
				<h3>Credit: {creditCount}</h3>
				<Promocode origin={this.props.origin} reloadCreditCount={this.reloadCreditCount}/>
				</Panel>
			</div>
		)
	},
});

module.exports = Profile

module.exports = Profile;
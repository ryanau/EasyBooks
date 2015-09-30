var React = require('react');
var $ = require('jquery');
var Courses = require('../courses.js');

var Router = require('react-router');
var Navigation = Router.Navigation;
var Link = Router.Link;

var mui = require('material-ui');
var ThemeManager = new mui.Styles.ThemeManager();
var Snackbar = mui.Snackbar;
var RaisedButton = mui.RaisedButton;

var SubscribedCourse = require('./SubscribedCourse.jsx');

Subscriptions = React.createClass({
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
			subscriptionBasket: new Courses,
			subscriptions: null,
		}
	},
	componentDidMount: function () {
		this.loadSubcriptions();
		this.state.subscriptionBasket.on('change', this.coursesChanged);
	},
	componentWillUnmount: function(){
		this.state.subscriptionBasket.empty();
	  this.state.subscriptionBasket.off('change');
	},
	loadSubcriptions: function () {
		$.ajax({
			url: this.props.origin + '/subscriptions',
			type: 'GET',
			dataType: 'json',
			crossDomain: true,
			headers: {'Authorization': localStorage.getItem('jwt')},
			success: function (response) {
				this.setState({
					subscriptions: response
				});
			}.bind(this),
			error: function (error) {
				window.location = "/"
			}.bind(this),
		});
	},
	updateSubscription: function () {
		var data = {
			courses: this.state.subscriptionBasket.courses,
		};
		$.ajax({
			url: this.props.origin + '/subscriptions',
			type: 'PUT',
			data: data,
			dataType: 'json',
			crossDomain: true,
			headers: {'Authorization': localStorage.getItem('jwt'),
			},
			success: function (response) {
				this.refs.subscriptionsUpdated.show();
				this.loadSubcriptions();
			}.bind(this),
			error: function (error) {
				window.location = "/"
			}.bind(this),
		});
	},
	render: function () {
		if (this.state.subscriptions != null) {
			var subscriptions = this.state.subscriptions.map(function (course, index) {
				return (
					<SubscribedCourse key={index} origin={this.props.origin} course={course} subscriptionBasket={this.state.subscriptionBasket}/>
				)
			}.bind(this));
			var updateSubscriptionButton = 
			<RaisedButton
			  label="Update Subscriptions"
			  onClick={this.updateSubscription}
			  secondary={true}/>;
		} else {
			var subscriptions = "Loading..."
		}
		return (
			<div>
				<Snackbar
				  ref="subscriptionsUpdated"
				  message='Subscriptions Updated'
				  autoHideDuration={2000}/>
				<h4>Subscriptions</h4>
				{subscriptions}
				{updateSubscriptionButton}
			</div>
		)
	},
});

module.exports = Subscriptions;
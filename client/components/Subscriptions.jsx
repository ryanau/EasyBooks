var React = require('react');
var $ = require('jquery');
var Router = require('react-router');
var Navigation = Router.Navigation;
var TimerMixin = require('react-timer-mixin');

var Link = Router.Link;

var mui = require('material-ui');
var ThemeManager = new mui.Styles.ThemeManager();
var Snackbar = mui.Snackbar;
var RaisedButton = mui.RaisedButton;

var SubscribedCourse = require('./SubscribedCourse.jsx');
var AddSubscription = require('./AddSubscription.jsx');
var Courses = require('../courses.js');

Subscriptions = React.createClass({
	mixins: [ Navigation, TimerMixin ],
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
			add_show: false,
		}
	},
	componentDidMount: function () {
		this.loadSubcriptions();
	},
	loadSubcriptions: function () {
		$.ajax({
			url: this.props.origin + '/subscriptions',
			type: 'GET',
			dataType: 'json',
			crossDomain: true,
			headers: {'Authorization': localStorage.getItem('jwt-easybooks')},
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
			headers: {'Authorization': localStorage.getItem('jwt-easybooks'),
			},
			success: function (response) {
				this.refs.subscriptionsUpdated.show();
				this.loadSubcriptions();
				this.setTimeout(function () {
					this.redirectToHome();
				}, 1000)
			}.bind(this),
			error: function (error) {
				window.location = "/"
			}.bind(this),
		});
	},
	redirectToHome: function () {
		this.transitionTo('/');
	},
	showSubscription: function () {
		this.setState({
			add_show: true,
		})
	},
	reload: function () {
		this.loadSubcriptions();
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
			if (this.state.add_show) {
				var subscription_component = <AddSubscription origin={this.props.origin} reload={this.reload}/>
			} else {
				var showAddSubscription = 
				<RaisedButton
				  label="Add Subscription"
				  onClick={this.showSubscription}
				  secondary={true}/>;
			}
		} else {
			var subscriptions = "Loading..."
		}
		return (
			<div>
				<Snackbar
				  ref="subscriptionsUpdated"
				  message='Subscriptions Updated. Redirecting...'
				  autoHideDuration={1000}/>
				<h4>Subscriptions</h4>
				{subscriptions}
				{subscription_component}
				{updateSubscriptionButton}
				{showAddSubscription}
			</div>
		)
	},
});

module.exports = Subscriptions;
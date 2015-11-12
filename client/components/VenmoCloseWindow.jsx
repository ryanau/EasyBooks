var React = require('react');
var $ = require('jquery');
var TimerMixin = require('react-timer-mixin');

VenmoCloseWindow = React.createClass({
	mixins: [ TimerMixin ],
	componentDidMount: function () {
		this.loadTimer()
	},
	loadTimer: function () {
		this.setTimeout(function () {
			window.close();
		}, 2000)
	},
	render: function () {
		return (
			<div>
				<h3>Venmo Authorization Successful! Window closing...</h3>
			</div>
		)
	}
});

module.exports = VenmoCloseWindow;
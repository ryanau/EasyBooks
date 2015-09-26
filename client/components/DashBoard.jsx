var React = require('react');
var $ = require('jquery');
var Router = require('react-router');
var Link = Router.Link;

var mui = require('material-ui');
var ThemeManager = new mui.Styles.ThemeManager();
var FlatButton = mui.FlatButton;
var RaisedButton = mui.RaisedButton;
var Dialog = mui.Dialog;
var TextField = mui.TextField;
var Snackbar = mui.Snackbar;

var MarketPlace = require('./MarketPlace.jsx');

DashBoard = React.createClass({
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
				<MarketPlace origin={this.props.origin}/>
			</div>
		)
	},
});

module.exports = DashBoard;
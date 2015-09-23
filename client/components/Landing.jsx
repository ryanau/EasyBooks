var React = require('react');
var Router = require('react-router');
var Link = Router.Link;

var SignUp = require('./SignUp.jsx');
var LogIn = require('./LogIn.jsx');

var mui = require('material-ui');
var ThemeManager = new mui.Styles.ThemeManager();

Landing = React.createClass({
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
	  		<SignUp origin={this.props.origin} />
	  		<LogIn origin={this.props.origin} />
  		</div>
  	)
  }
});

module.exports = Landing;
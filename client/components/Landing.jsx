var React = require('react');
var Router = require('react-router');
var Link = Router.Link;

var mui = require('material-ui');
var ThemeManager = new mui.Styles.ThemeManager();

var SignUp = require('./SignUp.jsx');
var LogIn = require('./LogIn.jsx');
var DashBoard = require('./DashBoard.jsx');

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
  	console.log("signed in" + this.props.signedIn);
  	if (this.props.signedIn) {
  		var display = (
	  		<div>
		  		<DashBoard origin={this.props.origin} currentUser={this.props.currentUser}/>
	  		</div>
  		);
  	} else {
  		var display = (
	  		<div>
		  		<SignUp origin={this.props.origin} />
		  		<LogIn origin={this.props.origin} />
	  		</div>
  		);
  	}
  	return (
  		<div>
	  		{display}
  		</div>
  	)
  }
});

module.exports = Landing;
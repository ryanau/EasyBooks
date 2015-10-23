var React = require('react');
var Router = require('react-router');
var Link = Router.Link;

var mui = require('material-ui');
var ThemeManager = new mui.Styles.ThemeManager();
var RaisedButton = mui.RaisedButton;


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
		  		<RaisedButton
		  			containerElement={<Link to="/signup" />}
		  			linkButton={true}
		  			label={('no', 'Sign Up')}/>
		  		<RaisedButton
		  			containerElement={<Link to="/login" />}
		  			linkButton={true}
		  			label={('no', 'Log In')}/>
	  			<RaisedButton
					  linkButton={true}
					  label="Log In via FB"
					  // comment the following line in development
					  // href={'https://easybook.herokuapp.com/auth/venmo'}/>

					  // comment the following line when deploying to heroku
					  href={'http://localhost:3000/auth/facebook'}/>
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
var React = require('react');
var Router = require('react-router');
var Link = Router.Link;

var mui = require('material-ui');
var ThemeManager = new mui.Styles.ThemeManager();

var Button = require('react-bootstrap').Button;
var Well = require('react-bootstrap').Well;

var DashBoard = require('./DashBoard.jsx');
var Register = require('./Register.jsx');

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
  	if (this.props.mode === "development") { var link = 'http://localhost:3000/auth/facebook' } 
  	if (this.props.mode === "production") { var link = 'https://easybooks.herokuapp.com/auth/facebook' }
  	if (this.props.signedIn && this.props.currentUser.completed) {
  		var display = (
	  		<div>
		  		<DashBoard origin={this.props.origin} currentUser={this.props.currentUser}/>
	  		</div>
  		);
  	} else if (this.props.currentUser.completed == false && this.props.signedIn) {
  		var display = (
  			<div>
  				<Register origin={this.props.origin} currentUser={this.props.currentUser}/>
  			</div>
  		)
  	} else {
  		var display = (
        <div className="container col-md-8 col-md-offset-2">
        <img id="landing" src="/berkeley.jpg"/>
				  <div id="parent">
  			    <form id="form_login">
  			    <h3>Buying and Selling Books is Never this Easy!</h3>
  					<Button href={link} bsStyle="primary">Log In via Facebook</Button>
  			    </form>
          </div>
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
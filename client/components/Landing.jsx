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
        <div>
        <div className="section hero">
          <div className="container">
            <div className="row">
              <div className="one-half column mL5p">
                <h4 className="hero-heading">Buying and Selling Books is Never this Easy!</h4>
                <Button href={link} bsStyle="primary">Log In via Facebook</Button>
              </div>
              <div className="one-half column phones">
                <img className="phone" src="/berkeley.jpg"/>
                <img className="phone" src="/berkeley.jpg"/>
              </div>
            </div>
          </div>
        </div>
          <div className="section values">
            <div className="container">
              <div className="row">
                <div className="one-third column value">
                  <h2 className="value-multiplier">Trust</h2>
                  <h5 className="value-heading">Buy from your Classmate</h5>
                  <p className="value-description">EasyBooks is your campus book marketplace.</p>
                </div>
              </div>
            </div>
          </div>
          <div className="section get-help">
            <div className="container">
              <div className="row">
                <div className="one-third column value">
                  <h2 className="value-multiplier">Convenience</h2>
                  <h5 className="value-heading">Text the seller/buyer directly</h5>
                  <p className="value-description">Through a private phone number, you can text the seller/buyer directly.</p>
                </div>
              </div>
            </div>
          </div>
          <div className="section categories">
            <div className="container">
              <h3 className="section-heading">Responsive Images</h3>
              <p className="section-description">Skeleton images sit easily in grid with .u-max-full-width className. I suggest exploring solution to serving different images based on device size.</p>
              <div className="row">
                <div className="one-half column category">
                  <img className="u-max-full-width" src="/berkeley.jpg"/>
                </div>
                <div className="one-half column category">
                  <img className="u-max-full-width" src="/berkeley.jpg"/>
                </div>
              </div>
            </div>
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
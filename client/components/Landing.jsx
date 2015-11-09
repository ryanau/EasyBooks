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
          <div className="landing-container">
            <div className="row">
              <div className="twelve column">
                <h4 className="hero-heading">Your trusted, streamlined campus marketplace for textbooks!</h4>
                <Button href={link} bsStyle="primary">Log In via Facebook</Button>
                <p>We only need your basic info and friends list (to see mutual friends connections) to get started!</p>
              </div>
            </div>
          </div>
        </div>
        <div className="section get-help">
          <div className="landing-container">
            <div className="row">
              <div className="twelve column value">
                <h5 className="value-heading">Trying to buy or sell your textbook? Don’t want to be ripped off??</h5>
                <p className="value-description">Students take note! Feel like you are wasting time and money finding used textbooks, try EasyBooks! You can buy directly from your fellow schoolmates, often at a lower price!</p>
                <p className="value-description">Unlike competitors, we provide a comfortable environment that enables you to sell/buy your textbooks quickly and reliably from other students.</p>
                <h3>Get started for free!</h3>
                <p className="value-description">Email us at caleazybooks@gmail.com</p>
              </div>
            </div>
          </div>
        </div>
        <div className="section values">
           <div className="landing-container">
           <h2>Buy a Textbook</h2>
             <div className="row">
               <div className="one-third column value">
                 <h4 className="value-multiplier">Step 1</h4>
                 <h5 className="value-heading">Get text alerts when what you look for becomes available</h5>
                 <p className="value-description">Never miss a post by simply uploading your schedule and subscribe to courses you need books for.</p>
               </div>
               <div className="one-third column value">
                 <h4 className="value-multiplier">Step 2</h4>
                 <h5 className="value-heading">Watch a post if that's what you're looking for</h5>
                 <p className="value-description">Most of the world accesses the internet on multiple devices.</p>
               </div>
               <div className="one-third column value">
                 <h4 className="value-multiplier">Step 3</h4>
                 <h5 className="value-heading">Meet with the seller and get your books</h5>
                 <p className="value-description">All users on EasyBooks are verified students at your school. Make a new friend when you meet up with them!</p>
               </div>
             </div>
           </div>
         </div>
        <div className="section get-help">
          <div className="landing-container">
            <div className="row">
              <div className="twelve column value">
                <h2 className="value-multiplier">Trust</h2>
                <h5 className="value-heading">Buy from and sell to other students</h5>
                <p className="value-description">Users are verified to be students at your school. Plus, you can see mutual friends between you and other users.</p>
              </div>
            </div>
          </div>
        </div>
        <div className="section img2">
          <div className="landing-container">
            <div className="row">
              <div className="twelve column value">
                <h2 className="value-multiplier">Be Prepared</h2>
                <h5 className="value-heading">Get your textbooks you need before the semester starts</h5>
                <p className="value-description">Save money by paying the "real" price</p>
              </div>
            </div>
          </div>
        </div>
        <div className="section get-help">
          <div className="landing-container">
            <div className="row">
              <div className="twelve column value">
                <h2 className="value-multiplier">Convenience</h2>
                <h5 className="value-heading">A marketplace designed just for textbooks exchange</h5>
                <p className="value-description">Easy-to-use with clear and text-based communications that save time.</p>
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
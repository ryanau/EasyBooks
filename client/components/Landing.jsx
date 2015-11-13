var React = require('react');
var Router = require('react-router');
var Link = Router.Link;

var mui = require('material-ui');
var ThemeManager = new mui.Styles.ThemeManager();
var DropDownMenu = mui.DropDownMenu;
var Tabs = mui.Tabs;
var Tab = mui.Tab;

var Button = require('react-bootstrap').Button;
var Well = require('react-bootstrap').Well;
var OverlayTrigger = require('react-bootstrap').OverlayTrigger;
var Tooltip = require('react-bootstrap').Tooltip;
var Popover = require('react-bootstrap').Popover;

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
  getInitialState: function () {
    return {
      displayBuy: true,
    }
  },
  handleTabChange: function(value, e, tab) {
    value == 0? this.setState({displayBuy: true}) : this.setState({displayBuy: false})
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
      var headerSlogan
      this.state.displayBuy? headerSlogan = <h2>3 Easy Steps to Buy a Textbook</h2> : headerSlogan = <h2>3 Easy Steps to Sell a Textbook</h2>
      var logInPopover = <Popover id="1"title="Why do we need Facebook?">We only need your basic info and friends list (to see mutual friends connections) to get started!</Popover>
      var displayBuy = (
        <div>
        <div className="step-box first-step-img">
          <div className="landing-container">
            <div className="row">
              <div className="twelve column value">
                <div className="one-half column">
                  <h4 className="hero-heading">Step 1</h4>
                  <h4 className="hero-heading">Search for the book you want by course name</h4>
                  <p className="value-description">All posts are listed by verified students from your school. You can even see which friends you have in common!</p>
                </div>
                <div className="one-half column">
                aldsjflaksjd
                </div>
              </div>
            </div>
          </div>
        </div>
        <div className="step-box second-step-img">
          <div className="landing-container">
            <div className="row">
            <div className="twelve column value">
              <h4 className="hero-heading">Step 2</h4>
              </div>
              <div className="six columns bY">
                <h4 className="hero-heading">Found the book you want? Watch the post!</h4>
                <p className="value-description">All posts are listed by verified students from your school. You can even see which friends you have in common!</p>
              </div>
              <div className="six columns bY">
                <h4 className="hero-heading">Couldn’t find the book you want? Don’t worry!</h4>
                <p className="value-description">Subscribe to the course and get notified whenever a new book is posted.</p>
              </div>
            </div>
          </div>
        </div>
        <div className="step-box third-step-img">
          <div className="landing-container">
            <div className="row">
              <div className="twelve column value">
                <div className="one-half column">
                lasjflskjalfkasdjlfkjs
                </div>
                <div className="one-half column">
                <h4 className="hero-heading">Step 3</h4>
                <h4 className="hero-heading">Keep an eye out for a text from the seller</h4>
                <p className="value-description">You can text the seller through a private number and arrange a time and place to meet up and get your book.</p>
                </div>
              </div>
            </div>
          </div>
        </div>
        </div>
      )
      var displaySell = (
        <div>
        <div className="step-box first-step-img">
          <div className="landing-container">
            <div className="row">
              <div className="twelve column value">
                <div className="one-half column">
                  <h4 className="hero-heading">Step 1</h4>
                  <h4 className="hero-heading">Make a post for the book you want to sell</h4>
                  <p className="value-description">It takes less than 30 seconds. Yes, we’re serious.</p>
                </div>
                <div className="one-half column">
                </div>
              </div>
            </div>
          </div>
        </div>
        <div className="step-box second-step-img">
          <div className="landing-container">
            <div className="row">
              <div className="twelve column value">
                <div className="one-half column">
                iljlkjlkjlkjl
                </div>
                <div className="one-half column">
                <h4 className="hero-heading">Step 2</h4>
                <h4 className="hero-heading">Sit back and relax while we match you with potential buyers</h4>
                <p className="value-description">Buyers who are interested in your textbook will watch your post. Once you have a match, you can text the buyer instantly through a private number.</p>
                </div>
              </div>
            </div>
          </div>
        </div>
        <div className="step-box third-step-img">
          <div className="landing-container">
            <div className="row">
              <div className="twelve column value">
                <div className="one-half column">
                  <h4 className="hero-heading">Step 3</h4>
                  <h4 className="hero-heading">Meet with the buyer to complete the transaction</h4>
                  <p className="value-description">All users on EasyBooks are verified students at your school. Make a new friend when you meet up with them!</p>
                </div>
                <div className="one-half column">
                </div>
              </div>
            </div>
          </div>
        </div>
        </div>
      )
      var display = (
        <div className="landing">
        <div className="section-hero hero">
          <div className="landing-container">
            <div className="row">
              <div className="twelve column">
                  <div className="pB20">
                    <p className="hero-heading">Your trusted campus textbook marketplace</p>
                  </div>
                  <OverlayTrigger id="1" placement="bottom" trigger="hover" overlay={logInPopover}>
                    <Button href={link} bsStyle="primary">Log In via Facebook</Button>
                  </OverlayTrigger>
              </div>
            </div>
          </div>
        </div>
        <div className="section-tab first-step-img">
          <div className="landing-container">
            <div className="row">
              <div className="twelve column value">
                <Tabs onChange={this.handleTabChange}>
                  <Tab label="To Buy" >  
                  </Tab>
                  <Tab label="To Sell" >
                  </Tab>
                </Tabs>
                {headerSlogan}
              </div>
            </div>
          </div>
        </div>
        {this.state.displayBuy? displayBuy : displaySell}
        </div>
      )
  	}
  	return (
  		<div>
        {display}
  		</div>
  	)
  }
});

module.exports = Landing;
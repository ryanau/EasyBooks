var React = require('react');
var $ = require('jquery');
var Router = require('react-router');
var Link = Router.Link;
var Navigation = Router.Navigation;
var TimerMixin = require('react-timer-mixin');

var Button = require('react-bootstrap').Button;
var Glyphicon = require('react-bootstrap').Glyphicon;
var OverlayTrigger = require('react-bootstrap').OverlayTrigger;
var Tooltip = require('react-bootstrap').Tooltip;
var Popover = require('react-bootstrap').Popover;
var Input = require('react-bootstrap').Input;
var Col = require('react-bootstrap').Col;
var Well = require('react-bootstrap').Well;
var Panel = require('react-bootstrap').Panel;
var ButtonToolbar = require('react-bootstrap').ButtonToolbar;
var Modal = require('react-bootstrap').Modal;

VenmoAuthorizationSell = React.createClass({
	mixins: [ TimerMixin ],
	getInitialState: function () {
		return {
			isLoading: false,
		}
	},
	popupCenter: function () {
	  var left = (screen.width/2)-(width/2);
	  var top = (screen.height/2)-(height/2);
	  var width = $(this).attr("data-width");
	  var height = $(this).attr("data-height");
	  this.setState({isLoading: true})
	  var logInWindow = window.open('http://localhost:3000/auth/venmo', 'authPopup', "menubar=no,toolbar=no,status=no,width="+width+",height="+height+",toolbar=no,left="+left+",top="+top);
	  var timer = this.setInterval(function () {
	  	if(logInWindow.closed) {  
  	    clearInterval(timer);
  	    this.props.loadUserVenmoStatus();
  	    this.setState({isLoading: false})
	  	}
	  }, 1000)
	},
	render: function () {
		return (
			<div>
				<Button onClick={this.popupCenter} disabled={this.state.isLoading} bsStyle="primary" bsSize="small"><Glyphicon glyph="ice-lolly"/>{this.state.isLoading ? 'Authorizing...' : 'Authorize Venmo Account'}
				</Button>
			</div>
		)
	}
});

module.exports = VenmoAuthorizationSell
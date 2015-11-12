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

VenmoAuthorizationWatch = React.createClass({
	mixins: [ Navigation, TimerMixin ],
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
  	    this.loadUserVenmoStatus()
	  	}
	  }, 1000)
	},
	loadUserVenmoStatus: function () {
		$.ajax({
		  url: this.props.origin + '/venmo_status',
		  type: 'GET',
		  dataType: 'json',
		  crossDomain: true,
		  headers: {'Authorization': localStorage.getItem('jwt-easybooks')},
		  success: function (response) {
		    if (response.status) {
		    	sessionStorage.setItem('venmo_link', true);
		    	this.setState({isLoading: false})
		    } else {
		    	this.setState({isLoading: false})
		    }
		  }.bind(this),
		  error: function (error) {
		    window.location = "/"
		  }.bind(this),
		});
	},
	starPost: function () {
		this.props.close()
		this.props.starPost()
	},
	render: function () {
		if (this.props.currentUser.venmo_linked || sessionStorage.getItem('venmo_link') == "true") {
			var modalContent = (
				<div>
				<Modal.Header>
					<Modal.Title>To watch</Modal.Title>
				</Modal.Header>
				<Modal.Body>
					<Button onClick={this.starPost} bsStyle="success" bsSize="small"><Glyphicon glyph="ice-lolly"/>Watch Now</Button>
				</Modal.Body>
				</div>
			)
		} else {
			var modalContent = (
				<div>
				<Modal.Header>
					<Modal.Title>Venmo Authorization</Modal.Title>
				</Modal.Header>
				<Modal.Body>
					<Button onClick={this.popupCenter} disabled={this.state.isLoading} bsStyle="primary" bsSize="small"><Glyphicon glyph="ice-lolly"/>{this.state.isLoading ? 'Authorizing...' : 'Authorize Venmo Account'}
					</Button>
				</Modal.Body>
				</div>
			)
		}
		return (
			<Modal show={this.props.show} onHide={this.props.close}>
				{modalContent}
				<Modal.Footer>
				   <Button onClick={this.props.close}>Close</Button>
				 </Modal.Footer>
			</Modal>
		)
	}
});

module.exports = VenmoAuthorizationWatch
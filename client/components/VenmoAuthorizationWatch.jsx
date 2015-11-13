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
					<Modal.Title>Watch and Monitor this Post</Modal.Title>
				</Modal.Header>
				<Modal.Body>
					<Button onClick={this.starPost} bsStyle="success" bsSize="small"><Glyphicon glyph="eye-open"/> Watch Now</Button>
					<hr />
					<p>If you're the first person watching this post, expect a text from the seller any second!</p>
					<p>If not, don't be discouraged! Just relax and grab a coffee, and we will keep you updated:)</p>
				</Modal.Body>
				</div>
			)
		} else {
			var modalContent = (
				<div>
				<Modal.Header>
					<Modal.Title>Authorize Your Venmo Account</Modal.Title>
				</Modal.Header>
				<Modal.Body>
					<p>In order to watch and monitor this post, you will first need to authorize your venmo account.</p>
					<Button onClick={this.popupCenter} disabled={this.state.isLoading} bsStyle="primary" bsSize="small"><Glyphicon glyph="ice-lolly"/>{this.state.isLoading ? 'Authorizing...' : 'Authorize Venmo Account'}
					</Button>
					<hr />
					<h4>Why do we need Venmo Authorization?</h4>
					<p>It is necessary for a streamlined marketplace experience offered by EasyBooks!</p>
					<p>You will receive a Payment Code via text once you get connected with the seller. After you meet up and receive your book from the seller, go ahead and reveal the Payment Code to the seller.</p>
					<p>Once the seller texts the Payment Code, the Venmo transfer will be completed automatically! It is THAT easy!</p>
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
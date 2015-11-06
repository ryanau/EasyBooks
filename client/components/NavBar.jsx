var React = require('react');
var Router = require('react-router');
var Link = Router.Link;
var Navigation = Router.Navigation;
var $ = require('jquery');

var Navbar = require('react-bootstrap').Navbar;
var NavItem = require('react-bootstrap').NavItem;
var NavBrand = require('react-bootstrap').NavBrand;
var NavDropdown = require('react-bootstrap').NavDropdown;
var Nav = require('react-bootstrap').Nav;
var MenuItem = require('react-bootstrap').MenuItem;
var ListGroup = require('react-bootstrap').ListGroup;
var DropdownButton = require('react-bootstrap').DropdownButton;
var Glyphicon = require('react-bootstrap').Glyphicon;
var Badge = require('react-bootstrap').Badge;
var Button = require('react-bootstrap').Button;

var ReactRouterBootstrap = require('react-router-bootstrap')
  , NavItemLink = ReactRouterBootstrap.NavItemLink
  , ButtonLink = ReactRouterBootstrap.ButtonLink
  , ListGroupItemLink = ReactRouterBootstrap.ListGroupItemLink
  , MenuItemLink = ReactRouterBootstrap.MenuItemLink

module.exports = React.createClass({
  mixins: [ Navigation ],
  getInitialState: function () {
    return {
    starred_post_count: null,
    }
  },
  componentDidMount: function () {
    this.loadNavRedirect();
    if (this.props.signedIn) {
      this.loadStarredPostCount();
    }
    // don't know why it's not working, works in Dev Tool
    // $('#collapsible-navbar-dropdown').hover(function () {$('#collapsible-navbar-dropdown')[0].click()})

  },
  componentDidUpdate: function () {
    this.loadNavRedirect();
  },
  loadStarredPostCount: function () {
    $.ajax({
      url: this.props.origin + '/starred_posts_count',
      type: 'GET',
      dataType: 'json',
      crossDomain: true,
      headers: {'Authorization': localStorage.getItem('jwt-easybooks')},
      success: function (response) {
        this.setState({
          starred_post_count: response.starred_posts_count,
        });
      }.bind(this),
      error: function (error) {
        window.location = "/"
      }.bind(this),
    });
  },
  loadNavRedirect: function () {
    $(document).ready(function() {
      $('#buyBar').on('click', function() {
        this.transitionTo('/');
      }.bind(this));
      $('#sellBar').on('click', function() {
        this.transitionTo('/sell');
      }.bind(this));
      $('#watchBar').on('click', function() {
        this.transitionTo('/starred');
      }.bind(this));
    }.bind(this));
  },
  buyNav: function () {
    this.transitionTo('/');
    this.closeNav();
  },
  sellNav: function () {
    this.transitionTo('/sell');
    this.closeNav();
  },
  followsNav: function () {
    this.transitionTo('/starred');
    this.closeNav();
  },
  logoutNav: function () {
    this.transitionTo('/logout');
    this.closeNav();
  },
  postdashboardNav: function () {
    this.transitionTo('/postdashboard');
    this.closeNav();
  },
  subscriptionNav: function () {
    this.transitionTo('/subscriptions');
    this.closeNav();
  },
  scheduleNav: function () {
    this.transitionTo('/schedule');
    this.closeNav();
  },
  profileNav: function () {
    this.transitionTo('/profile');
    this.closeNav();
  },
  closeNav: function () {
    if ($(window).width() < 768) {
      $('.navbar-toggle')[0].click();
    }
  },
  render: function() {
    var brand = <Link to='/' className='navbar-brand'>EasyBooks</Link>;  
    if (this.props.signedIn && this.props.currentUser.completed && $(window).width() < 768) {
      if (this.state.starred_post_count != null) {
        var starPostCount = this.state.starred_post_count
      }
      var control = (
        <div>
        <Navbar inverse toggleNavKey={0} fixedTop={true} className="transparent">
          <NavBrand>{brand}</NavBrand>
          <Nav right eventKey={0}>
            <MenuItem onSelect={this.buyNav}>Buy</MenuItem>
            <MenuItem onSelect={this.sellNav}>Sell</MenuItem>
            <MenuItem onSelect={this.followsNav}><Glyphicon glyph="eye-open"/> Watching <Badge>{starPostCount}</Badge></MenuItem>
            <NavDropdown eventKey={3} title="Dashboard" id="collapsible-navbar-dropdown">
              <MenuItem onSelect={this.postdashboardNav}>Your Posts</MenuItem>
              <MenuItem onSelect={this.subscriptionNav}>Subscriptions</MenuItem>
              <MenuItem onSelect={this.scheduleNav}>Schedule Uploader</MenuItem>
              <MenuItem divider />
              <MenuItem onSelect={this.profileNav}>Profile Settings</MenuItem>
            </NavDropdown>
            <MenuItem onSelect={this.logoutNav}>Log Out</MenuItem>
          </Nav>
        </Navbar>
        <nav className="paradeiser mT50">
          <a id="buyBar">
              <icon className="paradeiser_icon_canvas">
                <img src="/buy.svg" alt="Buy a Book"/>
              </icon>
              <span>Buy</span>
          </a>
          <a id="sellBar">
              <icon className="paradeiser_icon_canvas">
                <img src="/sell.svg" alt="Sell your Book"/>
              </icon>
              <span>Sell</span>
          </a>
          <a id="watchBar">
              <icon className="paradeiser_icon_canvas">
              <img src="http://danielwinter.at/apple-touch-icon_76x76.png" alt="Posts Watching" className="paradeiser_logo"/>
              </icon>
              <span>Watching</span>
          </a>
        </nav>
        </div>
      )
    } else if (this.props.signedIn && this.props.currentUser.completed) {
      if (this.state.starred_post_count != null) {
        var starPostCount = this.state.starred_post_count
      }
      var control = (
        <Navbar inverse toggleNavKey={0} fixedTop={true} className="transparent">
          <NavBrand>{brand}</NavBrand>
          <Nav right eventKey={0}>
            <MenuItem onSelect={this.buyNav}>Buy</MenuItem>
            <MenuItem onSelect={this.sellNav}>Sell</MenuItem>
            <MenuItem onSelect={this.followsNav}><Glyphicon glyph="eye-open"/> Watching <Badge>{starPostCount}</Badge></MenuItem>
            <NavDropdown eventKey={3} title="Dashboard" id="collapsible-navbar-dropdown">
              <MenuItem onSelect={this.postdashboardNav}>Your Posts</MenuItem>
              <MenuItem onSelect={this.subscriptionNav}>Subscriptions</MenuItem>
              <MenuItem onSelect={this.scheduleNav}>Schedule Uploader</MenuItem>
              <MenuItem divider />
              <MenuItem onSelect={this.profileNav}>Profile Settings</MenuItem>
            </NavDropdown>
            <MenuItem onSelect={this.logoutNav}>Log Out</MenuItem>
          </Nav>
        </Navbar>
      )
    } else {
      var control = 
      <Navbar inverse toggleNavKey={0} fixedTop={true} className="transparent">
        <NavBrand>{brand}</NavBrand>
      </Navbar>
    }
    return (
      <div>
        {control}
      </div>
    );
  }
});

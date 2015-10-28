var React = require('react');
var Router = require('react-router');
var Link = Router.Link;
var Navigation = Router.Navigation;

var mui = require('material-ui');
var ThemeManager = new mui.Styles.ThemeManager();
var AppBar = mui.AppBar;
var FlatButton = mui.FlatButton;
var FontIcon = mui.FontIcon;

var Navbar = require('react-bootstrap').Navbar;
var NavItem = require('react-bootstrap').NavItem;
var NavBrand = require('react-bootstrap').NavBrand;
var NavDropdown = require('react-bootstrap').NavDropdown;
var Nav = require('react-bootstrap').Nav;
var MenuItem = require('react-bootstrap').MenuItem;
var ListGroup = require('react-bootstrap').ListGroup;
var DropdownButton = require('react-bootstrap').DropdownButton;
var Glyphicon = require('react-bootstrap').Glyphicon;

var ReactRouterBootstrap = require('react-router-bootstrap')
  , NavItemLink = ReactRouterBootstrap.NavItemLink
  , ButtonLink = ReactRouterBootstrap.ButtonLink
  , ListGroupItemLink = ReactRouterBootstrap.ListGroupItemLink
  , MenuItemLink = ReactRouterBootstrap.MenuItemLink

module.exports = React.createClass({
  mixins: [ Navigation ],
  childContextTypes: {
    muiTheme: React.PropTypes.object
  },
  getChildContext: function () {
    return {
      muiTheme: ThemeManager.getCurrentTheme()
    };
  },
  buyNav: function () {
    this.transitionTo('/');
    $('.navbar-toggle')[0].click();
  },
  sellNav: function () {
    this.transitionTo('/sell');
    $('.navbar-toggle')[0].click();
  },
  followsNav: function () {
    this.transitionTo('/starred');
    $('.navbar-toggle')[0].click();
  },
  logoutNav: function () {
    this.transitionTo('/logout');
    $('.navbar-toggle')[0].click();
  },
  closeNav: function () {
    $('.navbar-toggle')[0].click();
  },
  render: function() {
    var brand = <Link to='/' className='navbar-brand'>EasyBooks</Link>;  
    var yourPosts = <Link to='/postdashboard'>Your Posts</Link>; 
    var subscriptions = <Link to='/subscriptions'>Subscriptions</Link>; 
    var schedule = <Link to='/schedule'>Schedule Uploader</Link>; 
    if (this.props.signedIn && this.props.currentUser.completed) {
      var control = 
        <Navbar inverse toggleNavKey={0} fixedTop={true} className="transparent">
          <NavBrand>{brand}</NavBrand>
          <Nav right eventKey={0}>
            <MenuItem onSelect={this.buyNav}>Buy</MenuItem>
            <MenuItem onSelect={this.sellNav}>Sell</MenuItem>
            <MenuItem onSelect={this.followsNav}>Follows</MenuItem>
            <NavDropdown eventKey={3} title="Profile" id="collapsible-navbar-dropdown">
              <MenuItem onSelect={this.closeNav}>{yourPosts}</MenuItem>
              <MenuItem onSelect={this.closeNav}>{subscriptions}</MenuItem>
              <MenuItem onSelect={this.closeNav}>{schedule}</MenuItem>
            </NavDropdown>
            <MenuItem onSelect={this.logoutNav}>Log Out</MenuItem>
          </Nav>
        </Navbar>
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

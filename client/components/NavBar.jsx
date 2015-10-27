var React = require('react');
var Router = require('react-router');
var Link = Router.Link;

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
  childContextTypes: {
    muiTheme: React.PropTypes.object
  },
  getChildContext: function () {
    return {
      muiTheme: ThemeManager.getCurrentTheme()
    };
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
            <NavItemLink to="/">Buy</NavItemLink>
            <NavItemLink to="/sell">Sell</NavItemLink>
            <NavDropdown eventKey={3} title="Profile" id="collapsible-navbar-dropdown">
              <MenuItem>{yourPosts}</MenuItem>
              <MenuItem>{subscriptions}</MenuItem>
              <MenuItem>{schedule}</MenuItem>
            </NavDropdown>
            <NavItemLink to="/logout"><Glyphicon glyph="log-out"/></NavItemLink>
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

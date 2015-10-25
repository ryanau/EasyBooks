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

var ReactRouterBootstrap = require('react-router-bootstrap')
  , NavItemLink = ReactRouterBootstrap.NavItemLink
  , ButtonLink = ReactRouterBootstrap.ButtonLink
  , ListGroupItemLink = ReactRouterBootstrap.ListGroupItemLink;

var LinkContainer = require('react-router-bootstrap').LinkContainer;

module.exports = React.createClass({
  handleSignOutLink: function() {
    localStorage.setItem('jwt-easybooks','');
    location = '/';
  },
  childContextTypes: {
    muiTheme: React.PropTypes.object
  },
  getChildContext: function () {
    return {
      muiTheme: ThemeManager.getCurrentTheme()
    };
  },

  render: function() {
    if (this.props.signedIn) {
      var homeLink = <Link to="app">EasyBooks</Link>
      var signingLink = 
        <div>
        <FlatButton
          containerElement={<Link to="sell" />}
          linkButton={true}
          hoverColor={'#FF9800'}
          rippleColor={'#FF9800'}
          style={{backgroundColor: '#FF9800',
                  color: '#002e32',
                  lineHeight: '18px'}}
          label={('no', 'Sell')}/>
        <FlatButton
          onClick={this.handleSignOutLink}
          hoverColor={'#FF9800'}
          rippleColor={'#FF9800'}
          style={{backgroundColor: '#FF9800',
                  color: '#002e32',
                  lineHeight: '18px'}}
          label={('no', 'SignOut')}/>
        </div>
    } else {
      var homeLink = <Link to="/">EasyBooks</Link>
    }
    return (
      <div>
        <Navbar inverse toggleNavKey={0}>
            <NavBrand>React-Bootstrap</NavBrand>
            <Nav right eventKey={0}>
              <NavItemLink to="/sell">Sell</NavItemLink>
              <NavItem eventKey={2} href="#">Link</NavItem>
              <NavDropdown eventKey={3} title="Dropdown" id="collapsible-navbar-dropdown">
                <MenuItem eventKey="1">Action</MenuItem>
                <MenuItem eventKey="2">Another action</MenuItem>
                <MenuItem eventKey="3">Something else here</MenuItem>
                <MenuItem divider />
                <MenuItem eventKey="4">Separated link</MenuItem>
              </NavDropdown>
            </Nav>
          </Navbar>
      </div>
    );
  }
});

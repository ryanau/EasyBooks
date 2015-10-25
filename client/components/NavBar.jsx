var React = require('react');
var Router = require('react-router');
var Link = Router.Link;

var mui = require('material-ui');
var ThemeManager = new mui.Styles.ThemeManager();
var AppBar = mui.AppBar;
var FlatButton = mui.FlatButton;
var FontIcon = mui.FontIcon;

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
      <div className="fixed">
        <AppBar 
          iconElementLeft={<FlatButton
                            containerElement={<Link to="app" />}
                            linkButton={true}
                            hoverColor={'#FF9800'}
                            rippleColor={'#FF9800'}
                            style={{backgroundColor: '#FF9800',
                                    color: '#002e32',
                                    fontSize:'18px',
                                    fontFamily: 'Lato', 
                                    fontWeight: "700"}}
                            label={('no', 'EasyBooks')}/>}
          style={{marginBottom: '0px',
                  backgroundColor: '#FF9800',
                  minHeight: '0px'}}
          iconElementRight={signingLink}/>
      </div>
    );
  }
});

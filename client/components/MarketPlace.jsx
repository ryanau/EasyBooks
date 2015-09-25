var React = require('react');
var $ = require('jquery');
var Router = require('react-router');
var Link = Router.Link;

var mui = require('material-ui');
var ThemeManager = new mui.Styles.ThemeManager();

var PublicPosts = require('./PublicPosts.jsx');

MarketPlace = React.createClass({
	childContextTypes: {
	  muiTheme: React.PropTypes.object
	},
	getChildContext: function () {
	  return {
	    muiTheme: ThemeManager.getCurrentTheme()
	  };
	},
  render: function () {
  	return (
  		<div>
  			<h3>MarketPlace</h3>
  			<PublicPosts origin={this.props.origin} />
  		</div>
  	)
  }
});

module.exports = MarketPlace;
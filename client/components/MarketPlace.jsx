var React = require('react');
var $ = require('jquery');
var Router = require('react-router');
var Link = Router.Link;

var mui = require('material-ui');
var ThemeManager = new mui.Styles.ThemeManager();
var Toolbar = mui.Toolbar;
var ToolbarGroup = mui.ToolbarGroup;
var ToolbarSeparator = mui.ToolbarSeparator;
var DropDownMenu = mui.DropDownMenu;
var FlatButton = mui.FlatButton;

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
  	var sortMethods = [
  		{ payload: "1", text: "Date: Newest to Oldest"},
  		{ payload: "2", text: "Date: Oldest to Newest"},
  		{ payload: "3", text: "Price: Low to High"},
  		{ payload: "4", text: "Price: High to Low"},
  	];
  	return (
  		<div id="marketplace">
  			<Toolbar> 
  				<ToolbarGroup key={0} float="left">
  					<DropDownMenu menuItems={sortMethods} />
  				</ToolbarGroup>
  				<ToolbarGroup key={1} float="right">
	  				<ToolbarSeparator/>
		  			<FlatButton
				 		containerElement={<Link to="/sell" />}
				 		linkButton={true}
				 		label={('no', 'Sell')}/>
  				</ToolbarGroup>
			 	</Toolbar>
  			<PublicPosts origin={this.props.origin} />
  		</div>
  	)
  }
});

module.exports = MarketPlace;
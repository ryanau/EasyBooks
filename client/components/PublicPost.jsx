var React = require('react');
var $ = require('jquery');
var Router = require('react-router');
var Link = Router.Link;
var moment = require('moment');

var mui = require('material-ui');
var ThemeManager = new mui.Styles.ThemeManager();
var Card = mui.Card;
var CardHeader = mui.CardHeader;
var CardText = mui.CardText;
var CardActions = mui.CardActions;
var CardTitle = mui.CardTitle;
var CardMedia = mui.CardMedia;
var Snackbar = mui.Snackbar;
var FlatButton = mui.FlatButton;


PublicPost = React.createClass({
	childContextTypes: {
	  muiTheme: React.PropTypes.object
	},
	getChildContext: function () {
	  return {
	    muiTheme: ThemeManager.getCurrentTheme()
	  };
	},
  render: function () {
  	var post = this.props.post
  	return (
  		<div>
  			<Card key={post.id} initiallyExpanded={false}>
  				<CardMedia overlay={
  					<CardTitle title={post.title} subtitle={"$" + post.price + " | Created " + moment(post.created_at).fromNow()} />}>
  					<img src={post.picture_url} />
  				</CardMedia>
  			</Card>
  		</div>
  	)
  }
});

module.exports = PublicPost;
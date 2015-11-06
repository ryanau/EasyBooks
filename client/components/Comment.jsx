var React = require('react');
var $ = require('jquery');
var Router = require('react-router');
var Uri = require('jsuri');
var Link = Router.Link;
var moment = require('moment');

var mui = require('material-ui');
var ThemeManager = new mui.Styles.ThemeManager();
var Avatar = mui.Avatar;

var Image = require('react-bootstrap').Image;

Comment = React.createClass({
	childContextTypes: {
	  muiTheme: React.PropTypes.object
	},
	getChildContext: function () {
	  return {
	    muiTheme: ThemeManager.getCurrentTheme()
	  };
	},
	render: function () {
		var comment = this.props.comment;
		var user;
		comment.user.id == this.props.seller_id? user = 'Seller' : user = comment.user.first_name + ' ' + comment.user.last_name
		return (
			<div>
				<p><Avatar src={comment.user.pic} style={{marginRight: "3px"}}/><strong>{user}</strong> ({moment(comment.created_at).fromNow()}): {comment.content}</p>
			</div>
		);
	},
});

module.exports = Comment;
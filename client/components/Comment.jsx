var React = require('react');
var $ = require('jquery');
var Router = require('react-router');
var Uri = require('jsuri');
var Link = Router.Link;
var moment = require('moment');

var mui = require('material-ui');
var ThemeManager = new mui.Styles.ThemeManager();
var RaisedButton = mui.RaisedButton;

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
		return (
			<div>
				<p>{comment.content} by {comment.user.first_name} from {moment(comment.created_at).fromNow()}</p>
			</div>
		)
	},
});

module.exports = Comment;
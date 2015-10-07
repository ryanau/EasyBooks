var React = require('react');
var $ = require('jquery');
var Router = require('react-router');
var Link = Router.Link;

var mui = require('material-ui');
var ThemeManager = new mui.Styles.ThemeManager();
var TextField = mui.TextField;
var Snackbar = mui.Snackbar;
var RaisedButton = mui.RaisedButton;

CommentBox = React.createClass({
	childContextTypes: {
	  muiTheme: React.PropTypes.object
	},
	getChildContext: function () {
	  return {
	    muiTheme: ThemeManager.getCurrentTheme()
	  };
	},
	getInitialState: function () {
		return {
			comment: null,
		}
	},
	handleComment: function (e) {
		this.setState({
			comment: e.target.value,
		})
	},
	clearComment: function () {
		this.refs.commentText.clearValue();
	},
	addComment: function () {
		var data = {
			comment: this.state.comment,
			post_id: this.props.post_id,
		};
		if (data.comment) {
			$.ajax({
				url: this.props.origin + '/comments',
				type: 'POST',
				data: data,
				dataType: 'json',
				crossDomain: true,
				headers: {'Authorization': localStorage.getItem('jwt-easybooks')},
				success: function (response) {
					this.refs.commentAdded.show();
					this.clearComment();
					this.props.updateComments();
					this.setState({
						comment: null,
					});
				}.bind(this),
				error: function (error) {
					window.location = "/"
				}.bind(this),
			});
		}
	},
	render: function () {
		return (
			<div>
				<h4>Comment Box</h4>
				<Snackbar
				  ref="commentAdded"
				  message='Comment Added'
				  autoHideDuration={2000}/>
				<TextField
					ref="commentText"
					onChange={this.handleComment}
				  floatingLabelText="Comment" 
				  hintText="Required"/>
			  <RaisedButton
			    label="Comment"
			    onClick={this.addComment}
			    secondary={true}/>
			</div>
		)
	},
});

module.exports = CommentBox;
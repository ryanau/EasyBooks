var React = require('react');
var $ = require('jquery');
var Router = require('react-router');
var Link = Router.Link;

var mui = require('material-ui');
var ThemeManager = new mui.Styles.ThemeManager();
var Snackbar = mui.Snackbar;

var Button = require('react-bootstrap').Button;
var Input = require('react-bootstrap').Input;
var Col = require('react-bootstrap').Col;

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
			comment: '',
		}
	},
	handleComment: function () {
		this.setState({
			comment: this.refs.comment.getValue(),
		})
	},
	clearComment: function () {
		this.refs.comment.clearValue();
	},
	validateComment: function () {
		var length = this.state.comment.length;
		if (length > 0) {
			return 'success';
		} else {
			return 'error';
		}
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
					this.props.updateComments();
					this.refs.commentAdded.show();
					this.setState({
						comment: '',
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
				<Snackbar
				  ref="commentAdded"
				  message='Comment Added'
				  autoHideDuration={2000}/>
				<Col xs={9} md={9}>
	  			<Input
		        type="text"
		        placeoholder="Add Comment"
		        value={this.state.comment}
		        bsStyle={this.validateComment()}
		        hasFeedback
		        ref="comment"
		        groupClassName="group-class"
		        labelClassName="label-class"
		        onChange={this.handleComment} />
	      </Col>
	      <Col xs={3} md={3}>
			  <Button onClick={this.addComment} bsStyle="primary">Comment</Button>
			  </Col>
			</div>
		)
	},
});

module.exports = CommentBox;
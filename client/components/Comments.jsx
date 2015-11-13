var React = require('react');
var $ = require('jquery');
var Router = require('react-router');
var Uri = require('jsuri');
var Link = Router.Link;

var mui = require('material-ui');
var ThemeManager = new mui.Styles.ThemeManager();

var Comment = require('./Comment.jsx');
var CommentBox = require('./CommentBox.jsx');

var ListGroup = require('react-bootstrap').ListGroup;
var ListGroupItem = require('react-bootstrap').ListGroupItem;

Comments = React.createClass({
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
			comments: null,
		}
	},
	componentDidMount: function () {
		this.loadComments();
	},
	loadComments: function () {
		var data = {post_id: this.props.post_id,};
		$.ajax({
			url: this.props.origin + '/comments',
			type: 'GET',
			data: data,
			dataType: 'json',
			crossDomain: true,
			headers: {'Authorization': localStorage.getItem('jwt-easybooks')},
			success: function (response) {
				this.setState({
					comments: response
				});
			}.bind(this),
			error: function (error) {
				window.location = "/"
			}.bind(this),
		});
	},
	updateComments: function () {
		var data = {post_id: this.props.post_id,};
		$.ajax({
			url: this.props.origin + '/comments',
			type: 'GET',
			data: data,
			dataType: 'json',
			crossDomain: true,
			headers: {'Authorization': localStorage.getItem('jwt-easybooks')},
			success: function (response) {
				this.setState({
					comments: response,
				});
			}.bind(this),
			error: function (error) {
				window.location = "/"
			}.bind(this),
		});
	},
	render: function () {
		if (this.state.comments != null) {
			if (this.state.comments.length != 0) {
				var comments = this.state.comments.map(function (comment, index) {
					return (
							<ListGroupItem key={index}>
								<Comment key={index} comment={comment} post_id={this.props.post_id} seller_id={this.props.seller_id}/>
							</ListGroupItem>
					)
				}.bind(this));
			}
		var commentBox = <CommentBox origin={this.props.origin} post_id={this.props.post_id} updateComments={this.updateComments}/>;
		} else {
			var comments = "Loading"
		}
		return (
			<div>
				<h4>Comments</h4>
				<ListGroup>
					{comments}
				</ListGroup>
				{commentBox}
			</div>
		)
	},
});

module.exports = Comments;
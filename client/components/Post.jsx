var React = require('react');
var $ = require('jquery');
var Router = require('react-router');
var Navigation = Router.Navigation;
var TimerMixin = require('react-timer-mixin');

var Uri = require('jsuri');
var Link = Router.Link;

var mui = require('material-ui');
var ThemeManager = new mui.Styles.ThemeManager();
var RaisedButton = mui.RaisedButton;
var FontIcon = mui.FontIcon;
var IconButton = mui.IconButton;
var Snackbar = mui.Snackbar;

var Comments = require('./Comments.jsx');

Post = React.createClass({
	mixins: [ Navigation, TimerMixin ],
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
			post: null,
			seller_id: null,
			seller_name: null,
		}
	},
	componentDidMount: function () {
		this.loadPost();
	},
	loadPost: function () {
		var path = location.pathname;
		var post_id = path.substring(7, path.length);
		var data = {
			post_id: post_id,
		};
		$.ajax({
			url: this.props.origin + '/posts/' + post_id,
			type: 'GET',
			data: data,
			dataType: 'json',
			crossDomain: true,
			headers: {'Authorization': localStorage.getItem('jwt')},
			success: function (response) {
				this.setState({
					post: response.post,
					seller_id: response.seller_id,
					seller_name: response.seller_name
				});
			}.bind(this),
			error: function (error) {
				window.location = "/"
			}.bind(this),
		});
	},
	deletePost: function () {
		var path = location.pathname;
		var post_id = path.substring(7, path.length);
		var data = {
			post_id: post_id,
		};
		$.ajax({
			url: this.props.origin + '/posts/' + post_id,
			type: 'DELETE',
			data: data,
			dataType: 'json',
			crossDomain: true,
			headers: {'Authorization': localStorage.getItem('jwt')},
			success: function (response) {
				this.refs.postDeleted.show();
				this.setTimeout(function () {
					this.redirectToHome();
				}, 1000)
			}.bind(this),
			error: function (error) {
				window.location = "/"
			}.bind(this),
		});
	},
	redirectToHome: function () {
		this.transitionTo('/');
	},
	render: function () {
		if (this.state.post != null) {
			var post = this.state.post;
			var seller_id = this.state.seller_id;
			var seller_name = this.state.seller_name;
			if (this.state.post.seller_id == this.props.currentUser.id) {
				var editButton = 
				<RaisedButton
				  label="Edit Post"
				  onClick={this.editPost}
				  secondary={true}/>;
				var deleteButton = 
				<RaisedButton
				  label="Delete Post"
				  onClick={this.deletePost}
				  primary={true}/>;
			} else {
				var starButton = 
				<IconButton><FontIcon className="material-icons">star</FontIcon></IconButton>
			}
			var comments = <Comments origin={this.props.origin} post_id={post.id}/>;
		} else {
			var post = "Loading..."
			var seller_id = ""
			var seller_name = ""
		}
		return (
			<div>
				<Snackbar
				  ref="postDeleted"
				  message='Post Deleted. Redirecting...'
				  autoHideDuration={1000}/>
				<h4>Post</h4>
				<p>{post.title}</p>
				<p>{post.price}</p>
				<p>{seller_name}</p>
				{comments}
				{editButton}
				{deleteButton}
				{starButton}
			</div>
		)
	},
});

module.exports = Post;
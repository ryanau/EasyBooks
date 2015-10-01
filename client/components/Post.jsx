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
var Colors = mui.Colors;

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
			star: null,
			sold: null,
		}
	},
	componentDidMount: function () {
		this.loadPost();
		this.loadStar();
	},
	markSold: function () {
		var path = location.pathname;
		var post_id = path.substring(7, path.length);
		var data = {
			post_id: post_id,
		};
		$.ajax({
			url: this.props.origin + '/posts/mark_sold',
			type: 'PUT',
			data: data,
			dataType: 'json',
			crossDomain: true,
			headers: {'Authorization': localStorage.getItem('jwt')},
			success: function (response) {
				if (response.sold) {
					this.refs.markSold.show();
					this.setState({
						sold: true,
					});
				} else {
					this.refs.markAvailable.show();
					this.setState({
						sold: false,
					});
				}
			}.bind(this),
			error: function (error) {
				window.location = "/"
			}.bind(this),
		});
	},
	loadStar: function () {
		var path = location.pathname;
		var post_id = path.substring(7, path.length);
		var data = {
			post_id: post_id,
		};
		$.ajax({
			url: this.props.origin + '/stars',
			type: 'GET',
			data: data,
			dataType: 'json',
			crossDomain: true,
			headers: {'Authorization': localStorage.getItem('jwt')},
			success: function (response) {
				if (response.starred) {
					this.setState({
						star: true,
					});
				} else {
					this.setState({
						star: false,
					});
				}
			}.bind(this),
			error: function (error) {
				window.location = "/"
			}.bind(this),
		});
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
					seller_name: response.seller_name,
					sold: response.post.sold,
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
	starPost: function () {
		var path = location.pathname;
		var post_id = path.substring(7, path.length);
		if (this.state.star) {
			var data = {
				post_id: post_id,
			};
			$.ajax({
				url: this.props.origin + '/stars',
				type: 'DELETE',
				data: data,
				dataType: 'json',
				crossDomain: true,
				headers: {'Authorization': localStorage.getItem('jwt')},
				success: function (response) {
					this.refs.postUnstarred.show();
				}.bind(this),
				error: function (error) {
					window.location = "/"
				}.bind(this),
			});
			this.setState({
				star: false
			});
		} else {
			var data = {
				post_id: post_id,
			};
			$.ajax({
				url: this.props.origin + '/stars',
				type: 'POST',
				data: data,
				dataType: 'json',
				crossDomain: true,
				headers: {'Authorization': localStorage.getItem('jwt')},
				success: function (response) {
					this.refs.postStarred.show();
				}.bind(this),
				error: function (error) {
					window.location = "/"
				}.bind(this),
			});
			this.setState({
				star: true
			});
		}
	},
	render: function () {
		console.log(this.state.post)
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
				if (this.state.sold) {
					var soldButton = 
					<RaisedButton
					  label="Mark as Available"
					  onClick={this.markSold}
					  primary={true}/>;
				} else {
					var soldButton = 
					<RaisedButton
					  label="Mark as Sold"
					  onClick={this.markSold}
					  primary={true}/>;
				}
			} else {
				if (this.state.star) {
					var starButton = 
					<IconButton onClick={this.starPost} tooltip="Unfollow this post" iconStyle={{color: "#FFFF00"}}><FontIcon className="material-icons">star</FontIcon></IconButton>
				} else {
					var starButton = 
					<IconButton onClick={this.starPost} tooltip="Follow this post"><FontIcon className="material-icons">star</FontIcon></IconButton>
				}
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
				<Snackbar
				  ref="postStarred"
				  message='Post Followed'
				  autoHideDuration={1000}/>
				<Snackbar
				  ref="postUnstarred"
				  message='Post Unfollowed'
				  autoHideDuration={1000}/>
				<Snackbar
				  ref="markSold"
				  message='Post Marked as Sold'
				  autoHideDuration={1000}/>
				<Snackbar
				  ref="markAvailable"
				  message='Post Marked as Available'
				  autoHideDuration={1000}/>
				<h4>Post</h4>
				{starButton}
				<p>{post.title}</p>
				<p>{post.price}</p>
				<p>{seller_name}</p>
				{comments}
				{editButton}
				{deleteButton}
				{soldButton}
			</div>
		)
	},
});

module.exports = Post;
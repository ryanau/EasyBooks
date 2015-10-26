var React = require('react');
var $ = require('jquery');
var Router = require('react-router');
var Navigation = Router.Navigation;
var moment = require('moment');

var mui = require('material-ui');
var ThemeManager = new mui.Styles.ThemeManager();
var FontIcon = mui.FontIcon;
var IconButton = mui.IconButton;
var Snackbar = mui.Snackbar;
var Avatar = mui.Avatar;

var Panel = require('react-bootstrap').Panel;
var Button = require('react-bootstrap').Button;
var ButtonToolbar = require('react-bootstrap').ButtonToolbar;

var Comments = require('./Comments.jsx');

Post = React.createClass({
	mixins: [ Navigation ],
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
			star_count: null,
			not_found: null,
		}
	},
	componentDidMount: function () {
		this.loadPost();
		this.loadStar();
		this.loadStarCount();
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
			headers: {'Authorization': localStorage.getItem('jwt-easybooks')},
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
			headers: {'Authorization': localStorage.getItem('jwt-easybooks')},
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
			headers: {'Authorization': localStorage.getItem('jwt-easybooks')},
			success: function (post) {
				if (post.error_message) {
					this.setState({
						not_found: true
					})
				} else {
					this.setState({
						post: post,
						seller_id: post.seller_id,
						seller_name: post.seller.first_name,
						sold: post.sold,
					});
				}
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
			headers: {'Authorization': localStorage.getItem('jwt-easybooks')},
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
				headers: {'Authorization': localStorage.getItem('jwt-easybooks')},
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
				headers: {'Authorization': localStorage.getItem('jwt-easybooks')},
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
		this.loadStarCount();
	},
	loadStarCount: function () {
		var path = location.pathname;
		var post_id = path.substring(7, path.length);
		var data = {
			post_id: post_id,
		};
		$.ajax({
			url: this.props.origin + '/stars/count',
			type: 'GET',
			data: data,
			dataType: 'json',
			crossDomain: true,
			headers: {'Authorization': localStorage.getItem('jwt-easybooks')},
			success: function (response) {
				this.setState({
					star_count: response.star_count,
				});
			}.bind(this),
			error: function (error) {
				window.location = "/"
			}.bind(this),
		});
	},
	render: function () {
		if (this.state.post != null && !this.state.not_found) {
			var post = this.state.post;
			var star_count = this.state.star_count;
			if (post.seller_id == this.props.currentUser.id) {
				var deleteButton = 
				  <Button onClick={this.deletePost} bsStyle="danger">Delete Post</Button>
				if (this.state.sold) {
					var soldButton = 
					<Button onClick={this.markSold} bsStyle="success">Mark as Available</Button>
				} else {
					var soldButton = 
					<Button onClick={this.markSold} bsStyle="success">Mark as Sold</Button>
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
			var comments = <Comments origin={this.props.origin} post_id={post.id} seller_id={post.seller.id}/>;
			var post = 
				<div>
				<p>{post.title}</p>
				<p>${post.price}</p>
				<p><Avatar src={post.seller.pic} style={{marginRight: "3px"}}/>{post.seller.first_name + ' ' + post.seller.last_name + ' | ' + moment(post.created_at).fromNow()}</p>
				<div className="imgBox">
				<img src={post.picture_url} />
				</div>
				</div>
			var subscribers = <h5>{star_count} user has subscribed to this post</h5>
		} else if (this.state.not_found) {
			var message = "Post Not Found"
		} else {
			var message = "Loading..."
		}
		return (
			<div className="container col-md-8 col-md-offset-2">
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
				<Panel header="Post" bsStyle="info">
				  {message}
				  {post}
				  {starButton}
				  {subscribers}
				  <ButtonToolbar>
					  {deleteButton}
					  {soldButton}
				  </ButtonToolbar>
				  {comments}
				</Panel>
			</div>
		)
	},
});

module.exports = Post;
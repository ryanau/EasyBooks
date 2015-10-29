var React = require('react');
var $ = require('jquery');
var Router = require('react-router');
var Link = Router.Link;

var mui = require('material-ui');
var ThemeManager = new mui.Styles.ThemeManager();

var Alert = require('react-bootstrap').Alert;
var Panel = require('react-bootstrap').Panel;

var PublicPost = require('./PublicPost.jsx');

StarredPosts = React.createClass({
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
			posts: null,
		}
	},
	componentDidMount: function () {
		this.loadPosts();
	},
	loadPosts: function () {
		$.ajax({
			url: this.props.origin + '/starred_posts',
			type: 'GET',
			dataType: 'json',
			crossDomain: true,
			headers: {'Authorization': localStorage.getItem('jwt-easybooks')},
			success: function (response) {
				this.setState({
					posts: response
				});
			}.bind(this),
			error: function (error) {
				window.location = "/"
			}.bind(this),
		});
	},
	render: function () {
		if (this.state.posts != null) {
			if (this.state.posts.length == 0) {
	  		var followReminder =
	  			<Alert bsStyle="info">
	  				<h4>Follow a Post and Get in Line!</h4>
	  		  	<p>You are not following any post... Follow a Post so you will instantly get connected to the seller if it is your turn!</p>
	  		  </Alert>
			  var postCourse = "No Post Followed"
			} else {
				var posts = this.state.posts.map(function (post, index) {
					return (
						<PublicPost key={post.id} origin={this.props.origin} post={post} currentUser={this.props.currentUser} />
					);
				}.bind(this));
				var postCourse = "Following " + this.state.posts.length + " posts"
			}
  	} else {
			var posts = "Loading..."
		};
		return (
			<div className="container col-md-8 col-md-offset-2">
				<Panel header={postCourse} bsStyle="info">
					<div className="mT10">
						{followReminder}
						{posts}
					</div>
				</Panel>
			</div>
		)
	},
});

module.exports = StarredPosts;
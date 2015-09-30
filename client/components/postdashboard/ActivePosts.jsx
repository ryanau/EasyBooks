var React = require('react');
var $ = require('jquery');
var Router = require('react-router');
var Link = Router.Link;

var mui = require('material-ui');
var ThemeManager = new mui.Styles.ThemeManager();

ActivePosts = React.createClass({
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
			url: this.props.origin + '/active_posts',
			type: 'GET',
			dataType: 'json',
			crossDomain: true,
			headers: {'Authorization': localStorage.getItem('jwt')},
			success: function (response) {
				this.setState({
					posts: response.data
				});
			}.bind(this),
			error: function (error) {
				window.location = "/"
			}.bind(this),
		});
	},
	render: function () {
		if (this.state.posts != null) {
			var posts = this.state.posts.map(function (post, index) {
				return (
					<PublicPost key={post.id} origin={this.props.origin} post={post}/>
				)
			}.bind(this));
		} else {
			var posts = "Loading..."
		};
		return (
			<div>
				<h4>Active Posts</h4>
				{posts}
			</div>
		)
	}
});

module.exports = ActivePosts;
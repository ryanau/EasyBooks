var React = require('react');
var $ = require('jquery');
var Router = require('react-router');
var Link = Router.Link;

var mui = require('material-ui');
var ThemeManager = new mui.Styles.ThemeManager();

var PublicPost = require('./PublicPost.jsx');

PublicPosts = React.createClass({
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
			course_selected: this.props.course_selected,
		}
	},
	componentDidMount: function () {
		this.loadPosts();
		this.state.course_selected.on('course_changed', this.readloadPosts)
	},
	readloadPosts: function () {
		var data = {
			course_selected: this.state.course_selected.courses[0],
		};
		$.ajax({
			url: this.props.origin + '/posts',
			type: 'GET',
			dataType: 'json',
			data: data,
			crossDomain: true,
			headers: {'Authorization': localStorage.getItem('jwt-easybooks')},
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
	loadPosts: function () {
		$.ajax({
			url: this.props.origin + '/posts',
			type: 'GET',
			dataType: 'json',
			crossDomain: true,
			headers: {'Authorization': localStorage.getItem('jwt-easybooks')},
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
  			<h3>Public Posts</h3>
  			{posts}
  		</div>
  	)
  }
});

module.exports = PublicPosts;
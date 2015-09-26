var React = require('react');
var $ = require('jquery');
var Router = require('react-router');
var Uri = require('jsuri');
var Link = Router.Link;

var mui = require('material-ui');
var ThemeManager = new mui.Styles.ThemeManager();

Post = React.createClass({
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
				console.log(response)
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
	render: function () {
		if (this.state.post != null) {
			var post = this.state.post;
			var seller_id = this.state.seller_id;
			var seller_name = this.state.seller_name;
		} else {
			var post = "Loading..."
			var seller_id = ""
			var seller_name = ""
		}
		return (
			<div>
				<h4>Post</h4>
				<p>{post.title}</p>
				<p>{seller_name}</p>
			</div>
		)
	},
});

module.exports = Post;
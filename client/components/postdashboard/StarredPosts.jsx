var React = require('react');
var $ = require('jquery');
var Router = require('react-router');
var Link = Router.Link;

var mui = require('material-ui');
var ThemeManager = new mui.Styles.ThemeManager();

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
			url: this.props.origin + '/posts',
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
		return (
			<div>
				<h4>Starred Posts</h4>
			</div>
		)
	},
});

module.exports = StarredPosts;
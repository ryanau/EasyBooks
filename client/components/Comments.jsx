var React = require('react');
var $ = require('jquery');
var Router = require('react-router');
var Uri = require('jsuri');
var Link = Router.Link;

var mui = require('material-ui');
var ThemeManager = new mui.Styles.ThemeManager();
var RaisedButton = mui.RaisedButton;

var Comment = require('./Comment.jsx');

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
		var data = {
			post_id: this.props.post_id,
		};
		$.ajax({
			url: this.props.origin + '/comments',
			type: 'GET',
			data: data,
			dataType: 'json',
			crossDomain: true,
			headers: {'Authorization': localStorage.getItem('jwt')},
			success: function (response) {
				this.setState({
					comments: response.comments,
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
						<Comment key={index} comment={comment} post_id={this.props.post_id} />
					)
				}.bind(this));
			}
		} else {
			var comments = "Loading"
		}
		return (
			<div>
				<h4>Comments</h4>
				{comments}
			</div>
		)
	},
});

module.exports = Comments;
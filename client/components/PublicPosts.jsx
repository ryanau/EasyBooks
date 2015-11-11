var React = require('react');
var $ = require('jquery');
var Router = require('react-router');
var Link = Router.Link;
var Infinite = require('react-infinite');

var mui = require('material-ui');
var ThemeManager = new mui.Styles.ThemeManager();

var Panel = require('react-bootstrap').Panel;
var Glyphicon = require('react-bootstrap').Glyphicon;
var Col = require('react-bootstrap').Col;

var ReactRouterBootstrap = require('react-router-bootstrap')
  , ButtonLink = ReactRouterBootstrap.ButtonLink

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
			start_point: 0,
			end_point: 19,
			isInfiniteLoading: true
		}
	},
	componentWillMount: function () {
		this.state.course_selected.on('sorting_changed', this.loadSelected)
		this.state.course_selected.on('course_changed', this.loadSelected)
	},
	componentDidMount: function () {
		this.loadPosts();
	},
	componentWillUnmount: function () {
		this.state.course_selected.off('sorting_changed')
		this.state.course_selected.off('course_changed')
	},
	loadSelected: function () {
		var data = {
			course_selected: this.state.course_selected.courses[0],
			start_point: this.state.start_point,
			end_point: this.state.end_point,
			sorting: this.props.sorting,
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
					posts: response
				});
			}.bind(this),
			error: function (error) {
				window.location = "/"
			}.bind(this),
		});
	},
	loadPosts: function () {
		var data = {
			start_point: this.state.start_point,
			end_point: this.state.end_point,
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
					posts: response
				});
			}.bind(this),
			error: function (error) {
				window.location = "/"
			}.bind(this),
		});
	},
	handleInfiniteLoad: function() {
    this.setState({
      isInfiniteLoading: true
    });
    var data = {
    	start_point: this.state.start_point + 10,
    	end_point: this.state.end_point + 10,
    };
    var posts = this.state.post;
   	$.ajax({
   		url: this.props.origin + '/posts',
   		type: 'GET',
   		dataType: 'json',
   		data: data,
   		crossDomain: true,
   		headers: {'Authorization': localStorage.getItem('jwt-easybooks')},
   		success: function (response) {
   			posts.concat(response)
   			this.setState({
   				posts: posts,
   				isInfiniteLoading: false,
   			});
   		}.bind(this),
   		error: function (error) {
   			window.location = "/"
   		}.bind(this),
   	});
  },
  buildElements: function (start, end) {

  },
  render: function () {
  	var header = "this.state.course_selected"
  	if (this.state.course_selected.courses.length == 0) {
  		var header = "Post for All Courses: " + this.props.sorting
  	} else {
  		var header = "Posts for " + this.state.course_selected.courses[0] + " : " + this.props.sorting
  	}
  	if (this.state.posts == null) {
  		var posts = "Loading..."
  	} else if (this.state.posts.length > 0) {
  		var posts = this.state.posts.map(function (post, index) {
  			return (
  				<Col lg={12} md={12} s={12} xs={12} key={post.id}>
	  				<PublicPost key={post.id} origin={this.props.origin} post={post} currentUser={this.props.currentUser} AppControl={this.props.AppControl} course_selected={this.props.course_selected}/>
  				</Col>
  			)
  		}.bind(this));
  	} else {
  		var posts = 
  		<div>
  		<h5>No post available... Add this course to your subscribed list to get instant text notifications when posts for {this.state.course_selected.courses[0]} become available!</h5>
  		<ButtonLink onClick={this.showSubscription} bsStyle="primary" to="/subscriptions"><Glyphicon glyph="plus"/> Add Subscription</ButtonLink>
  		</div>
  	};
  	return (
  		<div>
	  		<Panel header={header} bsStyle="info" className="p0">
	  			{posts}
	  		</Panel>
  		</div>
  	)
  }
});

module.exports = PublicPosts;
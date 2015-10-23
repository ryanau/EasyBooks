var React = require('react');
var $ = require('jquery');
var Router = require('react-router');
var Link = Router.Link;
var Navigation = Router.Navigation;
var moment = require('moment');

var mui = require('material-ui');
var ThemeManager = new mui.Styles.ThemeManager();
var Card = mui.Card;
var CardHeader = mui.CardHeader;
var CardText = mui.CardText;
var CardActions = mui.CardActions;
var CardTitle = mui.CardTitle;
var Snackbar = mui.Snackbar;
var FlatButton = mui.FlatButton;
var FontIcon = mui.FontIcon;
var IconButton = mui.IconButton;
var Colors = mui.Colors;

PublicPost = React.createClass({
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
      star: null,
      star_count: this.props.post.stars.length,
    }
  },
  componentDidMount: function () {
    this.loadStar();
  },
  redirectToPost: function () {
    this.transitionTo('/posts/' + this.props.post.id);
  },
  loadStar: function () {
    var path = location.pathname;
    var post_id = this.props.post.id;
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
  starPost: function () {
    var path = location.pathname;
    var post_id = this.props.post.id;
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
    var post_id = this.props.post.id;
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
    var post = this.props.post
  	var course = post.course
    if (this.state.star) {
      var starButton = 
      <IconButton onClick={this.starPost} tooltip="Unfollow this post" iconStyle={{color: "#FFFF00"}}><FontIcon className="material-icons">star</FontIcon></IconButton>
    } else {
      var starButton = 
      <IconButton onClick={this.starPost} tooltip="Follow this post"><FontIcon className="material-icons">star</FontIcon></IconButton>
    }
  	return (
      <div className="publicpost">
        <Snackbar
          ref="postStarred"
          message='Post Followed'
          autoHideDuration={1000}/>
        <Snackbar
          ref="postUnstarred"
          message='Post Unfollowed'
          autoHideDuration={1000}/>
  			<Card key={post.id}>
          <CardHeader 
            title={course.department + ' ' + course.course_number + ': ' + post.title + ' (' + (post.condition) + ')'}
            subtitle={"$" + post.price + " | " + this.state.star_count + " Subscribers" + " | Created " + moment(post.created_at).fromNow()}
            avatar={starButton}>
          </CardHeader>
          <CardText>
          <IconButton onClick={this.redirectToPost} tooltip="See Detail" tooltipPosition="bottom-center" touch={true}><FontIcon className="material-icons">forward</FontIcon></IconButton>
          {post.description}
          </CardText>
  			</Card>
  		</div>
  	)
  }
});

module.exports = PublicPost;
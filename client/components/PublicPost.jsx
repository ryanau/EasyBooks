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
var Avatar = mui.Avatar;

var Label = require('react-bootstrap').Label;
var Button = require('react-bootstrap').Button;
var Glyphicon = require('react-bootstrap').Glyphicon;

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
      mutual_friends_count: null,
      mutual_friends: null,
    }
  },
  componentDidMount: function () {
    this.loadStar();
    this.loadMutualFriends();
  },
  redirectToPost: function () {
    this.transitionTo('/posts/' + this.props.post.id);
  },
  loadMutualFriends: function () {
    var post = this.props.post
    var post_id = this.props.post.id;
    if (post.seller_id != this.props.currentUser.id) {
      var data = {
        post_id: post_id,
      };
      $.ajax({
        url: this.props.origin + '/mutual_friends',
        type: 'GET',
        data: data,
        dataType: 'json',
        crossDomain: true,
        headers: {'Authorization': localStorage.getItem('jwt-easybooks')},
        success: function (response) {
          if (response.mutual_friends_count != null) {
            this.setState({
              mutual_friends_count: response.mutual_friends_count,
              mutual_friends: response.mutual_friends,
            })
          }
        }.bind(this),
        error: function (error) {
          window.location = "/"
        }.bind(this),
      });
    }
  },
  loadStar: function () {
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
      this.loadStarCount();
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
      this.loadStarCount();
    }
  },
  loadStarCount: function () {
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
    if (post.seller_id != this.props.currentUser.id) {
      if (this.state.mutual_friends != null && this.state.mutual_friends.length < 10) {
        var avatars = this.state.mutual_friends.map(function (friend, index) {
          return (
            <Avatar key={index} src={friend[1]} style={{marginRight: "3px"}}/>
          )
        }.bind(this))
        var mutual = this.state.mutual_friends_count + " Mutual Friends"
      } else if (this.state.mutual_friends != null && this.state.mutual_friends.length > 10) {
        var avatars = this.state.mutual_friends.slice(0,10).map(function (friend, index) {
          return (
            <Avatar key={index} src={friend[1]} style={{marginRight: "3px"}}/>
          )
        }.bind(this))
        var mutual = this.state.mutual_friends_count + " Mutual Friends"
        var lastCount = this.state.mutual_friends_count - 10 + ' +'
      }
      if (this.state.star) {
        var actionButtons = 
        <CardActions>
          <IconButton onClick={this.starPost} tooltip="Unfollow this post" tooltipPosition="top-right" iconStyle={{color: "#FFFF00"}}><FontIcon className="material-icons">star</FontIcon></IconButton>
          <Button onClick={this.redirectToPost} bsStyle="info"><Glyphicon glyph="info-sign"/> Info</Button>
        </CardActions>
      } else {
        var actionButtons = 
        <CardActions>
          <IconButton onClick={this.starPost} tooltipPosition="top-right" tooltip="Follow this post"><FontIcon className="material-icons">star</FontIcon></IconButton>
          <Button onClick={this.redirectToPost} bsStyle="info"><Glyphicon glyph="info-sign"/> Info</Button>
        </CardActions>
      }
      var seller = post.seller.first_name + ' ' + post.seller.last_name
    } else {
      var seller = "you"
      var mutual = ":P"
      var actionButtons = 
      <CardActions>
        <Button onClick={this.redirectToPost} bsStyle="info"><Glyphicon glyph="info-sign"/> Info</Button>

      </CardActions>
    } 
    if (post.description) {
      var postDescription = <p>Extra info: {post.description}</p>
    }
    if (post.pickup) {
      var postPickUp = <p>Pick up at: {post.pickup}</p>
    }
    switch (post.condition) {
      case "New":
        var condition = <Label bsStyle="success">New</Label>
        break;
      case "Like New":
        var condition = <Label bsStyle="default">Like New</Label>
        break;
      case "Good":
        var condition = <Label bsStyle="primary">Good</Label>
        break;
      case "Fair":
        var condition = <Label bsStyle="warning">Fair</Label>
        break;
    }
  	return (
      <div>
        <Snackbar
          ref="postStarred"
          message='Post Followed'
          autoHideDuration={1000}/>
        <Snackbar
          ref="postUnstarred"
          message='Post Unfollowed'
          autoHideDuration={1000}/>
  			<Card key={post.id}>
          <CardHeader avatar={condition} title={course.department + ' ' + course.course_number + ': ' + post.title} subtitle={"$" + post.price + " | " + this.state.star_count + " Subscribers | " + moment(post.created_at).fromNow()} actAsExpander={true}
            showExpandableButton={true}/>
          <CardHeader expandable={true}
            title={"By " + seller}
            subtitle={mutual}
            avatar={post.seller.pic}>
          </CardHeader>
          {actionButtons}
          <CardText expandable={true}>
            {postDescription}
            {postPickUp}
            <div>
            {avatars}{lastCount}
            </div>
          </CardText>
  			</Card>
  		</div>
  	)
  }
});

module.exports = PublicPost;
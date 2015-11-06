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
var Badge = require('react-bootstrap').Badge;
var OverlayTrigger = require('react-bootstrap').OverlayTrigger;
var Tooltip = require('react-bootstrap').Tooltip;
var OverlayTrigger = require('react-bootstrap').OverlayTrigger;
var Popover = require('react-bootstrap').Popover;
var Input = require('react-bootstrap').Input;
var Col = require('react-bootstrap').Col;

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
      offer: null,
      star_position: null,
    }
  },
  componentDidMount: function () {
    this.loadStar();
    this.loadStarPosition();
    this.loadMutualFriends();
  },
  componentDidUpdate: function () {
    this.loadStarPosition();
  },
  redirectToPost: function () {
    this.transitionTo('/posts/' + this.props.post.id);
  },
  loadStarPosition: function () {
    var post = this.props.post
    var post_id = this.props.post.id;
    if (this.state.star && this.state.star_position == null) {
      var data = {
        post_id: post_id,
      };
      $.ajax({
        url: this.props.origin + '/stars/position',
        type: 'GET',
        data: data,
        dataType: 'json',
        crossDomain: true,
        headers: {'Authorization': localStorage.getItem('jwt-easybooks')},
        success: function (response) {
          this.setState({star_position: response.star_position})
        }.bind(this),
        error: function (error) {
          window.location = "/"
        }.bind(this),
      });
    }
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
    var data = {post_id: post_id};
    $.ajax({
      url: this.props.origin + '/stars',
      type: 'GET',
      data: data,
      dataType: 'json',
      crossDomain: true,
      headers: {'Authorization': localStorage.getItem('jwt-easybooks')},
      success: function (response) {
        response.starred? this.setState({star: true}) : this.setState({star: false})
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
  handleChange: function () {
    this.setState({
      offer: this.refs.offer.getValue(),
    });
  },
  render: function () {
    var post = this.props.post
  	var course = post.course
    var postLink = '/posts/' + post.id
    var watchClicked =<Button onClick={this.starPost} bsStyle="success" bsSize="small"><Glyphicon glyph="eye-open"/> Watching ({this.state.star_position})</Button>
    var watchNotClicked = <Button onClick={this.starPost} bsStyle="default" bsSize="small"><Glyphicon glyph="eye-close"/> Watch</Button>
    var infoButton = <Button onClick={this.redirectToPost} bsStyle="info" bsSize="small"><Glyphicon glyph="info-sign"/> Info</Button>
    var sendOfferButton = (
      <OverlayTrigger rootClose trigger="click" placement="bottom" overlay={<Popover title="Your Offer">
      <Col lg={6} md={6} s={6} xs={6}>
      <Input
        type="text"
        value={this.state.offer}
        placeholder={post.price}
        hasFeedback
        ref="offer"
        groupClassName="group-class"
        labelClassName="label-class"
        onChange={this.handleChange} />
      </Col>
      <Col lg={6} md={6} s={6} xs={6}>
      <Button onClick={this.sendOffer} bsStyle="success" bsSize="small"><Glyphicon glyph="send"/> Send</Button>
      </Col>
      </Popover>}>
      <Button bsStyle="info" bsSize="small"><Glyphicon glyph="send"/> Make Offer</Button>
      </OverlayTrigger>
    )
    if (post.seller_id != this.props.currentUser.id) {
      if (this.state.mutual_friends != null && this.state.mutual_friends.length < 10) {
        var avatars = this.state.mutual_friends.map(function (friend, index) {
          return (
            <Avatar key={index} src={friend[1]} style={{marginRight: "3px"}}/>
          )
        }.bind(this))
        var mutual = this.state.mutual_friends_count + " Mutual Friends"
      } else if (this.state.mutual_friends != null && this.state.mutual_friends.length > 10) {
        var avatars = this.state.mutual_friends.slice(0,9).map(function (friend, index) {
          return (
            <Avatar key={index} src={friend[1]} style={{marginRight: "3px"}}/>
          )
        }.bind(this))
        var mutual = this.state.mutual_friends_count + " Mutual Friends"
        var lastCount = <Badge>{this.state.mutual_friends_count - 9 + ' +'}</Badge>
      } else {
        var mutual = "Loading mutual friends..."
      }
      var actionButtons = 
      <CardActions>
        {this.state.star? watchClicked : watchNotClicked}
        {infoButton}
      </CardActions>
      var seller = post.seller.first_name + ' ' + post.seller.last_name
    } else {
      var seller = "you"
      var mutual = ":P"
      var actionButtons = 
      <CardActions>
        {infoButton}
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
          message='Watching Post'
          autoHideDuration={1000}/>
        <Snackbar
          ref="postUnstarred"
          message='Unwatching Post'
          autoHideDuration={1000}/>
  			<Card key={post.id} className="mB10">
          <CardTitle title={<Link to={postLink}>{post.title}</Link>} subtitle={course.department + ' ' + course.course_number} />
          <CardHeader avatar={condition} title={"$" + post.price + " | " + moment(post.created_at).fromNow()} subtitle={this.state.star_count + " Watchers"} actAsExpander={true}
            showExpandableButton={true}/>
          <CardText expandable={true}>
            {postDescription}
            {postPickUp}
          </CardText>
          {actionButtons}
          <CardHeader
            title={"By " + seller}
            subtitle={mutual}
            avatar={post.seller.pic}
            actAsExpander={true}
            showExpandableButton={true}>
          </CardHeader>
          <CardText expandable={true}>
            {avatars}{lastCount}
          </CardText>
  			</Card>
  		</div>
  	)
  }
});

module.exports = PublicPost;
var React = require('react');
var $ = require('jquery');
var Router = require('react-router');
var Navigation = Router.Navigation;
var moment = require('moment');
var TimerMixin = require('react-timer-mixin');

var mui = require('material-ui');
var ThemeManager = new mui.Styles.ThemeManager();
var FontIcon = mui.FontIcon;
var IconButton = mui.IconButton;
var Snackbar = mui.Snackbar;
var Avatar = mui.Avatar;

var Label = require('react-bootstrap').Label;
var Button = require('react-bootstrap').Button;
var Glyphicon = require('react-bootstrap').Glyphicon;
var Badge = require('react-bootstrap').Badge;
var OverlayTrigger = require('react-bootstrap').OverlayTrigger;
var Tooltip = require('react-bootstrap').Tooltip;
var Popover = require('react-bootstrap').Popover;
var Input = require('react-bootstrap').Input;
var Col = require('react-bootstrap').Col;
var Well = require('react-bootstrap').Well;
var Panel = require('react-bootstrap').Panel;
var ButtonToolbar = require('react-bootstrap').ButtonToolbar;

var Comments = require('./Comments.jsx');
var VenmoAuthorizationWatch = require('./VenmoAuthorizationWatch.jsx');

Post = React.createClass({
	mixins: [ Navigation, TimerMixin ],
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
			star: null,
			sold: null,
			star_count: null,
			not_found: null,

			mutual_friends_count: null,
			mutual_friends: null,
			star_position: null,
			showVenmoModal: false,
		}
	},
	componentDidMount: function () {
		this.loadPost();
	},
	loadPost: function () {
		var path = location.pathname;
		var post_id = path.substring(7, path.length);
		var data = {post_id: post_id,};
		$.ajax({
			url: this.props.origin + '/posts/' + post_id,
			type: 'GET',
			data: data,
			dataType: 'json',
			crossDomain: true,
			headers: {'Authorization': localStorage.getItem('jwt-easybooks')},
			success: function (post) {
				if (post.error_message) {
					this.setState({
						not_found: true
					})
				} else {
					$.when(this.setState({
						post: post,
						seller_id: post.seller_id,
						seller_name: post.seller.first_name,
						sold: post.sold,
					})).done(function (){
						this.loadStar();
						this.loadStarCount();
						this.loadMutualFriends();
					}.bind(this));
				}
			}.bind(this),
			error: function (error) {
				window.location = "/"
			}.bind(this),
		});
	},
	loadMutualFriends: function () {
		var post_id = this.state.post.id;
		var data = {
		  post_id: post_id,
		};
	  if (this.state.post.seller_id != this.props.currentUser.id) {
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
		var path = location.pathname;
		var post_id = path.substring(7, path.length);
		var data = {post_id: post_id,};
		$.ajax({
		  url: this.props.origin + '/stars',
		  type: 'GET',
		  data: data,
		  dataType: 'json',
		  crossDomain: true,
		  headers: {'Authorization': localStorage.getItem('jwt-easybooks')},
		  success: function (response) {
		    $.when(response.starred? this.setState({star: true}) : this.setState({star: false})).done(function () {
		      this.loadStarPosition();
		    }.bind(this));
		  }.bind(this),
		  error: function (error) {
		    window.location = "/"
		  }.bind(this),
		});
	},
	loadStarPosition: function () {
	  var post = this.state.post
	  var post_id = this.state.post.id;
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
	deletePost: function () {
		var path = location.pathname;
		var post_id = path.substring(7, path.length);
		var data = {post_id: post_id,};
		$.ajax({
			url: this.props.origin + '/posts/' + post_id,
			type: 'DELETE',
			data: data,
			dataType: 'json',
			crossDomain: true,
			headers: {'Authorization': localStorage.getItem('jwt-easybooks')},
			success: function (response) {
				this.refs.postDeleted.show();
				this.setTimeout(function () {
					this.redirectToHome();
				}, 1000)
			}.bind(this),
			error: function (error) {
				window.location = "/"
			}.bind(this),
		});
	},
	redirectToHome: function () {
		this.transitionTo('/');
	},
	starPost: function () {
		var path = location.pathname;
		var post_id = path.substring(7, path.length);
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
					$.when(this.setState({star: false})).done(function (){
					  this.loadStarCount();
					}.bind(this));
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
					$.when(this.setState({star: true})).done(function (){
					  this.loadStarCount();
					  this.loadStarPosition();
					}.bind(this));
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
		var post_id = path.substring(7, path.length);
		var data = {post_id: post_id,};
		$.ajax({
			url: this.props.origin + '/stars/count',
			type: 'GET',
			data: data,
			dataType: 'json',
			crossDomain: true,
			headers: {'Authorization': localStorage.getItem('jwt-easybooks')},
			success: function (response) {
				this.setState({star_count: response.star_count});
			}.bind(this),
			error: function (error) {
				window.location = "/"
			}.bind(this),
		});
	},
	openVenmoModal: function () {
	  this.setState({showVenmoModal: true})
	},
	closeVenmoModal: function () {
	  this.setState({showVenmoModal: false})
	},
	render: function () {
		if (this.state.post != null && !this.state.not_found) {
			var post = this.state.post
			var course = post.course
			var author = <span className="colorGrey fs16"><i> {post.author}</i></span>
			var comments = <Comments origin={this.props.origin} post_id={post.id} seller_id={post.seller.id}/>;
			var description = <Col lg={12} md={12} s={12} xs={12}><p>{post.description}</p></Col>
			var pickUp = <Col lg={12} md={12} s={12} xs={12}><p>Pick Up: {post.pickup}</p></Col>
			var deleteButton = <Button onClick={this.deletePost} bsStyle="danger"><Glyphicon glyph="trash"/></Button>
			var watchClickedTooltip = <Tooltip id="1">Your position is {this.state.star_position} out of {this.state.star_count} watchers</Tooltip>
			if (this.state.star) {
			  var watcherBadgeTooltip = watchClickedTooltip
			} else {
			  var watcherBadgeTooltip = <Tooltip id="1">You are not watching this post</Tooltip>
			}
			var watcherBadge = (
			  <OverlayTrigger placement="top" overlay={watcherBadgeTooltip}>
			    <Label>{this.state.star_count} people watching</Label>
			  </OverlayTrigger>
			)
			var watchClicked = (
			  <OverlayTrigger placement="top" overlay={watchClickedTooltip}>
			    <Button onClick={this.starPost} bsStyle="success" bsSize="small"><Glyphicon glyph="eye-open"/> Watching ({this.state.star_position})</Button>
			  </OverlayTrigger>
			)
			var watchNewButton = (
			  <Button bsSize="small" bsStyle="default" onClick={this.openVenmoModal}><Glyphicon glyph="eye-open"/> Watch Now</Button>
			)
			switch (post.condition) {
			  case "New":
			    var condition = <Label bsStyle="success">New</Label>
			    break;
			  case "Like New":
			    var condition = <Label bsStyle="info">Like New</Label>
			    break;
			  case "Good":
			    var condition = <Label bsStyle="primary">Good</Label>
			    break;
			  case "Fair":
			    var condition = <Label bsStyle="warning">Fair</Label>
			    break;
			}
			if (post.seller_id != this.props.currentUser.id) {
			  if (this.state.mutual_friends != null && this.state.mutual_friends.length < 20) {
			    var avatars = this.state.mutual_friends.map(function (friend, index) {
			      var tooltip = <Tooltip id={index}>{friend[0]}</Tooltip>
			      return (
			      <OverlayTrigger key={index} placement="top" overlay={tooltip}>
			        <Avatar src={friend[1]} style={{marginRight: "3px"}}/>
			      </OverlayTrigger>
			      )
			    }.bind(this))
			    var mutual = this.state.mutual_friends_count + " Mutual Friends"
			  } else if (this.state.mutual_friends != null && this.state.mutual_friends.length > 10) {
			    var avatars = this.state.mutual_friends.slice(0,19).map(function (friend, index) {
			    var tooltip = <Tooltip id={index}>{friend[0]}</Tooltip>
			      return (
			        <OverlayTrigger key={index} placement="top" overlay={tooltip}>
			          <Avatar src={friend[1]} style={{marginRight: "3px"}}/>
			        </OverlayTrigger>
			      )
			    }.bind(this))
			    var mutual = this.state.mutual_friends_count + " Mutual Friends"
			    var lastCount = <Badge>{this.state.mutual_friends_count - 19 + ' +'}</Badge>
			  } else {
			    var mutual = "Loading mutual friends..."
			  }
		    var buttonGroup = (
		      <ButtonToolbar>
		      {this.state.star? watchClicked : watchNewButton}
		      </ButtonToolbar>
		    )
			  var seller = post.seller.first_name + ' ' + post.seller.last_name
			  var mutualPopOver = (
			    <OverlayTrigger trigger="click" rootClose placement="bottom" overlay={<Popover id="1">{avatars}{lastCount}</Popover>}>
			    <Button bsSize="xsmall">{mutual}</Button>
			    </OverlayTrigger>
			  )
			} else {
			  var seller = "you"
			  var mutual = ":P"
			  if (!post.sold) {
				  var buttonGroup = (
				    <ButtonToolbar>
				    {deleteButton}
				    </ButtonToolbar>
				  )
			  }
			  if (post.entry.venmo_transaction_id) {
				  var soldAt = <Well>{'Sold on ' + moment(post.entry.created_at).format('MMMM Do YYYY, h:mm:ss a') + ' | Venmo Transaction ID ' + post.entry.venmo_transaction_id}</Well>
			  }
			}
			if (post.description) {
			  var postDescription = <p>Extra info: {post.description}</p>
			}
			if (post.pickup) {
			  var postPickUp = <p>Pick up at: {post.pickup}</p>
			}
			var display = (
				<div>
				{soldAt}
				{condition} <Label bsStyle="danger">${post.price}</Label> <Label bsSize="small">{moment(post.created_at).fromNow()}</Label> {watcherBadge}
				<Col lg={12} md={12} s={12}>
				  <h3><Label bsSize="large">{course.department + ' ' + course.course_number}</Label> {post.title} {author}</h3>
				</Col>
				{post.description? description : null}
				{post.pickup? pickUp : null}
				<Col lg={12} md={12} s={12}>
				<div className="imgBox">
					<img src={post.picture_url} />
				</div>
				</Col>
				<Col lg={9} xs={12}>
				  <Avatar src={post.seller.pic} style={{marginRight: "3px"}}/>By {seller} {mutualPopOver} 
				</Col>
				<Col lg={3} xs={12}>
				  {buttonGroup}
				</Col>
				</div>
			)
		} else if (this.state.not_found) {
			var display = "Post not found"
		} else {
			var display = "Loading..."
		}
		return (
			<div className="container col-md-8 col-md-offset-2">
				<Snackbar
				  ref="postDeleted"
				  message='Post Deleted. Redirecting...'
				  autoHideDuration={1000}/>
				<Snackbar
				  ref="postStarred"
				  message='Watching Post'
				  autoHideDuration={1000}/>
				<Snackbar
				  ref="postUnstarred"
				  message='Unwatching Post'
				  autoHideDuration={1000}/>
			  <VenmoAuthorizationWatch show={this.state.showVenmoModal} close={this.closeVenmoModal} currentUser={this.props.currentUser} origin={this.props.origin} starPost={this.starPost}/>
				<Panel header="Post" bsStyle="info">
					{display}
					<Col lg={12} md={12} s={12}>
					  {comments}
				  </Col>
				</Panel>
			</div>
		)
	},
});

module.exports = Post;
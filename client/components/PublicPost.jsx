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
  redirectToPost: function () {
    this.transitionTo('/posts/' + this.props.post.id);
  },
  render: function () {
    var post = this.props.post
  	var course = post.course
  	return (
      <div className="publicpost">
  			<Card key={post.id}>
          <CardHeader 
            title={course.department + ' ' + course.course_number + ': ' + post.title + ' (' + (post.condition) + ')'}
            subtitle={"$" + post.price + " | " + post.stars.length + " Subscribers" + " | Created " + moment(post.created_at).fromNow()}
            avatar={<IconButton onClick={this.redirectToPost} tooltip="See Detail" tooltipPosition="bottom-center" touch={true}><FontIcon className="material-icons">forward</FontIcon></IconButton>}>
          </CardHeader>
          <CardText>
          {post.description}
          </CardText>
  			</Card>
  		</div>
  	)
  }
});

module.exports = PublicPost;
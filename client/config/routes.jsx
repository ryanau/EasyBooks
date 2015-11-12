var React = require('react');
var Router = require('react-router');
var App = require('../components/App.jsx');
var Landing = require('../components/Landing.jsx');
var Sell = require('../components/Sell.jsx');
var Post = require('../components/Post.jsx');
var ScheduleUploader = require('../components/ScheduleUploader.jsx');
var Subscriptions = require('../components/Subscriptions.jsx');
var Login = require('../components/LogIn.jsx');
var SignUp = require('../components/SignUp.jsx');
var LogOut = require('../components/LogOut.jsx');
var PostDashboard = require('../components/PostDashboard.jsx');
var StarredPosts = require('../components/StarredPosts.jsx');
var Profile = require('../components/Profile.jsx');
var VenmoCloseWindow = require('../components/VenmoCloseWindow.jsx');

var DefaultRoute = Router.DefaultRoute;
var Route = Router.Route;
var NotFoundRoute = Router.NotFoundRoute;

module.exports = (
  <Route name="app" path="/" handler={App}>
	  <DefaultRoute name="landing" handler={Landing} />
	  <Route name="signup" path="signup" handler={SignUp} />
	  <Route name="logout" path="logout" handler={LogOut} />
	  <Route name="login" path="login" handler={Login} />
	  <Route name="postdashboard" path="postdashboard" handler={PostDashboard} />
	  <Route name="sell" handler={Sell} />
	  <Route name="posts/:id" path="posts/:id" handler={Post} />
	  <Route name="scheduleuploader" path="schedule" handler={ScheduleUploader} />
	  <Route name="subscriptions" path="subscriptions" handler={Subscriptions} />
	  <Route name="starred" path="starred" handler={StarredPosts} />
	  <Route name="profile" path="profile" handler={Profile} />
	  <Route name="venmo_close_window" path="venmo_close_window" handler={VenmoCloseWindow} />
  </Route>
);
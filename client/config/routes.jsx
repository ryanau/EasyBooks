var React = require('react');
var Router = require('react-router');
var App = require('../components/App.jsx');
var Landing = require('../components/Landing.jsx');
var Sell = require('../components/Sell.jsx');
var Post = require('../components/Post.jsx');
var ScheduleUploader = require('../components/ScheduleUploader.jsx');
var Subscriptions = require('../components/Subscriptions.jsx');
// var PostEdit = require('../components/PostEdit.jsx');
var PostDashboard = require('../components/PostDashboard.jsx');


var DefaultRoute = Router.DefaultRoute;
var Route = Router.Route;
var NotFoundRoute = Router.NotFoundRoute;


module.exports = (
  <Route name="app" path="/" handler={App}>
	  <DefaultRoute name="landing" handler={Landing} />
	  <Route name="postdashboard" path="postdashboard" handler={PostDashboard} />
	  <Route name="sell" handler={Sell} />
	  <Route name="posts/:id" path="posts/:id" handler={Post} />
	  <Route name="scheduleUploader" path="schedule" handler={ScheduleUploader} />
	  <Route name="Subscriptions" path="subscriptions" handler={Subscriptions} />
  </Route>
);
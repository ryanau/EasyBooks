require('./assets/app.css');

var React = require('react');
var App = require('./components/App.jsx');
var Router = require('react-router');
var routes = require('./config/routes.jsx');

var injectTapEventPlugin = require("react-tap-event-plugin");
injectTapEventPlugin();

Router.run(routes, Router.HistoryLocation, function(Handler) {
  React.render(<Handler/>, document.body);
});


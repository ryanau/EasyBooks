var React = require('react');
var Router = require('react-router');
var Link = Router.Link;

LogOut = React.createClass({
  componentDidMount: function () {
    this.logOutUser();
  },
  logOutUser: function () {
    localStorage.removeItem('jwt-easybooks');
    location = '/';
  },
  render: function () {
    return (
      <div>
      </div>
    )
  },
})

module.exports = LogOut;
  

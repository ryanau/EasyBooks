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
        <h4>Sad to see you leave :(</h4>
      </div>
    )
  },
})

module.exports = LogOut;
  

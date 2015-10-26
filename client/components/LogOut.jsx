var React = require('react');
var Router = require('react-router');
var Link = Router.Link;

LogOut = React.createClass({
  componentDidMount: function () {
    this.logOutUser();
  },
  logOutUser: function () {
    localStorage.removeItem('jwt-easybooks');
    setTimeout(function() {location = '/';}, 2000);
  },
  render: function () {
    return (
      <div className="container col-md-8 col-md-offset-2">
        <h4>Sad to see you leave :(</h4>
        <iframe src="//giphy.com/embed/hoaFB12CCE824" width="480" height="360" frameBorder="0" allowFullScreen></iframe><p><a href="http://giphy.com/gifs/sad-cat-cute-hoaFB12CCE824"></a></p>
      </div>
    )
  },
})

module.exports = LogOut;
  

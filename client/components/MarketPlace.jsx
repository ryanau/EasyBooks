var React = require('react');
var $ = require('jquery');
var Router = require('react-router');
var Link = Router.Link;
var Select = require('react-select');
var TimerMixin = require('react-timer-mixin');

var Glyphicon = require('react-bootstrap').Glyphicon;
var Button = require('react-bootstrap').Button;
var Col = require('react-bootstrap').Col;
var SplitButton = require('react-bootstrap').SplitButton;
var MenuItem = require('react-bootstrap').MenuItem;

var PublicPosts = require('./PublicPosts.jsx');
var Courses = require('../courses.js');

MarketPlace = React.createClass({
  mixins: [ TimerMixin ],
  getInitialState: function () {
    return {
      courses: [{value: "1", label: "Loading..."}],
      course_selected: new Courses,
      sorting: "Newest to Oldest",
    }
  },
  componentDidMount: function () {
    this.loadCourses();
  },
  loadCourses: function () {
    $.ajax({
      url: this.props.origin + '/courses',
      type: 'GET',
      dataType: 'json',
      crossDomain: true,
      headers: {'Authorization': localStorage.getItem('jwt-easybooks')},
      success: function (response) {
        this.setState({
          courses: response.courses,
        });
      }.bind(this),
      error: function (error) {
        window.location = "/"
      }.bind(this),
    });
  },
  searchChange: function (value) {
    this.state.course_selected.empty();
    this.state.course_selected.courseSelect(value);
  },
  changeSorting: function (e) {
    this.setState({
      sorting: e.target.innerHTML,
    })
    this.setTimeout(function () {
      this.state.course_selected.emit('sorting_changed')
    }, 500)
  },
  render: function () {
    var searchOptions = this.state.courses;
  	return (
  		<div>
        <Col xs={12} md={8} lg={9} s={8}>
          <Select
          name="form-field-name"
          value="Type the course name or click the dropdown button on the right"
          options={searchOptions}
          onChange={this.searchChange}
          searchable={true}/>
        </Col>
        <Col xs={12} md={4} lg={3} s={4}>
          <SplitButton bsStyle="primary" title={this.state.sorting} key={1} id="sorting">
            <MenuItem onSelect={this.changeSorting} eventKey="1">Newest to Oldest</MenuItem>
            <MenuItem onSelect={this.changeSorting} eventKey="2">Oldest to Newest</MenuItem>
            <MenuItem onSelect={this.changeSorting} eventKey="3">$ Low to High</MenuItem>
            <MenuItem onSelect={this.changeSorting} eventKey="4">$ High to Low</MenuItem>
          </SplitButton>
        </Col>
        <Col xs={12} md={12} lg={12} s={12}>
  			 <PublicPosts origin={this.props.origin} course_selected={this.state.course_selected} currentUser={this.props.currentUser} sorting={this.state.sorting}/>
        </Col>
  		</div>
  	)
  }
});

module.exports = MarketPlace;
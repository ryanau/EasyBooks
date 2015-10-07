var React = require('react');
var $ = require('jquery');
var Router = require('react-router');
var Link = Router.Link;
var Select = require('react-select');

var mui = require('material-ui');
var ThemeManager = new mui.Styles.ThemeManager();
var Toolbar = mui.Toolbar;
var ToolbarGroup = mui.ToolbarGroup;
var ToolbarSeparator = mui.ToolbarSeparator;
var DropDownMenu = mui.DropDownMenu;
var FlatButton = mui.FlatButton;

var PublicPosts = require('./PublicPosts.jsx');
var Courses = require('../courses.js');

MarketPlace = React.createClass({
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
      courses: [{value: "1", label: "Loading..."}],
      course_selected: new Courses,
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
  render: function () {
  	var sortMethods = [
  		{ payload: "1", text: "Date: Newest to Oldest"},
  		{ payload: "2", text: "Date: Oldest to Newest"},
  		{ payload: "3", text: "Price: Low to High"},
  		{ payload: "4", text: "Price: High to Low"},
  	];
    var searchOptions = this.state.courses;
  	return (
  		<div id="marketplace">
        <Select
          name="form-field-name"
          value="Please type the course name or use the dropdown menu"
          options={searchOptions}
          onChange={this.searchChange}
          searchable={true}/>
  			<Toolbar> 
  				<ToolbarGroup key={0} float="left">
  					<DropDownMenu menuItems={sortMethods} />
  				</ToolbarGroup>
  				<ToolbarGroup key={1} float="right">
	  				<ToolbarSeparator/>
		  			<FlatButton
				 		containerElement={<Link to="/sell" />}
				 		linkButton={true}
				 		label={('no', 'Sell')}/>
  				</ToolbarGroup>
			 	</Toolbar>
  			<PublicPosts origin={this.props.origin} course_selected={this.state.course_selected}/>
  		</div>
  	)
  }
});

module.exports = MarketPlace;
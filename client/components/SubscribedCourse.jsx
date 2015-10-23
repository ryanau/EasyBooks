var React = require('react');
var $ = require('jquery');

var mui = require('material-ui');
var ThemeManager = new mui.Styles.ThemeManager();
var Toggle = mui.Toggle;

SubscribedCourse = React.createClass({
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
			display: "YES",
		}
	},
	componentDidMount: function () {

	},
	handleToggle: function () {
		var course = [];
		course.push(this.props.course.course.department);
		course.push(this.props.course.course.course_number);
		this.props.subscriptionBasket.addToCourses(course);
		if (this.state.display === "NO") {
		  this.setState({
		    display: "YES"
		  });
		} else {
		  this.setState({
		    display: "NO"
		  })
		};
	},
	render: function () {
		var course = this.props.course
		return (
			<div>
				<p>{course.course.department + ' ' + course.course.course_number}</p>

				<Toggle
				  ref="toggle"
				  onToggle={this.handleToggle}
				  defaultToggled={true}
				  label={this.state.display}/>
			</div>
		)
	}
});

module.exports = SubscribedCourse;
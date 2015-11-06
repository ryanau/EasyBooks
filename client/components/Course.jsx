var React = require('react');
var $ = require('jquery');
var Dropzone = require('react-dropzone');

var mui = require('material-ui');
var ThemeManager = new mui.Styles.ThemeManager();
var Toggle = mui.Toggle;

Course = React.createClass({
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
			display: true,
		}
	},
	componentDidMount: function () {
		this.preLoad();
	},
	preLoad: function () {
		this.props.courseBasket.addToCourses(this.props.course)
	},
	handleToggle: function () {
		this.props.courseBasket.addToCourses(this.props.course)
		this.state.display? this.setState({display: false}) : this.setState({display: true})
	},
	render: function () {
		course = this.props.course
		return (
			<div>
				<p>{course[0] + " " + course[1]}</p>
				<Toggle
				  ref="toggle"
				  onToggle={this.handleToggle}
				  defaultToggled={true}
				  label={this.state.display}/>
		  </div>
		)
	},
});

module.exports = Course;
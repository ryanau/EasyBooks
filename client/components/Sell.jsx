var React = require('react');
var $ = require('jquery');
var Router = require('react-router');
var Navigation = Router.Navigation;
var Link = Router.Link;

var mui = require('material-ui');
var ThemeManager = new mui.Styles.ThemeManager();
var TextField = mui.TextField;
var DropDownMenu = mui.DropDownMenu;
var FlatButton = mui.FlatButton;

Sell = React.createClass({
	mixins: [ Navigation ],
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
			title: "",
			price: "",
			pickup: "",
			courses: [{payload: "1", text: "Loading"}],
			course_id: "1",
			warning: "",
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
			headers: {'Authorization': localStorage.getItem('jwt')},
			success: function (response) {
				this.setState({
					courses: response.courses
				});
			}.bind(this),
			error: function (error) {
				window.location = "/"
			}.bind(this),
		});
	},
	handleTitle: function (e) {
		this.setState({
			title: e.target.value
		})
	},
	handlePrice: function (e) {
		this.setState({
			price: e.target.value
		})
	},
	handlePickup: function (e) {
		this.setState({
			pickup: e.target.value
		})
	},
	handleDropDownMenu: function (e, selectedIndex, menuItem) {
		this.setState({
			course_id: menuItem.payload
		});
	},
	handleSubmit: function () {
		var data = {
			title: this.state.title,
			price: this.state.price,
			pickup: this.state.pickup,
			course_id: this.state.course_id,
		};
		if (data.title == "" || data.price == "" || data.pickup == "") {
			this.setState({
				warning: "Please fill out all required fields."
			});
		} else {
			$.ajax({
				url: this.props.origin + '/posts',
				type: 'POST',
				data: data,
				dataType: 'json',
				crossDomain: true,
				headers: {'Authorization': localStorage.getItem('jwt')},
				success: function (response) {
					this.transitionTo('/posts/' + response.post_id, {postId: response.post_id});
					// window.location = "/" + this.props.origin + '/posts/' + response.post_id
				}.bind(this),
				error: function (error) {
					window.location = "/"
				}.bind(this),
			});
		}
	},
  render: function () {
  	var courseList = this.state.courses;
  	var warning = this.state.warning;
  	return (
  		<div>
  			<h4>Sell</h4>
  			<TextField
  				onChange={this.handleTitle}
  			  floatingLabelText="Title" 
  			  hintText="Required"/>
  			<div>
  			<TextField
  				onChange={this.handlePrice}
  			  floatingLabelText="Price" 
  			  hintText="Required"/>
  			</div>
  			<div>
  			<TextField
  				onChange={this.handlePickup}
  			  floatingLabelText="Pick Up Location" 
  			  hintText="Required"/>
  			</div>
  			<div>
  			<DropDownMenu menuItems={courseList} autoScrollBodyContent={true} onChange={this.handleDropDownMenu}/>
  			</div>
  			<div>
  			<FlatButton
  			  label="Sell Book"
  			  onClick={this.handleSubmit}/>
  			</div>
  			{warning}
  		</div>
  	)
  }
});

module.exports = Sell;
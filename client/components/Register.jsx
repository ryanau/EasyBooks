var React = require('react');
var $ = require('jquery');

var mui = require('material-ui');
var ThemeManager = new mui.Styles.ThemeManager();
var DropDownMenu = mui.DropDownMenu;

var Input = require('react-bootstrap').Input;
var Button = require('react-bootstrap').Button;
var ButtonToolbar = require('react-bootstrap').ButtonToolbar;

Register = React.createClass({
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
			email: "",
			phone: "",
			university: "1",
			universities: [{payload: "1", text: "Loading"}],
			warning: "",
		}
	},
	componentDidMount: function () {
		this.loadUniversities();
	},
	loadUniversities: function () {
		$.ajax({
			url: this.props.origin + '/universities',
			type: 'GET',
			dataType: 'json',
			success: function (response) {
				universities = response.data
				this.setState({
					universities: universities,
				});
			}.bind(this),
			error: function (error) {
				window.location = "/"
			}.bind(this),
		});
	},
	handleChange: function (e) {
		this.setState({
		  email: this.refs.email.getValue(),
		  phone: this.refs.phone.getValue(),
		});
	},
	handleSubmit: function () {
		var data = {
			id: this.props.currentUser.id,
			email: this.state.email,
			phone: this.state.phone,
			university: this.state.university,
		};
		if (data.email == "" || data.phone == "") {
			this.setState({
				warning: "Please fill out all required fields."
			});
		} else if (this.validatePhone() == 'success' && this.validateEmail() == 'success') {
			$.ajax({
				url: this.props.origin + '/register',
				type: 'POST',
				data: data,
				dataType: 'json',
				success: function (response) {
					window.location = "/"
					console.log('completed registration');
				}.bind(this),
				error: function (error) {
					window.location = "/"
				}.bind(this),
			});
		} else {
			this.setState({
				warning: "The input format is not correct."
			});
		}
	},
	handleDropDownMenu: function (e, selectedIndex, menuItem) {
		this.setState({
			university: menuItem.payload
		});
	},
	validatePhone: function () {
	  var length = this.state.phone.length;
	  var content = this.state.phone;
	  if (length == 10 && content.match(/^[0-9]*$/)) {
	  	return 'success';
	  } else {
	  	return 'error';
	  }
	},
	validateEmail: function () {
		var content = this.state.email;
		if (content.match(/^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.+-]+\.edu$/)) {
			return 'success';
		} else {
			return 'error';
		}
	},
	render: function () {
		var universityList = this.state.universities;
		if (this.state.warning != "") {
			var warning = this.state.warning;
		}
		if (this.state.phone.length > 0) {
			var dropdown = 
			<div>
				<h5><strong>Select University</strong></h5>
				<DropDownMenu menuItems={universityList} autoScrollBodyContent={true} onChange={this.handleDropDownMenu}/>
			</div>
		}
		return (
			<div className="container col-md-8 col-md-offset-2">
  			<Input
	        type="text"
	        value={this.state.phone}
	        placeholder="e.g. 1238963300"
	        label="Phone Number"
	        help="Required"
	        bsStyle={this.validatePhone()}
	        hasFeedback
	        ref="phone"
	        groupClassName="group-class"
	        labelClassName="label-class"
	        onChange={this.handleChange} />
				<Input
	        type="email"
	        value={this.state.email}
	        placeholder="e.g. example@university.edu"
	        label="School Email (.edu)"
	        help="Required"
	        bsStyle={this.validateEmail()}
	        hasFeedback
	        ref="email"
	        groupClassName="group-class"
	        labelClassName="label-class"
	        onChange={this.handleChange} />
	        {dropdown}
	      <ButtonToolbar>
		      <Button onClick={this.handleSubmit} bsStyle="success">Complete Registration</Button>
	      </ButtonToolbar>
				{warning}
			</div>
		);
	},
});

module.exports = Register;
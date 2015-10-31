var React = require('react');
var $ = require('jquery');

var mui = require('material-ui');
var ThemeManager = new mui.Styles.ThemeManager();
var DropDownMenu = mui.DropDownMenu;

var Input = require('react-bootstrap').Input;
var Button = require('react-bootstrap').Button;
var ButtonToolbar = require('react-bootstrap').ButtonToolbar;
var Alert = require('react-bootstrap').Alert;
var Col = require('react-bootstrap').Col;
var Panel = require('react-bootstrap').Panel;

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
			warning: null,
			promo: "",
			isLoading: false,
			codeMessage: null,
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
	handleChange: function () {
		this.setState({
			email: this.refs.email.getValue(),
		  phone: this.refs.phone.getValue(),
		  promo: this.refs.promo.getValue().toUpperCase(),
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
	// findSchool: function (email) {
	// 	if (this.state.email.match(/^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.+-]+\.edu$/)) {
	// 		var data = {
	// 			university: email,
	// 		}
	// 		$.ajax({
	// 			url: this.props.origin + '/universities/find_school',
	// 			type: 'GET',
	// 			data: data,
	// 			dataType: 'json',
	// 			crossDomain: true,
	// 			headers: {'Authorization': localStorage.getItem('jwt-easybooks')},
	// 			success: function (response) {
	// 				if (response.id != 0) {
	// 					this.setState({
	// 						university: response.id,
	// 						checked: true
	// 					})
	// 				}
	// 			}.bind(this),
	// 			error: function (error) {
	// 				window.location = "/"
	// 			}.bind(this),
	// 		})
	// 	}
	// },
	submitPromo: function () {
		var data = {
			promo: this.state.promo,
		}
		this.setState({
			isLoading: true,
		})
		$.ajax({
			url: this.props.origin + '/promo/verify',
			type: 'GET',
			data: data,
			dataType: 'json',
			crossDomain: true,
			headers: {'Authorization': localStorage.getItem('jwt-easybooks')},
			success: function (response) {
				this.setState({
					isLoading: false,
					codeMessage: response.message,
				})
			}.bind(this),
			error: function (error) {
				window.location = "/"
			}.bind(this),
		})
	},
	render: function () {
		var universityList = this.state.universities;
		if (this.state.warning != "") {
			var warning = this.state.warning;
		}
		if (this.state.university == 1) {
			var university = 
			<h4>University of California, Berkeley</h4>
		}
  	if (this.state.warning != null) {
  		var warning =
			<Alert bsStyle="danger">
				<h4>Error!</h4>
		  	<p>{this.state.warning}</p>
		  </Alert>
  	}
  	if (this.state.phone.length > 0) {
  		var dropdown = 
  		<div>
  			<h5><strong>Select University</strong></h5>
  			<DropDownMenu menuItems={universityList} autoScrollBodyContent={true} onChange={this.handleDropDownMenu}/>
  		</div>
  	}
  	var infoBox = 
  		<Alert bsStyle="info">
  			<h4>Why school email and phone number?</h4>
  			<p>A school (.edu) email is needed for verification purposes so we can create a safe community marketplace for everyone!</p>
  	  	<p>A valid phone number is needed for a fast textbook buying/selling experience brought to you by EasyBooks!</p>
  	  </Alert>
  	if (this.state.codeMessage != null) {
  		var codeStatus = 
  			<Alert bsStyle="info">
  				<h5>{this.state.codeMessage}</h5>
  			</Alert>
		}
		return (
			<div className="container col-md-8 col-md-offset-2">
				{warning}
				{infoBox}
  			<Input
	        type="text"
	        value={this.state.phone}
	        placeholder="e.g. 5108963300"
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
        <Panel header="Promo Code" bsStyle="primary">
        <Col lg={8} md={8} s={8} xs={8}>
				<Input
	        type="text"
	        value={this.state.promo}
	        placeholder="Optional"
	        hasFeedback
	        ref="promo"
	        groupClassName="group-class"
	        labelClassName="label-class"
	        onChange={this.handleChange} />
	      </Col>
	      <Col lg={4} md={4} s={4} xs={4}>
	      <Button 
	      	disabled={this.state.isLoading}
	      	onClick={!this.state.isLoading ? this.submitPromo : null}>{this.state.isLoading ? 'Applying...' : 'Apply'}</Button>
	      </Col>
	      <Col lg={12} md={12} s={12} xs={12}>
	      {codeStatus}
	      </Col>
	      </Panel>
	      <ButtonToolbar className="mT10">
		      <Button onClick={this.handleSubmit} bsStyle="success">Complete Registration</Button>
	      </ButtonToolbar>
			</div>
		);
	},
});

module.exports = Register;
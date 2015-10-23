var React = require('react');
var $ = require('jquery');

var mui = require('material-ui');
var ThemeManager = new mui.Styles.ThemeManager();
var RaisedButton = mui.RaisedButton;
var TextField = mui.TextField;
var DropDownMenu = mui.DropDownMenu;

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
	handleEmail: function (e) {
		this.setState({
			email: e.target.value
		})
	},
	handlePhone: function (e) {
		this.setState({
			phone: e.target.value
		})
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
		} else {
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
		};
	},
	handleDropDownMenu: function (e, selectedIndex, menuItem) {
		this.setState({
			university: menuItem.payload
		});
	},
	render: function () {
		var universityList = this.state.universities;
		if (this.state.warning != "") {
			var warning = this.state.warning;
		}
		return (
			<div>
				<div>
				<DropDownMenu menuItems={universityList} autoScrollBodyContent={true} onChange={this.handleDropDownMenu}/>
				</div>
				<div>
				<TextField
					onChange={this.handlePhone}
				  floatingLabelText="Phone Number" 
				  hintText="Required"/>
				</div>
				<div>
				<TextField
					onChange={this.handleEmail}
				  floatingLabelText="Email" 
				  hintText="Required"/>
				</div>
				<RaisedButton
				  label="Complete Registration"
				  onClick={this.handleSubmit}/>
				{warning}
			</div>
		);
	},
});

module.exports = Register;
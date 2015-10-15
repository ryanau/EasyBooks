var React = require('react');
var $ = require('jquery');
var Router = require('react-router');
var Navigation = Router.Navigation;
var Link = Router.Link;
var Dropzone = require('react-dropzone');
var Select = require('react-select');

var mui = require('material-ui');
var ThemeManager = new mui.Styles.ThemeManager();
var TextField = mui.TextField;
var DropDownMenu = mui.DropDownMenu;
var FlatButton = mui.FlatButton;
var Paper = mui.Paper;
var LinearProgress = mui.LinearProgress;

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
			title: '',
			price: '',
			pickup: '',
			description: '',
			condition: '',
			course_selected: null,
			warning: null,
			pic_file: null,
			pic_url: null,
			uploading: null,
			courses: [{value: "1", label: "Loading..."}],
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
	handleTitle: function (e) {
		this.setState({
			title: e.target.value
		});
	},
	handlePrice: function (e) {
		this.setState({
			price: e.target.value
		});
	},
	handlePickup: function (e) {
		this.setState({
			pickup: e.target.value
		});
	},
	handleDescription: function (e) {
		this.setState({
			description: e.target.value
		});
	},
	handleCondition: function (e, selectedIndex, menuItem) {
		this.setState({
			condition: menuItem.text,
		});
	},
	searchChange: function (value) {
		this.setState({
			course_selected: value,
		});
	},
	onDrop: function (file) {
		this.setState({
			uploading: true,
		});
		var data = new FormData();
		data.append("pic_file", file[0]);
		$.ajax({
			url: this.props.origin + '/image_upload',
			type: 'POST',
			data: data,
			dataType: 'json',
			processData: false,
			contentType: false,
			crossDomain: true,
			headers: {'Authorization': localStorage.getItem('jwt-easybooks'),
			},
			success: function (response) {
				this.setState({
					pic_file: file,
					pic_url: response.pic_url,
					uploading: false,
				})
			}.bind(this),
			error: function (error) {
				window.location = "/"
			}.bind(this),
		});
	},
	handleSubmit: function () {
		var data = {
			title: this.state.title,
			price: this.state.price,
			pickup: this.state.pickup,
			course_selected: this.state.course_selected,
			pic_url: this.state.pic_url,
			description: this.state.description,
			condition: this.state.condition,
		};
		if (data.title == '' || data.price == '' || data.pickup == '' || data.description == '' || data.condition == '') {
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
				headers: {'Authorization': localStorage.getItem('jwt-easybooks')},
				success: function (response) {
					this.transitionTo('/posts/' + response.post_id, {postId: response.post_id});
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
  	var conditions = [
  		{ payload: '1', text: 'Select Condition'},
	  	{ payload: '2', text: 'New' },
	  	{ payload: '3', text: 'Like New' },
	  	{ payload: '4', text: 'Good' },
	  	{ payload: '5', text: 'Fair' },
  	];
  	if (this.state.pic_file != null) {
  		var picPreview = <img src={this.state.pic_file[0].preview} />
  	}
  	if (this.state.uploading == true) {
  		var uploadingProgress = <LinearProgress mode="indeterminate" />
  	} else if (this.state.uploading == null) {
  		var uploadingProgress = 
				<Paper zDepth={2}>
					<Dropzone onDrop={this.onDrop} multiple={false}>
	          <div><h3>Drag or click here to upload your pictures</h3></div>
	        </Dropzone>
				</Paper>
  	}
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
  			<TextField
  				onChange={this.handleDescription}
  			  floatingLabelText="Description" 
  			  hintText="Required"/>
  			</div>
  			<div>
  			<DropDownMenu menuItems={conditions} onChange={this.handleCondition}/>
  			</div>
  			<div>
  			<Select
  			  name="form-field-name"
  			  value="Please type the course name or use the dropdown menu"
  			  options={courseList}
  			  onChange={this.searchChange}
  			  searchable={true}/>
  			</div>
  			<div>
					{uploadingProgress}
  			</div>
  			<div>{picPreview}</div>
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
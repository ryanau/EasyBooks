var React = require('react');
var $ = require('jquery');
var Router = require('react-router');
var Navigation = Router.Navigation;
var Link = Router.Link;
var Dropzone = require('react-dropzone');
var Select = require('react-select');

var mui = require('material-ui');
var ThemeManager = new mui.Styles.ThemeManager();
var DropDownMenu = mui.DropDownMenu;
var Paper = mui.Paper;
var LinearProgress = mui.LinearProgress;

var Input = require('react-bootstrap').Input;
var MenuItem = require('react-bootstrap').MenuItem;
var Dropdown = require('react-bootstrap').Dropdown;
var Button = require('react-bootstrap').Button;
var Panel = require('react-bootstrap').Panel;

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
			condition: "Good",
			course_selected: null,
			warning: null,
			pic_file: null,
			pic_url: null,
			uploading: null,
			courses: [{value: "1", label: "Loading..."}],
			isLoading: false,
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
		this.setState({
			course_selected: value,
		});
	},
	onDrop: function (file) {
		var extension = file[0].name.split('.').pop()
		if ( extension == "jpg" || extension == "jpeg" || extension == "png") {
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
		} else {
			alert("Only image file with extension of .jpg, .png, .jpeg is allowed!")
		}
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
		if (data.title == '' || data.price == '' || data.condition == '') {
			this.setState({
				warning: "Please fill out all required fields."
			});
		} else if (this.validateTitle() == 'success' && this.validatePrice() == 'success'){
			this.setState({
				isLoading: true,
			})
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
		} else {
			this.setState({
				warning: "The input format is not correct."
			});
		}
	},
	handleChange: function () {
	  this.setState({
	    title: this.refs.title.getValue(),
	    description: this.refs.description.getValue(),
	    price: this.refs.price.getValue(),
	    pickup: this.refs.pickup.getValue(),
	  });
	},
	validateTitle: function () {
	  var length = this.state.title.length;
	  if (length > 0) {
	  	return 'success';
	  } else {
	  	return 'error';
	  }
	},
	validatePrice: function () {
		var length = this.state.price.length;
		var content = this.state.price;
		if (length > 0 && content.match(/^[0-9]*$/)) {
			return 'success';
		} else {
			return 'error';
		}
	},
	changeCondition: function (e) {
		this.setState({
			condition: e.target.innerHTML,
		})
	},
  render: function () {
  	var courseList = this.state.courses;
  	var warning = this.state.warning;
  	if (this.state.pic_file != null) {
  		var picPreview = <img src={this.state.pic_file[0].preview} />
  	}
  	if (this.state.uploading == true) {
  		var uploadingProgress = <LinearProgress mode="indeterminate" />
  	} else if (this.state.uploading == null) {
  		var uploadingProgress = 
				<Dropzone onDrop={this.onDrop} className="dropzone" activeClassName="dropzone_active" multiple={false}>
	        <div><h5>Drag or click here to upload your picture for the book (ONE only)</h5></div>
	      </Dropzone>
  	}
  	return (
  		<div className="container col-md-8 col-md-offset-2">
	  			<form className="form-horizontal">
		  			<Input
			        type="text"
			        value={this.state.title}
			        placeholder="e.g. Stats20 Textbook"
			        label="Book Name"
			        help="Required"
			        bsStyle={this.validateTitle()}
			        hasFeedback
			        ref="title"
			        groupClassName="group-class"
			        labelClassName="label-class"
			        onChange={this.handleChange} />
		  			<Input
			        type="text"
			        value={this.state.price}
			        placeholder="e.g. 36"
			        addonBefore="$" 
			        addonAfter=".00"
			        label="Price"
			        help="Required"
			        bsStyle={this.validatePrice()}
			        hasFeedback
			        ref="price"
			        groupClassName="group-class"
			        labelClassName="label-class"
			        onChange={this.handleChange} />
		  			<Input
			        type="text"
			        value={this.state.description}
			        placeholder="e.g. slightly highlighted, international edition"
			        label="Description"
			        help="Optional"
			        hasFeedback
			        ref="description"
			        groupClassName="group-class"
			        labelClassName="label-class"
			        onChange={this.handleChange} />
						<Input
			        type="text"
			        value={this.state.pickup}
			        placeholder="e.g. Unit 1"
			        label="Pick Up Location"
			        help="Optional"
			        hasFeedback
			        ref="pickup"
			        groupClassName="group-class"
			        labelClassName="label-class"
			        onChange={this.handleChange} />
			      <h5><strong>Select Condition</strong></h5>
		  			<Dropdown id="condition">
		  				<Dropdown.Toggle>
		  			  	{this.state.condition}
		  			  </Dropdown.Toggle>
				      <Dropdown.Menu>
				        <MenuItem eventKey="1" onSelect={this.changeCondition}>New</MenuItem>
				        <MenuItem eventKey="2" onSelect={this.changeCondition}>Like New</MenuItem>
				        <MenuItem eventKey="3" onSelect={this.changeCondition}>Good</MenuItem>
				        <MenuItem eventKey="4" onSelect={this.changeCondition}>Fair</MenuItem>
				      </Dropdown.Menu>
				    </Dropdown>
		  			<h5><strong>Select Course Name</strong></h5>
		  			<Select
		  			  name="form-field-name"
		  			  value="Type the course name or click the dropdown button on the right"
		  			  options={courseList}
		  			  onChange={this.searchChange}
		  			  searchable={true}/>
		  			<div>
							{uploadingProgress}
		  			</div>
		  			<div>{picPreview}</div>
		  			<div>
		  			<Button
			        bsStyle="primary"
			        disabled={this.state.isLoading}
			        onClick={!this.state.isLoading ? this.handleSubmit : null}>
			        {this.state.isLoading ? 'Putting it on the rack...' : 'Sell Book'}
			      </Button>
		  			</div>
		  			{warning}
	  			</form>
  		</div>
  	)
  }
});

module.exports = Sell;
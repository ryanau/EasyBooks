var React = require('react');
var $ = require('jquery');
var Router = require('react-router');
var Navigation = Router.Navigation;
var Link = Router.Link;
var Dropzone = require('react-dropzone');
var Select = require('react-select');
var TimerMixin = require('react-timer-mixin');

var mui = require('material-ui');
var ThemeManager = new mui.Styles.ThemeManager();
var DropDownMenu = mui.DropDownMenu;
var Paper = mui.Paper;
var LinearProgress = mui.LinearProgress;
var Snackbar = mui.Snackbar;

var Input = require('react-bootstrap').Input;
var MenuItem = require('react-bootstrap').MenuItem;
var Dropdown = require('react-bootstrap').Dropdown;
var Button = require('react-bootstrap').Button;
var Panel = require('react-bootstrap').Panel;
var Alert = require('react-bootstrap').Alert;
var Col = require('react-bootstrap').Col;
var PageHeader = require('react-bootstrap').PageHeader;
var Row = require('react-bootstrap').Row;
var ButtonToolbar = require('react-bootstrap').ButtonToolbar;
var Popover = require('react-bootstrap').Popover;
var OverlayTrigger = require('react-bootstrap').OverlayTrigger;

var VenmoAuthorizationSell = require('./VenmoAuthorizationSell.jsx');

var ReactRouterBootstrap = require('react-router-bootstrap')
  , ButtonLink = ReactRouterBootstrap.ButtonLink

Sell = React.createClass({
	mixins: [ Navigation, TimerMixin ],
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
			sell_status: null,
			error_message: null,
			author: '',
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
			venmoAuthorized: false,
		}
	},
	componentDidMount: function () {
		if (this.props.currentUser.venmo_linked || sessionStorage.getItem('venmo_link') == "true") {
			this.loadSellEligible();
			this.loadCourses();
			this.loadCreditCount();
		}
	},
	loadCreditCount: function () {
		$.ajax({
		  url: this.props.origin + '/credits/count',
		  type: 'GET',
		  dataType: 'json',
		  crossDomain: true,
		  headers: {'Authorization': localStorage.getItem('jwt-easybooks')},
		  success: function (response) {
		    this.setState({
		    	credit_count: response.credit_count,
		    });
		  }.bind(this),
		  error: function (error) {
		    window.location = "/"
		  }.bind(this),
		});	
	},
	loadUserVenmoStatus: function () {
		$.ajax({
		  url: this.props.origin + '/venmo_status',
		  type: 'GET',
		  dataType: 'json',
		  crossDomain: true,
		  headers: {'Authorization': localStorage.getItem('jwt-easybooks')},
		  success: function (response) {
		    if (response.status) {
		    	this.setState({venmoAuthorized: true});
		    	sessionStorage.setItem('venmo_link', true);
		    	this.loadSellEligible();
		    	this.loadCourses();
		    }
		  }.bind(this),
		  error: function (error) {
		    window.location = "/"
		  }.bind(this),
		});
	},
	loadSellEligible: function () {
		$.ajax({
			url: this.props.origin + '/sell_status',
			type: 'GET',
			dataType: 'json',
			crossDomain: true,
			headers: {'Authorization': localStorage.getItem('jwt-easybooks')},
			success: function (response) {
				this.setState({
					sell_status: response.status,
					error_message: response.error_message,
				});
			}.bind(this),
			error: function (error) {
				window.location = "/"
			}.bind(this),
		});
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
			author: this.state.author,
			price: Math.ceil((this.state.price * 1.039 + 0.75)*100)/100,
			pickup: this.state.pickup,
			course_selected: this.state.course_selected,
			pic_url: this.state.pic_url,
			description: this.state.description,
			condition: this.state.condition,
		};
		if (data.author == '' || data.title == '' || data.price == '' || data.condition == '' || data.course_selected == null) {
			this.setState({
				warning: "Please fill out all required fields. Did you select the Course?"
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
					this.refs.postCreated.show();
					this.setTimeout(function () {
						this.transitionTo('/posts/' + response.post_id, {postId: response.post_id});
					}, 1000)
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
	    author: this.refs.author.getValue(),
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
	validateAuthor: function () {
	  var length = this.state.author.length;
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
  	if (this.state.venmoAuthorized || sessionStorage.getItem('venmo_link') == "true" || this.props.currentUser.venmo_linked) {
	   	if (this.state.sell_status == null) {
	  			var warning = "Loading..."
	   	} else if (this.state.sell_status) {
	   		var warning =
	 			<Alert bsStyle="danger">
	 				<h4>Error!</h4>
	 		  	<p>{this.state.error_message}</p>
	 		  	<p><ButtonLink bsStyle="primary" to="/profile">Buy more credit</ButtonLink></p>
	 		  </Alert>
	 	  } else {
	 	  	var courseList = this.state.courses;
	 	  	if (this.state.warning != null) {
	 	  		var warning =
	 				<Alert bsStyle="danger">
	 					<h4>Error!</h4>
	 			  	<p>{this.state.warning}</p>
	 			  </Alert>
	 	  	}
	 	  	if (this.state.pic_file != null) {
	 	  		var picPreview = <img src={this.state.pic_file[0].preview} />
	 	  	}
	 	  	if (this.state.uploading == true) {
	 	  		var uploadingProgress = <LinearProgress mode="indeterminate" />
	 	  	} else if (this.state.uploading == null) {
	 	  		var uploadingProgress = 
	 	  			<div>
	 	  			<h5>Picture Uploader (Optional)</h5>
	 					<Dropzone onDrop={this.onDrop} className="dropzone" activeClassName="dropzone_active" multiple={false}>
	 		        <div><h5>Drag or click here to upload your picture for the book (ONE only)</h5></div>
	 		      </Dropzone>
	 		      </div>
	 	  	}
	 	  	var price_tooltip = <Popover title="Listing price reflects the 3.9% + $0.75 processing fee">But don't worry you'll still make <strong>${this.state.price}</strong> for your book!</Popover>
	 	  	var body = 
	 	  	<div>
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
			    <div className="mB10">
					<h5><strong>Select Course Name</strong></h5>
					<Select
						placeholder="Select or type the course name"
					  name="form-field-name"
					  value={this.state.course_selected}
					  options={courseList}
					  onChange={this.searchChange}
					  searchable={true}/>
					</div>
	 				<Input
	 	        type="text"
	 	        value={this.state.title}
	 	        placeholder="e.g. Introduction to Statistics"
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
	 	        value={this.state.author}
	 	        placeholder="e.g. Freedman, Pisani, and Purves"
	 	        label="Author"
	 	        help="Required"
	 	        bsStyle={this.validateAuthor()}
	 	        hasFeedback
	 	        ref="author"
	 	        groupClassName="group-class"
	 	        labelClassName="label-class"
	 	        onChange={this.handleChange} />
	 				<Input
	 					type="text"
	 	        value={this.state.price}
	 	        placeholder="e.g. 36"
	 	        addonBefore="$" 
	 	        addonAfter=".00"
	 	        label="How much do you want to make from your book?"
	 	        help="Required"
	 	        bsStyle={this.validatePrice()}
	 	        hasFeedback
	 	        ref="price"
	 	        groupClassName="group-class"
	 	        labelClassName="label-class"
	 	        onChange={this.handleChange} />
	 	      <ButtonToolbar>
	 	        <OverlayTrigger placement="top" overlay={price_tooltip} trigger="hover">
	            <Button>Including the processing fee, it will be listed for: ${Math.ceil((this.state.price * 1.039 + 0.75)*100)/100}</Button>
	          </OverlayTrigger>
          </ButtonToolbar>
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
	 				<div>
	 					{uploadingProgress}
	 				</div>
	 				<div>{picPreview}</div>
	 				<div>
	 				<ButtonToolbar className="mT10">
	 				<Button
	 	        bsStyle="primary"
	 	        disabled={this.state.isLoading}
	 	        onClick={!this.state.isLoading ? this.handleSubmit : null}>
	 	        {this.state.isLoading ? 'Putting it on the rack...' : 'Sell Book'}
	 	      </Button>
	 	      </ButtonToolbar>
	 	      </div>
	 			</div>
	 		}
   	} else {
  		var body = <VenmoAuthorizationSell loadUserVenmoStatus={this.loadUserVenmoStatus} origin={this.props.origin}/>
	  }
	  if (this.state.credit_count == null) {
	  	var creditCount = "Loading credit..."
	  } else {
	  	var creditCount = 'Remaining credit: ' + this.state.credit_count;
	  }
  	return (
  		<div className="container col-md-8 col-md-offset-2">
	  		<Snackbar
	  		  ref="postCreated"
	  		  message='Post Created! Redirecting...'
	  		  autoHideDuration={1000}/>
	  		<PageHeader>Make a Sell Post <small>{creditCount}</small></PageHeader>
  				{warning}
  				{body}
  		</div>
  	)
  }
});

module.exports = Sell;
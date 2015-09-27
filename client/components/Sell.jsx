var React = require('react');
var $ = require('jquery');
var Router = require('react-router');
var Navigation = Router.Navigation;
var Link = Router.Link;
var Dropzone = require('react-dropzone');

var mui = require('material-ui');
var ThemeManager = new mui.Styles.ThemeManager();
var TextField = mui.TextField;
var DropDownMenu = mui.DropDownMenu;
var FlatButton = mui.FlatButton;
var Paper = mui.Paper;

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
			pic_file: null,
			pic_url: null,
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
	onDrop: function (file) {
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
			headers: {'Authorization': localStorage.getItem('jwt'),
			},
			success: function (response) {
				console.log(response);
				this.setState({
					pic_file: file,
					pic_url: response.pic_url,
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
			course_id: this.state.course_id,
			pic_url: this.state.pic_url,
		};
		console.log(data)
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
					debugger
					window.location = "/"
				}.bind(this),
			});
		}
	},
  render: function () {
  	var courseList = this.state.courses;
  	var warning = this.state.warning;
  	if (this.state.pic_file != null) {
  		var picPreview = <img src={this.state.pic_file[0].preview} />
  		console.log(this.state.pic_file)
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
					<Paper zDepth={2}>
						<Dropzone onDrop={this.onDrop} multiple={false}>
		          <div><h3>Drag or click here to upload your pictures</h3></div>
		        </Dropzone>
					</Paper>
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
  			<div>{picPreview}</div>
  		</div>
  	)
  }
});

module.exports = Sell;
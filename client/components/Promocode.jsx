var React = require('react');
var $ = require('jquery');

var Input = require('react-bootstrap').Input;
var Button = require('react-bootstrap').Button;
var Alert = require('react-bootstrap').Alert;
var Col = require('react-bootstrap').Col;
var Panel = require('react-bootstrap').Panel;

Promocode = React.createClass({
	getInitialState: function () {
		return {
			promo: "",
			isLoading: false,
			codeMessage: null,
		}
	},
	handleChange: function () {
		this.setState({
		  promo: this.refs.promo.getValue().toUpperCase(),
		});
	},
	submitPromo: function () {
		var data = {promo: this.state.promo,}
		this.setState({isLoading: true,})
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
  	if (this.state.codeMessage != null) {
  		var codeStatus = 
  			<Alert bsStyle="info">
  				<h5>{this.state.codeMessage}</h5>
  			</Alert>
		}
		return (
			<div>
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
			</div>
		);
	},
});

module.exports = Promocode;
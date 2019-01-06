import React, { Component } from 'react';
import { validateField, isEmail, isEmpty, isSame } from '../validationFunctions'

export default class PeerRegistration extends Component{
	state = {
		form_inputs: {},
		errors: {},
		validations: {
			first_name: [isEmpty],
			last_name: [isEmpty],
			email: [isEmpty, isEmail],
			phone_number: [],
			password: [],
			confirm_password: [isSame("password")]
		}
	};

	updateErrors = (fieldValue, fieldName) => {
		let errors = validateField(this.state, fieldValue, fieldName);
		if(errors){
			this.setState({errors});
		}
	};

	// more generic version of handleChange so field name doesn't have to be specified in call
	handleChange = (e) => {
		let fieldValue = e.target.value;
		let fieldName = e.target.name;

		// TODO: hash password before storing in state and just check if the hashes are the same to confirm password
		// upon submit the real password can be sent over instead of the hash so server side can hash/encrpty it
		
		this.setState({ form_inputs: {...this.state.form_inputs, [fieldName] : fieldValue}}, this.updateErrors(fieldValue, fieldName));
	};

	handleSubmit = (e) => {
		e.preventDefault();

		// In the case that the user presses submit without entering any info, 
		// check that all required fields have a value upon submit
		// forms only validate fields when input field has been modified
		const requiredFields = ["first_name", "last_name", "email"];
		const errorMessage = "Input required.";
		let tempErrors = {}
		requiredFields.forEach((requiredField) => {
			let fieldValue = this.state.form_inputs[requiredField];
			if(!fieldValue){
				tempErrors[requiredField] = errorMessage;
			}
		});
		this.setState({errors: {...this.state.errors, ...tempErrors}}, () => {
			// TODO: check that there are no errors in state before letting data go through
			// note: the errors set here are not visible outside this callback since state isn't re-rendered
			// at predictable times (could be batched), so do check in this callback

			console.log(this.state)
		});


		// TODO: instead of using FormData use regular json - put the form info into json
		// OR add form info into state and pass that to fetch body...
		
		// const data = new FormData(e.target);
		// fetch("/register-peer", {
		// 	method: "POST",
		// 	body: data
		// });

		console.log(this.state);
	};

	// TODO: change the hours available to dynamic form - check off day of week to get the form to input time
	// have value of day of the week for checkbox input be number; save in state state an array of numbers for days available
	// render hours input fields based on list state - maybe make a new component
	render(){
		return(
			<div>
				<h1>Sign up to be a PEER!</h1>
				<form onSubmit={this.handleSubmit}>
					<p>* are required fields.</p>
					First Name* <input type="text" name="first_name" onChange={(e) => this.handleChange(e)} />
					{this.state.errors.first_name ? <p className="error-message">{this.state.errors.first_name}</p> : undefined}

					Last Name* <input type="text" name="last_name" onChange={(e) => this.handleChange(e)} /><br/>
					{this.state.errors.last_name ? <p className="error-message">{this.state.errors.last_name}</p> : undefined}

					Email* <input type="text" name="email" onChange={(e) => this.handleChange(e)} /><br/>
					{this.state.errors.email ? <p className="error-message">{this.state.errors.email}</p> : undefined}

					Cell* <input type="text" name="phone_number" /><br/>

					<div>
						<p>Hours Available*: </p>
						Sunday <input type="text" name="time_in_sun"/> to <input type="text" name="time_out_sun"/><br/>
						Monday <input type="text" name="time_in_mon"/> to <input type="text" name="time_out_mon"/><br/>
						Tuesday <input type="text" name="time_in_tue"/> to <input type="text" name="time_out_tue"/><br/>
						Wedensday <input type="text" name="time_in_wed"/> to <input type="text" name="time_out_wed"/><br/>
						Thursday <input type="text" name="time_in_thu"/> to <input type="text" name="time_out_thu"/><br/>
						Friday <input type="text" name="time_in_fri"/> to <input type="text" name="time_out_fri"/><br/>
						Saturday <input type="text" name="time_in_sat"/> to <input type="text" name="time_out_sat"/><br/>
					</div>

					<div>
						<p>Areas of Specialty: </p>
						<input type="checkbox" name="specialty0" value="0" />Drug intervention<br/>
						<input type="checkbox" name="specialty1" value="1" />Transportation<br/>
						<input type="checkbox" name="specialty2" value="2" />Housing<br/>
						<input type="checkbox" name="specialty3" value="3" />BH/MH<br/>
						<input type="checkbox" name="specialty4" value="4" />Suicide<br/>
						<input type="checkbox" name="specialty5" value="5" />SRPA<br/>
					</div>

					Password: <input type="password" name="password" />
					Confirm Password: <input type="password" name="confirm_password" onChange={(e) => this.handleChange(e)}/>
					<button className="submit_button">Submit</button>
				</form>
			</div>
		);
	};
}
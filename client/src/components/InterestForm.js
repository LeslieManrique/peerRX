import React, { Component } from 'react';
import { withRouter } from 'react-router-dom';
import { validateField, isEmail, isEmpty, isUserType, isPhoneNumber, allValid } from '../helper/validationFunctions';
import { sendFormInputs } from '../helper/serverConnectionFunctions';
import { cleanPhoneNumber } from '../helper/sanitizeUserInputFunctions'

class InterestForm extends Component{
	state = {
		form_inputs: {
			user_type: "",
			name: "",
			email: "",
			phone_number: ""
		},
		errors: {},
		validations: {
			user_type: [isUserType],
			name: [isEmpty],
			email: [isEmpty, isEmail],
			phone_number: [isPhoneNumber]
		}
	};

	// update state with error messages
	updateErrors = (fieldValue, fieldName) => {
		let errors = validateField(this.state, fieldValue, fieldName);
		if(errors){
			this.setState({errors});
		}
	};

	// save input in state
	handleChange = (e) => {
		const input_type = e.target.name;
		const new_value = e.target.value;
		this.setState(
			{ form_inputs: {...this.state.form_inputs, [input_type] : new_value}}, 
			this.updateErrors(new_value, input_type)
		);
	};

	handleSubmit = (e) => {
		e.preventDefault();

		// Forms only validate fields when input field has been modified so check all required fields input before sending request
		const requiredFields = ["user_type", "name", "email"];
		const errorMessage = "Input required.";
		let tempErrors = {}
		requiredFields.forEach((requiredField) => {
			let fieldValue = this.state.form_inputs[requiredField];
			if(!fieldValue){
				tempErrors[requiredField] = errorMessage;
			}
		});

		// send post request when there are no errors
		this.setState({errors: {...this.state.errors, ...tempErrors}}, () => {
			const currentErrors = allValid(this.state);
			if(currentErrors.length === 0){
				console.log(this.state.errors);

				// clean input data to be sent to server side
				let body = this.state.form_inputs;
				body.phone_number = cleanPhoneNumber(body.phone_number);

				// send data to server side
				const init = {
					method: "POST",
					body: JSON.stringify(body),
					headers: {"Content-Type": "application/json"}
				};
				sendFormInputs("/interest", init, () => {
					// redirect to thank you page after succesful post
					this.props.history.push("/thank_you");
				});
			}
		});
	};

	render(){
		return(
			<div>
				<h1>PeerRX Interest Form</h1>
				<h2>Sign up to get access to PeerRX upon release!</h2>

				<form id="interest_form" onSubmit={this.handleSubmit}>
					<p className="instructions">* are required fields</p>

					I am a ...
					<select name="user_type" value={this.state.form_inputs.user_type} onChange={this.handleChange}>
						<option value="" disabled>Select User Type</option>
						<option value="0">Peer</option>
						<option value="1">Peer Agency</option>
						<option value="2">Location</option>
					</select>
					{this.state.errors.user_type ? <p className="error-message">{this.state.errors.user_type}</p> : undefined}

					Name* <input type="text" name="name" onChange={this.handleChange} />
					{this.state.errors.name ? <p className="error-message">{this.state.errors.name}</p> : undefined}
					
					Email* <input type="text" name="email" onChange={this.handleChange} />
					{this.state.errors.email ? <p className="error-message">{this.state.errors.email}</p> : undefined}

					Phone Number <input type="text" name="phone_number" onChange={this.handleChange}/>
					{this.state.errors.phone_number ? <p className="error-message">{this.state.errors.phone_number}</p> : undefined}

					<button>Submit</button>
				</form>
			</div>
		);
	}
}

export default withRouter(InterestForm);
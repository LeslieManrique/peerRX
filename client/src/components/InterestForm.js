import React, { Component } from "react";
import ThankYouPage from "./ThankYouPage";
import { withRouter } from 'react-router-dom';

class InterestForm extends Component{
	state = {
		form_data: {
			user_type: "",
			name: "",
			email: "",
			phone_number: ""
		}
	};

	// save input in state
	handleChange = (e) => {
		const input_type = e.target.name;
		const new_value = e.target.value;
		this.setState({ form_data : { ...this.state.form_data, [input_type] : new_value}}, 
			() => {console.log(this.state.form_data)}
		);
	};

	handleSubmit = (e) => {
		e.preventDefault();

		// send data to server - how to test that it's being sent?
		fetch("/submit_interest", {
			method: "POST",
			body: JSON.stringify(this.state.form_data),
			headers: {"Content-Type": "application/json"}
		})
		.then(response => response.json())
		.then(response => {
			console.log('Success:', JSON.stringify(response));
			
			// redirect to thank you page after succesful post
			this.props.history.push("/thank_you");
		})
		.catch(error => console.error('Error:', error));
		
	};

	render(){
		return(
			<div>
				<h1>PeerRX Interest Form</h1>
				<h2>Sign up to get access to PeerRX upon release!</h2>

				<form onSubmit={this.handleSubmit}>
					<p className="instructions">* are required fields</p>

					I am a ...
					<select name="user_type" value={this.state.form_data.user_type} onChange={this.handleChange}>
						<option value="" disabled>Select User Type</option>
						<option value="0">Peer</option>
						<option value="1">Peer Agency</option>
						<option value="2">Location</option>
					</select>
					Name* <input type="text" name="name" onChange={this.handleChange} required/>
					Email* <input type="text" name="email" onChange={this.handleChange} required/>
					Phone Number <input type="text" name="phone_number" onChange={this.handleChange}/>
					<button>Submit</button>
				</form>
			</div>
		);
	}
}

export default withRouter(InterestForm);
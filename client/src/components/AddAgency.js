import React, { Component } from 'react';

export default class AddAgency extends Component{
	handleAddAgency = (e) => {
		e.preventDefault();

		const current_element = e.target.elements;
		const agency_info = {
			name: current_element.first_name.value.trim(),
			city: current_element.city.value.trim(),
			state: current_element.state.value.trim(),
			zipcode: current_element.zipcode.value.trim(),
			phone_number: current_element.phone_number.value.trim(),
			main_contact_name: current_element.main_contact_name.value.trim(),
			main_contact_email: current_element.main_contact_email.value.trim()
		};
	};

	render(){
		return(
			<div>
				<form onSubmit={this.handleAddAgency}>
					Name: <input type="text" name="first_name" required /><br/>
					City: <input type="text" name="city" required />
					State: <input type="text" name="state" required />
					Zip: <input type="number" name="zipcode" required /><br/>
					Telephone: <input type="text" name="phone_number" required/><br/>
					Main Contact Name <input type="text" name="main_contact_name" /><br/>
					Main Contact Email <input type="email" name="main_contact_email" /><br/>
					<button>Add Agency</button>
				</form>
			</div>
		);
	}
}
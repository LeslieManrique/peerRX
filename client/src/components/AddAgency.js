import React, { Component } from 'react';

export default class AddAgency extends Component{
	state = {
		name: "",
		city: "",
		state: "",
		zipcode: "",
		phone_number: "",
		main_contact_name: "",
		main_contact_email: ""
	};

	handleAddAgencyInfo = (input_type, e) => {
		this.setState({ [input_type] : e.target.value});
	};

	render(){
		return(
			<div>
				Name: <input type="text" name="agency_name" onChange={this.handleAddAgencyInfo.bind(this, "name")} required /><br/>
				City: <input type="text" name="agency_city" onChange={this.handleAddAgencyInfo.bind(this, "city")} required /><br/>
				State: <input type="text" name="agency_state" onChange={this.handleAddAgencyInfo.bind(this, "state")} required />
				Zip: <input type="number" name="agency_zipcode" onChange={this.handleAddAgencyInfo.bind(this, "zipcode")} required /><br/>
				Telephone: <input type="text" name="agency_phone_number" onChange={this.handleAddAgencyInfo.bind(this, "phone_number")} required/><br/>
				Main Contact Name <input type="text" name="main_contact_name" onChange={this.handleAddAgencyInfo.bind(this, "main_contact_name")} /><br/>
				Main Contact Email <input type="email" name="main_contact_email" onChange={this.handleAddAgencyInfo.bind(this, "main_contact_email")} /><br/>
				<button onClick={this.props.handleAdd.bind(this, this.state)}>Add Agency</button>
			</div>
		);
	}
}

import React, { Component } from 'react';
import AddAgency from "./AddAgency";

export default class LocationRegistration extends Component{
	// expected peer agency info {name:'', city:'', state:'', zipcode:'', phone_number:'', main_contact_name:'', main_contact_email:''}
	state = {
		peer_agencies: []
	};

	handleAdd = (new_agency, e) => {
		e.preventDefault();
		this.setState({ peer_agencies: this.state.peer_agencies.concat([new_agency])});
	};

	render(){
		return(
			<div>
				<h1>Sign up your LOCATION!</h1>
				<form method="POST" action="/register-location">
					Name: <input type="text" name="first_name" required /><br/>
					Address: <input type="text" name="address" required /><br/>
					City: <input type="text" name="city" required />
					State: <input type="text" name="state" required />
					Zip: <input type="number" name="zipcode" required /><br/>
					Telephone: <input type="text" name="phone_number" required/><br/>

					<div>
						<h2>Local Agencies:</h2>
						<div>
							{this.state.peer_agencies.map((agency, index) => (
								<div className="agency_info" key={index}>
									<h3>Agency #{index + 1}: {agency.name}</h3>
									<div className="address">
										<p className="city">{agency.city}</p>
										<p className="state">{agency.state}</p>
										<p className="zipcode">{agency.zipcode}</p>
									</div>
									<p className="phone_number">{agency.phone_number}</p>
									<p className="main_contact_name">{agency.main_contact_name ? "Main Contact: " + agency.main_contact_name: agency.main_contact_name}</p>
									<p className="main_contact_email">{agency.main_contact_email ? "Contact Email: " + agency.main_contact_email: agency.main_contact_email}</p>
								</div>
							))}
							<AddAgency handleAdd={this.handleAdd}/>
						</div>
					</div>

					<div>
						<p>Possible Peer Needs: </p>
						<input type="checkbox" name="specialty0" value="0" />Drug intervention<br/>
						<input type="checkbox" name="specialty1" value="1" />Transportation<br/>
						<input type="checkbox" name="specialty2" value="2" />Housing<br/>
						<input type="checkbox" name="specialty3" value="3" />BH/MH<br/>
					</div>

					Password: <input type="password" name="password" required />
					<input type="submit" />
				</form>
			</div>
		);
	};
}

import React, { Component } from 'react';
import AddAgency from "./AddAgency";

export default class LocationRegistration extends Component{
	state = {
		peer_agencies: []
	};

	handleAddAgency = (e) => {
		e.preventDefault();

		return (<AddAgency />);
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
						<p>Local Agencies:</p>
						<AddAgency />
						<button onClick={this.handleAddAgency}>Add New Agency</button>
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
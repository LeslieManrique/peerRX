import React, { Component } from 'react';

export default class AgencyRegistration extends Component{
	render(){
		return(
			<div>
				<h1>Sign up your AGENCY!</h1>
				<form method="POST" action="/register-agency">
					Name: <input type="text" name="first_name" required /><br/>
					Address: <input type="text" name="address" required /><br/>
					City: <input type="text" name="city" required />
					State: <input type="text" name="state" required />
					Zip: <input type="number" name="zipcode" required /><br/>
					Telephone: <input type="text" name="phone_number" required/><br/>

					<div>
						<p>Hours of Operation: </p>
						Sunday <input type="text" name="timeIn"/> to <input type="text" name="timeOut"/><br/>
						Monday <input type="text" name="timeIn"/> to <input type="text" name="timeOut"/><br/>
						Tuesday <input type="text" name="timeIn"/> to <input type="text" name="timeOut"/><br/>
						Wedensday <input type="text" name="timeIn"/> to <input type="text" name="timeOut"/><br/>
						Thursday <input type="text" name="timeIn"/> to <input type="text" name="timeOut"/><br/>
						Friday <input type="text" name="timeIn"/> to <input type="text" name="timeOut"/><br/>
						Saturday <input type="text" name="timeIn"/> to <input type="text" name="timeOut"/><br/>
					</div>

					Peers List: <input type="file" accept=".csv" name="peers_list" /><br/>
					<div>
						<p>Peer Services Administrated: </p>
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
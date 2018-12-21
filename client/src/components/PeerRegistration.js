import React, { Component } from 'react';

export default class PeerRegistration extends Component{
	render(){
		return(
			<div>
				<h1>Sign up to be a PEER!</h1>
				<form method="POST" action="/register-peer">
					First Name <input type="text" name="first_name" required/>
					Last Name <input type="text" name="last_name" required/><br/>
					Email <input type="email" name="email" required/><br/>
					Cell <input type="text" name="phone_number" required/><br/>

					<div>
						<p>Hours Available: </p>
						Sunday <input type="text" name="timeIn"/> to <input type="text" name="timeOut"/><br/>
						Monday <input type="text" name="timeIn"/> to <input type="text" name="timeOut"/><br/>
						Tuesday <input type="text" name="timeIn"/> to <input type="text" name="timeOut"/><br/>
						Wedensday <input type="text" name="timeIn"/> to <input type="text" name="timeOut"/><br/>
						Thursday <input type="text" name="timeIn"/> to <input type="text" name="timeOut"/><br/>
						Friday <input type="text" name="timeIn"/> to <input type="text" name="timeOut"/><br/>
						Saturday <input type="text" name="timeIn"/> to <input type="text" name="timeOut"/><br/>
					</div>

					<div>
						<p>Areas of Specialty: </p>
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
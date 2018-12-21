import React, { Component } from 'react';
import PeerRegistration from "./PeerRegistration";
import AgencyRegistration from "./AgencyRegistration";
import LocationRegistration from "./LocationRegistration";

export default class Registration extends Component{
	state = {
		user_type: "",
	};

	selectUserType = (e) => {
		const new_user_type = e.target.value;
		this.setState({user_type: new_user_type});
	};

	displayUserForm = (user_type) => {
		console.log(user_type)
		if(user_type === "0"){
			return(<PeerRegistration />);
		}
		else if(user_type === "1"){
			return(<AgencyRegistration />);
		}
		else if(user_type === "2"){
			return(<LocationRegistration />);
		}
		return(undefined);
	};

	render(){
		return(
			<div>
				I am a 
				<select name="user_type" value={this.state.user_type} onChange={this.selectUserType}>
					<option value="" disabled>Select User Type</option>
					<option value="0">Peer</option>
					<option value="1">Peer Agency</option>
					<option value="2">Location</option>
				</select>
				{this.displayUserForm(this.state.user_type)}
			</div>
		);
	}
};
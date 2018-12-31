import React, { Component } from 'react';
import { withRouter, Link } from 'react-router-dom';

class HomePage extends Component{

	render(){
		console.log(this.props);
		return(
			<div>
				<Link to="/login">Log In</Link>
				<Link to="/register">Sign Up</Link>
			</div>
		);
	}
};

export default withRouter(HomePage);
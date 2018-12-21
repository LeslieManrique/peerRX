import React, { Component } from 'react';
import { Route, withRouter, Link } from 'react-router-dom';
import Registration from './Registration';
import LogIn from './LogIn';

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
import React, { Component } from 'react';
import { withRouter } from 'react-router-dom';

class LogIn extends Component{
	render(){
		return(
			<div>
				<form method="POST" action="/login">
					Username <input type="text" name="username"/>
					Password <input type="password" name="password"/>
					<input type="submit"/>
				</form>
			</div>
		);
	};
};

export default withRouter(LogIn);
import validator from 'validator';

// validate field value using specified validation functions
function validateField(state, fieldValue, fieldName){
	console.log(`${fieldName}: ${fieldValue}`);

	let errorMessage;
	state.validations[fieldName].forEach( (validation) => {
		if(typeof validation === "function"){
			errorMessage = validation(fieldValue, state.form_inputs);

			state.errors = { ...state.errors, [fieldName] : errorMessage };

			if(errorMessage){
				return state.errors;
			}
		}
	});
};

// checks if field is empty
function isEmpty(input){
	const errorMessage = input ? undefined : "Error! Input required.";
	return errorMessage;
}

// used to check that confirmed password matches password
function isSame(input2Name){
	return (input1, formInputs) => {
		console.log(input1, formInputs[input2Name])
		const errorMessage = input1 === formInputs[input2Name] ? undefined : "Error! Not same.";
		return errorMessage;
	}
}

// checks if email is valid according to validator module isEmail function
function isEmail(input){
	const isValidEmail = validator.isEmail(input);

	const errorMessage = isValidEmail ? undefined : "Error! Email is not valid.";
	return errorMessage;	
}

// check that user enters a valid user type
function isUserType(input){
	const userTypes = ["0","1","2"]
	const isValidUserType = validator.isIn(input, userTypes);

	const errorMessage = isValidUserType ? undefined : "Error! Select a user type.";
	return errorMessage;
}

// checks that user enters a valid phone number
function isPhoneNumber(input){
	const isValidPhone = validator.isMobilePhone(input, ['en-US']);

	const errorMessage = isValidPhone ? undefined : "Error! Enter a valid phone number.";
	return errorMessage;
}

// check that there are no errors in state
function allValid(state){
	let inputErrorKeys = [];
	for(let key in state.errors){
		inputErrorKeys.push(key);
	}
	const currentErrors = inputErrorKeys.filter((fieldError) => state.errors[fieldError] !== undefined);
	return currentErrors;
}

export {
	validateField,
	isEmpty,
	isEmail,
	isSame,
	isUserType,
	isPhoneNumber,
	allValid
};

// validate field value using specified validation functions
export function validateField(state, fieldValue, fieldName){
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
export function isEmpty(input){
	let error_message = input ? undefined : "Error! Input required.";
	return error_message;
}

// used to check that confirmed password matches password
export function isSame(input2Name){
	return (input1, formInputs) => {
		console.log(input1, formInputs[input2Name])
		let error_message = input1 === formInputs[input2Name] ? undefined : "Error! Not same.";
		return error_message;
	}
}

// TODO: import validator from npm and use their isEmail; below function was used for testing
export function isEmail(input){
	const email_regex = /@/;

	let error_message = input.search(email_regex) < 0 ? "Error! Email is not valid." : undefined;
	return error_message;
}
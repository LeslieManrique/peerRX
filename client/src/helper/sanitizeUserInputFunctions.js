// functions to clean user input before sending to server side


// clean phone number - server accepts int only
function cleanPhoneNumber(input){
	let phone = undefined;

	const numericRegEx = /[0-9]/g;
	const onlyNumbers = input.match(numericRegEx);
	if(onlyNumbers){
		// keep only 10 digit phone number; drop country code 1 if entered
		if(onlyNumbers.length === 11){
			phone = parseInt(onlyNumbers.slice(1, 11).join(''), 10);
		} else {
			phone = parseInt(onlyNumbers.join(''), 10);
		}
		console.log(`phone: ${phone}`);
	} else {
		console.log("Error! Phone number could not be extracted.");
	}
		
	return phone;
}

export {
	cleanPhoneNumber
};
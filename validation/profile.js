const Validator = require('validator');
const isEmpty = require('./is-empty');

module.exports = function validateRegisterInput(data) {

    let errors = {};

    data.handle = !isEmpty(data.handle) ? data.handle : '';
    data.status = !isEmpty(data.status) ? data.status : '';
    data.skills = !isEmpty(data.skills) ? data.skills : '';

    if (Validator.isEmpty(data.handle)) {
        errors.handle = 'Profile handle is required';
    }

    if (Validator.isEmpty(data.status)) {
        errors.status = 'Profile status is required';
    }

    if (Validator.isEmpty(data.skills)) {
        errors.skills = 'Profile skills is required';
    }

    if (!Validator.isLength(data.handle, {min: 2, max: 40})) {
        errors.handle = 'Profile handle must be between 2 and 40 characters';
    }

    if (!isEmpty(data.website)) {
        if (!Validator.isURL(data.website)) {
            errors.website = 'Not a valid URL';
        }
    }
    
    return {
        errors,
        isValid: isEmpty(errors)
    };

}
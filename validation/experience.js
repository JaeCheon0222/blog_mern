const Validator = require('validator');
const isEmpty = require('./is-empty');

module.exports = function validateExperienceInput(data) {

    let errors = {};

    data.title = !isEmpty(data.title) ? data.title : '';
    data.company = !isEmpty(data.company) ? data.company : '';
    data.location = !isEmpty(data.location) ? data.location : '';
    data.from = !isEmpty(data.from) ? data.from : '';

    if (Validator.isEmpty(data.title)) {
        errors.title = 'Profile title is required'
    }

    if (Validator.isEmpty(data.company)) {
        errors.company = 'Profile company is required'
    }

    if (Validator.isEmpty(data.location)) {
        errors.location = 'Profile location is required'
    }
    
    if (Validator.isEmpty(data.from)) {
        errors.from = 'Profile form is required'
    }

    return {
        errors,
        isValid: isEmpty(errors)
    }

    // title: {
    //     type: String,
    //     required: true
    // },
    // company: {
    //     type: String,
    //     required: true
    // },
    // location: {
    //     type: String
    // },
    // from: {
    //     type: Date,
    //     required: true
    // },
}
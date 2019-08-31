// open source로 validator 구현
const Validator = require('validator');
const isEmpty = require('./is-empty');

// 사용자 입력값 내보냄.
module.exports = function validateRegisterInput(data) {
    // 에러를 담는 변수
    let errors = {};

    // 사용자 입력값 확인
    data.name = !isEmpty(data.name) ? data.name : '';
    data.email = !isEmpty(data.email) ? data.email : '';
    data.password = !isEmpty(data.password) ? data.password : '';
    data.password2 = !isEmpty(data.password2) ? data.password2 : '';

    // 최소, 최대 문자열 길이
    if (!Validator.isLength(data.name, {min : 2, max: 30})) {
        errors.name = 'Name must be between 2 and 30 characters';
    }

    if (Validator.isEmpty(data.name)) {
        errors.name = 'Name is required';
    }

    if (Validator.isEmpty(data.email)) {
        errors.email = 'Email field is required';
    }

    if (Validator.isEmpty(data.password)) {
        errors.password = 'Password field is required';
    }

    if (Validator.isEmpty(data.password2)) {
        errors.password2 = 'Password2 field is required';
    }

    // email 형식 확인, Validator에서 함수 제공
    if (!Validator.isEmail(data.email)) {
        errors.email = 'Email is invalid';
    }

    // password 길이 확인
    if (!Validator.isLength(data.password, {min: 6, max: 30})) {
        errors.password = 'Password must be at least 6 characters';
    }

    if (!Validator.equals(data.password, data.password2)) {
        errors.password2 = 'Passwords must match';
    }

    return {
        errors,
        isValid: isEmpty(errors)
    };

};
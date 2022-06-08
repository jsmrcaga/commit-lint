const { ValidationError } = require('./errors');

class Validation {
	static run_validator(validator, value) {
		try {
			let ret = null;
			if(validator instanceof Function) {
				ret = validator(value);
			} else {
				ret = validator.validate(value);
			}

			if(ret instanceof Promise) {
				return ret;
			}

			return Promise.resolve(ret);
		} catch(e) {
			return Promise.reject(e);
		}
	}

	static validate(validators, value, error_message, index=0, errors=[]) {
		if(!validators[index] || index >= validators.length) {
			if(!errors.length) {
				return Promise.resolve();
			}

			return Promise.reject(new ValidationError(error_message, errors));
		}

		return this.run_validator(validators[index], value).catch(e => {
			errors.push(e);
		}).finally(() => {
			return this.validate(validators, value, error_message, index + 1, errors);
		});
	}
}

module.exports = { Validation };

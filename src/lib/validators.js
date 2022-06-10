const { ValidationError } = require('./errors');

class Validator {
	validate() {
		throw new Error('You should override the validate method');
	}
}

class LengthValidator {
	constructor({ min=3, max=25 }) {
		this.min = min;
		this.max = max;
	}

	validate({ commit: ghcommit, pull_request }) {
		const length = ghcommit.commit.message.split(/\s/g).length;

		const errors = [];
		if(length < this.min) {
			errors.push(`Your commit must have at least ${this.min} words`);
		}

		if(length > this.max) {
			errors.push(`Your commit must have ${this.max} words at most`);
		}

		if(errors.length) {
			throw new ValidationError('Commit size is invalid', errors);
		}
	}
}

class WordingValidator {
	constructor({ not_allowed=[], required=[] }) {
		this.not_allowed = not_allowed;
		this.required = required;
	}

	validate({ commit: ghcommit, pull_request }) {
		const words = ghcommit.commit.message.split(/\s/g);

		const errors = [];
		for(const prohibited of this.not_allowed) {
			if(prohibited instanceof RegExp && prohibited.test(ghcommit.commit.message)) {
				errors.push(`Commit message MUST NOT match the regex: "${prohibited}"`);
				continue;
			}

			if(words.includes(prohibited)) {
				errors.push(`Commit message MUST NOT contain "${prohibited}"`);
			}
		}

		for(const needed of this.required) {
			if(needed instanceof RegExp && !needed.test(ghcommit.commit.message)) {
				errors.push(`Commit message MUST match the regex: "${needed}"`);
				continue;
			}

			if(!words.includes(needed)) {
				errors.push(`Commit message MUST contain "${needed}"`);
			}
		}

		if(errors.length) {
			throw new ValidationError('Wording is invalid', errors);
		}
	}
}

class FormatValidator {
	constructor(formats=[]) {
		// default format is "Commit: xxxxxxxx"
		this.formats = formats.map(regexp => new RegExp(regexp));
	}

	validate({ commit: ghcommit, pull_request }) {
		for(const format of this.formats) {
			if(format.test(ghcommit.commit.message)) {
				return;
			}
		}

		throw new ValidationError(`Commit must match one of these formats: ${this.formats.join(', ')}`);
	}
}

module.exports = {
	Validator,
	ValidationError,
	LengthValidator,
	WordingValidator,
	FormatValidator
};

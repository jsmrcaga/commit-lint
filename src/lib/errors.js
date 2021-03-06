class RequestError extends Error {
	constructor(message, { status, headers, response }) {
		super(message);
		this.status = status;
		this.headers = headers;
		this.response = response;
	}
}

class ValidationError extends Error {
	constructor(message, errors) {
		super(message);
		this.message = message;
		this.errors = errors || [];
	}

	get errors_repr() {
		return this.errors.map(error => {
			if(error instanceof ValidationError) {
				return error.toString();
			}

			if(typeof error === 'string') {
				return `• ${error}`;
			}

			return `• ${error.message}`;
		}).join('\n');
	}

	toString() {
		return `${this.message}\n${this.errors_repr}`;
	}
}


module.exports = {
	RequestError,
	ValidationError
};

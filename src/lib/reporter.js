const GitHub = require('./github');

class Reporter {
	report() {
		throw new Error('You should override this method');
	}
}

class DefaultReporter {
	constructor({ fail_on_errors }) {
		this.fail_on_errors = fail_on_errors;
	}

	report({ pull_request, commits }) {
		let has_errors = false;

		if(pull_request) {
			has_errors = true;
			GitHub.command('error', {}, pull_request);
		}

		for(const [sha, error] of Object.entries(commits)) {
			if(error !== true) {
				has_errors = true;
				GitHub.command('error', {}, error.toString());
			}
		}

		if(has_errors && this.fail_on_errors) {
			process.exit(1);
		}
	}
}

module.exports = { Reporter, DefaultReporter };

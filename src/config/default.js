const {
	LengthValidator,
	WordingValidator,
	FormatValidator,
} = require('../lib/validators');

const { Reporter } = require('../lib/reporter');

module.exports = {
	reporter_config: {
		fail_on_errors: true
	},

	pull_request_validators: [],
	commit_validators: [
		new LengthValidator({
			min: 3,
			max: 25
		}),

		new WordingValidator({
			not_allowed: [/review(s)?/i, /^\s*lint\s*$/i, /^\s*update(s)?\s*$/i, /^\s*fix(es)?\s*$/i]
		}),

		new FormatValidator(/[A-Z][^\:]+\:\s.+/)
	]
};

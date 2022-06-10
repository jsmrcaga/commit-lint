const {
	LengthValidator,
	WordingValidator,
	FormatValidator,
} = require('../lib/validators');

const { Reporter } = require('../lib/reporter');

module.exports = (config) => ({
	reporter_config: {
		fail_on_errors: config.fail_on_errors ?? true
	},

	pull_request_validators: [],
	commit_validators: [
		new LengthValidator({
			min: config.default.min_word_length ?? 3,
			max: config.default.max_word_length ?? 25
		}),

		new WordingValidator({
			not_allowed: config.default.words_not_allowed ?? [/review(s)?/i, /^\s*lint\s*$/i, /^\s*update(s)?\s*$/i, /^\s*fix(es)?\s*$/i],
			required: config.default.words_required ?? []
		}),

		new FormatValidator(config.default.message_formats ?? [/^[A-Z][^\:]+\:\s.+$/])
	]
});

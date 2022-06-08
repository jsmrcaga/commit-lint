const { Validation } = require('./validation');

class Linter {
	constructor(config) {
		this.config = config;
	}

	get commit_validators() {
		return this.config.commit_validators || [];
	}

	get pull_request_validators() {
		return this.config.pull_request_validators || [];
	}

	async_lint_commits(pull_request, commits, validators, index=0, result={}) {
		const commit = commits[index];
		if(!commit || index >= commits.length) {
			return result;
		}

		return Validation.validate(
			this.commit_validators,
			{ pull_request, commit },
			`Validation failed for commit ${commit.sha}.`
		).then(() => {
			result[commit.sha] = true;
			return this.async_lint_commits(pull_request, commits, validators, index + 1, result);
		}).catch(error => {
			result[commit.sha] = error;
			return this.async_lint_commits(pull_request, commits, validators, index + 1, result);
		});
	}

	lint(pull_request, commits) {
		const commits_validation = this.async_lint_commits(pull_request, commits, this.commit_validators);

		const pr_validation = Validation.validate(
			this.pull_request_validators,
			{ pull_request, commits },
			`Validation failed for pull request ${pull_request.id}`
		).catch(e => e);

		return Promise.all([pr_validation, commits_validation]);
	}
}

module.exports = {
	Linter
};

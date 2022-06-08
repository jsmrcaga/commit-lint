const GitHub = require('./github');

class PullRequest {
	constructor(pull_request) {
		this.pull_request = pull_request;
	}

	get number() {
		return this.pull_request.number;
	}

	get_commits(repo) {
		return GitHub.get(`/repos/${repo}/pulls/${this.number}/commits`);
	}
}

module.exports = { PullRequest };

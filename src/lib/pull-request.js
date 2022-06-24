const GitHub = require('./github');

class PullRequest {
	constructor(pull_request) {
		this.pull_request = pull_request;
	}

	get number() {
		return this.pull_request.number;
	}

	parse_commits(commits) {
		return commits.map(commit => {
			const { message } = commit.commit;
			const line_jump = message.indexOf('\n');

			commit.message = message;
			commit.body = null;
			if(line_jump === -1) {
				// We only have a single line message
				return commit;
			}

			commit.message = message.substring(0, line_jump);
			commit.body = message.substring(line_jump + 1);
			return commit;
		});
	}

	get_commits(repo) {
		return GitHub.get(`/repos/${repo}/pulls/${this.number}/commits`).then(commits => this.parse_commits(commits));
	}
}

module.exports = { PullRequest };

const GitHub = require('./github');

class Reporter {
	report() {
		throw new Error('You should override this method');
	}
}

class DefaultReporter {
	constructor({ fail_on_errors=true, comment_on_commits=false }) {
		this.fail_on_errors = fail_on_errors;
		this.comment_on_commits = comment_on_commits;
	}

	report({ event, repo, pull_request, commits }) {
		let has_errors = false;

		const promises = [];

		if(pull_request) {
			has_errors = true;
			const p = GitHub.command('error', {}, pull_request);
			promises.push(p);
		}

		for(const [sha, error] of Object.entries(commits)) {
			if(error) {
				has_errors = true;
				const p = GitHub.command('error', {}, error.toString());
				promises.push(p);

				if(this.comment_on_commits) {
					const c = GitHub.post(`/repos/${repo}/commits/${sha}/comments`, {
						body: {
							body: error.toString()
						}
					}).catch(e => {
						console.error('Commit Comment Error', e);
					});

					promises.push(c);
				}
			}
		}

		return Promise.all(promises).finally(() => {
			if(has_errors && this.fail_on_errors) {
				process.exit(1);
			}
		});
	}
}

module.exports = { Reporter, DefaultReporter };

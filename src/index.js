#!/usr/bin/env node

const { Config } = require('./lib/config');
const { Linter } = require('./lib/linter');
const { DefaultReporter } = require('./lib/reporter');
const { PullRequest } = require('./lib/pull-request');

// Constants
const REPO = process.env.GITHUB_REPOSITORY;
const EVENT = require(process.env.GITHUB_EVENT_PATH);

const config_location = process.env.INPUT_COMMIT_LINT_CONFIG || null;

const config = Config.load(config_location);
const linter = new Linter(config);
const reporter = config.reporter || new DefaultReporter(config.reporter_config);

const pull_request = new PullRequest(EVENT.pull_request);

pull_request.get_commits(REPO).then(commits => {
	return linter.lint(EVENT, commits);
}).then(([pull_request, commits]) => {
	return reporter.report({
		pull_request,
		commits,
		event: EVENT,
		repo: REPO
	});
}).catch(e => {
	console.error(e);
	process.exit(1);
});

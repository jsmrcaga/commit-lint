const { RequestError } = require('./errors');
const QueryString = require('querystring');

class GitHub {
	constructor() {
		this.token = process.env.INPUT_GITHUB_TOKEN;

		if(!this.token) {
			throw new Error('Cannot initialize GitHub API Client without a token');
		}
	}

	request({ url=null, path='/', method='GET', body=undefined, query={}, headers={} }) {
		if(!url) {
			url =  `https://api.github.com${path}`;
		}

		const querystring = query && Object.keys(query).length ? QueryString.stringify(query) : '';

		url += `?${querystring}`;

		headers = new Headers(headers);

		if(!headers.get('Authorization')) {
			headers.set('Authorization', `Bearer ${this.token}`);
		}

		if(!headers.get('Content-Type') && body) {
			headers.set('Content-Type', 'application/json');
			if(body instanceof Object) {
				body = JSON.stringify(body);
			}
		}

		return fetch(url, {
			method,
			body,
			headers
		}).then(response => {
			if(response.status < 200 || response.status > 300) {
				return response.text().then(text => {
					throw new RequestError(`GitHub API error for ${url}`, {
						status: response.status,
						headers: response.headers,
						response: text
					});
				});
			}

			return response.json();
		});
	}

	get(path, options={}) {
		return this.request({
			path,
			method: 'GET',
			...options
		});
	}

	post(path, options={}) {
		return this.request({
			path,
			method: 'POST',
			...options
		});
	}

	command(cmd, params, value) {
		const parameters = Object.entries(params).reduce((agg, [key, value]) => agg.push(`${key}=${value}`), []).join(',')
		const command = `::${cmd} ${parameters}::${value}\n`;
		return new Promise((resolve, reject) => {
			process.stdout.write(command, err => {
				if(err) {
					return reject(err);
				}

				return resolve();
			});
		});
	}
}

const github = new GitHub();
module.exports = github;

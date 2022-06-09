const Path = require('path');
const DEFAULT_CONFIG = require('../config/default');

class Config {
	constructor(config) {
		this.config = {
			...DEFAULT_CONFIG(config),
			...config
		};

		return new Proxy(this, {
			get: (obj, prop) => {
				if(prop in obj.config) {
					return obj.config[prop];
				}

				return undefined;
			}
		});
	}

	static load(path=null) {
		let config = {};
		// current dir: process.cwd() -> /xxx/xxx/xxx
		// ex config ./commit-lint.config.js
		// ex full: /xxx/xxx/xxx/commit-lint.config.js

		if(path) {
			config = require(Path.join(process.cwd(), path));
		}

		return new this(config);
	}
}

module.exports = { Config };

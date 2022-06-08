const Path = require('path');
const DEFAULT_CONFIG = require('../config/default');

class Config {
	constructor(config) {
		this.config = {
			...DEFAULT_CONFIG,
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
		if(path) {
			config = require(path);
		}

		return new this(config);
	}
}

module.exports = { Config };

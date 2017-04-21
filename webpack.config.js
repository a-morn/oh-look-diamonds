var path = require('path');

var outputFolder = 'dist';

module.exports = {
	devtool: 'source-map',
	entry: './src/js/main.js',
	output: {
		path: path.resolve(__dirname, outputFolder),
		filename: 'bundle.js'
	},
	module: {
		loaders: [
			{
				test: /\.js?$/,
				loader: 'babel-loader',
				query: {
					presets: ['es2015']
				}
			}
		]
	}
};

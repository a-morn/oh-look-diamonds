var path = require('path');
var webpack = require('webpack');

module.exports = {
	entry: './src/js/main.js',
	output: {
		path: path.resolve(__dirname, 'dist'),
		filename: 'bundle.js'
	},
	devtool: 'source-map',
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

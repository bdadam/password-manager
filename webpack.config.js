const path = require("path");
const webpack = require("webpack");

module.exports = {
	cache: true,
    // watch: true,
    devtool: 'source-map',
	failOnError: false,
	bail: false,
	entry: {
        main: './js/main.js',
		sw: './js/service-worker.js'
	},
	output: {
		path: path.join(__dirname, "public"),
		filename: "[name].js",
	},
	module: {
		loaders: [
			{ test: /\.js$/, exclude: /node_modules/, loader: 'babel', query: { presets: ['es2015'] }, plugins: ['transform-object-assign'], cacheDirectory: true },
			// { test: /\.pug$/, exclude: /node_modules/, loader: 'pug-html-loader' },
			// { test: /\.html$/, exclude: /(node_modules|bower_components)/, loader: 'html', query: { } },
			{ test: /\.html$/, exclude: /(node_modules|bower_components)/, loader: 'raw!html-minify' }
		]
	},
	plugins: [
		new webpack.DefinePlugin({ 'process.env.NODE_ENV': '"production"' }),
		// new webpack.optimize.DedupePlugin(),
		// new webpack.optimize.OccurrenceOrderPlugin(),
		// new webpack.optimize.UglifyJsPlugin({
		//     compress: {
		//         warnings: false
		//     }
		// })
	]
};

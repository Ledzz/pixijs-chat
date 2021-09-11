const path = require('path');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const {CleanWebpackPlugin} = require('clean-webpack-plugin');
const ForkTsCheckerWebpackPlugin = require('fork-ts-checker-webpack-plugin');

const paths = {
	context: path.join(__dirname, './src'),
	tsConfig: path.join(__dirname, './tsconfig.json'),
	outPath: path.join(__dirname, './dist'),
	indexHTML: path.resolve(__dirname, './src/index.html'),

};

module.exports = {
	entry: {
		main: path.resolve(__dirname, './src/index.ts'),
	},
	output: {
		path: path.resolve(__dirname, './dist'),
		filename: '[name].js',
	},
	mode: 'development', target: 'web',
	resolve: {
		extensions: ['.js', '.ts', '.tsx'],
		mainFields: ['module', 'browser', 'main'],
		alias: {},
	},
	module: {
		rules: [
			// .ts, .tsx
			{
				test: /\.tsx?$/,
				use: [
					{
						loader: 'babel-loader',
						options: {
							plugins: [
								'babel-plugin-transform-class-properties',
								'@babel/plugin-proposal-optional-chaining',
							],
							presets: [
								'@babel/preset-typescript',
							],
						},
					},
				],
				exclude: /node_modules/,
			},
		],
	},
	plugins: [
		new CleanWebpackPlugin(),
		new HtmlWebpackPlugin({
			title: 'webpack Boilerplate',
			template: paths.indexHTML,
			filename: 'index.html', // название выходного файла
		}),
		new ForkTsCheckerWebpackPlugin({
			typescript: {
				diagnosticOptions: {
					semantic: true,
					syntactic: true,
				},
				configFile: paths.tsConfig,
			},
		}),

	],
	devServer: {
		port: 4044,
		historyApiFallback: true,
		hot: true,
	},

};

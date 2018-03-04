var path = require('path')
var tsconfig = require('./tsconfig.json')
var webpackConfig = require('@ionic/app-scripts/config/webpack.config');

var BundleAnalyzerPlugin = require('webpack-bundle-analyzer').BundleAnalyzerPlugin;

webpackConfig.dev.plugins.push(new BundleAnalyzerPlugin({
	generateStatsFile: true,
	openAnalyzer: false,
	analyzerMode: 'static',
	reportFilename: "../../.analysis/report3524.html",
	statsFilename: "../../.analysis/stats3524.json"
}));
webpackConfig.prod.plugins.push(new BundleAnalyzerPlugin({
	generateStatsFile: true,
	analyzerMode: 'static',
	openAnalyzer: false,
	reportFilename: "../../.analysis/report3524.html",
	statsFilename: "../../.analysis/stats3524.json"
}));

module.exports = webpackConfig;
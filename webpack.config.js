var webpackConfig = require('@ionic/app-scripts/config/webpack.config');
var webpack = require("webpack");
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

webpackConfig.prod.plugins.push( new webpack.ContextReplacementPlugin(/moment[/\\]locale$/, /en/));
webpackConfig.dev.plugins.push( new webpack.ContextReplacementPlugin(/moment[/\\]locale$/, /en/));

module.exports = webpackConfig;
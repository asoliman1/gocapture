
// https://www.npmjs.com/package/uglify-js
module.exports = {

	/**
	 * mangle: uglify 2's mangle option
	 */
	mangle: false,/* {
		keep_fnames: true
	},*/

	/**
	 * compress: uglify 2's compress option
	 */
	compress: {
		unused: true,
		dead_code: true,
		toplevel: true
	},
	output: {
		beautify: true
	}
};
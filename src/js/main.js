var skrollr = require('skrollr');
require('skrollr-menu');
var $ = require('jquery');

var s = skrollr.init({
	mobileCheck: function() {
		return false;
	}
});

skrollr.menu.init(s, {
	animate: true,
	easing: 'sqrt',
	duration: function(currentTop, targetTop) {
		var threshold = 1000;
		var msec = Math.abs(currentTop-targetTop)/3;
		if( msec > threshold ) msec = threshold;
		return msec;
	},
	change: function(newHash, newTopPosition) {
	}
});


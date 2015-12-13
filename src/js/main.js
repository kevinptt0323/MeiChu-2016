var skrollr = require('skrollr');

var s = skrollr.init({
	mobileCheck: function() {
		return false;
	}
});

var scrollTo = function(id) {
	console.log(id);
	s.animateTo(400);
	return false;
}

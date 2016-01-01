/* jslint node: true, esnext: true */
'use strict';
var
	$                = require('jquery'),
	React            = require('react'),
	ReactDOM         = require('react-dom'),
	AppBar           = require('material-ui/lib/app-bar'),
	Paper            = require('material-ui/lib/paper'),
	CircularProgress = require('material-ui/lib/circular-progress'),
	RaisedButton     = require('material-ui/lib/raised-button'),
	FlatButton       = require('material-ui/lib/flat-button'),
	Dialog           = require('material-ui/lib/dialog'),
	TextField        = require('material-ui/lib/text-field'),
	injectTapEventPlugin = require("react-tap-event-plugin")
;

ReactDOM.render(
	<RaisedButton label="Submit" secondary={true} />,
	document.getElementById('test')
);

(function() {
'use strict';

angular.module("config", [])

.constant("ConStore", {
	"version": "v0.1.1",
	"showVersion": true,
	"baseUrl": "https://securechat.click",
	"apiServer": "https://api.securechat.click"
})

;})();
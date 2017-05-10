angular.module('app', [

    // Vendor components
    'ngAnimate',
    'ngCookies',
    'ngSanitize',
    'ngResource',
    'ui.router',
    'ngMaterial',

    // Templates
    'app.templates',

    // Local components	
    'components.ui', // UI templates by AppInfo.APP_UI_TYPE
    'components.d3.wrapper',
    'components.d3.service',

    // Pages	
    'app.pages',
])

.constant('AppInfo', {
    APP_ID: 'd3-boilerplate',
    DEBUG: true,
    APP_NAME: 'D3 boilerplate',
    APP_VERSION: '0.1',
    APP_UI_TYPE: 'material', //'web', // suffix pro nazvy sablon
})

.run(function(
    $rootScope, AppInfo, $state
) {
    $rootScope.AppInfo = AppInfo;
    $rootScope.$state = $state;

    if (!AppInfo.DEBUG) {
        if (!window.console) window.console = {};
        var methods = ["log", "debug", "warn", "info", "dir", "dirxml", "trace", "profile"];
        for (var i = 0; i < methods.length; i++) {
            console[methods[i]] = function() {};
        }
    }
})

.controller('app:Content', function($scope) {});
angular.module('app')
    .config(function (
        $urlRouterProvider, $stateProvider, $compileProvider, AppInfo) {
    // if the path doesn't match any of the urls you configured
    // otherwise will take care of routing the user to the specified url
    // $urlRouterProvider.otherwise('/main');
        $urlRouterProvider.otherwise('/main');
        $compileProvider.debugInfoEnabled(true);
    });

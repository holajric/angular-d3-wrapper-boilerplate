angular
    .module('app.main.config', [])
    .config(MainConfig);


/* @ngInject */
function MainConfig($stateProvider) {
    $stateProvider
        .state('main', {
            url: '/main',
            cache: false,
            views: {
                'content@': { /* @ngInject */
                    templateProvider: function ($templateFactory, uiType) {
                        return $templateFactory.fromUrl(uiType.getPageTemplateUrl('main'));
                    },
                    controller: 'MainController as vm',
//                    controllerAs: 'vm' // FIXIT: toto nefunguje 
                }
            },
            data: { 
                isPublic: true
            }
        });
}
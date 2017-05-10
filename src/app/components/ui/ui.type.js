angular
    .module('components.ui.type', [])
    .factory('uiType', uiType);

uiType.$inject = ['AppInfo'];

/* @ngInject */
function uiType(AppInfo) {
    var exports = {
        getPageTemplateUrl: function (componentName, subComponentName) {
            return getTemplateUrl('pages', componentName, subComponentName);
        },
        getComponentTemplateUrl: function (componentName, subComponentName) {
            return getTemplateUrl('components', componentName, subComponentName);
        }
    };


    return exports;

    ////////////////

    function getUiPath() {
        return AppInfo.APP_UI_TYPE ? '.' + AppInfo.APP_UI_TYPE : '';
    }

    function getTemplateUrl(path, componentName, subComponentName) {
        if(!subComponentName)
            subComponentName = componentName;    
        return 'app/' + path + '/' + componentName + '/' + subComponentName + getUiPath() + '.html';
    }

}
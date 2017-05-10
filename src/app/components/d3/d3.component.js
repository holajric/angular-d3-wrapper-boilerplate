angular
    .module('components.d3.wrapper', [])
    .component('d3Wrapper', {
        template: "",
        bindings: {
            id: '@',
            moduleId: '@?',
            onWrapperInit: '&',
            type: '@',
            height: '@',
            width: '@'
        },
        controller: D3WrapperController,
        controllerAs: 'vm'
    });

function D3WrapperController(D3Service, $element) {
    var vm = this;
    vm.wrapperHolder = d3.select($element[0]).append(vm.type).attr("height", vm.height).attr("width", vm.width);
    D3Service.bindToElement(vm.wrapperHolder)
    vm.onWrapperInit({wrapper: vm.wrapperHolder})
}
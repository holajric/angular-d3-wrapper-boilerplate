angular
    .module('app.main', ['app.main.config'])
    .controller('MainController', MainController);

/* @ngInject */
function MainController(
    $scope, D3Service
) {
    // CONTROLLER CONTEXT
    var vm = this;

    // INITIALISATION
    vm.rendered = false;
    vm.onWrapperInit = function onWrapperInit(canvasWrapper) {
        vm.canvas = canvasWrapper;
        render();
        vm.rendered = true;
    }

    // CANVAS SIZE
    vm.width = 300;
    vm.height = 300;

    // BUTTON CLICK ACTION
    vm.onButtonClick = function onButtonClick() {
        vm.radius = 10 + (Math.random() * 100);
        rerender();
    }
  
    // INITIAL RENDERING
    function render() {
        vm.radius = 50;
        vm.circle = vm.canvas.createCircle("test-circle", 150, 150, vm.radius, "blue", "red")
        vm.circle.on("click", vm.onButtonClick)   
    }

    // RERENDERING
    function rerender() {
        if(vm.rendered) {  
            vm.circle.changeElement({"attr":{"r":vm.radius}},{"duration":2000})
        }   
    }

}
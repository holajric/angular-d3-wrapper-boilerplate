/** TEST */
angular
    .module('components.d3.service', [])
    .factory('D3Service', D3Service);


/* @ngInject */
function D3Service($interval) {
    var api = {
        "createElement": createElement,
        "changeElement": changeElement,
        "createMultiCircle": createMultiCircle,
        "createCircle": createCircle,
        "createLine": createLine,
        "createText": createText,
        "createLinearGradient": createLinearGradient,
        "createRadialGradient":createRadialGradient,
        "createGlowFilter": createGlowFilter,
        "createPath": createPath,
    };

    var static = {
        "bindToElement":bindToElement,
        "lineFunction":lineFunction,
        "areaFunction":areaFunction,
        "arcFunction":arcFunction,
    }

    return _.defaults({}, static, api);
    
    function bindToElement(element) {
        _.each(api, function(method, methodName) {
            var curried = _.curry(method);
            element[methodName] = curried(element)
        })
    }

    function lineFunction(data, method) {
        return (d3.svg.line().x(function(d) { return d.x; }).y(function(d) { return d.y; }).interpolate(method))(data);
    }

    function areaFunction(data, base, method) {
        return (d3.svg.area().x(function(d) { return d.x; }).y0(base).y1(function(d) { return d.y; }).interpolate(method))(data);
    }

    function arcFunction(data) {
        return (d3.svg.arc().innerRadius(function(d) { console.log(d);  return d.inner}).outerRadius(function(d) {return d.outer}).startAngle(function(d) {return d.start}).endAngle(function(d) {return d.end}))(data)
    }

    function createElement(container, type, attrs) {
        var element = container.append(type)
        changeElement(element, attrs)
        bindToElement(element)
        return element;
    }

    function changeElement(element, settings, transition) {
        var newElement = element;
        if(transition !== undefined) {
            newElement = element.transition()
            _.each(transition, function(val, attr) {
                newElement = newElement[attr](val)
            })
        }
        _.each(settings, function(setting, settingName) {
            if(_.isPlainObject(setting)) {
                _.each(setting, function(value, key) {
                    newElement = newElement[settingName](key, value)
                })
            }	else {
                newElement = newElement[settingName](setting)
            }

        })
        return element;
    }

    function createMultiCircle(container, commonId, cx, cy, radii, fill) {
        var circles = []
        _.each(radii, function(r, index) {
            circleLayer = createElement(container, "circle", {"attr": {"cx": cx, "cy": cy, "r":r, "stroke": "none", "fill": fill[index], "id": commonId + "_layer" + index}})
            circles.push(circleLayer)
        })
        return circles;
    }

    function createCircle(container, id, cx, cy, r, fill, stroke) {
        return createElement(container, "circle", {"attr": {"id":id, "cx":cx, "cy":cy, "r":r, "fill": fill, "stroke":stroke}})
    }

    function createLine(container, id, x1, x2, y1, y2, strokeWidth, stroke) {
        return createElement(container, "line", {"attr": {"id":id, "x1":x1, "x2":x2, "y1":y1, "y2": y2, "stroke-width": strokeWidth, "stroke":stroke}})
    }

    function createText(container, id, x, y, opacity, fill, fontFamily, fontSize, text) {
        return createElement(container, "text", {"attr":{"id":id, "text-anchor":"middle", "x":x,"y":y, "opacity":opacity, "fill":fill, "font-family":fontFamily,"font-size":fontSize + "px"},"text":text});
    }

    function createLinearGradient(container, gradient) {
        var grad = {"gradient": createElement(container, "linearGradient", {"attr":gradient.definition}), "stops":[]}
        _.each(gradient.stops, function(stop){
            grad.stops.push(createElement(grad.gradient, "stop", {"attr":stop}))
        })
        return grad
    }

    function createRadialGradient(container, gradient) {
        var grad = {"gradient": createElement(container, "radialGradient", {"attr":gradient.definition}), "stops":[]}
        _.each(gradient.stops, function(stop){
            grad.stops.push(createElement(grad.gradient, "stop", {"attr":stop}))
        })
        return grad
    }

    function createGlowFilter(container, id, deviation) {
        var filter = {"container": createElement(container, "filter", {"attr":{"id":id, "height":"150%", "width":"150%","y":"-50%","x":"-50%","filterUnits":"userSpaceOnUse"}})}
        filter.blur = createElement(filter.container, "feGaussianBlur", {"attr":{"stdDeviation":deviation, "result":"coloredBlur"}})
        filter.merge = createElement(filter.container, "feMerge", {})
        filter.mergeNodes = []
        filter.mergeNodes.push(createElement(filter.merge, "feMergeNode", {"attr":{"in":"coloredBlur"}}))
        filter.mergeNodes.push(createElement(filter.merge, "feMergeNode", {"attr":{"in":"SourceGraphic"}}))
        return filter;
    }

    function createPath(container, id, stroke, strokeWidth, fill, d, filter) {
        return createElement(container, "path", {"attr":{"id":id, "stroke":stroke, "stroke-width":strokeWidth, "fill":fill, "d": d, "filter":filter}})
    }
} 
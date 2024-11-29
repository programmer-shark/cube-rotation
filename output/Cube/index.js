"use strict";
var Control_Applicative = require("../Control.Applicative/index.js");
var Control_Bind = require("../Control.Bind/index.js");
var Control_Monad_State_Class = require("../Control.Monad.State.Class/index.js");
var Data_Array = require("../Data.Array/index.js");
var Data_Function = require("../Data.Function/index.js");
var Data_Functor = require("../Data.Functor/index.js");
var Data_Maybe = require("../Data.Maybe/index.js");
var Data_Semigroup = require("../Data.Semigroup/index.js");
var Data_Show = require("../Data.Show/index.js");
var Data_Tuple = require("../Data.Tuple/index.js");
var Data_Unit = require("../Data.Unit/index.js");
var Halogen_Component = require("../Halogen.Component/index.js");
var Halogen_HTML_Core = require("../Halogen.HTML.Core/index.js");
var Halogen_HTML_Elements = require("../Halogen.HTML.Elements/index.js");
var Halogen_HTML_Events = require("../Halogen.HTML.Events/index.js");
var Halogen_HTML_Properties = require("../Halogen.HTML.Properties/index.js");
var Halogen_Query_HalogenM = require("../Halogen.Query.HalogenM/index.js");
var Halogen_Svg_Attributes = require("../Halogen.Svg.Attributes/index.js");
var Halogen_Svg_Elements = require("../Halogen.Svg.Elements/index.js");
var $$Math = require("../Math/index.js");
var Tick = (function () {
    function Tick(value0) {
        this.value0 = value0;
    };
    Tick.create = function (value0) {
        return new Tick(value0);
    };
    return Tick;
})();
var Other = (function () {
    function Other(value0) {
        this.value0 = value0;
    };
    Other.create = function (value0) {
        return new Other(value0);
    };
    return Other;
})();
var X = (function () {
    function X() {

    };
    X.value = new X();
    return X;
})();
var Y = (function () {
    function Y() {

    };
    Y.value = new Y();
    return Y;
})();
var Z = (function () {
    function Z() {

    };
    Z.value = new Z();
    return Z;
})();

// Events
var DecAngVelocity = (function () {
    function DecAngVelocity(value0) {
        this.value0 = value0;
    };
    DecAngVelocity.create = function (value0) {
        return new DecAngVelocity(value0);
    };
    return DecAngVelocity;
})();

// Events
var IncAngVelocity = (function () {
    function IncAngVelocity(value0) {
        this.value0 = value0;
    };
    IncAngVelocity.create = function (value0) {
        return new IncAngVelocity(value0);
    };
    return IncAngVelocity;
})();

// Events
var Reverse = (function () {
    function Reverse() {

    };
    Reverse.value = new Reverse();
    return Reverse;
})();

// Events
var VelocityIncrement = (function () {
    function VelocityIncrement() {

    };
    VelocityIncrement.value = new VelocityIncrement();
    return VelocityIncrement;
})();

// Events
var VelocityDecrement = (function () {
    function VelocityDecrement() {

    };
    VelocityDecrement.value = new VelocityDecrement();
    return VelocityDecrement;
})();

// Events
var AddCube = (function () {
    function AddCube() {

    };
    AddCube.value = new AddCube();
    return AddCube;
})();

// Events
var RemoveCube = (function () {
    function RemoveCube() {

    };
    RemoveCube.value = new RemoveCube();
    return RemoveCube;
})();

// Values
var viewBoxSize = 600.0;
var viewCenter = {
    x: viewBoxSize / 2.0,
    y: viewBoxSize / 2.0
};
var velocityIncrement = function (cube) {
    return {
        shape: cube.shape,
        angVel: cube.angVel,
        forward: cube.forward,
        velocity: cube.velocity + 30.0,
        count: cube.count
    };
};
var velocityDecrement = function (cube) {
    return {
        shape: cube.shape,
        angVel: cube.angVel,
        forward: cube.forward,
        velocity: cube.velocity - 30.0,
        count: cube.count
    };
};
var rotate = function (v) {
    var rotateInPlane = function (axis1) {
        return function (axis2) {
            return function (ang) {
                return new Data_Tuple.Tuple(axis1 * $$Math.cos(ang) - axis2 * $$Math.sin(ang), axis2 * $$Math.cos(ang) + axis1 * $$Math.sin(ang));
            };
        };
    };
    var rotateX = function (ang) {
        return function (v1) {
            var v2 = rotateInPlane(v1.y)(v1.z)(ang);
            return {
                x: v1.x,
                y: v2.value0,
                z: v2.value1
            };
        };
    };
    var rotateY = function (ang) {
        return function (v1) {
            var v2 = rotateInPlane(v1.x)(v1.z)(ang);
            return {
                x: v2.value0,
                y: v1.y,
                z: v2.value1
            };
        };
    };
    var rotateZ = function (ang) {
        return function (v1) {
            var v2 = rotateInPlane(v1.x)(v1.y)(ang);
            return {
                x: v2.value0,
                y: v2.value1,
                z: v1.z
            };
        };
    };
    var $89 = rotateZ(v.za);
    var $90 = rotateY(v.ya);
    var $91 = rotateX(v.xa);
    return function ($92) {
        return $89($90($91($92)));
    };
};

// where
//   cube = last cubes
//   newCube = if cube == Nothing then initCube else initCube {count = cube.count+1.0}
//-- End of Unit Functions
var rotateShape = function (vertices) {
    return function (ang) {
        return Data_Functor.map(Data_Functor.functorArray)(rotate(ang))(vertices);
    };
};
var reverse = function (cube) {
    return {
        shape: cube.shape,
        angVel: cube.angVel,
        forward: (function () {
            if (cube.forward) {
                return false;
            };
            return true;
        })(),
        velocity: cube.velocity,
        count: cube.count
    };
};

//-------------------------------------------------------------------------------------
var renderView = function (state) {
    var renderButton = function (label) {
        return function (query) {
            return Halogen_HTML_Elements.button([ Halogen_HTML_Properties.title(label), Halogen_HTML_Events.onClick(function (v) {
                return query;
            }) ])([ Halogen_HTML_Core.text(label) ]);
        };
    };
    
    // parallel projection
var project = function (p) {
        return {
            x: p.x + viewCenter.x,
            y: p.y + viewCenter.y
        };
    };
    var getPoint = function (maybePoint) {
        var $$default = {
            x: 100.0,
            y: 100.0
        };
        return Data_Maybe.fromMaybe($$default)(maybePoint);
    };
    var drawVertex = function (idx) {
        return function (v) {
            return Halogen_Svg_Elements.g([  ])([ Halogen_Svg_Elements.text([ Halogen_Svg_Attributes.x(v.x + 5.0), Halogen_Svg_Attributes.y(v.y - 5.0), Halogen_Svg_Attributes.fill(new Data_Maybe.Just(new Halogen_Svg_Attributes.RGB(150, 150, 150))) ])([ Halogen_HTML_Core.text(Data_Show.show(Data_Show.showInt)(idx)) ]), Halogen_Svg_Elements.circle([ Halogen_Svg_Attributes.r(3.0), Halogen_Svg_Attributes.cx(v.x), Halogen_Svg_Attributes.cy(v.y), Halogen_Svg_Attributes.fill(new Data_Maybe.Just(new Halogen_Svg_Attributes.RGB(100, 100, 100))) ]) ]);
        };
    };
    var drawVertices = function (vert2Ds) {
        return Data_Array.mapWithIndex(drawVertex)(vert2Ds);
    };
    var drawLine = function (a) {
        return function (b) {
            return Halogen_Svg_Elements.line([ Halogen_Svg_Attributes.x1(a.x), Halogen_Svg_Attributes.x2(b.x), Halogen_Svg_Attributes.y1(a.y), Halogen_Svg_Attributes.y2(b.y), Halogen_Svg_Attributes.stroke(new Data_Maybe.Just(new Halogen_Svg_Attributes.RGB(50, 50, 50))) ]);
        };
    };
    var drawEdges = function (edges) {
        return function (verts) {
            var connectedVerts = Data_Functor.map(Data_Functor.functorArray)(function (v) {
                return new Data_Tuple.Tuple(Data_Array.index(verts)(v.value0), Data_Array.index(verts)(v.value1));
            })(edges);
            return Data_Functor.map(Data_Functor.functorArray)(function (v) {
                return drawLine(getPoint(v.value0))(getPoint(v.value1));
            })(connectedVerts);
        };
    };
    var drawCube = function (edges) {
        return function (vert2Ds) {
            return Data_Semigroup.append(Data_Semigroup.semigroupArray)(drawEdges(edges)(vert2Ds))(drawVertices(vert2Ds));
        };
    };
    var vert2Ds = Data_Functor.map(Data_Functor.functorArray)(project)(state.shape.vertices);
    return Halogen_HTML_Elements.div([  ])(Data_Semigroup.append(Data_Semigroup.semigroupArray)([ renderButton("rotX+")(new IncAngVelocity(X.value)), renderButton("rotY+")(new IncAngVelocity(Y.value)), renderButton("rotZ+")(new IncAngVelocity(Z.value)), renderButton("reverse")(Reverse.value), renderButton("vel++")(VelocityIncrement.value), renderButton("vel--")(VelocityDecrement.value), renderButton("Add Cube")(AddCube.value), renderButton("Remove Cube")(RemoveCube.value), Halogen_HTML_Core.text(Data_Show.show(Data_Show.showNumber)(state.velocity)), Halogen_HTML_Core.text(Data_Show.show(Data_Show.showBoolean)(state.forward)), Halogen_HTML_Core.text(Data_Show.show(Data_Show.showNumber)(state.count)) ])([ Halogen_Svg_Elements.svg([ Halogen_Svg_Attributes.viewBox(0.0)(0.0)(viewBoxSize)(viewBoxSize) ])([ Halogen_Svg_Elements.g([  ])(drawCube(state.shape.edges)(vert2Ds)) ]) ]));
};
var removeCube = function (cubes1) {
    return function (initialState) {
        return Data_Array.drop(1)(cubes1);
    };
};
var oneDegInRad = 1.745329255e-2;
var tenDegInRad = oneDegInRad * 10.0;
var initCube = {
    shape: {
        vertices: [ {
            x: 100.0,
            y: 100.0,
            z: 100.0
        }, {
            x: -100.0,
            y: 100.0,
            z: 100.0
        }, {
            x: 100.0,
            y: -100.0,
            z: 100.0
        }, {
            x: -100.0,
            y: -100.0,
            z: 100.0
        }, {
            x: 100.0,
            y: 100.0,
            z: -100.0
        }, {
            x: -100.0,
            y: 100.0,
            z: -100.0
        }, {
            x: 100.0,
            y: -100.0,
            z: -100.0
        }, {
            x: -100.0,
            y: -100.0,
            z: -100.0
        } ],
        edges: [ new Data_Tuple.Tuple(0, 1), new Data_Tuple.Tuple(0, 2), new Data_Tuple.Tuple(0, 4), new Data_Tuple.Tuple(1, 5), new Data_Tuple.Tuple(1, 3), new Data_Tuple.Tuple(2, 3), new Data_Tuple.Tuple(2, 6), new Data_Tuple.Tuple(4, 5), new Data_Tuple.Tuple(4, 6), new Data_Tuple.Tuple(3, 7), new Data_Tuple.Tuple(6, 7), new Data_Tuple.Tuple(5, 7) ]
    },
    angVel: {
        xa: tenDegInRad,
        ya: tenDegInRad,
        za: tenDegInRad
    },
    forward: true,
    velocity: 1.0,
    count: 1.0
};
var frameRate = 200.0;
var dampenPercent = 1.0 - 0.9 / frameRate;
var dampenAngVelocity = function (v) {
    var dampen = function (ang) {
        return ang * dampenPercent;
    };
    return {
        xa: dampen(v.xa),
        ya: dampen(v.ya),
        za: dampen(v.za)
    };
};
var anglePerFrame = function (v) {
    return {
        xa: v.xa / frameRate,
        ya: v.ya / frameRate,
        za: v.za / frameRate
    };
};

//-- Unit Functions
var updateCube = function (cube) {
    var newShape = {
        edges: cube.shape.edges,
        vertices: rotateShape(cube.shape.vertices)(anglePerFrame(cube.angVel))
    };
    return {
        shape: newShape,
        angVel: dampenAngVelocity(cube.angVel),
        forward: cube.forward,
        velocity: cube.velocity,
        count: cube.count
    };
};
var addCube = function (cubes1) {
    return function (initialState) {
        return Data_Array.snoc(cubes1)(initCube);
    };
};
var accelerateBy = oneDegInRad * 50.0;
var decAngVelocity = function (axis) {
    return function (cube) {
        if (axis instanceof X) {
            return {
                shape: cube.shape,
                angVel: {
                    xa: (function () {
                        if (cube.forward) {
                            return cube.angVel.xa + accelerateBy + cube.velocity;
                        };
                        return cube.angVel.xa - accelerateBy - cube.velocity;
                    })(),
                    ya: cube.angVel.ya,
                    za: cube.angVel.za
                },
                forward: cube.forward,
                velocity: cube.velocity,
                count: cube.count
            };
        };
        if (axis instanceof Y) {
            return {
                shape: cube.shape,
                angVel: {
                    xa: cube.angVel.xa,
                    ya: (function () {
                        if (cube.forward) {
                            return cube.angVel.ya + accelerateBy + cube.velocity;
                        };
                        return cube.angVel.ya - accelerateBy - cube.velocity;
                    })(),
                    za: cube.angVel.za
                },
                forward: cube.forward,
                velocity: cube.velocity,
                count: cube.count
            };
        };
        if (axis instanceof Z) {
            return {
                shape: cube.shape,
                angVel: {
                    xa: cube.angVel.xa,
                    ya: cube.angVel.ya,
                    za: (function () {
                        if (cube.forward) {
                            return cube.angVel.za + accelerateBy + cube.velocity;
                        };
                        return cube.angVel.za - accelerateBy - cube.velocity;
                    })()
                },
                forward: cube.forward,
                velocity: cube.velocity,
                count: cube.count
            };
        };
        throw new Error("Failed pattern match at Cube (line 331, column 31 - line 334, column 179): " + [ axis.constructor.name ]);
    };
};
var incAngVelocity = function (axis) {
    return function (cube) {
        if (axis instanceof X) {
            return {
                shape: cube.shape,
                angVel: {
                    xa: (function () {
                        if (cube.forward) {
                            return cube.angVel.xa + accelerateBy + cube.velocity;
                        };
                        return cube.angVel.xa - accelerateBy - cube.velocity;
                    })(),
                    ya: cube.angVel.ya,
                    za: cube.angVel.za
                },
                forward: cube.forward,
                velocity: cube.velocity,
                count: cube.count
            };
        };
        if (axis instanceof Y) {
            return {
                shape: cube.shape,
                angVel: {
                    xa: cube.angVel.xa,
                    ya: (function () {
                        if (cube.forward) {
                            return cube.angVel.ya + accelerateBy + cube.velocity;
                        };
                        return cube.angVel.ya - accelerateBy - cube.velocity;
                    })(),
                    za: cube.angVel.za
                },
                forward: cube.forward,
                velocity: cube.velocity,
                count: cube.count
            };
        };
        if (axis instanceof Z) {
            return {
                shape: cube.shape,
                angVel: {
                    xa: cube.angVel.xa,
                    ya: cube.angVel.ya,
                    za: (function () {
                        if (cube.forward) {
                            return cube.angVel.za + accelerateBy + cube.velocity;
                        };
                        return cube.angVel.za - accelerateBy - cube.velocity;
                    })()
                },
                forward: cube.forward,
                velocity: cube.velocity,
                count: cube.count
            };
        };
        throw new Error("Failed pattern match at Cube (line 338, column 29 - line 341, column 179): " + [ axis.constructor.name ]);
    };
};
var cubes = (function () {
    var render = function (state) {
        return Halogen_HTML_Elements.div([  ])([ Halogen_HTML_Elements.ul([  ])(Data_Functor.map(Data_Functor.functorArray)(renderView)(state)) ]);
    };
    var initialState = [ initCube ];
    var handleQuery = function (v) {
        if (v instanceof Tick) {
            return Control_Bind.bind(Halogen_Query_HalogenM.bindHalogenM)(Control_Monad_State_Class.modify(Halogen_Query_HalogenM.monadStateHalogenM)(function (c) {
                return Data_Functor.map(Data_Functor.functorArray)(updateCube)(c);
            }))(function () {
                return Control_Applicative.pure(Halogen_Query_HalogenM.applicativeHalogenM)(new Data_Maybe.Just(v.value0));
            });
        };
        if (v instanceof Other) {
            return Control_Applicative.pure(Halogen_Query_HalogenM.applicativeHalogenM)(new Data_Maybe.Just(v.value0));
        };
        throw new Error("Failed pattern match at Cube (line 299, column 23 - line 305, column 32): " + [ v.constructor.name ]);
    };
    
    // render = renderView
var handleAction = function (query) {
        if (query instanceof DecAngVelocity) {
            return Control_Bind.bind(Halogen_Query_HalogenM.bindHalogenM)(Control_Monad_State_Class.modify(Halogen_Query_HalogenM.monadStateHalogenM)(function (c) {
                return Data_Functor.map(Data_Functor.functorArray)(decAngVelocity(query.value0))(c);
            }))(function () {
                return Control_Applicative.pure(Halogen_Query_HalogenM.applicativeHalogenM)(Data_Unit.unit);
            });
        };
        if (query instanceof IncAngVelocity) {
            return Control_Bind.bind(Halogen_Query_HalogenM.bindHalogenM)(Control_Monad_State_Class.modify(Halogen_Query_HalogenM.monadStateHalogenM)(function (c) {
                return Data_Functor.map(Data_Functor.functorArray)(incAngVelocity(query.value0))(c);
            }))(function () {
                return Control_Applicative.pure(Halogen_Query_HalogenM.applicativeHalogenM)(Data_Unit.unit);
            });
        };
        if (query instanceof Reverse) {
            return Control_Bind.bind(Halogen_Query_HalogenM.bindHalogenM)(Control_Monad_State_Class.modify(Halogen_Query_HalogenM.monadStateHalogenM)(function (c) {
                return Data_Functor.map(Data_Functor.functorArray)(reverse)(c);
            }))(function () {
                return Control_Applicative.pure(Halogen_Query_HalogenM.applicativeHalogenM)(Data_Unit.unit);
            });
        };
        if (query instanceof VelocityIncrement) {
            return Control_Bind.bind(Halogen_Query_HalogenM.bindHalogenM)(Control_Monad_State_Class.modify(Halogen_Query_HalogenM.monadStateHalogenM)(function (c) {
                return Data_Functor.map(Data_Functor.functorArray)(velocityIncrement)(c);
            }))(function () {
                return Control_Applicative.pure(Halogen_Query_HalogenM.applicativeHalogenM)(Data_Unit.unit);
            });
        };
        if (query instanceof VelocityDecrement) {
            return Control_Bind.bind(Halogen_Query_HalogenM.bindHalogenM)(Control_Monad_State_Class.modify(Halogen_Query_HalogenM.monadStateHalogenM)(function (c) {
                return Data_Functor.map(Data_Functor.functorArray)(velocityDecrement)(c);
            }))(function () {
                return Control_Applicative.pure(Halogen_Query_HalogenM.applicativeHalogenM)(Data_Unit.unit);
            });
        };
        if (query instanceof AddCube) {
            return Control_Bind.bind(Halogen_Query_HalogenM.bindHalogenM)(Control_Monad_State_Class.modify(Halogen_Query_HalogenM.monadStateHalogenM)(function (c) {
                return addCube(c)(initialState);
            }))(function () {
                return Control_Applicative.pure(Halogen_Query_HalogenM.applicativeHalogenM)(Data_Unit.unit);
            });
        };
        if (query instanceof RemoveCube) {
            return Control_Bind.bind(Halogen_Query_HalogenM.bindHalogenM)(Control_Monad_State_Class.modify(Halogen_Query_HalogenM.monadStateHalogenM)(function (c) {
                return removeCube(c)(initialState);
            }))(function () {
                return Control_Applicative.pure(Halogen_Query_HalogenM.applicativeHalogenM)(Data_Unit.unit);
            });
        };
        throw new Error("Failed pattern match at Cube (line 200, column 30 - line 295, column 28): " + [ query.constructor.name ]);
    };
    return Halogen_Component.mkComponent({
        initialState: Data_Function["const"](initialState),
        render: render,
        "eval": Halogen_Component.mkEval({
            handleAction: handleAction,
            handleQuery: handleQuery,
            receive: Halogen_Component.defaultEval.receive,
            initialize: Halogen_Component.defaultEval.initialize,
            finalize: Halogen_Component.defaultEval.finalize
        })
    });
})();
module.exports = {
    DecAngVelocity: DecAngVelocity,
    IncAngVelocity: IncAngVelocity,
    Reverse: Reverse,
    VelocityIncrement: VelocityIncrement,
    VelocityDecrement: VelocityDecrement,
    AddCube: AddCube,
    RemoveCube: RemoveCube,
    X: X,
    Y: Y,
    Z: Z,
    Tick: Tick,
    Other: Other,
    accelerateBy: accelerateBy,
    addCube: addCube,
    anglePerFrame: anglePerFrame,
    cubes: cubes,
    dampenAngVelocity: dampenAngVelocity,
    dampenPercent: dampenPercent,
    decAngVelocity: decAngVelocity,
    frameRate: frameRate,
    incAngVelocity: incAngVelocity,
    initCube: initCube,
    oneDegInRad: oneDegInRad,
    removeCube: removeCube,
    renderView: renderView,
    reverse: reverse,
    rotate: rotate,
    rotateShape: rotateShape,
    tenDegInRad: tenDegInRad,
    velocityDecrement: velocityDecrement,
    velocityIncrement: velocityIncrement,
    viewBoxSize: viewBoxSize,
    viewCenter: viewCenter,
    updateCube: updateCube
};

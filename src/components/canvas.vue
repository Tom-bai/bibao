<template>
    <div>
        <!-- <div class="controls">
            <div class="functions btn-group"></div>
            <div class="rotate btn-group">
                <div class="btn rotatex" data-rotate="x">rotatex</div>
                <div class="btn rotatey" data-rotate="y">rotatey</div>
                <div class="btn rotatez" data-rotate="z">rotatez</div>
            </div>
        </div> -->
        <canvas id="canvas" width="2560" height="900" style="min-width: 900px; width: 100%; position: fixed; left: 50%; top: 80%; transform: translate(-50%, -50%)"></canvas>
    </div>
</template>
<script>
    export default {
        name: 'canvas-component',
        mounted() {
            this.initCanvas();
        },
        methods: {
            initCanvas() {
                var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();
                function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }
                function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }
                function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }
                var Point = function (_F3$Obj) {
                    _inherits(Point, _F3$Obj);
                    function Point() {
                        var radius = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : 5;

                        _classCallCheck(this, Point);

                        var _this = _possibleConstructorReturn(this, (Point.__proto__ || Object.getPrototypeOf(Point)).call(this));

                        _this.radius = radius;
                        _this.color = 'rgba(' + [Math.random() * 255 | 0, Math.random() * 255 | 0, Math.random() * 255 | 0, Math.random()].join(',') + ')';
                        _this.prevCrood = null;
                        return _this;
                    }

                    _createClass(Point, [{
                        key: 'render',
                        value: function render(ctx) {

                            ctx.fillStyle = '#fff';
                            ctx.fillRect(this.croods2D.position.x, this.croods2D.position.y, this.radius * this.croods2D.scale * this.yScale, this.radius * this.croods2D.scale * this.yScale);
                        }
                    }]);
                    return Point;
                }(F3.Obj);
                var planeFunctions = {
                    'sin(sqrt(x^2+z^2))': function sinSqrtX2Z2(x, z, offset) {
                        return Math.sin(Math.sqrt(Math.pow(x / 2, 2) + Math.pow(z / 2, 2)) - offset);
                    },
                    'cos(x)*sin(z)': function cosXSinZ(x, z, offset) {
                        return Math.cos(x / 4 + offset) * Math.sin(z / 4 + offset) * 1;
                    }
                };
                var Effect = function (_F3$Time) {
                    _inherits(Effect, _F3$Time);
                    function Effect(renderer, scene, camera, cvs) {
                        _classCallCheck(this, Effect);
                        var _this2 = _possibleConstructorReturn(this, (Effect.__proto__ || Object.getPrototypeOf(Effect)).call(this));
                        _this2.renderer = renderer;
                        _this2.scene = scene;
                        _this2.camera = camera;
                        _this2.cvs = cvs;

                        _this2.xOffset = 0;
                        _this2.waveHeight = 0.4; // 波高
                        _this2.waveWidth = 8; // 波长

                        _this2.col = 33;
                        _this2.colPointNum = 33;

                        _this2.flyTime = 2000;
                        _this2.timePass = 0;

                        _this2.scale = 1;
                        _this2.scaleStep = 0.01;

                        _this2.planeFunction = function () {
                            return 0;
                        };
                        _this2.rotate = { x: false, y: false, z: false };

                        _this2.pointGroup = new F3.Obj();
                        _this2.scene.add(_this2.pointGroup);

                        _this2.resize(cvs.width, cvs.height);
                        _this2.init();
                        return _this2;
                    }

                    _createClass(Effect, [{
                        key: 'resize',
                        value: function resize(width, height) {
                            this.cvs.width = width;
                            this.cvs.height = height;
                            // this.pointGroup.position.set(this.cvs.width/2, this.cvs.height, 0);
                            this.stepWidth = width * 1.8 / this.col;
                            this.pointGroup.setPosition(this.cvs.width / 2, this.cvs.height * 1.2, -this.col * this.stepWidth / 2);
                            this.pointGroup.setRotation(0.1, 0, 0);
                            // this.waveHeight = height/2;
                            // this.waveWidth = this.waveHeight * 4;
                            // console.log(this.stepWidth);
                        }
                    }, {
                        key: 'init',
                        value: function init() {
                            // create point
                            var point;
                            for (var x = -(this.col - 1) / 2, count = 0; x <= (this.col - 1) / 2; x++) {
                                for (var z = -(this.colPointNum - 1) / 2; z <= (this.colPointNum - 1) / 2; z++) {
                                    point = new Point(10);
                                    this.pointGroup.add(point);
                                    /*point.initPos = new F3.Vector3(
                                         x + Math.random() * -2 + 1,
                                         -30 + -10 * Math.random(),
                                         z + Math.random() * -2 + 1
                                    );*/
                                    point.initPos = new F3.Vector3(0, 0, 0);
                                    point.flyDelay = 0; //Math.random() * 1000 | 0;
                                }
                            }
                        }
                    }, {
                        key: 'update',
                        value: function update(delta) {
                            this.timePass += delta;
                            this.xOffset = this.timePass / 500;

                            var point = void 0;
                            var flyPecent = void 0;
                            var x = void 0,
                                y = void 0,
                                z = void 0;
                            var count = 0;

                            // if (this.timePass < 100)
                            for (x = -(this.col - 1) / 2; x <= (this.col - 1) / 2; x++) {
                                for (z = -(this.colPointNum - 1) / 2; z <= (this.colPointNum - 1) / 2; z++) {

                                    // let y = Math.cos(x*Math.PI/this.waveWidth + this.xOffset)*Math.sin(z*Math.PI/this.waveWidth + this.xOffset) * this.waveHeight;

                                    y = this.planeFunction(x, z, this.xOffset);
                                    // let y = Math.sin(Math.sqrt(Math.pow(x/v, 2)+Math.pow(z/v, 2)) - this.xOffset) * 1
                                    // console.log(y);

                                    point = this.pointGroup.children[count];
                                    point.yScale = 1; //(-y + 0.6)/(this.waveHeight) * 1.5;

                                    flyPecent = (this.timePass - point.flyDelay) / this.flyTime;
                                    flyPecent = flyPecent > 1 ? 1 : flyPecent < 0 ? 0 : flyPecent;

                                    point.setPosition(x * this.stepWidth, y * this.stepWidth, z * this.stepWidth);
                                    count++;
                                }
                            }
                            if (this.rotate.x || this.rotate.y || this.rotate.z) {
                                this.pointGroup.setRotation(this.rotate.x ? this.pointGroup.rotation.x + 0.001 : 0, this.rotate.y ? this.pointGroup.rotation.y + 0.001 : 0, this.rotate.z ? this.pointGroup.rotation.z + 0.001 : 0);
                            }
                        }
                    }, {
                        key: 'setFunction',
                        value: function setFunction(fun) {
                            this.planeFunction = fun;
                        }
                    }, {
                        key: 'toggleRotate',
                        value: function toggleRotate(r) {
                            this.rotate[r] = !this.rotate[r];
                            if (!this.rotate[r]) {
                                this.pointGroup.rotation[r] = 0;
                            }
                        }
                    }, {
                        key: 'animate',
                        value: function animate() {
                            var _this3 = this;

                            this.addTick(function (delta) {
                                _this3.update(delta);
                                _this3.renderer.render(_this3.scene, _this3.camera);
                            });
                        }
                    }]);

                    return Effect;
                }(F3.Time);
                function init(cvs) {
                    var ctx = cvs.getContext('2d');
                    var scene = new F3.Scene();
                    var camera = new F3.Camera();
                    camera.origin = new F3.Vector3(cvs.width / 2, cvs.height / 3);
                    camera.p = 1200;
                    var renderer = new F3.Renderer(ctx, cvs);
                    var effect = new Effect(renderer, scene, camera, cvs);
                    effect.animate();
                    function selectFunction(funName) {
                        effect.setFunction(planeFunctions[funName]);
                    }
                    selectFunction('sin(sqrt(x^2+z^2))');// cos(x)*sin(z)
                    function toggleRotate(_r) {
                        effect.toggleRotate(_r);
                    }
                    toggleRotate('y'); // x，y,z
                    F3.TIME.start();
                }
                init(document.querySelector('#canvas'));
            }
        }
    }
</script>
<style scoped>
    .controls {
        width: 500px;
        display: inline-block;
        position: absolute;
        top: 20px;
        left: 50%;
        transform: translate(-50%, 0);
    }

    .btn-group {
        display: inline-block;
    }

    .btn {
        display: inline-block;
        margin-bottom: 0;
        font-weight: 500;
        text-align: center;
        -ms-touch-action: manipulation;
        touch-action: manipulation;
        cursor: pointer;
        background-image: none;
        border: 1px solid transparent;
        white-space: nowrap;
        line-height: 1.5;
        padding: 4px 15px;
        font-size: 12px;
        border-radius: 0px;
        -webkit-user-select: none;
        -moz-user-select: none;
        -ms-user-select: none;
        user-select: none;
        -webkit-transition: all 0.3s cubic-bezier(0.645, 0.045, 0.355, 1);
        transition: all 0.3s cubic-bezier(0.645, 0.045, 0.355, 1);
        position: relative;
        color: rgba(0, 0, 0, 0.65);
        background-color: #fff;
        border-color: #d9d9d9;
    }

    .btn:first-child {
        border-radius: 4px 0 0 4px;
    }

    .btn:last-child {
        border-radius: 0 4px 4px 0;
    }

    .btn.active {
        color: #fff;
        background-color: #dc7953;
        border-color: #dc7953;
    }

    .rotate {
        margin-left: 20px;
    }

    .rotate .btn {
        border: none;
        border-radius: 20px;
    }
</style>
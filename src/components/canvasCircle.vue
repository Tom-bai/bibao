<template>
    <div :id="canvasId" class="canvas-wrap"></div>
</template>
<script>
    export default {
        name: "CanvasCircle",
        props: {
            text: {
                type: String
            },
            percentage: {
                require: true,
                default: 50
            },
            iconURL: {
                type: String
            },
            maskColor: {
                default: 'red'
            },
            coinName: {
                type: String
            },
            lineWidth: {
                default: 10
            },
            diameter: {
                default: 135
            }
        },
        data() {
            return {

            }
        },
        watch: {
            text(val) {
            },
            percentage(val) {
            }
        },
        computed: {
            canvasId() {
                return `canvaId${this._uid}`
            }
        },
        mounted() {
            this.initData();
            // this.initData();
        },
        methods: {
            initData() {
                var vue_self = this;
                var canvasCircle = (function (w, d) {
                    function Circle(option) {
                        this.default = {
                            'canvasWrap': null,//【必填】包裹圆环的div盒子
                            'diameter': 150,//【圆的直径】
                            'lineWidth': 15,//【圆环大小 】
                            'baseColor': '#eaeaea',//【圆的底层颜色】
                            'maskColor': ['#ff0', '#f00'], //【圆的遮罩颜色】可以为一个颜色#f00,也可以为数组【但是接收两个颜色】
                            'percentage': 50,//【百分比】
                            'textColor': '#262B2E',//【字体颜色】
                            'fontSize': '20px',//【字体大小】
                            'callback': () => {
                                // console.log('执行回调');
                            }
                        };
                        this.op = this.extend(this.default, option);
                        this.init();
                    }

                    Circle.prototype = {
                        //初始化入口
                        init: function () {
                            if (!this.op.canvasWrap) {
                                //如果没有this.op.canvasWrap
                                throw new Error('CanvasWrap is not defined !');
                            }
                            this.createEle();
                        },
                        //创建元素
                        createEle: function () {
                            var _this = this;
                            var eleWrap = d.querySelector(_this.op.canvasWrap);
                            let { canvas1, canvas2 } = {};
                            _this.canvasOut = canvas1 = d.createElement('canvas');
                            _this.canvasInt = canvas2 = d.createElement('canvas');
                            _this.canvasOut.className = 'canvasWrap';
                            _this.canvasInt.className = 'canvasBox';
                            if (vue_self.iconURL) {
                                var icon = document.createElement('img');
                                icon.src = vue_self.iconURL;
                                icon.className = 'icon-position'
                                icon.style.cssText = `position: absolute;left: -7px;top: -2px;z-index: 99;transform: rotate(-14deg);`
                                eleWrap.appendChild(icon);
                            }
                            eleWrap.appendChild(_this.canvasOut);
                            eleWrap.appendChild(_this.canvasInt);
                            this.addStyle(eleWrap, canvas1, canvas2, this.op.diameter, this.op.diameter);
                        },
                        //添加样式
                        addStyle: function (wrap, eleInt, eleOut, w, h) {
                            var ctx1 = eleInt.getContext('2d');
                            var ctx2 = eleOut.getContext('2d');
                            var _this = this;
                            wrap.style.cssText = 'position:relative;width:' + w + 'px;height:' + h + 'px';
                            eleInt.width = eleOut.width = w;
                            eleInt.height = eleOut.height = w;
                            eleInt.style.cssText = eleOut.style.cssText = 'position:absolute;left:0;top:0;transform:rotate(-90deg);text-align:center;line-height:135px;';
                            _this.drawCanvas(ctx1, ctx2);
                        },
                        //填充canvas
                        drawCanvas: function (ctx1, ctx2) {
                            var _this = this;
                            var o = _this.op;
                            ctx1.lineWidth = o.lineWidth;
                            ctx1.strokeStyle = o.baseColor;
                            ctx1.beginPath();
                            ctx1.arc(o.diameter / 2, o.diameter / 2, o.diameter / 2 - o.lineWidth / 2, 0, 2 * Math.PI, false);
                            ctx1.stroke();
                            ctx1.closePath();
                            ctx2.lineWidth = o.lineWidth;
                            ctx2.strokeStyle = o.baseColor;
                            ctx2.lineWidth = o.lineWidth;
                            ctx2.strokeStyle = o.maskColor;
                            _this.animateCanvas(ctx2, o.percentage);
                        },
                        //执行canvas动画
                        animateCanvas: function (ctx2, percent) {
                            var timer = null;
                            var angle = 0;
                            var percentage = null;
                            var _this = this;
                            var o = _this.op;
                            var diameter = _this.op.diameter;
                            (function changeCanvas() {
                                timer = requestAnimationFrame(changeCanvas);
                                ctx2.beginPath();
                                ctx2.arc(o.diameter / 2, diameter / 2, diameter / 2 - o.lineWidth / 2, 0, angle * Math.PI / 180, false);
                                ctx2.clearRect(0, 0, diameter, diameter);
                                percentage = parseInt(angle / 360 * 100);
                                if (percentage < percent) {
                                    angle = angle + 1 ;
                                } else {
                                    window.cancelAnimationFrame(timer);
                                    if (o.callback && typeof o.callback == 'function') {
                                        o.callback();
                                    }
                                }
                                
                                ctx2.stroke();
                                ctx2.closePath();
                                ctx2.rotate(90 * Math.PI / 180);
                                ctx2.font = o.fontSize + ' Arial';
                                if (Object.prototype.toString.call(o.maskColor) === '[object Array]') {
                                    var gradient = ctx2.createLinearGradient(0, 0, diameter * 2, 10);
                                    for (var i = 0; i < o.maskColor.length; i++) {
                                        gradient.addColorStop(i, o.maskColor[i]);
                                    }
                                    ctx2.strokeStyle = gradient;
                                } else if (Object.prototype.toString.call(o.maskColor) === '[object String]') {
                                    ctx2.strokeStyle = o.maskColor;
                                }

                                ctx2.fillStyle = o.textColor;
                                if (vue_self.text && vue_self.coinName) {
                                    ctx2.fillText(vue_self.text, diameter / 2 + o.lineWidth / 2, -diameter / 1.7 + o.lineWidth / 1.7);
                                    ctx2.font = '18px Arial';
                                    ctx2.fillText(vue_self.coinName, diameter / 2 + o.lineWidth / 2, -diameter / 2.4 + o.lineWidth / 2.4);
                                } else {
                                    ctx2.fillText(percentage + ' %', diameter / 2 + o.lineWidth / 2, -diameter / 2 + o.lineWidth / 2);
                                }
                                ctx2.textBaseline = 'middle';
                                ctx2.textAlign = 'center';
                                ctx2.closePath();
                                ctx2.restore();
                            })();
                        },
                        //合并参数
                        extend: function (defaults, option) {
                            for (let i in option) {
                                defaults[i] = option[i];
                            }
                            return defaults;
                        }
                    }
                    return Circle;
                })(window, document);

                new canvasCircle({
                    canvasWrap: `#${this.canvasId}`,
                    percentage: this.percentage,
                    lineWidth: this.lineWidth,
                    maskColor: this.maskColor,
                    diameter: this.diameter
                });
            }
        }
    }
</script>
<style scoped lang="scss">
    .canvas-wrap {
        margin: 0 auto;
        text-align: center;
        line-height: 135px;
    }

    .icon-position {
        position: absolute;
        left: -4px;
        top: 0px;
        z-index: 99;
        transform: rotate(-14deg);
    }
</style>
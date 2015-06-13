;(function () {

    function getRandomInt(min, max) {
        return Math.floor(Math.random() * (max - min + 1)) + min;
    }

    var collectImage = {
        init: function ($el, ops) {
            this.$el = $el;
            this.ops = ops;
            this.datas = ops.datas;

            this.objs = [];
            this.closeObjs = [];
            this.t0 = 0;
            this.createObjs();
            this.animFrame();
        },

        createObjs: function () {
            var len = this.datas.length;

            for (var i = 0; i < len; i++) {
                var newObj = this.datas[i];
                var params = {};

                params.$el = newObj.$el,
                params.w = newObj.width;
                params.h = newObj.height;
                params.mass = 1;

                this.objs.push(new Obj(params));
                this.objs[i].pos2D = new Vector2D(getRandomInt(-500, 500), getRandomInt(-300, 300));
                this.objs[i].center2D = new Vector2D(0, 0);
                this.objs[i].datas = newObj;
                this.objs[i].changeStyles();
                this.objs[i].isIncluded = false;
            }
        },

        animFrame: function () {
            var _this = this;

            animFrame();
            function animFrame() {
                _this.animId = requestAnimationFrame(animFrame);
                _this.onTimer();
            }
        },

        stopAnimate: function (evt) {
            cancelAnimationFrame(this.animId);
        },

        onTimer: function () {
            var t1 = new Date().getTime();
            this.dt = 0.005 * (t1 - this.t0);
            this.t0 = t1;

            if (this.dt > 0.2) {
                this.dt = 0;
            }

            this.move();
        },

        move: function () {
            for (var i = 0, len = this.objs.length; i < len; i++) {
                var obj = this.objs[i];

                this.moveObject(obj);
                this.calcForce(obj);
                this.updateAccel(obj);
                this.updateVelo(obj);
                this.checkStop(obj);
            }
        },

        moveObject: function (obj) {
            obj.pos2D = obj.pos2D.addScaled(obj.velo2D, this.dt);
            obj.changeStyles();
        },

        calcForce: function (obj) {
            var displ = obj.pos2D.subtract(obj.center2D);
            var restoring = Forces.spring(obj.datas.kSpring, displ);
            var damping = Forces.damping(obj.datas.kDamping, obj.velo2D);

            obj.force = Forces.add([restoring, damping]);
        },

        updateAccel: function (obj) {
            obj.acc = obj.force.multiply(1 / obj.mass);
        },

        updateVelo: function (obj) {
            obj.velo2D = obj.velo2D.addScaled(obj.acc, this.dt);
        },

        checkStop: function (obj) {
            // if (Math.round(obj.acc.length()) === 0 && !obj.isIncluded) {
            //     obj.isIncluded = true;
            //     obj.pos2D = new Vector2D(0, 0);
            //     this.closeObjs.push(obj);
            //     console.log(1)

            // }

            // if (this.objs.length === this.closeObjs.length) {
            //     stopAnimate();
            // }
        }
    };

    $.fn.collectImage = function (ops) {
        var options = $.extend({}, $.fn.collectImage.options, ops);

        this.each(function () {
            var $this = $(this);

            if ($this.data('init')) {
                return false;
            }

            $this.data('init', true);

            var newCollectImage = Object.create(collectImage);
            newCollectImage.init($this, options);
        });
    };

    $.fn.collectImage.options = {
    };

    window.onload = function () {
        var sizeEl = 20;
        var count = 500 / sizeEl;
        var $container = $('.Container');
        var home = [];

        for (var i = 0; i < count; i++) {
            for (var j = 0; j < count; j++) {
                var $item = $('<div class="Container-item"></div>');
                $item.css({
                    width: sizeEl,
                    height: sizeEl,
                    top: j * sizeEl,
                    left: i * sizeEl,
                    backgroundPosition: (-i * sizeEl) + 'px ' + (-j * sizeEl) + 'px'
                });

                home.push({
                    $el: $item,
                    top: j * sizeEl,
                    left: i * sizeEl,
                    size: sizeEl,
                    kSpring: getRandomInt(8, 50) / 10,
                    kDamping: 0.1
                });

                $container.append($item);
            }
        }

        $container.collectImage({
            datas: home
        });
    };
}());

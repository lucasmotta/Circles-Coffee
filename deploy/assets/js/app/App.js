// Generated by CoffeeScript 1.3.3
(function() {
  var AbstractCircle, AppView, CircleTouchView, CircleView, Point,
    __bind = function(fn, me){ return function(){ return fn.apply(me, arguments); }; },
    __hasProp = {}.hasOwnProperty,
    __extends = function(child, parent) { for (var key in parent) { if (__hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor(); child.__super__ = parent.prototype; return child; };

  $(function() {
    this.window = $(window);
    this.isMobile = /Android|webOS|iPhone|iPad|iPod|BlackBerry/i.test(navigator.userAgent);
    if (!this.isMobile) {
      $("#navigation").css({
        "display": "block"
      });
      $("#share").css({
        "display": "block"
      });
    }
    document.body.addEventListener("touchmove", function(event) {
      return event.preventDefault();
    });
    this.app = new AppView("#circles");
    return this;
  });

  Point = (function() {

    Point.prototype.x = 0;

    Point.prototype.y = 0;

    function Point(x, y) {
      this.x = x != null ? x : 0;
      this.y = y != null ? y : 0;
    }

    Point.prototype.reset = function() {
      this.x = 0;
      this.y = 0;
      return this;
    };

    /*
    	Get the center distance between two different items
    	@param		b 				Item to compare
    */


    Point.prototype.distanceTo = function(b) {
      var x, y;
      x = b.x - this.x;
      y = b.y - this.y;
      x = x * x;
      y = y * y;
      return Math.sqrt(x + y);
    };

    /*
    	Get the angle between two different items
    	@param		b 				Item to compare
    */


    Point.prototype.angleTo = function(b) {
      var x, y;
      x = this.x - b.x;
      y = this.y - b.y;
      return Math.atan2(x, y);
    };

    return Point;

  })();

  AbstractCircle = (function(_super) {

    __extends(AbstractCircle, _super);

    AbstractCircle.prototype.fixed = false;

    AbstractCircle.prototype.dragging = false;

    AbstractCircle.prototype.over = false;

    AbstractCircle.prototype.selected = false;

    AbstractCircle.prototype.momentum = null;

    AbstractCircle.prototype.position = null;

    AbstractCircle.prototype.center = null;

    AbstractCircle.prototype.clickPos = null;

    AbstractCircle.prototype.color = 0;

    AbstractCircle.prototype.radius = 0;

    AbstractCircle.prototype.originalRadius = 0;

    AbstractCircle.prototype.openedRadius = 200;

    AbstractCircle.prototype.priority = 0;

    AbstractCircle.prototype.container = null;

    AbstractCircle.prototype.content = null;

    AbstractCircle.prototype.contentHeight = 0;

    AbstractCircle.prototype.contentWidth = 0;

    /*
    	Signals
    */


    AbstractCircle.prototype.changed = null;

    /*
    	@param		display			Set the DOM object of your item
    	@param 		color			Color of your item
    */


    function AbstractCircle(display, color, container) {
      this.display = display;
      this.color = color != null ? color : "#F66";
      this.container = container;
      this.updateRadius = __bind(this.updateRadius, this);

      this.hideContent = __bind(this.hideContent, this);

      this.showContent = __bind(this.showContent, this);

      AbstractCircle.__super__.constructor.call(this, 0, 0);
      this.radius = parseFloat(this.display.attr("data-radius"));
      this.originalRadius = this.radius;
      this.momentum = new Point();
      this.position = new Point();
      this.center = new Point();
      this.clickPos = new Point();
      this.setPos(this.container.width() * .5, this.container.height());
      this.display.css({
        "display": "inline",
        "width": this.radius * 2,
        "height": this.radius * 2,
        "background-color": this.color
      });
      this.content = $(this.display.find("p"));
      this.contentHeight = this.content.height();
      this.contentWidth = this.content.width();
      this.content.css({
        "display": "inline",
        "background-color": this.color
      });
      this.content.remove();
      this.openedRadius = 200;
      this.changed = new signals.Signal();
      this.setupEvents();
    }

    /*
    	Apply the position to the DOM object
    */


    AbstractCircle.prototype.apply = function() {
      return console.log("Warning: This method should be overridden");
    };

    /*
    	Setup the regular events
    */


    AbstractCircle.prototype.setupEvents = function() {
      return console.log("Warning: This method should be overridden");
    };

    /*
    	Setup the items and push them to an array
    */


    AbstractCircle.prototype.setSelected = function() {
      return console.log("Warning: This method should be overridden");
    };

    AbstractCircle.prototype.showContent = function() {
      this.display.append(this.content);
      return TweenLite.to(this.content, .5, {
        css: {
          opacity: 1
        },
        ease: Quart.easeOut
      });
    };

    AbstractCircle.prototype.hideContent = function() {
      var _this = this;
      return TweenLite.to(this.content, .2, {
        css: {
          opacity: 0
        },
        ease: Quart.easeOut,
        onComplete: function() {
          return _this.content.remove();
        }
      });
    };

    /*
    	Set the position of your display
    */


    AbstractCircle.prototype.setPos = function(x, y) {
      this.x = this.position.x = x;
      this.y = this.position.y = y;
      return this.display.css({
        "left": this.x,
        "top": this.y
      });
    };

    /*
    	Update the position of your item based on the given center position
    	@param		destination		Destination point of your circle
    */


    AbstractCircle.prototype.update = function(destination) {
      if (this.fixed) {
        return;
      }
      this.momentum.reset();
      if (this.selected) {
        this.momentum.x -= (this.center.x - destination.x) * .15;
        this.momentum.y -= (this.center.y - destination.y) * .15;
      } else {
        this.momentum.x -= (this.center.x - destination.x) * .02;
        this.momentum.y -= (this.center.y - destination.y) * .02;
      }
      this.position.x += this.momentum.x;
      return this.position.y += this.momentum.y;
    };

    /*
    	Compare two different items and sort their positions to avoid colisions
    	@param		b 				Item to compare
    */


    AbstractCircle.prototype.compare = function(b) {
      var angle, distance, force, margin, minDistance;
      if (this.fixed) {
        return;
      }
      angle = this.center.angleTo(b.center);
      distance = this.center.distanceTo(b.center);
      margin = 20;
      minDistance = this.radius + b.radius + margin;
      force = 1;
      if (distance < minDistance) {
        this.position.x += Math.sin(angle) * (minDistance - distance) * force;
        this.position.y += Math.cos(angle) * (minDistance - distance) * force;
      }
      return this;
    };

    /*
    	Update the DOM object with the radius
    */


    AbstractCircle.prototype.updateRadius = function() {
      return this.display.css({
        "width": this.radius * 2,
        "height": this.radius * 2
      });
    };

    return AbstractCircle;

  })(Point);

  AppView = (function() {

    AppView.prototype.items = [];

    AppView.prototype.colors = ["#C9D5A8", "#871F3B", "#F66", "#0c9"];

    AppView.prototype.center = null;

    AppView.prototype.id = 0;

    AppView.prototype.container = null;

    AppView.prototype.currentItem = null;

    AppView.prototype.isTouchScreen = false;

    /*
    	An <ul> id that contains all the list items (<li>)
    	@param		container_id	Id of your list
    */


    function AppView(container_id) {
      this.container_id = container_id;
      this.onItemSelected = __bind(this.onItemSelected, this);

      this.updateItems = __bind(this.updateItems, this);

      this.container = $(this.container_id);
      this.isTouchScreen = "ontouchstart" in document.documentElement;
      this.center = new Point(this.container.width() * .5, this.container.height() * .5);
      this.setupItems();
      this.id = setInterval(this.updateItems, 30);
    }

    /*
    	Setup the items and push them to an array
    */


    AppView.prototype.setupItems = function() {
      var CircleClass, c, i, list;
      list = this.container.children();
      i = list.length;
      c = null;
      CircleClass = (this.isTouchScreen ? CircleTouchView : CircleView);
      while (i-- > 0) {
        c = new CircleClass($(list[i]), this.colors[i % this.colors.length], this.container);
        c.changed.add(this.onItemSelected);
        this.items.push(c);
      }
      return this;
    };

    /* 
    	Update the position of all the items
    */


    AppView.prototype.updateItems = function() {
      var i, item, j, length;
      length = this.items.length;
      i = 0;
      j = 0;
      item = null;
      this.center.x = this.container.width() * .5;
      this.center.y = this.container.height() * .5;
      while (i < length) {
        j = 0;
        this.items[i].update(this.center);
        while (j < length) {
          if (i !== j) {
            if (this.items[i].priority <= this.items[j].priority) {
              this.items[i].compare(this.items[j]);
            }
          }
          j++;
        }
        this.items[i].apply();
        i++;
      }
      return this;
    };

    /*
    	Method for when the item is selected (clicked)
    */


    AppView.prototype.onItemSelected = function(target) {
      if (this.currentItem !== null) {
        this.currentItem.setSelected(false);
      }
      this.currentItem = target;
      return this.currentItem.setSelected(true);
    };

    return AppView;

  })();

  CircleView = (function(_super) {

    __extends(CircleView, _super);

    CircleView.prototype.pressTime = 0;

    function CircleView(display, color, container) {
      this.display = display;
      this.color = color != null ? color : "#F66";
      this.container = container;
      CircleView.__super__.constructor.call(this, this.display, this.color, this.container);
    }

    CircleView.prototype.setPos = function(x, y) {
      TweenLite.killTweensOf(this.display);
      return CircleView.__super__.setPos.call(this, x, y);
    };

    CircleView.prototype.setSelected = function(selected) {
      this.selected = selected;
      this.priority = selected != null ? selected : {
        1: 0
      };
      this.display.css("cursor", "default");
      TweenLite.killTweensOf(this);
      if (this.selected) {
        return TweenLite.to(this, 1, {
          radius: this.openedRadius,
          ease: Quart.easeOut,
          onUpdate: this.updateRadius,
          onComplete: this.showContent
        });
      } else {
        this.hideContent();
        return TweenLite.to(this, 1, {
          radius: this.originalRadius,
          ease: Quart.easeOut,
          onUpdate: this.updateRadius,
          delay: .2
        });
      }
    };

    CircleView.prototype.apply = function() {
      this.x -= (this.x - this.position.x) * .1;
      this.y -= (this.y - this.position.y) * .1;
      this.center.x = this.x + this.radius;
      this.center.y = this.y + this.radius;
      if (this.selected) {
        this.content.css({
          "top": this.radius - this.contentHeight * .5,
          "left": this.radius - this.contentWidth * .5
        });
      }
      if (this.dragging) {
        return;
      }
      return TweenLite.to(this.display, .2, {
        css: {
          left: this.x,
          top: this.y
        },
        ease: Quart.easeOut
      });
    };

    CircleView.prototype.setupEvents = function() {
      /*
      		Roll Over
      */

      var _this = this;
      this.display.mouseenter(function() {
        if (_this.fixed) {
          return;
        }
        if (_this.selected) {
          return;
        }
        _this.over = true;
        TweenLite.to(_this, 1, {
          radius: _this.originalRadius + 50,
          ease: Quart.easeOut,
          onUpdate: _this.updateRadius
        });
        _this.display.css("cursor", "pointer");
        return _this;
      });
      /*
      		Roll Out
      */

      this.display.mouseleave(function() {
        if (_this.fixed) {
          return;
        }
        if (_this.selected) {
          return;
        }
        _this.over = false;
        TweenLite.to(_this, 1, {
          radius: _this.originalRadius,
          ease: Quart.easeOut,
          onUpdate: _this.updateRadius
        });
        _this.display.css("cursor", "default");
        return _this;
      });
      /*
      		Mouse Down
      */

      this.display.mousedown(function() {
        if (_this.selected) {
          return;
        }
        _this.fixed = true;
        _this.dragging = true;
        _this.clickPos.x = event.offsetX + _this.container.position().left;
        _this.clickPos.y = event.offsetY + _this.container.position().top;
        _this.pressTime = new Date().getTime();
        /*
        			Mouse Up
        */

        $(window).bind("mouseup", function() {
          _this.fixed = false;
          _this.dragging = false;
          $(window).unbind("mouseup");
          $(window).unbind("mousemove");
          return _this;
        });
        /*
        			Mouse Move
        */

        $(window).bind("mousemove", function(event) {
          _this.setPos(event.pageX - _this.clickPos.x, event.pageY - _this.clickPos.y);
          return _this;
        });
        return _this;
      });
      this.display.dblclick(function() {
        return _this.changed.dispatch(_this);
      });
      return this;
    };

    return CircleView;

  })(AbstractCircle);

  CircleTouchView = (function(_super) {

    __extends(CircleTouchView, _super);

    CircleTouchView.prototype.touch = null;

    CircleTouchView.prototype.touchId = 0;

    CircleTouchView.prototype.lastTouch = 0;

    CircleTouchView.prototype.pinching = false;

    CircleTouchView.prototype.pinchingDistance = 0;

    CircleTouchView.prototype.clickRadius = 0;

    function CircleTouchView(display, color, container, isTouchScreen) {
      this.display = display;
      this.color = color != null ? color : "#F66";
      this.container = container;
      this.isTouchScreen = isTouchScreen;
      this.updateRadius = __bind(this.updateRadius, this);

      CircleTouchView.__super__.constructor.call(this, this.display, this.color, this.container);
    }

    CircleTouchView.prototype.setSelected = function(selected) {
      this.selected = selected;
      return this.priority = selected != null ? selected : {
        1: 0
      };
    };

    CircleTouchView.prototype.apply = function() {
      this.x -= (this.x - this.position.x) * .1;
      this.y -= (this.y - this.position.y) * .1;
      this.center.x = this.x + this.radius;
      this.center.y = this.y + this.radius;
      this.content.css({
        "top": this.radius - this.contentHeight * .5,
        "left": this.radius - this.contentWidth * .5
      });
      if (this.dragging) {
        return;
      }
      this.display.css("left", this.x);
      return this.display.css("top", this.y);
    };

    CircleTouchView.prototype.updateRadius = function() {
      CircleTouchView.__super__.updateRadius.call(this);
      if (this.touch) {
        return this.setPos(this.touch.pageX - this.clickPos.x - this.radius, this.touch.pageY - this.clickPos.y - this.radius);
      }
    };

    CircleTouchView.prototype.setupEvents = function() {
      /*
      		Touch Start
      */

      var _this = this;
      this.display.bind("doubletap", function(event) {
        return console.log("double tap");
      });
      this.display.bind("touchstart", function(event) {
        var touches;
        touches = event.originalEvent.touches;
        _this.touchId = touches.length - 1;
        _this.touch = touches[_this.touchId];
        _this.pinching = touches.length === 2;
        _this.clickRadius = _this.radius;
        if (_this.pinching) {
          _this.pinchingDistance = new Point(touches[0].pageX, touches[0].pageY).distanceTo(new Point(touches[1].pageX, touches[1].pageY));
        }
        if (_this.dragging) {
          return;
        }
        _this.dragging = true;
        _this.over = true;
        _this.clickPos.x = _this.container.position().left;
        _this.clickPos.y = _this.container.position().top;
        TweenLite.to(_this, .5, {
          radius: _this.originalRadius + 20,
          ease: Quart.easeOut,
          onUpdate: _this.updateRadius
        });
        /*
        			Touch End
        */

        _this.display.bind("touchend", function(event) {
          _this.over = false;
          _this.dragging = false;
          _this.touch = null;
          _this.pinching = event.originalEvent.touches.length === 2;
          TweenLite.to(_this, .5, {
            radius: _this.originalRadius,
            ease: Quart.easeOut,
            onUpdate: _this.updateRadius
          });
          $(window).unbind("touchend");
          return $(window).unbind("touchmove");
        });
        /*
        			Touch Move
        */

        $(window).bind("touchmove", function(event) {
          var distance;
          touches = event.originalEvent.touches;
          _this.pinching = touches.length === 2;
          distance = 0;
          if (_this.pinching) {
            distance = new Point(touches[0].pageX, touches[0].pageY).distanceTo(new Point(touches[1].pageX, touches[1].pageY));
            _this.radius = _this.originalRadius = distance - _this.pinchingDistance + _this.clickRadius;
            _this.updateRadius();
            _this.center.x = _this.x + _this.radius;
            _this.center.y = _this.y + _this.radius;
            return _this.content.css({
              "top": _this.radius - _this.contentHeight * .5,
              "left": _this.radius - _this.contentWidth * .5
            });
          } else {
            return _this.setPos(_this.touch.pageX - _this.clickPos.x - _this.radius, _this.touch.pageY - _this.clickPos.y - _this.radius);
          }
        });
        return _this;
      });
      return this;
    };

    return CircleTouchView;

  })(AbstractCircle);

}).call(this);

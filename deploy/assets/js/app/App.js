// Generated by CoffeeScript 1.3.3
(function() {
  var AppView, CircleView, Point,
    __bind = function(fn, me){ return function(){ return fn.apply(me, arguments); }; },
    __hasProp = {}.hasOwnProperty,
    __extends = function(child, parent) { for (var key in parent) { if (__hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor(); child.__super__ = parent.prototype; return child; };

  $(function() {
    var _this = this;
    this.app = new AppView("#circles");
    this.window = $(window);
    this.main = $("#main");
    this.navigation = $("#navigation");
    $(window).resize(function() {
      var padding;
      padding = parseFloat(_this.main.css("padding-left")) * 2;
      _this.main.css("width", _this.window.width() - _this.navigation.outerWidth() - padding);
      _this.main.css("min-width", _this.window.width() - _this.navigation.outerWidth() - padding);
      _this.main.css("height", _this.window.height() - padding);
      return _this;
    });
    $(window).trigger("resize");
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

    return Point;

  })();

  AppView = (function() {

    AppView.prototype.items = [];

    AppView.prototype.colors = ["#C9D5A8", "#871F3B", "#F66", "#0c9"];

    AppView.prototype.center = null;

    AppView.prototype.id = 0;

    /*
    	An <ul> id that contains all the list items (<li>)
    	@param		container		Id of your list
    */


    function AppView(container) {
      this.container = container;
      this.updateItems = __bind(this.updateItems, this);

      this.setupItems();
      this.center = new Point($(this.container).width() * .5, $(this.container).height() * .5);
      this.id = setInterval(this.updateItems, 30);
    }

    /*
    	Setup the items and push them to an array
    */


    AppView.prototype.setupItems = function() {
      var c, i, list;
      list = $(this.container).children();
      i = list.length;
      c = null;
      while (i-- > 0) {
        c = new CircleView(list[i], this.colors[i % this.colors.length]);
        c.container = this.container;
        this.items.push(c);
      }
      return this;
    };

    /* ge
    	Compare two different items and sort their positions to avoid colisions
    	@param		a 				First item
    	@param		b 				Second item to compare with "a"
    */


    AppView.prototype.compareItems = function(a, b) {
      var angle, distance, force, margin, minDistance;
      if (a.fixed) {
        return;
      }
      angle = this.getAngle(a, b);
      distance = this.getDistance(a, b);
      margin = 20;
      minDistance = a.radius + b.radius + margin;
      force = .9;
      if (distance < minDistance) {
        a.position.x += Math.sin(angle) * (minDistance - distance) * force;
        a.position.y += Math.cos(angle) * (minDistance - distance) * force;
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
      this.center.x = $(this.container).width() * .5;
      this.center.y = $(this.container).height() * .5;
      while (i < length) {
        j = 0;
        this.items[i].update(this.center);
        while (j < length) {
          if (i !== j) {
            this.compareItems(this.items[i], this.items[j]);
          }
          j++;
        }
        this.items[i].apply();
        i++;
      }
      return this;
    };

    /*
    	Get the center distance between two different items
    	@param		a 				First item
    	@param		b 				Second item
    */


    AppView.prototype.getDistance = function(a, b) {
      var x, y;
      x = b.center.x - a.center.x;
      y = b.center.y - a.center.y;
      x = x * x;
      y = y * y;
      return Math.sqrt(x + y);
    };

    /*
    	Get the angle between two different items
    	@param		a 				First item
    	@param		b 				Second item
    */


    AppView.prototype.getAngle = function(a, b, rotation) {
      var x, y;
      if (rotation == null) {
        rotation = 0;
      }
      x = a.center.x - b.center.x;
      y = a.center.y - b.center.y;
      return Math.atan2(x, y);
    };

    return AppView;

  })();

  CircleView = (function(_super) {

    __extends(CircleView, _super);

    CircleView.prototype.fixed = false;

    CircleView.prototype.momentum = null;

    CircleView.prototype.position = null;

    CircleView.prototype.center = null;

    CircleView.prototype.clickPos = null;

    CircleView.prototype.container = null;

    CircleView.prototype.radius = 0;

    CircleView.prototype.originalRadius = 0;

    CircleView.prototype.content = null;

    CircleView.prototype.contentHeight = 0;

    CircleView.prototype.contentWidth = 0;

    /*
    	@param		display			Set the DOM object of your item
    	@param 		color			Color of your item
    */


    function CircleView(display, color) {
      var _this = this;
      this.display = display;
      this.color = color != null ? color : "#F66";
      this.updateRadius = __bind(this.updateRadius, this);

      CircleView.__super__.constructor.call(this);
      this.radius = 30 + Math.random() * 60;
      this.originalRadius = this.radius;
      this.momentum = new Point();
      this.position = new Point();
      this.center = new Point();
      this.clickPos = new Point();
      this.content = $(this.display).find("span");
      this.contentHeight = $(this.content).height();
      this.contentWidth = $(this.content).width();
      $(this.display).css("visibility", "visible");
      $(this.display).css("width", this.radius * 2);
      $(this.display).css("height", this.radius * 2);
      $(this.display).css("background-color", this.color);
      /*
      		Roll Over
      */

      $(this.display).mouseenter(function() {
        if (_this.fixed) {
          return;
        }
        TweenLite.to(_this, 1, {
          radius: _this.originalRadius + 50,
          ease: Quart.easeOut,
          onUpdate: _this.updateRadius
        });
        return $(_this.display).css("cursor", "pointer");
      });
      /*
      		Roll Out
      */

      $(this.display).mouseleave(function() {
        if (_this.fixed) {
          return;
        }
        TweenLite.to(_this, 1, {
          radius: _this.originalRadius,
          ease: Quart.easeOut,
          onUpdate: _this.updateRadius
        });
        return $(_this.display).css("cursor", "default");
      });
      /*
      		Mouse Down
      */

      $(this.display).mousedown(function() {
        _this.fixed = true;
        _this.clickPos.x = event.offsetX + $(_this.container).position().left;
        _this.clickPos.y = event.offsetY + $(_this.container).position().top;
        /*
        			Mouse Up
        */

        $(window).bind("mouseup", function() {
          _this.fixed = false;
          $(window).unbind("mouseup");
          return $(window).unbind("mousemove");
        });
        /*
        			Mouse Move
        */

        return $(window).bind("mousemove", function(event) {
          _this.x = _this.position.x = event.pageX - _this.clickPos.x;
          _this.y = _this.position.y = event.pageY - _this.clickPos.y;
          TweenLite.killTweensOf($(_this.display));
          $(_this.display).css("left", _this.x);
          return $(_this.display).css("top", _this.y);
        });
      });
    }

    /*
    	Update the position of your item based on the given center position
    	@param		destination		Destination point of your circle
    */


    CircleView.prototype.update = function(destination) {
      this.momentum.reset();
      this.momentum.x -= (this.center.x - destination.x) / 30;
      this.momentum.y -= (this.center.y - destination.y) / 30;
      this.momentum.x *= .6;
      this.momentum.y *= .6;
      this.position.x += this.momentum.x;
      return this.position.y += this.momentum.y;
    };

    /*
    	Apply the position to the DOM object
    */


    CircleView.prototype.apply = function() {
      this.x -= (this.x - this.position.x) * .7;
      this.y -= (this.y - this.position.y) * .7;
      this.center.x = this.x + this.radius;
      this.center.y = this.y + this.radius;
      $(this.content).css("top", this.radius - this.contentHeight * .5);
      $(this.content).css("left", this.radius - this.contentWidth * .5);
      if (this.fixed) {
        return;
      }
      return TweenLite.to($(this.display), 1, {
        css: {
          left: this.x,
          top: this.y
        },
        ease: Quart.easeOut
      });
    };

    /*
    	Update the DOM object with the radius
    */


    CircleView.prototype.updateRadius = function() {
      $(this.display).css("width", this.radius * 2);
      return $(this.display).css("height", this.radius * 2);
    };

    return CircleView;

  })(Point);

}).call(this);
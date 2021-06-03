/******/ (() => { // webpackBootstrap
/******/ 	var __webpack_modules__ = ({

<<<<<<< HEAD
/***/ "./node_modules/@farvell/jflow-core/index.js":
/*!***************************************************!*\
  !*** ./node_modules/@farvell/jflow-core/index.js ***!
  \***************************************************/
/***/ ((module, __unused_webpack_exports, __webpack_require__) => {

const Handler = __webpack_require__( /*! ./src/eventHandler */ "./node_modules/@farvell/jflow-core/src/eventHandler.js" ),
    Lightbox = __webpack_require__( /*! ./src/Lightbox/lightbox */ "./node_modules/@farvell/jflow-core/src/Lightbox/lightbox.js" ),
    Parallax = __webpack_require__( /*! ./src/parallaxText */ "./node_modules/@farvell/jflow-core/src/parallaxText.js" ),
	Style = __webpack_require__( /*! ./src/style */ "./node_modules/@farvell/jflow-core/src/style.js" );

module.exports = {
    Handler,
	Style,
    Lightbox,
    Parallax
};


/***/ }),

/***/ "./node_modules/@farvell/jflow-core/src/Lightbox/lightbox.js":
/*!*******************************************************************!*\
  !*** ./node_modules/@farvell/jflow-core/src/Lightbox/lightbox.js ***!
  \*******************************************************************/
/***/ ((module, __unused_webpack_exports, __webpack_require__) => {

const LightboxHandler = __webpack_require__( /*! ./lightboxHandler */ "./node_modules/@farvell/jflow-core/src/Lightbox/lightboxHandler.js" ),
	LightboxConstructor = __webpack_require__( /*! ./lightboxConstructor */ "./node_modules/@farvell/jflow-core/src/Lightbox/lightboxConstructor.js" );

// Lightbox logic and constructor
module.exports = class Lightbox {

    // fetching data classes to control lightbox
    constructor( config ) {
        // Set param config
		this.config = new LightboxConstructor( config );

        // Initializing handler
        this.handler = new LightboxHandler({
            element: "lightbox",
            css: config.css
        });

        // Init roullette of images
        this._initRoullette();

        // Return listen lightbox
        return this.listen();
    }

    // initializing roullette from fetched images
    _initRoullette() {
        this.config.images.forEach(( img, index ) => {
            const image = img.cloneNode(),
                text = this.config.texts[ index ];

            // Reset image element to lightbox css classes
            image.classList.remove( ...image.classList );
            image.classList.add( "roullette-image", this.control );

            // Pushing images to roullete
            this.config.roullette.img.appendChild( image );
            this.config.roullette.txt.push( text.textContent );
        });

        // Finally sets the lightbox size to length of roullette
        this.lightboxSize = this.config.roullette.txt.length;
    }

    // SETTERS
    _setPhoto( src ) { this.config.lightbox.photo.src = src; }
    _setCaption( text ) { this.config.lightbox.caption.textContent = text; }

    // Update position ( certain positions are conditioned buttons )
    _setLastPosition( position ) { this.lastPosition = position; }

    _updateFromAll( position ) {
        const photo = this.config.roullette.img.children,
            caption = this.config.roullette.txt;

        this._setPhoto( photo.position.src );
        this._setCaption( caption.position );
    }

    // Update from previous button
    _updateFromPrevious() {
        const position = this.lastPosition > 0
            ? --this.lastPosition 
            : this.lightboxSize;

        this._updateFromAll( position );
        
        return position;
    }

    // Update from next button
    _updateFromNext() {
        const position = this.lastPosition < this.lightboxSize
            ? ++this.lastPosition 
            : 0;

        this._updateFromAll( position );

        return position;
    }

    // Update from roullete image
    _updateFromRoullette( index ) {
        const length = this.config.conditions.length,
            position = index - length;

        this._updateFromAll( position );

        return position;
    }

    // Update from grid of images
    _updateFromImages( index ) {
        const length = this.config.conditions.length,
            position = ( index - this.lightboxSize)  - length;

        this._updateFromAll( position );

        return position;
    }

    // If conditions return True
    _validUpdate ( classList, name ) {
        const conditions = this.config.conditions;

        return classList.contains( conditions.name );
    }

    // Route depending on position
    _updateFrom( classList, index ) {
        let position;

        if ( this._validUpdate( classList, "roullette" ) ) {
            position = this._updateFromRoullette(index);

        } else if ( this._validUpdate( classList, "previous" ) ) {
            position = this._updateFromPrevious();

        } else if ( this._validUpdate( classList, "next" ) ) {
            position = this._updateFromNext();

        } else { position = this._updateFromImages( index ); }

        this._setLastPosition( position );
    }

    // Update state from all conditions
    _update() {
        
        const lastClick = this.handler.lastClicked(),
            classList = lastClick.element.classList;
            
        if ( classList.contains( this.config.exit ) ) return;

        this._updateFrom( classList, lastClick.index );
    }

    // Listener handler
    async listen() {
        this.handler.setAfterFunc( this._update, this ); 
        return this.handler.onClick( this.config.control, this.conditions )
			.then( console.log( "Lightbox is working!" ) );
    }
}

/***/ }),

/***/ "./node_modules/@farvell/jflow-core/src/Lightbox/lightboxConstructor.js":
/*!******************************************************************************!*\
  !*** ./node_modules/@farvell/jflow-core/src/Lightbox/lightboxConstructor.js ***!
  \******************************************************************************/
/***/ ((module, __unused_webpack_exports, __webpack_require__) => {

const Style = __webpack_require__( /*! ../style */ "./node_modules/@farvell/jflow-core/src/style.js" );

// Lightbox DOM constructor
module.exports = class LightboxConstructor {
	constructor( config ) {
		this._createLightbox();
		this._styleLightbox( config.color );
		
		return this._setLightboxConfig( config )
	}
	
    // Setting lightbox properties
	_setLightboxConfig( config ) {
		return {
			images: [ ...document.getElementsByClassName( config.images ) ],
			texts: [ ...document.getElementsByClassName( config.texts ) ],
			lightbox: {
				photo: document.getElementById( "lighbox-photo" ),
				caption: document.getElementById( "lightbox-caption" ),
			},
			roullette: {
				img: document.getElementById( "lightbox-roullette" ),
				txt: []
			},
			control: "lightbox-control",
        	exit: "lightbox-close",
        	conditions: {
           		roullette: "roullette-image",
            	previous: "previous-button", 
            	next: "next-button",
            	length: 2
			}
        };
	}

	// Putting lightbox html to DOM
	_createLightbox() {
		const wrapper = document.createElement( "div" );

		wrapper.innerHTML += 
		`<section id="lightbox" class="fixed-wrapper lightbox-wrapper">
			<span class="button fixed-button lightbox-close lightbox-control">x</span>

			<section class="wrapper lightbox">
				<figure class="wrapper lightbox-photo-wrapper">
					<article class="lightbox-previous">
						<span class="button lightbox-button vertical-align previous-button lightbox-control"><</span>
					</article>
					<img id="lightbox-photo" class="lightbox-photo all-align" src="#" alt="lightbox-main-photo">
					<article class="lightbox-next">
						<span class="button lightbox-button vertical-align next-button lightbox-control"><</span>
					</article>
				</figure>
			</section>

			<p id="lightbox-caption" class="horizontal-align lightbox-caption"></p>
			<nav id="lightbox-roullette" class="horizontal-align roullette"></nav>
		</section>
		`;
		
		document.body.style.position = "relative";
		document.body.appendChild( wrapper );
	}

	_styleLightbox( color = "#1d1d1d" ) {
		new Style({

			backgroundColor: color

		}).setStyles( "lightbox-wrapper" );
	}
}

/***/ }),

/***/ "./node_modules/@farvell/jflow-core/src/Lightbox/lightboxHandler.js":
/*!**************************************************************************!*\
  !*** ./node_modules/@farvell/jflow-core/src/Lightbox/lightboxHandler.js ***!
  \**************************************************************************/
/***/ ((module) => {

// Lightbox event handler 
module.exports = class LightboxHandler {

    // ... Animation { element: idName, css: className || [className] }
    constructor( ...animations ) {

        // Init array of animations.
        this.animations = [];
        this._initAnimations( animations );

        // Return function to Lightbox logic
        return Object.freeze(Object.create({

            setAfterFunc: this.setAfterFunc.bind( this ),
            lastClicked: this.lastClicked.bind( this ),
            onClick: this.onClick.bind( this )

        }));
    }

    // Setting animations object and css array
    _initAnimations( animations ) {
        animations.forEach(( a ) => {
            this.animations.push({
                element: document.getElementById( a.element ),
                css: Array.isArray( a.css ) ? a.css : [ a.css ]
            });
        });
        
        this._setDefaultAnimation();
        
    }

    // If css provided is an array
    _setDefaultAnimation() {
        if ( this.animations.length > 1 ) {
            const animation = this.animations[0],
                element = animation.element,
                css = animation.css

            this._animateByCss( element, css[0] );
        }
    }

    // Needs for logic in Lightbox, controls roullette updates
    setAfterFunc( func, that, ...args ) {
        this._afterFunc = () => {
            if ( typeof func == "function"
                && typeof that == "object" )
                return that[ func.name ]( args );
        };

        return this;
    }

    // Only update animation if its condition returns true
    _isConditioned( conditions ) {
        if ( conditions === null ) return false;
            
        const classList = this.lastClick.element.classList;
        let isConditioned = false;

        Object.keys( conditions ).forEach(( c ) => {
            if ( classList.contains( conditions[ c ] ) ) 
                isConditioned = true;
        });

        return isConditioned;
    }

    // Toggle class list item
    _toggleAnimation( element, css ) { element.classList.toggle( css ); }

    // For each animation, animate
    _animate() {
        this.animations.forEach(( a ) => {
            a.css.forEach(( c ) => {
                this._toggleAnimation( a.element, c );
            });        
        });
    }

    // Controls if have conditions
    _trigger( conditions ) {
        if ( this._isConditioned( conditions ) ) return;

        this._animate();
    }

    // Execute all functions atached to the event
    _execution( conditions = null ) {
        this._trigger( conditions );
        
        if ( typeof this._afterFunc === "function" )
            this._afterFunc();
    }

    // Needs in Lightbox class, return last clicked element
    lastClicked() { return this.lastClick; }

    // Each click updates lastClick variable 
    async onClick( controls, conditions ) {
        const keys = document.querySelectorAll( `.${controls}` );

        keys.forEach(( e, i ) => {
            e.addEventListener("click", () => {
                this.lastClick = { 
                    "element": e,
                    "index": (i - 1) 
                };

                this._execution( conditions );
            });
        });

        return this;
    }
}

/***/ }),

/***/ "./node_modules/@farvell/jflow-core/src/eventHandler.js":
/*!**************************************************************!*\
  !*** ./node_modules/@farvell/jflow-core/src/eventHandler.js ***!
  \**************************************************************/
/***/ ((module) => {

// Generic handler
module.exports = class Handler {

    // Animation { element: idName, css: className || [className] }
    constructor( ...animations ) {
        
        this.animations = [];
        this._initAnimations( animations );

        // Return event methods
        return Object.freeze(Object.create({

            onTimeout: this.onTimeout.bind( this ),
            onClick: this.onClick.bind( this ),
            onScroll: this.onScroll.bind( this )

        }));
    }

    // Setting animations object and css array
    _initAnimations( animations ) {
        animations.forEach(( a, i ) => {
            this.animations.push({
                element: document.getElementById( a.element ),
                css: Array.isArray( a.css ) ? a.css : [ a.css ]
            });

            this._setDefaultAnimation( i );
        });
    }

    // If css provided is not an array
    _setDefaultAnimation( index ) {
        const animation = this.animations[ index ],
            element = animation.element,
            css = animation.css;

        if ( css.length > 1 )
            this._toggleAnimation( element, css[0] );
    }

    // Toggle class list item
    _toggleAnimation( element, css ) { element.classList.toggle( css ); }

    // For each animation, animate
    _animate() {
        this.animations.forEach(( animation ) => {
            animation.css.forEach(( cssName ) => {
                this._toggleAnimation( animation.element, cssName );
            });        
        });
    }

    // Timeout event, animate given time
    async onTimeout( time ) {
        const timer = setTimeout(() => {
            this._animate();
        }, time);
		
        return this;
    }

    // Click event triggers animation
    async onClick( controls ) {
        const keys = document.querySelectorAll( `.${controls}` );

        keys.forEach(( trigger ) => {
            trigger.addEventListener("click", ( e ) => {
				e.stopPropagation();
                this._animate();
            });
        });

        return this;
    }

	// If Offset is inside conditions, animate
	_triggerScroll( scroll, offset, scrolled ) {
		if (( scroll <= offset && scrolled ) || 
            ( scroll >= offset && !scrolled )) {
                
            this._animate();
			return !scrolled;
        }

		return scrolled;
	}

    // Controls scroll when loads document
    _initScroll( offset ) {
        if ( window.scrollY >= offset ) {
            this._animate();
            return true;
        }

        return false;
    }

    // Scroll event triggers animation
    async onScroll( offset ) {
        let scrolled = this._initScroll( offset );

        document.addEventListener("scroll", () => {
            const scroll = window.scrollY;
			scrolled = this.triggerScroll( scroll, offset, scrolled );
        });

        return this;
    }

}

/***/ }),

/***/ "./node_modules/@farvell/jflow-core/src/parallaxText.js":
/*!**************************************************************!*\
  !*** ./node_modules/@farvell/jflow-core/src/parallaxText.js ***!
  \**************************************************************/
/***/ ((module) => {

/* Parallax movement */
module.exports = class Parallax {

    // ... HTMLElement, dir 1 = up | -1 = down, minOffset in pixels to active scroll
    constructor( ...config ) {       
        
        // Init multiple configs
        this.config = [];
        this._initConfig( config );
        // Need updates movement at restart
        // Prevents charging scroll at re-render position
        this._updateMovement();

        // Return listen to move scroll
        return Object.freeze(Object.create({

            listen: this.listen.bind( this )

        }));
    }

    _initConfig( config ) {
        config.forEach(( parallax ) => {
            this.config.push({
                target: document.getElementById( parallax.target ),
                direction: parallax.direction,
                offset: ( parallax.offset ? value.offset : 0 )
            });
        });
    }

    // Updates movement relative on direction and offset
    _updateMovement( offset = window.scrollY ) {
        // For each parallax configuration object
        this.config.forEach(( value ) => {
            const style = value.target.style,
                movement = ( offset - value.offset ) * value.direction;

            // Only executes if offset arrives to minOffset
            if ( offset >= value.offset )
                style.transform = `translateY( ${ movement }px)`;
        });
    }

    _render( offset ) {
        window.requestAnimationFrame(() => {
            this._updateMovement( offset );
        })
    }

    // Event handler for scroll
    async listen() {
        window.addEventListener("scroll", () => {
            const offset = window.scrollY;
            this._render( offset );
        });
    }
    
}


/***/ }),

/***/ "./node_modules/@farvell/jflow-core/src/style.js":
/*!*******************************************************!*\
  !*** ./node_modules/@farvell/jflow-core/src/style.js ***!
  \*******************************************************/
/***/ ((module) => {

// Converts style objetcs into html props.
module.exports = class Style {
	constructor( styles ) {
		// Object containig style keys
		this.styles = styles;

		// Return set styles
		return Object.freeze(Object.create({

			setStyles: this.setStyles.bind( this )

		}));

	}

	// Set styles to targets clasName
	setStyles( className ) {
		this.elements = [ ...document.getElementsByClassName( className ) ];

		this.elements.forEach(( element ) => {
			Object.keys( this.styles ).forEach(( key ) => {
				element.style.key = this.styles.key;
			});
		});

		return this.elements;
	}
}
=======
/***/ "./src/handler.js":
/*!************************!*\
  !*** ./src/handler.js ***!
  \************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "default": () => (/* binding */ Handler)
/* harmony export */ });
function _typeof(obj) { "@babel/helpers - typeof"; if (typeof Symbol === "function" && typeof Symbol.iterator === "symbol") { _typeof = function _typeof(obj) { return typeof obj; }; } else { _typeof = function _typeof(obj) { return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj; }; } return _typeof(obj); }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } }

function _createClass(Constructor, protoProps, staticProps) { if (protoProps) _defineProperties(Constructor.prototype, protoProps); if (staticProps) _defineProperties(Constructor, staticProps); return Constructor; }

/* Generic event handler */
var Handler = /*#__PURE__*/function () {
  function Handler() {
    _classCallCheck(this, Handler);

    this.animations = [];

    for (var _len = arguments.length, animations = new Array(_len), _key = 0; _key < _len; _key++) {
      animations[_key] = arguments[_key];
    }

    this._initAnimations(animations);

    return Object.freeze(Object.create({
      setAfterFunc: this.setAfterFunc.bind(this),
      timeout: this.timeout.bind(this),
      lastClicked: this.lastClicked.bind(this),
      onClick: this.onClick.bind(this)
    }));
  }

  _createClass(Handler, [{
    key: "_initAnimations",
    value: function _initAnimations(animations) {
      var _this = this;

      animations.forEach(function (a, i) {
        _this.animations.push({
          element: document.getElementById(a.element),
          css: Array.isArray(a.css) ? a.css : [a.css]
        });

        _this._initCss(i);
      });
    }
  }, {
    key: "_initCss",
    value: function _initCss(index) {
      var animation = this.animations[index],
          element = animation.element,
          css = animation.css;
      if (css.length > 1) this._animateByCss(element, css[0]);
    }
  }, {
    key: "setAfterFunc",
    value: function setAfterFunc(func, that) {
      for (var _len2 = arguments.length, args = new Array(_len2 > 2 ? _len2 - 2 : 0), _key2 = 2; _key2 < _len2; _key2++) {
        args[_key2 - 2] = arguments[_key2];
      }

      this._afterFunc = function () {
        if (typeof func == "function" && _typeof(that) == "object") return that[func.name](args);
      };

      return this;
    }
  }, {
    key: "_isConditioned",
    value: function _isConditioned(conditions) {
      if (conditions === null) return false;
      var classList = this.lastClick.element.classList;
      var isConditioned = false;
      Object.keys(conditions).forEach(function (c) {
        if (classList.contains(conditions[c])) isConditioned = true;
      });
      return isConditioned;
    }
  }, {
    key: "_animateByCss",
    value: function _animateByCss(element, css) {
      element.classList.toggle(css);
    }
  }, {
    key: "_animate",
    value: function _animate() {
      var _this2 = this;

      this.animations.forEach(function (a) {
        a.css.forEach(function (c) {
          _this2._animateByCss(a.element, c);
        });
      });
    }
  }, {
    key: "_trigger",
    value: function _trigger(conditions) {
      if (this._isConditioned(conditions)) return;

      this._animate();
    }
  }, {
    key: "_execution",
    value: function _execution() {
      var conditions = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : null;

      this._trigger(conditions);

      if (typeof this._afterFunc === "function") this._afterFunc();
    }
  }, {
    key: "timeout",
    value: function timeout(time) {
      var _this3 = this;

      setTimeout(function () {
        _this3._execution();
      }, time);
      return this;
    }
  }, {
    key: "lastClicked",
    value: function lastClicked() {
      return this.lastClick;
    }
  }, {
    key: "onClick",
    value: function onClick(controls, conditions) {
      var _this4 = this;

      var keys = document.querySelectorAll(controls);
      keys.forEach(function (e, i) {
        e.addEventListener("click", function () {
          _this4.lastClick = {
            "element": e,
            "index": i - 1
          };
          console.log("click to %o at index %o!", e, i - 1);

          _this4._execution(conditions);
        });
      });
      return this;
    }
  }]);

  return Handler;
}();



/***/ }),

/***/ "./src/lightbox.js":
/*!*************************!*\
  !*** ./src/lightbox.js ***!
  \*************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "default": () => (/* binding */ Lightbox)
/* harmony export */ });
/* harmony import */ var _handler__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ./handler */ "./src/handler.js");
function _toConsumableArray(arr) { return _arrayWithoutHoles(arr) || _iterableToArray(arr) || _unsupportedIterableToArray(arr) || _nonIterableSpread(); }

function _nonIterableSpread() { throw new TypeError("Invalid attempt to spread non-iterable instance.\nIn order to be iterable, non-array objects must have a [Symbol.iterator]() method."); }

function _unsupportedIterableToArray(o, minLen) { if (!o) return; if (typeof o === "string") return _arrayLikeToArray(o, minLen); var n = Object.prototype.toString.call(o).slice(8, -1); if (n === "Object" && o.constructor) n = o.constructor.name; if (n === "Map" || n === "Set") return Array.from(o); if (n === "Arguments" || /^(?:Ui|I)nt(?:8|16|32)(?:Clamped)?Array$/.test(n)) return _arrayLikeToArray(o, minLen); }

function _iterableToArray(iter) { if (typeof Symbol !== "undefined" && Symbol.iterator in Object(iter)) return Array.from(iter); }

function _arrayWithoutHoles(arr) { if (Array.isArray(arr)) return _arrayLikeToArray(arr); }

function _arrayLikeToArray(arr, len) { if (len == null || len > arr.length) len = arr.length; for (var i = 0, arr2 = new Array(len); i < len; i++) { arr2[i] = arr[i]; } return arr2; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } }

function _createClass(Constructor, protoProps, staticProps) { if (protoProps) _defineProperties(Constructor.prototype, protoProps); if (staticProps) _defineProperties(Constructor, staticProps); return Constructor; }



var Lightbox = /*#__PURE__*/function () {
  function Lightbox(data) {
    _classCallCheck(this, Lightbox);

    this._constructData(data);

    this._constructHandler(data["animation"]);

    this._initRoullette();

    return Object.freeze(Object.create({
      listen: this.listen.bind(this)
    }));
  }

  _createClass(Lightbox, [{
    key: "_constructData",
    value: function _constructData(data) {
      this.images = document.querySelectorAll(data["images"]);
      this.texts = document.querySelectorAll(data["texts"]);
      this.lightbox = {
        photo: document.getElementById(data["photo"]),
        caption: document.getElementById(data["caption"])
      };
      this.roullette = {
        img: document.getElementById(data["roullette"]),
        txt: []
      };
    }
  }, {
    key: "_constructHandler",
    value: function _constructHandler(animation) {
      this.handler = new _handler__WEBPACK_IMPORTED_MODULE_0__.default(animation);
      this.exit = "lightbox-close";
      this.conditions = {
        roullette: "roullette-image",
        previous: "previous-button",
        next: "next-button",
        length: 2
      };
      console.log(this.handler);
    }
  }, {
    key: "_initRoullette",
    value: function _initRoullette() {
      var _this = this;

      this.images.forEach(function (e, i) {
        var _image$classList;

        var image = e.cloneNode(),
            text = _this.texts[i];

        (_image$classList = image.classList).remove.apply(_image$classList, _toConsumableArray(image.classList));

        image.classList.add("roullette-image", "lightbox-control");

        _this.roullette.img.appendChild(image);

        _this.roullette.txt.push(text.textContent);
      });
      this.lightboxSize = this.roullette.txt.length;
    }
  }, {
    key: "_setPhoto",
    value: function _setPhoto(src) {
      this.lightbox.photo.src = src;
    }
  }, {
    key: "_setCaption",
    value: function _setCaption(text) {
      this.lightbox.caption.textContent = text;
    }
  }, {
    key: "_setLastPosition",
    value: function _setLastPosition(position) {
      this.lastPosition = position;
    }
  }, {
    key: "_updateFromAll",
    value: function _updateFromAll(position) {
      var photo = this.roullette.img.children,
          caption = this.roullette.txt;
      console.log("photo: %o", photo[position]);
      console.log("caption: %o", caption[position]);
      console.log("position: %o", position);

      this._setPhoto(photo[position].src);

      this._setCaption(caption[position]);
    }
  }, {
    key: "_updateFromPrevious",
    value: function _updateFromPrevious() {
      var position = this.lastPosition > 0 ? --this.lastPosition : this.lightboxSize;

      this._updateFromAll(position);

      return position;
    }
  }, {
    key: "_updateFromNext",
    value: function _updateFromNext() {
      var position = this.lastPosition < this.lightboxSize ? ++this.lastPosition : 0;

      this._updateFromAll(position);

      return position;
    }
  }, {
    key: "_updateFromRoullette",
    value: function _updateFromRoullette(index) {
      var length = this.conditions.length,
          position = index - length;

      this._updateFromAll(position);

      return position;
    }
  }, {
    key: "_updateFromImages",
    value: function _updateFromImages(index) {
      var length = this.conditions.length,
          position = index - this.lightboxSize - length;

      this._updateFromAll(position);

      return position;
    }
  }, {
    key: "_validUpdate",
    value: function _validUpdate(classList, name) {
      var conditions = this.conditions;
      return classList.contains(conditions[name]);
    }
  }, {
    key: "_updateFrom",
    value: function _updateFrom(classList, index) {
      var position;

      if (this._validUpdate(classList, "roullette")) {
        position = this._updateFromRoullette(index);
      } else if (this._validUpdate(classList, "previous")) {
        position = this._updateFromPrevious();
      } else if (this._validUpdate(classList, "next")) {
        position = this._updateFromNext();
      } else {
        position = this._updateFromImages(index);
      }

      this._setLastPosition(position);
    }
  }, {
    key: "_update",
    value: function _update() {
      var lastClick = this.handler.lastClicked(),
          classList = lastClick.element.classList;
      if (classList.contains(this.exit)) return;

      this._updateFrom(classList, lastClick.index);
    }
  }, {
    key: "listen",
    value: function listen() {
      this.handler.setAfterFunc(this._update, this);
      return this.handler.onClick(".lightbox-control", this.conditions);
    }
  }]);

  return Lightbox;
}();


>>>>>>> eacaccd3865fa86ba0a0e96ce481b5e7d0c06caa

/***/ }),

/***/ "./src/styles/index.scss":
/*!*******************************!*\
  !*** ./src/styles/index.scss ***!
  \*******************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

"use strict";
__webpack_require__.r(__webpack_exports__);
// extracted by mini-css-extract-plugin


/***/ }),

/***/ "./node_modules/typed.js/lib/typed.js":
/*!********************************************!*\
  !*** ./node_modules/typed.js/lib/typed.js ***!
  \********************************************/
/***/ (function(module) {

/*!
 * 
 *   typed.js - A JavaScript Typing Animation Library
 *   Author: Matt Boldt <me@mattboldt.com>
 *   Version: v2.0.11
 *   Url: https://github.com/mattboldt/typed.js
 *   License(s): MIT
 * 
 */
(function webpackUniversalModuleDefinition(root, factory) {
	if(true)
		module.exports = factory();
	else {}
})(this, function() {
return /******/ (function(modules) { // webpackBootstrap
/******/ 	// The module cache
/******/ 	var installedModules = {};
/******/
/******/ 	// The require function
/******/ 	function __nested_webpack_require_737__(moduleId) {
/******/
/******/ 		// Check if module is in cache
/******/ 		if(installedModules[moduleId])
/******/ 			return installedModules[moduleId].exports;
/******/
/******/ 		// Create a new module (and put it into the cache)
/******/ 		var module = installedModules[moduleId] = {
/******/ 			exports: {},
/******/ 			id: moduleId,
/******/ 			loaded: false
/******/ 		};
/******/
/******/ 		// Execute the module function
/******/ 		modules[moduleId].call(module.exports, module, module.exports, __nested_webpack_require_737__);
/******/
/******/ 		// Flag the module as loaded
/******/ 		module.loaded = true;
/******/
/******/ 		// Return the exports of the module
/******/ 		return module.exports;
/******/ 	}
/******/
/******/
/******/ 	// expose the modules object (__webpack_modules__)
/******/ 	__nested_webpack_require_737__.m = modules;
/******/
/******/ 	// expose the module cache
/******/ 	__nested_webpack_require_737__.c = installedModules;
/******/
/******/ 	// __webpack_public_path__
/******/ 	__nested_webpack_require_737__.p = "";
/******/
/******/ 	// Load entry module and return exports
/******/ 	return __nested_webpack_require_737__(0);
/******/ })
/************************************************************************/
/******/ ([
/* 0 */
/***/ (function(module, exports, __nested_webpack_require_2018__) {

	'use strict';
	
	Object.defineProperty(exports, '__esModule', {
	  value: true
	});
	
	var _createClass = (function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ('value' in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; })();
	
	function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError('Cannot call a class as a function'); } }
	
	var _initializerJs = __nested_webpack_require_2018__(1);
	
	var _htmlParserJs = __nested_webpack_require_2018__(3);
	
	/**
	 * Welcome to Typed.js!
	 * @param {string} elementId HTML element ID _OR_ HTML element
	 * @param {object} options options object
	 * @returns {object} a new Typed object
	 */
	
	var Typed = (function () {
	  function Typed(elementId, options) {
	    _classCallCheck(this, Typed);
	
	    // Initialize it up
	    _initializerJs.initializer.load(this, options, elementId);
	    // All systems go!
	    this.begin();
	  }
	
	  /**
	   * Toggle start() and stop() of the Typed instance
	   * @public
	   */
	
	  _createClass(Typed, [{
	    key: 'toggle',
	    value: function toggle() {
	      this.pause.status ? this.start() : this.stop();
	    }
	
	    /**
	     * Stop typing / backspacing and enable cursor blinking
	     * @public
	     */
	  }, {
	    key: 'stop',
	    value: function stop() {
	      if (this.typingComplete) return;
	      if (this.pause.status) return;
	      this.toggleBlinking(true);
	      this.pause.status = true;
	      this.options.onStop(this.arrayPos, this);
	    }
	
	    /**
	     * Start typing / backspacing after being stopped
	     * @public
	     */
	  }, {
	    key: 'start',
	    value: function start() {
	      if (this.typingComplete) return;
	      if (!this.pause.status) return;
	      this.pause.status = false;
	      if (this.pause.typewrite) {
	        this.typewrite(this.pause.curString, this.pause.curStrPos);
	      } else {
	        this.backspace(this.pause.curString, this.pause.curStrPos);
	      }
	      this.options.onStart(this.arrayPos, this);
	    }
	
	    /**
	     * Destroy this instance of Typed
	     * @public
	     */
	  }, {
	    key: 'destroy',
	    value: function destroy() {
	      this.reset(false);
	      this.options.onDestroy(this);
	    }
	
	    /**
	     * Reset Typed and optionally restarts
	     * @param {boolean} restart
	     * @public
	     */
	  }, {
	    key: 'reset',
	    value: function reset() {
	      var restart = arguments.length <= 0 || arguments[0] === undefined ? true : arguments[0];
	
	      clearInterval(this.timeout);
	      this.replaceText('');
	      if (this.cursor && this.cursor.parentNode) {
	        this.cursor.parentNode.removeChild(this.cursor);
	        this.cursor = null;
	      }
	      this.strPos = 0;
	      this.arrayPos = 0;
	      this.curLoop = 0;
	      if (restart) {
	        this.insertCursor();
	        this.options.onReset(this);
	        this.begin();
	      }
	    }
	
	    /**
	     * Begins the typing animation
	     * @private
	     */
	  }, {
	    key: 'begin',
	    value: function begin() {
	      var _this = this;
	
	      this.options.onBegin(this);
	      this.typingComplete = false;
	      this.shuffleStringsIfNeeded(this);
	      this.insertCursor();
	      if (this.bindInputFocusEvents) this.bindFocusEvents();
	      this.timeout = setTimeout(function () {
	        // Check if there is some text in the element, if yes start by backspacing the default message
	        if (!_this.currentElContent || _this.currentElContent.length === 0) {
	          _this.typewrite(_this.strings[_this.sequence[_this.arrayPos]], _this.strPos);
	        } else {
	          // Start typing
	          _this.backspace(_this.currentElContent, _this.currentElContent.length);
	        }
	      }, this.startDelay);
	    }
	
	    /**
	     * Called for each character typed
	     * @param {string} curString the current string in the strings array
	     * @param {number} curStrPos the current position in the curString
	     * @private
	     */
	  }, {
	    key: 'typewrite',
	    value: function typewrite(curString, curStrPos) {
	      var _this2 = this;
	
	      if (this.fadeOut && this.el.classList.contains(this.fadeOutClass)) {
	        this.el.classList.remove(this.fadeOutClass);
	        if (this.cursor) this.cursor.classList.remove(this.fadeOutClass);
	      }
	
	      var humanize = this.humanizer(this.typeSpeed);
	      var numChars = 1;
	
	      if (this.pause.status === true) {
	        this.setPauseStatus(curString, curStrPos, true);
	        return;
	      }
	
	      // contain typing function in a timeout humanize'd delay
	      this.timeout = setTimeout(function () {
	        // skip over any HTML chars
	        curStrPos = _htmlParserJs.htmlParser.typeHtmlChars(curString, curStrPos, _this2);
	
	        var pauseTime = 0;
	        var substr = curString.substr(curStrPos);
	        // check for an escape character before a pause value
	        // format: \^\d+ .. eg: ^1000 .. should be able to print the ^ too using ^^
	        // single ^ are removed from string
	        if (substr.charAt(0) === '^') {
	          if (/^\^\d+/.test(substr)) {
	            var skip = 1; // skip at least 1
	            substr = /\d+/.exec(substr)[0];
	            skip += substr.length;
	            pauseTime = parseInt(substr);
	            _this2.temporaryPause = true;
	            _this2.options.onTypingPaused(_this2.arrayPos, _this2);
	            // strip out the escape character and pause value so they're not printed
	            curString = curString.substring(0, curStrPos) + curString.substring(curStrPos + skip);
	            _this2.toggleBlinking(true);
	          }
	        }
	
	        // check for skip characters formatted as
	        // "this is a `string to print NOW` ..."
	        if (substr.charAt(0) === '`') {
	          while (curString.substr(curStrPos + numChars).charAt(0) !== '`') {
	            numChars++;
	            if (curStrPos + numChars > curString.length) break;
	          }
	          // strip out the escape characters and append all the string in between
	          var stringBeforeSkip = curString.substring(0, curStrPos);
	          var stringSkipped = curString.substring(stringBeforeSkip.length + 1, curStrPos + numChars);
	          var stringAfterSkip = curString.substring(curStrPos + numChars + 1);
	          curString = stringBeforeSkip + stringSkipped + stringAfterSkip;
	          numChars--;
	        }
	
	        // timeout for any pause after a character
	        _this2.timeout = setTimeout(function () {
	          // Accounts for blinking while paused
	          _this2.toggleBlinking(false);
	
	          // We're done with this sentence!
	          if (curStrPos >= curString.length) {
	            _this2.doneTyping(curString, curStrPos);
	          } else {
	            _this2.keepTyping(curString, curStrPos, numChars);
	          }
	          // end of character pause
	          if (_this2.temporaryPause) {
	            _this2.temporaryPause = false;
	            _this2.options.onTypingResumed(_this2.arrayPos, _this2);
	          }
	        }, pauseTime);
	
	        // humanized value for typing
	      }, humanize);
	    }
	
	    /**
	     * Continue to the next string & begin typing
	     * @param {string} curString the current string in the strings array
	     * @param {number} curStrPos the current position in the curString
	     * @private
	     */
	  }, {
	    key: 'keepTyping',
	    value: function keepTyping(curString, curStrPos, numChars) {
	      // call before functions if applicable
	      if (curStrPos === 0) {
	        this.toggleBlinking(false);
	        this.options.preStringTyped(this.arrayPos, this);
	      }
	      // start typing each new char into existing string
	      // curString: arg, this.el.html: original text inside element
	      curStrPos += numChars;
	      var nextString = curString.substr(0, curStrPos);
	      this.replaceText(nextString);
	      // loop the function
	      this.typewrite(curString, curStrPos);
	    }
	
	    /**
	     * We're done typing the current string
	     * @param {string} curString the current string in the strings array
	     * @param {number} curStrPos the current position in the curString
	     * @private
	     */
	  }, {
	    key: 'doneTyping',
	    value: function doneTyping(curString, curStrPos) {
	      var _this3 = this;
	
	      // fires callback function
	      this.options.onStringTyped(this.arrayPos, this);
	      this.toggleBlinking(true);
	      // is this the final string
	      if (this.arrayPos === this.strings.length - 1) {
	        // callback that occurs on the last typed string
	        this.complete();
	        // quit if we wont loop back
	        if (this.loop === false || this.curLoop === this.loopCount) {
	          return;
	        }
	      }
	      this.timeout = setTimeout(function () {
	        _this3.backspace(curString, curStrPos);
	      }, this.backDelay);
	    }
	
	    /**
	     * Backspaces 1 character at a time
	     * @param {string} curString the current string in the strings array
	     * @param {number} curStrPos the current position in the curString
	     * @private
	     */
	  }, {
	    key: 'backspace',
	    value: function backspace(curString, curStrPos) {
	      var _this4 = this;
	
	      if (this.pause.status === true) {
	        this.setPauseStatus(curString, curStrPos, true);
	        return;
	      }
	      if (this.fadeOut) return this.initFadeOut();
	
	      this.toggleBlinking(false);
	      var humanize = this.humanizer(this.backSpeed);
	
	      this.timeout = setTimeout(function () {
	        curStrPos = _htmlParserJs.htmlParser.backSpaceHtmlChars(curString, curStrPos, _this4);
	        // replace text with base text + typed characters
	        var curStringAtPosition = curString.substr(0, curStrPos);
	        _this4.replaceText(curStringAtPosition);
	
	        // if smartBack is enabled
	        if (_this4.smartBackspace) {
	          // the remaining part of the current string is equal of the same part of the new string
	          var nextString = _this4.strings[_this4.arrayPos + 1];
	          if (nextString && curStringAtPosition === nextString.substr(0, curStrPos)) {
	            _this4.stopNum = curStrPos;
	          } else {
	            _this4.stopNum = 0;
	          }
	        }
	
	        // if the number (id of character in current string) is
	        // less than the stop number, keep going
	        if (curStrPos > _this4.stopNum) {
	          // subtract characters one by one
	          curStrPos--;
	          // loop the function
	          _this4.backspace(curString, curStrPos);
	        } else if (curStrPos <= _this4.stopNum) {
	          // if the stop number has been reached, increase
	          // array position to next string
	          _this4.arrayPos++;
	          // When looping, begin at the beginning after backspace complete
	          if (_this4.arrayPos === _this4.strings.length) {
	            _this4.arrayPos = 0;
	            _this4.options.onLastStringBackspaced();
	            _this4.shuffleStringsIfNeeded();
	            _this4.begin();
	          } else {
	            _this4.typewrite(_this4.strings[_this4.sequence[_this4.arrayPos]], curStrPos);
	          }
	        }
	        // humanized value for typing
	      }, humanize);
	    }
	
	    /**
	     * Full animation is complete
	     * @private
	     */
	  }, {
	    key: 'complete',
	    value: function complete() {
	      this.options.onComplete(this);
	      if (this.loop) {
	        this.curLoop++;
	      } else {
	        this.typingComplete = true;
	      }
	    }
	
	    /**
	     * Has the typing been stopped
	     * @param {string} curString the current string in the strings array
	     * @param {number} curStrPos the current position in the curString
	     * @param {boolean} isTyping
	     * @private
	     */
	  }, {
	    key: 'setPauseStatus',
	    value: function setPauseStatus(curString, curStrPos, isTyping) {
	      this.pause.typewrite = isTyping;
	      this.pause.curString = curString;
	      this.pause.curStrPos = curStrPos;
	    }
	
	    /**
	     * Toggle the blinking cursor
	     * @param {boolean} isBlinking
	     * @private
	     */
	  }, {
	    key: 'toggleBlinking',
	    value: function toggleBlinking(isBlinking) {
	      if (!this.cursor) return;
	      // if in paused state, don't toggle blinking a 2nd time
	      if (this.pause.status) return;
	      if (this.cursorBlinking === isBlinking) return;
	      this.cursorBlinking = isBlinking;
	      if (isBlinking) {
	        this.cursor.classList.add('typed-cursor--blink');
	      } else {
	        this.cursor.classList.remove('typed-cursor--blink');
	      }
	    }
	
	    /**
	     * Speed in MS to type
	     * @param {number} speed
	     * @private
	     */
	  }, {
	    key: 'humanizer',
	    value: function humanizer(speed) {
	      return Math.round(Math.random() * speed / 2) + speed;
	    }
	
	    /**
	     * Shuffle the sequence of the strings array
	     * @private
	     */
	  }, {
	    key: 'shuffleStringsIfNeeded',
	    value: function shuffleStringsIfNeeded() {
	      if (!this.shuffle) return;
	      this.sequence = this.sequence.sort(function () {
	        return Math.random() - 0.5;
	      });
	    }
	
	    /**
	     * Adds a CSS class to fade out current string
	     * @private
	     */
	  }, {
	    key: 'initFadeOut',
	    value: function initFadeOut() {
	      var _this5 = this;
	
	      this.el.className += ' ' + this.fadeOutClass;
	      if (this.cursor) this.cursor.className += ' ' + this.fadeOutClass;
	      return setTimeout(function () {
	        _this5.arrayPos++;
	        _this5.replaceText('');
	
	        // Resets current string if end of loop reached
	        if (_this5.strings.length > _this5.arrayPos) {
	          _this5.typewrite(_this5.strings[_this5.sequence[_this5.arrayPos]], 0);
	        } else {
	          _this5.typewrite(_this5.strings[0], 0);
	          _this5.arrayPos = 0;
	        }
	      }, this.fadeOutDelay);
	    }
	
	    /**
	     * Replaces current text in the HTML element
	     * depending on element type
	     * @param {string} str
	     * @private
	     */
	  }, {
	    key: 'replaceText',
	    value: function replaceText(str) {
	      if (this.attr) {
	        this.el.setAttribute(this.attr, str);
	      } else {
	        if (this.isInput) {
	          this.el.value = str;
	        } else if (this.contentType === 'html') {
	          this.el.innerHTML = str;
	        } else {
	          this.el.textContent = str;
	        }
	      }
	    }
	
	    /**
	     * If using input elements, bind focus in order to
	     * start and stop the animation
	     * @private
	     */
	  }, {
	    key: 'bindFocusEvents',
	    value: function bindFocusEvents() {
	      var _this6 = this;
	
	      if (!this.isInput) return;
	      this.el.addEventListener('focus', function (e) {
	        _this6.stop();
	      });
	      this.el.addEventListener('blur', function (e) {
	        if (_this6.el.value && _this6.el.value.length !== 0) {
	          return;
	        }
	        _this6.start();
	      });
	    }
	
	    /**
	     * On init, insert the cursor element
	     * @private
	     */
	  }, {
	    key: 'insertCursor',
	    value: function insertCursor() {
	      if (!this.showCursor) return;
	      if (this.cursor) return;
	      this.cursor = document.createElement('span');
	      this.cursor.className = 'typed-cursor';
	      this.cursor.innerHTML = this.cursorChar;
	      this.el.parentNode && this.el.parentNode.insertBefore(this.cursor, this.el.nextSibling);
	    }
	  }]);
	
	  return Typed;
	})();
	
	exports['default'] = Typed;
	module.exports = exports['default'];

/***/ }),
/* 1 */
/***/ (function(module, exports, __nested_webpack_require_18173__) {

	'use strict';
	
	Object.defineProperty(exports, '__esModule', {
	  value: true
	});
	
	var _extends = Object.assign || function (target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i]; for (var key in source) { if (Object.prototype.hasOwnProperty.call(source, key)) { target[key] = source[key]; } } } return target; };
	
	var _createClass = (function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ('value' in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; })();
	
	function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { 'default': obj }; }
	
	function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError('Cannot call a class as a function'); } }
	
	var _defaultsJs = __nested_webpack_require_18173__(2);
	
	var _defaultsJs2 = _interopRequireDefault(_defaultsJs);
	
	/**
	 * Initialize the Typed object
	 */
	
	var Initializer = (function () {
	  function Initializer() {
	    _classCallCheck(this, Initializer);
	  }
	
	  _createClass(Initializer, [{
	    key: 'load',
	
	    /**
	     * Load up defaults & options on the Typed instance
	     * @param {Typed} self instance of Typed
	     * @param {object} options options object
	     * @param {string} elementId HTML element ID _OR_ instance of HTML element
	     * @private
	     */
	
	    value: function load(self, options, elementId) {
	      // chosen element to manipulate text
	      if (typeof elementId === 'string') {
	        self.el = document.querySelector(elementId);
	      } else {
	        self.el = elementId;
	      }
	
	      self.options = _extends({}, _defaultsJs2['default'], options);
	
	      // attribute to type into
	      self.isInput = self.el.tagName.toLowerCase() === 'input';
	      self.attr = self.options.attr;
	      self.bindInputFocusEvents = self.options.bindInputFocusEvents;
	
	      // show cursor
	      self.showCursor = self.isInput ? false : self.options.showCursor;
	
	      // custom cursor
	      self.cursorChar = self.options.cursorChar;
	
	      // Is the cursor blinking
	      self.cursorBlinking = true;
	
	      // text content of element
	      self.elContent = self.attr ? self.el.getAttribute(self.attr) : self.el.textContent;
	
	      // html or plain text
	      self.contentType = self.options.contentType;
	
	      // typing speed
	      self.typeSpeed = self.options.typeSpeed;
	
	      // add a delay before typing starts
	      self.startDelay = self.options.startDelay;
	
	      // backspacing speed
	      self.backSpeed = self.options.backSpeed;
	
	      // only backspace what doesn't match the previous string
	      self.smartBackspace = self.options.smartBackspace;
	
	      // amount of time to wait before backspacing
	      self.backDelay = self.options.backDelay;
	
	      // Fade out instead of backspace
	      self.fadeOut = self.options.fadeOut;
	      self.fadeOutClass = self.options.fadeOutClass;
	      self.fadeOutDelay = self.options.fadeOutDelay;
	
	      // variable to check whether typing is currently paused
	      self.isPaused = false;
	
	      // input strings of text
	      self.strings = self.options.strings.map(function (s) {
	        return s.trim();
	      });
	
	      // div containing strings
	      if (typeof self.options.stringsElement === 'string') {
	        self.stringsElement = document.querySelector(self.options.stringsElement);
	      } else {
	        self.stringsElement = self.options.stringsElement;
	      }
	
	      if (self.stringsElement) {
	        self.strings = [];
	        self.stringsElement.style.display = 'none';
	        var strings = Array.prototype.slice.apply(self.stringsElement.children);
	        var stringsLength = strings.length;
	
	        if (stringsLength) {
	          for (var i = 0; i < stringsLength; i += 1) {
	            var stringEl = strings[i];
	            self.strings.push(stringEl.innerHTML.trim());
	          }
	        }
	      }
	
	      // character number position of current string
	      self.strPos = 0;
	
	      // current array position
	      self.arrayPos = 0;
	
	      // index of string to stop backspacing on
	      self.stopNum = 0;
	
	      // Looping logic
	      self.loop = self.options.loop;
	      self.loopCount = self.options.loopCount;
	      self.curLoop = 0;
	
	      // shuffle the strings
	      self.shuffle = self.options.shuffle;
	      // the order of strings
	      self.sequence = [];
	
	      self.pause = {
	        status: false,
	        typewrite: true,
	        curString: '',
	        curStrPos: 0
	      };
	
	      // When the typing is complete (when not looped)
	      self.typingComplete = false;
	
	      // Set the order in which the strings are typed
	      for (var i in self.strings) {
	        self.sequence[i] = i;
	      }
	
	      // If there is some text in the element
	      self.currentElContent = this.getCurrentElContent(self);
	
	      self.autoInsertCss = self.options.autoInsertCss;
	
	      this.appendAnimationCss(self);
	    }
	  }, {
	    key: 'getCurrentElContent',
	    value: function getCurrentElContent(self) {
	      var elContent = '';
	      if (self.attr) {
	        elContent = self.el.getAttribute(self.attr);
	      } else if (self.isInput) {
	        elContent = self.el.value;
	      } else if (self.contentType === 'html') {
	        elContent = self.el.innerHTML;
	      } else {
	        elContent = self.el.textContent;
	      }
	      return elContent;
	    }
	  }, {
	    key: 'appendAnimationCss',
	    value: function appendAnimationCss(self) {
	      var cssDataName = 'data-typed-js-css';
	      if (!self.autoInsertCss) {
	        return;
	      }
	      if (!self.showCursor && !self.fadeOut) {
	        return;
	      }
	      if (document.querySelector('[' + cssDataName + ']')) {
	        return;
	      }
	
	      var css = document.createElement('style');
	      css.type = 'text/css';
	      css.setAttribute(cssDataName, true);
	
	      var innerCss = '';
	      if (self.showCursor) {
	        innerCss += '\n        .typed-cursor{\n          opacity: 1;\n        }\n        .typed-cursor.typed-cursor--blink{\n          animation: typedjsBlink 0.7s infinite;\n          -webkit-animation: typedjsBlink 0.7s infinite;\n                  animation: typedjsBlink 0.7s infinite;\n        }\n        @keyframes typedjsBlink{\n          50% { opacity: 0.0; }\n        }\n        @-webkit-keyframes typedjsBlink{\n          0% { opacity: 1; }\n          50% { opacity: 0.0; }\n          100% { opacity: 1; }\n        }\n      ';
	      }
	      if (self.fadeOut) {
	        innerCss += '\n        .typed-fade-out{\n          opacity: 0;\n          transition: opacity .25s;\n        }\n        .typed-cursor.typed-cursor--blink.typed-fade-out{\n          -webkit-animation: 0;\n          animation: 0;\n        }\n      ';
	      }
	      if (css.length === 0) {
	        return;
	      }
	      css.innerHTML = innerCss;
	      document.body.appendChild(css);
	    }
	  }]);
	
	  return Initializer;
	})();
	
	exports['default'] = Initializer;
	var initializer = new Initializer();
	exports.initializer = initializer;

/***/ }),
/* 2 */
/***/ (function(module, exports) {

	/**
	 * Defaults & options
	 * @returns {object} Typed defaults & options
	 * @public
	 */
	
	'use strict';
	
	Object.defineProperty(exports, '__esModule', {
	  value: true
	});
	var defaults = {
	  /**
	   * @property {array} strings strings to be typed
	   * @property {string} stringsElement ID of element containing string children
	   */
	  strings: ['These are the default values...', 'You know what you should do?', 'Use your own!', 'Have a great day!'],
	  stringsElement: null,
	
	  /**
	   * @property {number} typeSpeed type speed in milliseconds
	   */
	  typeSpeed: 0,
	
	  /**
	   * @property {number} startDelay time before typing starts in milliseconds
	   */
	  startDelay: 0,
	
	  /**
	   * @property {number} backSpeed backspacing speed in milliseconds
	   */
	  backSpeed: 0,
	
	  /**
	   * @property {boolean} smartBackspace only backspace what doesn't match the previous string
	   */
	  smartBackspace: true,
	
	  /**
	   * @property {boolean} shuffle shuffle the strings
	   */
	  shuffle: false,
	
	  /**
	   * @property {number} backDelay time before backspacing in milliseconds
	   */
	  backDelay: 700,
	
	  /**
	   * @property {boolean} fadeOut Fade out instead of backspace
	   * @property {string} fadeOutClass css class for fade animation
	   * @property {boolean} fadeOutDelay Fade out delay in milliseconds
	   */
	  fadeOut: false,
	  fadeOutClass: 'typed-fade-out',
	  fadeOutDelay: 500,
	
	  /**
	   * @property {boolean} loop loop strings
	   * @property {number} loopCount amount of loops
	   */
	  loop: false,
	  loopCount: Infinity,
	
	  /**
	   * @property {boolean} showCursor show cursor
	   * @property {string} cursorChar character for cursor
	   * @property {boolean} autoInsertCss insert CSS for cursor and fadeOut into HTML <head>
	   */
	  showCursor: true,
	  cursorChar: '|',
	  autoInsertCss: true,
	
	  /**
	   * @property {string} attr attribute for typing
	   * Ex: input placeholder, value, or just HTML text
	   */
	  attr: null,
	
	  /**
	   * @property {boolean} bindInputFocusEvents bind to focus and blur if el is text input
	   */
	  bindInputFocusEvents: false,
	
	  /**
	   * @property {string} contentType 'html' or 'null' for plaintext
	   */
	  contentType: 'html',
	
	  /**
	   * Before it begins typing
	   * @param {Typed} self
	   */
	  onBegin: function onBegin(self) {},
	
	  /**
	   * All typing is complete
	   * @param {Typed} self
	   */
	  onComplete: function onComplete(self) {},
	
	  /**
	   * Before each string is typed
	   * @param {number} arrayPos
	   * @param {Typed} self
	   */
	  preStringTyped: function preStringTyped(arrayPos, self) {},
	
	  /**
	   * After each string is typed
	   * @param {number} arrayPos
	   * @param {Typed} self
	   */
	  onStringTyped: function onStringTyped(arrayPos, self) {},
	
	  /**
	   * During looping, after last string is typed
	   * @param {Typed} self
	   */
	  onLastStringBackspaced: function onLastStringBackspaced(self) {},
	
	  /**
	   * Typing has been stopped
	   * @param {number} arrayPos
	   * @param {Typed} self
	   */
	  onTypingPaused: function onTypingPaused(arrayPos, self) {},
	
	  /**
	   * Typing has been started after being stopped
	   * @param {number} arrayPos
	   * @param {Typed} self
	   */
	  onTypingResumed: function onTypingResumed(arrayPos, self) {},
	
	  /**
	   * After reset
	   * @param {Typed} self
	   */
	  onReset: function onReset(self) {},
	
	  /**
	   * After stop
	   * @param {number} arrayPos
	   * @param {Typed} self
	   */
	  onStop: function onStop(arrayPos, self) {},
	
	  /**
	   * After start
	   * @param {number} arrayPos
	   * @param {Typed} self
	   */
	  onStart: function onStart(arrayPos, self) {},
	
	  /**
	   * After destroy
	   * @param {Typed} self
	   */
	  onDestroy: function onDestroy(self) {}
	};
	
	exports['default'] = defaults;
	module.exports = exports['default'];

/***/ }),
/* 3 */
/***/ (function(module, exports) {

	/**
	 * TODO: These methods can probably be combined somehow
	 * Parse HTML tags & HTML Characters
	 */
	
	'use strict';
	
	Object.defineProperty(exports, '__esModule', {
	  value: true
	});
	
	var _createClass = (function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ('value' in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; })();
	
	function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError('Cannot call a class as a function'); } }
	
	var HTMLParser = (function () {
	  function HTMLParser() {
	    _classCallCheck(this, HTMLParser);
	  }
	
	  _createClass(HTMLParser, [{
	    key: 'typeHtmlChars',
	
	    /**
	     * Type HTML tags & HTML Characters
	     * @param {string} curString Current string
	     * @param {number} curStrPos Position in current string
	     * @param {Typed} self instance of Typed
	     * @returns {number} a new string position
	     * @private
	     */
	
	    value: function typeHtmlChars(curString, curStrPos, self) {
	      if (self.contentType !== 'html') return curStrPos;
	      var curChar = curString.substr(curStrPos).charAt(0);
	      if (curChar === '<' || curChar === '&') {
	        var endTag = '';
	        if (curChar === '<') {
	          endTag = '>';
	        } else {
	          endTag = ';';
	        }
	        while (curString.substr(curStrPos + 1).charAt(0) !== endTag) {
	          curStrPos++;
	          if (curStrPos + 1 > curString.length) {
	            break;
	          }
	        }
	        curStrPos++;
	      }
	      return curStrPos;
	    }
	
	    /**
	     * Backspace HTML tags and HTML Characters
	     * @param {string} curString Current string
	     * @param {number} curStrPos Position in current string
	     * @param {Typed} self instance of Typed
	     * @returns {number} a new string position
	     * @private
	     */
	  }, {
	    key: 'backSpaceHtmlChars',
	    value: function backSpaceHtmlChars(curString, curStrPos, self) {
	      if (self.contentType !== 'html') return curStrPos;
	      var curChar = curString.substr(curStrPos).charAt(0);
	      if (curChar === '>' || curChar === ';') {
	        var endTag = '';
	        if (curChar === '>') {
	          endTag = '<';
	        } else {
	          endTag = '&';
	        }
	        while (curString.substr(curStrPos - 1).charAt(0) !== endTag) {
	          curStrPos--;
	          if (curStrPos < 0) {
	            break;
	          }
	        }
	        curStrPos--;
	      }
	      return curStrPos;
	    }
	  }]);
	
	  return HTMLParser;
	})();
	
	exports['default'] = HTMLParser;
	var htmlParser = new HTMLParser();
	exports.htmlParser = htmlParser;

/***/ })
/******/ ])
});
;

/***/ })

/******/ 	});
/************************************************************************/
/******/ 	// The module cache
/******/ 	var __webpack_module_cache__ = {};
/******/ 	
/******/ 	// The require function
/******/ 	function __webpack_require__(moduleId) {
/******/ 		// Check if module is in cache
/******/ 		if(__webpack_module_cache__[moduleId]) {
/******/ 			return __webpack_module_cache__[moduleId].exports;
/******/ 		}
/******/ 		// Create a new module (and put it into the cache)
/******/ 		var module = __webpack_module_cache__[moduleId] = {
/******/ 			// no module.id needed
/******/ 			// no module.loaded needed
/******/ 			exports: {}
/******/ 		};
/******/ 	
/******/ 		// Execute the module function
/******/ 		__webpack_modules__[moduleId].call(module.exports, module, module.exports, __webpack_require__);
/******/ 	
/******/ 		// Return the exports of the module
/******/ 		return module.exports;
/******/ 	}
/******/ 	
/************************************************************************/
/******/ 	/* webpack/runtime/compat get default export */
/******/ 	(() => {
/******/ 		// getDefaultExport function for compatibility with non-harmony modules
/******/ 		__webpack_require__.n = (module) => {
/******/ 			var getter = module && module.__esModule ?
/******/ 				() => (module['default']) :
/******/ 				() => (module);
/******/ 			__webpack_require__.d(getter, { a: getter });
/******/ 			return getter;
/******/ 		};
/******/ 	})();
/******/ 	
/******/ 	/* webpack/runtime/define property getters */
/******/ 	(() => {
/******/ 		// define getter functions for harmony exports
/******/ 		__webpack_require__.d = (exports, definition) => {
/******/ 			for(var key in definition) {
/******/ 				if(__webpack_require__.o(definition, key) && !__webpack_require__.o(exports, key)) {
/******/ 					Object.defineProperty(exports, key, { enumerable: true, get: definition[key] });
/******/ 				}
/******/ 			}
/******/ 		};
/******/ 	})();
/******/ 	
/******/ 	/* webpack/runtime/hasOwnProperty shorthand */
/******/ 	(() => {
/******/ 		__webpack_require__.o = (obj, prop) => (Object.prototype.hasOwnProperty.call(obj, prop))
/******/ 	})();
/******/ 	
/******/ 	/* webpack/runtime/make namespace object */
/******/ 	(() => {
/******/ 		// define __esModule on exports
/******/ 		__webpack_require__.r = (exports) => {
/******/ 			if(typeof Symbol !== 'undefined' && Symbol.toStringTag) {
/******/ 				Object.defineProperty(exports, Symbol.toStringTag, { value: 'Module' });
/******/ 			}
/******/ 			Object.defineProperty(exports, '__esModule', { value: true });
/******/ 		};
/******/ 	})();
/******/ 	
/************************************************************************/
var __webpack_exports__ = {};
// This entry need to be wrapped in an IIFE because it need to be in strict mode.
(() => {
"use strict";
/*!*********************!*\
  !*** ./src/main.js ***!
  \*********************/
__webpack_require__.r(__webpack_exports__);
<<<<<<< HEAD
/* harmony import */ var _farvell_jflow_core__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! @farvell/jflow-core */ "./node_modules/@farvell/jflow-core/index.js");
/* harmony import */ var _farvell_jflow_core__WEBPACK_IMPORTED_MODULE_0___default = /*#__PURE__*/__webpack_require__.n(_farvell_jflow_core__WEBPACK_IMPORTED_MODULE_0__);
/* harmony import */ var typed_js__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! typed.js */ "./node_modules/typed.js/lib/typed.js");
/* harmony import */ var typed_js__WEBPACK_IMPORTED_MODULE_1___default = /*#__PURE__*/__webpack_require__.n(typed_js__WEBPACK_IMPORTED_MODULE_1__);
/* harmony import */ var _styles_index_scss__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! ./styles/index.scss */ "./src/styles/index.scss");
// Import modules

=======
/* harmony import */ var _handler__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ./handler */ "./src/handler.js");
/* harmony import */ var _lightbox__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ./lightbox */ "./src/lightbox.js");
/* harmony import */ var typed_js__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! typed.js */ "./node_modules/typed.js/lib/typed.js");
/* harmony import */ var typed_js__WEBPACK_IMPORTED_MODULE_2___default = /*#__PURE__*/__webpack_require__.n(typed_js__WEBPACK_IMPORTED_MODULE_2__);
/* harmony import */ var _styles_index_scss__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! ./styles/index.scss */ "./src/styles/index.scss");
// Import modules


>>>>>>> eacaccd3865fa86ba0a0e96ce481b5e7d0c06caa
 // Webpack styles

 // Initialize menu event.

var initMenu = function initMenu() {
<<<<<<< HEAD
  var menu = new _farvell_jflow_core__WEBPACK_IMPORTED_MODULE_0__.Handler({
    element: "menu",
    css: ["hideLeft", "showLeft"]
  }, {
    element: "menu-button",
    css: ["unrotateRight", "rotateRight"]
  });
  return menu.onClick("menu-control");
=======
  return new Promise(function (resolve) {
    var menu = new _handler__WEBPACK_IMPORTED_MODULE_0__.default({
      element: "menu",
      css: ["hideLeft", "showLeft"]
    }, {
      element: "menu-button",
      css: ["unrotateRight", "rotateRight"]
    });
    resolve(menu.onClick(".menu-control"));
  });
}; // Initialize lightbox event.


var initLightbox = function initLightbox() {
  return new Promise(function (resolve) {
    var lightbox = new _lightbox__WEBPACK_IMPORTED_MODULE_1__.default({
      images: ".grid-image",
      texts: ".grid-caption",
      animation: {
        element: "lightbox",
        css: ["disappear", "appear"]
      },
      photo: "lightbox-photo",
      caption: "lightbox-caption",
      roullette: "lightbox-roullette"
    });
    resolve(lightbox.listen());
  });
>>>>>>> eacaccd3865fa86ba0a0e96ce481b5e7d0c06caa
}; // Initialize document event.


var initDocument = function initDocument() {
<<<<<<< HEAD
  var document = new _farvell_jflow_core__WEBPACK_IMPORTED_MODULE_0__.Handler({
    element: "document",
    css: ["disappear", "appear"]
  }, {
    element: "loader",
    css: "disappear"
  });
  return document.onTimeout(900);
=======
  return new Promise(function (resolve) {
    var document = new _handler__WEBPACK_IMPORTED_MODULE_0__.default({
      element: "document",
      css: ["disappear", "appear"]
    }, {
      element: "loader",
      css: "disappear"
    });
    resolve(document.timeout(900));
  });
>>>>>>> eacaccd3865fa86ba0a0e96ce481b5e7d0c06caa
}; // Main function.


window.addEventListener("load", function () {
<<<<<<< HEAD
  initMenu().then(initDocument()).then(new _farvell_jflow_core__WEBPACK_IMPORTED_MODULE_0__.Lightbox({
    images: "grid-image",
    texts: "grid-caption",
    css: ["disappear", "appear"]
  }));
}); // Typed.js

new (typed_js__WEBPACK_IMPORTED_MODULE_1___default())("#typed", {
=======
  initMenu().then(initLightbox()).then(initDocument());
}); //Typed.js

new (typed_js__WEBPACK_IMPORTED_MODULE_2___default())("#typed", {
>>>>>>> eacaccd3865fa86ba0a0e96ce481b5e7d0c06caa
  strings: ["d", "designers.", "d", "developers.", "", "you!"],
  typeSpeed: 90,
  backSpeed: 50,
  startDelay: 2000,
  backDelay: 1000,
  loop: true
});
console.log("Hot reloading...");
})();

/******/ })()
;
//# sourceMappingURL=bundle.js.map
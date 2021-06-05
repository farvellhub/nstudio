// Lightbox logic and constructor
export default class Lightbox {

	// fetching data classes to control lightbox
	constructor( config ) {
        
		// Initializing handler
		this.handler = new LightboxHandler({
			element: "lightbox",
			css: config.css
		});
		// Set param config
		this._setLightboxConfig( config );
		// Init roullette of images
		this._initRoullette();

		console.log( this.config );
		// Return listen lightbox
		return this.listen();
	}

	_setLightboxConfig( config ) {
		this.config =  {
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

	_updateFromAll() {
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
			position = ( index - this.lightboxSize )  - length;

		this._updateFromAll( position );

		return position;
	}

	// If conditions return True
	_validUpdate ( classList ) {
		const conditions = this.config.conditions;

		return classList.contains( conditions.name );
	}

	// Route depending on position
	_updateFrom( classList, index ) {
		let position;

		if ( this._validUpdate( classList, "roullette" )) {
			position = this._updateFromRoullette( index );

		} else if ( this._validUpdate( classList, "previous" )) {
			position = this._updateFromPrevious();

		} else if ( this._validUpdate( classList, "next" )) {
			position = this._updateFromNext();

		} else { position = this._updateFromImages( index ); }

		this._setLastPosition( position );
	}

	// Update state from all conditions
	_update() {
        
		const lastClick = this.handler.lastClicked(),
			classList = lastClick.element.classList;
            
		if ( classList.contains( this.config.exit )) return;

		this._updateFrom( classList, lastClick.index );
	}

	// Listener handler
	async listen() {
		this.handler.setAfterFunc( this._update, this ); 
		return this.handler.onClick( this.config.control, this.conditions )
			.then( console.log( "Lightbox is working!" ));
	}
}

// Lightbox event handler 
class LightboxHandler {

	// ... Animation { element: idName, css: className || [className] }
	constructor( ...animations ) {
		// Init animations.
		this.animations = [];
		this._initAnimations( animations );
	}

	// Setting animations object and css array
	_initAnimations( animations ) {
		animations.forEach(( anim, index ) => {
			this.animations.push({
				element: document.getElementById( anim.element ),
				css: Array.isArray( anim.css ) ? anim.css : [ anim.css ]
			});

			this._setDefaultAnimation( index );
		});
	}

	// If css provided is an array
	_setDefaultAnimation( index ) {
		const animation = this.animations[ index ],
			element = animation.element,
			css = animation.css;

		if ( css.length > 1 ) this._toggleAnimation( element, css[ 0 ]);
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
			if ( classList.contains( conditions[ c ])) 
				isConditioned = true;
		});

		return isConditioned;
	}

	// Controls if have conditions
	_trigger( conditions ) {
		if ( this._isConditioned( conditions )) return;

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
			e.addEventListener( "click", () => {
				this.lastClick = { 
					"element": e,
					"index": ( i - 1 ) 
				};

				this._execution( conditions );
			});
		});

		return this;
	}
}
// Babel runtime
import "core-js/stable";
import "regenerator-runtime/runtime";

// Import modules
import { Handler } from "@farvell/jflow-core";
import Typed from "typed.js";
import Lightbox from "./lightbox";

// Webpack styles
import "./styles/index.scss";

// Initialize menu event.
const initMenu = () => {
    const menu = new Handler({
        element: "menu",
        css: [ "hideLeft", "showLeft" ],
    },
    {
        element: "menu-button",
        css: [ "unrotateRight", "rotateRight" ],
    });

    return menu.onClick( "menu-control" );
};

// Initialize document event.
const initDocument = () => {
    const document = new Handler({
        element: "document",
        css: [ "disappear", "appear" ]
    },
    {
        element: "loader",
        css: "disappear"
    });

    return document.onTimeout( 900 );
};

// Main function.
window.addEventListener( "load", () => {
    initMenu()
        .then( initDocument())
        .then( new Lightbox({

            images: "grid-image",
            texts: "grid-caption",
            css: [ "disappear", "appear" ]

        })).then( console.log( "Is working..." ));
});

// Typed.js
new Typed( "#typed", {
    strings: [ "d", "designers.", "d", "developers.", "", "you!" ],
    typeSpeed: 90,
    backSpeed: 50,
    startDelay: 2000,
    backDelay: 1000,
    loop: true
});



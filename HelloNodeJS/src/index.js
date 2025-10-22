import {home} from "./home.js";
import {contact} from "./contact-us.js";
import {about} from "./about-us.js";


let homeButton = home();
let contactButton = contact();
let aboutButton = about();
let nav = document.getElementsByTagName("nav")[0];

nav.appendChild(homeButton);
nav.appendChild(contactButton);
nav.appendChild(aboutButton);

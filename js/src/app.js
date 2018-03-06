import filterPortfolio from './filter-portfolio.js';

import fontawesome from '@fortawesome/fontawesome';
import {faInstagram, faLinkedin, faGithub, faTwitter} from 		'@fortawesome/fontawesome-free-brands';
import {faEnvelope, faExternalLink } from '@fortawesome/fontawesome-pro-light';
import faCircle from '@fortawesome/fontawesome-pro-solid';

fontawesome.library.add(faGithub);
fontawesome.library.add(faEnvelope);
fontawesome.library.add(faInstagram);
fontawesome.library.add(faLinkedin);
fontawesome.library.add(faTwitter);
fontawesome.library.add(faCircle);
fontawesome.library.add(faExternalLink);


// TODO: Add smoothscroll polyfill

// Polyfill for matches() from https://developer.mozilla.org/en-US/docs/Web/API/Element/matches
// For browsers that do not support Element.matches() or Element.matchesSelector(), 
// but carry support for document.querySelectorAll(), a polyfill exists:
if (!Element.prototype.matches) {
    Element.prototype.matches = 
        Element.prototype.matchesSelector || 
        Element.prototype.mozMatchesSelector ||
        Element.prototype.msMatchesSelector || 
        Element.prototype.oMatchesSelector || 
        Element.prototype.webkitMatchesSelector ||
        function(s) {
            var matches = (this.document || this.ownerDocument).querySelectorAll(s),
                i = matches.length;
            while (--i >= 0 && matches.item(i) !== this) {}
            return i > -1;            
        };
}

const inView = require('in-view');


window.addEventListener('DOMContentLoaded', function(e){
	
	// lazyloading the images
	let imageSize = "";
	if (window.innerWidth > 800){
		imageSize = "desktop";
	} else if (window.innerWidth > 450){
		imageSize = "tablet";
	} else {
		imageSize = "mobile";
	}

    // Let's set our lazyload offset to 500px below the viewport. 
    inView.offset(-500);

    inView('.project__thumb--blur')
        .on('enter', el => {
            let img = el.querySelector('img');
            let src = img.getAttribute('src');
            img.setAttribute('src', src.replace('micro-thumbs', 'thumbs'));
            el.classList.remove('project__thumb--blur');
        });


});

// FILTER THE PROJECTS TO THE CHOSEN CATEGORY

window.addEventListener('DOMContentLoaded', function(e){
	// Init the portfolio filter buttons
	const filterButtons = [].slice.call(document.querySelectorAll('.filter'));
	filterButtons.forEach(f => {
		f.addEventListener('click', function(e){
			console.log('click');
			document.querySelector('.filter--checked').classList.remove('filter--checked');
			this.classList.add('filter--checked');

			// We're using css selectors to match projects. If the "all" button is selected,
			// then set the css selector to the wildcard
			const 	desiredCategory = this.dataset.topic == "all" ? "" : `[data-${this.dataset.topic}]`,
					projects = [].slice.call(document.querySelectorAll('.project'));

			for (let project of projects){
				if(project.matches(`.project${desiredCategory}`)){
					project.classList.add('project--visible');
				} else {
					project.classList.remove('project--visible');
				}
			}
		})
	})
})
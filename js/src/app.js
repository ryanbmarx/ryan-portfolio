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



window.addEventListener('DOMContentLoaded', function(e){
	// Init the portfolio filter buttons
	const filterButtons = [].slice.call(document.querySelectorAll('.filter'));
	filterButtons.forEach(f => {
		f.addEventListener('click', function(e){
			console.log('click');
			if (this.classList.contains('filter--checked')) this.classList.remove('filter--checked');
			else this.classList.add('filter--checked');

			filterPortfolio();
		})
	})
})
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
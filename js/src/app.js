import filterPortfolio from './filter-portfolio.js';
import fontawesome from '@fortawesome/fontawesome';
// import faUser from '@fortawesome/fontawesome-pro-solid/faUser'
import faCircle from '@fortawesome/fontawesome-pro-regular/faCircle'
// import faArchive from '@fortawesome/fontawesome-pro-light/faArchive'
// import faFacebookF from '@fortawesome/fontawesome-free-brands/faFacebookF';
// import faTwitterSquare from '@fortawesome/fontawesome-free-brands/faTwitterSquare';
// import faGithub from '@fortawesome/fontawesome-free-brands/faGithub';
// import faLinkedin from '@fortawesome/fontawesome-free-brands/faLinkedin';
// import faInstagram from '@fortawesome/fontawesome-free-brands/faInstagram';
// import faExternalLink from '@fortawesome/fontawesome-pro-regular/faExternalLink';
import brands from '@fortawesome/fontawesome-free-brands';
import solid from '@fortawesome/fontawesome-pro-solid';
import light from '@fortawesome/fontawesome-pro-light';

fontawesome.library.add(solid.faCircle);
fontawesome.library.add(brands.faFacebookF);
fontawesome.library.add(brands.faTwitter);
fontawesome.library.add(brands.faGithub);
fontawesome.library.add(brands.faLinkedin);
fontawesome.library.add(brands.faInstagram);
fontawesome.library.add(light.faExternalLink);
fontawesome.library.add(light.faEnvelope);


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
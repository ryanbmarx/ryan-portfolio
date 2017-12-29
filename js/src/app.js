import fontawesome from '@fortawesome/fontawesome';
import { faFacebook } from '@fortawesome/fontawesome-free-solid';

// TODO: Add smoothscroll polyfill







window.addEventListener('DOMContentLoaded', function(e){
	// Init the portfolio filter buttons
	const filterButtons = [].slice.call(document.querySelectorAll('.filter'));
	filterButtons.forEach(f => {
		f.addEventListener('click', function(e){
			console.log('click');
			if (this.classList.contains('filter--active')) this.classList.remove('filter--active');
			else this.classList.add('filter--active');
		})
	})
})
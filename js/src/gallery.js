import 'lightgallery.js';
import "lg-zoom.js";
import "lg-thumbnail.js";

document.addEventListener('DOMContentLoaded',function(){
    lightGallery(document.querySelector('#gallery'),{
		thumbnail:true,
		animateThumb:true
    }); 
});

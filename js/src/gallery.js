require("lightgallery.js");
// require("lg-zoom.js");
// require("lg-thumbnail.js");

document.addEventListener('DOMContentLoaded',function(){
    lightGallery(document.querySelector('#gallery'),{
		thumbnail:true,
		animateThumb:true
    }); 
});

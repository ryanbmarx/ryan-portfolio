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

module.exports = function filterPortfolio(){
	console.log('filtering')
	// Found the nodelist>array trick here --> https://davidwalsh.name/nodelist-array
	const 	checkedFilters = document.querySelectorAll('.filter--checked'),
			projects = [].slice.call(document.querySelectorAll('.project'));

	projects.forEach(project => {
		project.classList.remove("project--visible");
	})
	
	// These arrays will hold the selected categories in the form of css selector strings.
	// BUT, if there are no selections from the category, we want to show ALL, not show NONE.
	const selectedCategories = checkedFilters.length > 0 ? [] : ["*"];

	// Populate the category array with strings representing css selectors that would
	// select that category. For instance, javascript would be "[data-javascript]"
	for (let i=0; i < checkedFilters.length; i++){
		selectedCategories.push(`[data-${checkedFilters[i].dataset.topic}]`);
	}

	// For each food item, if it matches something from each of the categories, then display it. Else, hide it.
	projects.forEach(project => {
		if (project.matches(selectedCategories)){
			// The item matches the desired stadium(s), categories and ratings. Turn it on. 
			project.classList.add("project--visible");
		} else {
			// The item does not meet one of the criteria above. Hide it.
			project.classList.remove("project--visible");
		}
	})

}
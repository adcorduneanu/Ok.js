(function () {   
    this.OkTabs = function () {
        var currentObj = this;
        this.parent; var i=0;

        // Define option defaults
        var defaults = {
            className: 'OkTabs',           
            activeTab: 0,
            activeTabClass:'OkTabs-active'
        }

        if (!arguments[0]) {
            throw new Error("The id was not specified");
        }

        // Create options by extending defaults with the passed in arugments
        if (arguments[1] && typeof arguments[1] === "object") {
            this.options = extendDefaults(defaults, arguments[1]);
        }
        else {
            this.options = defaults;
        }

        this.parent = document.getElementById(arguments[0]);
        this.parent.addClass(this.options.className);
        var parentUL = this.parent.getElementsByTagName("ul")[0];
        var parentDiv = document.querySelectorAll("#" + arguments[0] + " > div");

        currentObj.clickHandler = function (index) {
            parentUL.children[currentObj.options.activeTab].removeClass(currentObj.options.activeTabClass);
            parentDiv[currentObj.options.activeTab].style.display = "none";

            currentObj.options.activeTab = index;
            parentUL.children[currentObj.options.activeTab].addClass(currentObj.options.activeTabClass);
            parentDiv[currentObj.options.activeTab].style.display = "block";
        };

        while (i < parentUL.children.length) {            
            parentDiv[i].style.display = "none";

            if (currentObj.options.activeTab == i) {
                parentUL.children[i].addClass(currentObj.options.activeTabClass);
                parentDiv[i].style.display = "block";
            }

            parentUL.children[i].children[0].onclick = currentObj.clickHandler.bind(this,i);
            i++;
        }

        
    }

    // Utility method to extend defaults with user options
    function extendDefaults(source, properties) {
        var property;
        for (property in properties) {
            if (properties.hasOwnProperty(property)) {
                source[property] = properties[property];
            }
        }
        return source;
    }
}());
var register = function(Handlebars) {
    var helpers = {
        // check if the timeseries value is bounded
        isNotBounded: function (num, upper, lower) {
            return !(num <= upper && num >= lower);
        }


        
    }




    if (Handlebars && typeof Handlebars.registerHelper === "function") {
        // for each helper we defined above
        for (var prop in helpers) {
            // register helper
            Handlebars.registerHelper(prop, helpers[prop]);
        }
    } else {
        // return helpers object in case we can't register 
        return helpers;
    }
}




module.exports.register = register;
module.exports.helpers = register(null); 
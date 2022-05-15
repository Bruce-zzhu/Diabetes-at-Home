var register = function(Handlebars) {
    var helpers = {
        // check if the timeseries value is bounded
        isNotBounded: function (num, upper, lower) {
            return !(num <= upper && num >= lower);
        },

        // to make @index start from 1
        idx: function(value) {
            return parseInt(value) + 1;
        },

        // extract date info from Date object
        getDate: function (date) {
            const year = date.getFullYear();
            const month = date.getMonth() + 1;
            const day = date.getDate();

            return `${day}/${month}/${year}`
        },

        // change mongodb default time to melbourne date without time
        toMelbDate: function (date) {
            const timestamp = date.toLocaleString("en-AU", {"timeZone": "Australia/Melbourne"})
            return timestamp.slice(0, 10)
        },

        // date with time
        toMelbTimestamp: function (date) {
            return date.toLocaleString("en-AU", {"timeZone": "Australia/Melbourne"})
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
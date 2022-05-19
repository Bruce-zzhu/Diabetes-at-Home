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

        // check if value entry is recorded
        recorded: function(value) {
            return (value == 0) || value;
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

        // date without year
        toMelbDateNoYear: function (date) {
            const timestamp = date.toLocaleString("en-AU", {"timeZone": "Australia/Melbourne"})
            return timestamp.slice(0, 5)
        },

        // date with time
        toMelbTimestamp: function (date) {
            return new Date(date).toLocaleString("en-AU", {"timeZone": "Australia/Melbourne"})
        },

        // JSON stringfy
        jStringify: function (obj) {
            return JSON.stringify(obj);
        },

        // check if a user (cookie) is clinician
        ifClin: function (user, options) {
            return (user.role == "clinician") ? options.fn(this) : options.inverse(this);
        },

        // check if the comment is empty
        notEmpty: function (comment) {
            return Boolean(comment);
        },

        // check if two strings are the same
        sameStr: function (s1, s2) {
            return s1 === s2;
        },

        topRanked: function (context, block) {
            var topRanked = "";
            var n = Math.min(parseInt(block.hash.n), context.length);
            for (var i=0; i<n; i++) {
                topRanked += block.fn(context[i]);
            }
            return topRanked;
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
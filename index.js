(function(module) {
    "use strict";

    var Youku = {},
        embed = 'hahahahaha----$1----hahahahha';

    Youku.parse = function(data, callback) {
        var	regularUrl = /test(.*?)test/;

        if (data.postData.content.match(regularUrl)) {
            data.postData.content = data.postData.content.replace(regularUrl, embed);
        }

        callback(null, data);
    };

    module.exports = Youku;
}(module));

(function(module) {
    "use strict";

    let superagent = require('superagent');
    let cheerio = require('cheerio');

    var Youku = {},
        embed = '$1';
        embed += '<p>$3</p>'

    const pokerUrl = /(>(http:\/\/replay\.pokermate\.net:8080\/handplayer\/replay\/\?url=([a-z0-9]{96}))<\/a>)/g;

    Youku.parse = function(data, callback) {
        console.log('------parsing', data.postData.pid, '-----------');
        console.log(data.postData);
        console.log('------parsing', data.postData.pid, '-----------');

        if (data.postData.content.match(pokerUrl)) {
            data.postData.content = data.postData.content.replace(pokerUrl, embed);
            console.log(data.postData.content);
        }

        callback(null, data);
    };

    Youku.fetch = function(data, callback) {
        const regex = /(http:\/\/replay\.pokermate\.net:8080\/handplayer\/replay\/\?url=([a-z0-9]{96}))/g;
        const str = data.content;
        let m;

        while ((m = regex.exec(str)) !== null) {
            // This is necessary to avoid infinite loops with zero-width matches
            if (m.index === regex.lastIndex) {
                regex.lastIndex++;
            }

            let url = m[1];
            let token = m[2];
            console.log(url);
            console.log(token);

            superagent.get(url)
              .end(function(err, res) {
                if ( !err && res.ok ) {
                  let $ = cheerio.load(res.text);
                  const str = $('body + script')[0].children[0].data;
                  const regex = /parseJSON\(\'(\1.*?)\'\)/g;
                  const json_data = regex.exec(str)[1];
                  console.log(json_data);
                  console.log(JSON.parse(json_data));
                }
              });
        }
    };

    module.exports = Youku;
}(module));

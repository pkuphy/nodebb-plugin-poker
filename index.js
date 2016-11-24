(function(module) {
    "use strict";

    let superagent = require('superagent');
    let cheerio = require('cheerio');
    let db = module.parent.require('./database');

    let Poker = {};
    let embed = '$1 ';
    embed += '<span><button class="btn btn-xs btn-default toggle-poker-player load-poker-player" data-token="$3">载入牌谱</button>';
    embed += '<span class="mycanvas"></span>';

    const pokerUrl = /(>(http:\/\/replay\.pokermate\.net:8080\/handplayer\/replay\/\?url=([a-z0-9]{96})).*?<\/a>)/g;

    Poker.parse = function(data, callback) {

        if (data.postData.content.match(pokerUrl)) {
            data.postData.content = data.postData.content.replace(pokerUrl, embed);
        }

        let postKey = 'post:' + data.postData.pid;

        db.getObject(postKey, function(err, obj) {
            if (obj) {
                let str = obj.content;
                const regex = /(http:\/\/replay\.pokermate\.net:8080\/handplayer\/replay\/\?url=([a-z0-9]{96}))/g;
                let m;

                while ((m = regex.exec(str)) !== null ) {
                    if (m.index === regex.lastIndex) {
                        regex.lastIndex++;
                    }

                    let token = m[2];
                    let tokenKey = 'poker:' + token;

                    db.getObject(tokenKey, function(err, obj) {
                        if (obj) {
                            let json_data = JSON.parse(obj.data);
                            json_data.STAGE.TITLE = '';
                            json_data.STAGE.TABLE.TITLE = '';
                            data.postData.content += '<p class="hidden" id="';
                            data.postData.content += token;
                            data.postData.content += '">';
                            data.postData.content += JSON.stringify(json_data);
                            data.postData.content += '</p>';
                        }
                    })
                }
            }

        });

        callback(null, data);
    };

    Poker.store = function(data, callback) {
        const regex = /(http:\/\/replay\.pokermate\.net:8080\/handplayer\/replay\/\?url=([a-z0-9]{96}))/g;
        const str = data.content;
        let m;

        // 处理帖子里的每一条链接
        while ((m = regex.exec(str)) !== null) {
            if (m.index === regex.lastIndex) {
                regex.lastIndex++;
            }

            let url = m[1];
            let token = m[2];

            let _key = 'poker:' + token;

            console.log(_key);

            db.getObject(_key, function(err, obj) {
                console.log(_key);
                console.log('obj', obj, '\n\n');
                if (!obj) {
                    superagent.get(url)
                        .end(function(err, res) {
                            if ( !err && res.ok ) {
                                let $ = cheerio.load(res.text);
                                if ($('body + script').length > 0) {
                                    const str = $('body + script')[0].children[0].data;
                                    const regex = /parseJSON\(\'(\1.*?)\'\)/g;
                                    const json_data = regex.exec(str)[1];
                                    db.setObject(_key, {data: json_data});
                                }
                            }
                    });
                } else {
                    console.log('already fetched!');
                }
            });

        }
    };

    module.exports = Poker;
}(module));

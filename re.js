const regex = /(http:\/\/replay\.pokermate\.net:8080\/handplayer\/replay\/\?url=([a-z0-9]{96}))/g;
const str = `http://replay.pokermate.net:8080/handplayer/replay/?url=de6eb0a0ba32c4a9277c0a3ffead0280c3bd25d4b9d93b849237a8c1023963b60101c1926b6f104bd6fe2401a824b0b7\\n\\nhttp://replay.pokermate.net:8080/handplayer/replay/?url=de6eb0a0ba32c4a9277c0a3ffead0280c3bd25d4b9d93b849237a8c1023963b60101c1926b6f104bd6fe2401a824b0b7`;
let m;

while ((m = regex.exec(str)) !== null) {
    // This is necessary to avoid infinite loops with zero-width matches
    if (m.index === regex.lastIndex) {
        regex.lastIndex++;
    }
    
    // The result can be accessed through the `m`-variable.
    m.forEach((match, groupIndex) => {
        console.log(`Found match, group ${groupIndex}: ${match}`);
    });
}

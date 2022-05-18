function start(){
    let readline = require('readline');
    readline.emitKeypressEvents(process.stdin);
    const userinput = "> "
    const Cache = {history:[], currentChunk:'', wasCurent:'', data:{pos:0, cursorPos:userinput.length}};
    function protos(command){
        if(command == undefined)return
        readline.clearLine(process.stdout, 0);
        readline.cursorTo(process.stdout, 0);
        if(!command.startsWith('.')){
            try {
                console.log(`[ \x1b[1;32meval\x1b[0m ]: ${require("util").inspect(eval("'use strict';"+command), {colors:true, depth:0})}`)
            } catch(err) {
                console.log(`[ \x1b[1;32meval\x1b[0m ]: \x1b[1;31m<ERROR> ${err}\x1b[0m`)
            }
            return process.stdout.write(userinput)
        }
        command = command.substring(1)
        switch(command){
            case 'clear':
                console.clear()
                break;
            case 'history':
                console.log(Cache.history.join("\n"))
                break;
                default:
                    console.log(`${command}: invalid command`)
                    break;
        }
        process.stdout.write(userinput)
    }
    function ctrl(key) {
        switch (key.name) {
            case "c":
                console.log("^C");
                process.exit(0)
            case "l":
                console.clear()
                readline.cursorTo(process.stdout, 0)
                process.stdout.write(`${userinput}${Cache.currentChunk}`)
                readline.cursorTo(process.stdout, Cache.data.cursorPos)
                return true   
            default:
                break;
        }
        process.stdout.write(userinput)
    }
    let scope = this
    process.stdout.write(userinput)
    if(process.stdin.isTTY){
        process.stdin.setRawMode(true);
        process.stdin.on('keypress', (str, key) => {
            if(key.ctrl){
                if (ctrl(key)) return
            }
            if(scope.paused)return
            switch (key.name) {
                case 'up':
                    readline.clearLine(process.stdout, 0);
                    readline.cursorTo(process.stdout, 0);
                    if(Cache.data.pos > 0){
                        if(Cache.data.pos == Cache.history.length){
                            Cache.wasCurent = Cache.currentChunk
                        }
                        if(Cache.data.pos+1 < Cache.history.length) {Cache.wasCurent = Cache.currentChunk;}
                        Cache.data.pos -= 1;
                        Cache.currentChunk = Cache.history[Cache.data.pos];
                        process.stdout.write(`${userinput}${Cache.currentChunk}`);
                    } else {
                        process.stdout.write(`${userinput}${Cache.currentChunk}`);
                    }
                    Cache.data.cursorPos = Cache.currentChunk.length+userinput.length;
                    readline.cursorTo(process.stdout, Cache.data.cursorPos);
                    break;
                case 'down':
                    readline.clearLine(process.stdout, 0);
                    readline.cursorTo(process.stdout, 0);
                    if(Cache.data.pos+1 < Cache.history.length){
                        Cache.data.pos += 1;
                        Cache.currentChunk = Cache.history[Cache.data.pos];
                        process.stdout.write(`${userinput}${Cache.currentChunk}`);
                    } else {
                        if (Cache.data.pos+1 == Cache.history.length){
                            Cache.currentChunk = Cache.wasCurent;
                            Cache.wasCurent = '';
                            Cache.data.pos+=1;
                        }
                        Cache.data.cursorPos = Cache.currentChunk.length+userinput.length;
                        process.stdout.write(`${userinput}${Cache.currentChunk}`);
                    }
                    readline.cursorTo(process.stdout, Cache.data.cursorPos);
                    break;
                case 'left':
                    if(Cache.data.cursorPos > userinput.length)Cache.data.cursorPos -= 1;
                    readline.cursorTo(process.stdout, Cache.data.cursorPos);
                    break;
                case 'right': 
                    if(Cache.data.cursorPos < Cache.currentChunk.length+userinput.length)Cache.data.cursorPos += 1;
                    readline.cursorTo(process.stdout, Cache.data.cursorPos);
                    break;
                case 'return':
                    let cache
                    if (Cache.currentChunk != ''){
                        if(Cache.history.length == 0 || Cache.history[Cache.history.length-1] != Cache.currentChunk) Cache.history.push(Cache.currentChunk);
                        Cache.data.pos+=1;
                        cache = Cache.currentChunk;
                        Cache.currentChunk = '';
                        Cache.wasCurent = '';
                        Cache.data.cursorPos = userinput.length;
                    }
                    process.stdout.write(`\n${userinput}`);
                    protos(cache);
                    break;
                case 'backspace':
                    Cache.currentChunk = Cache.currentChunk.slice(0, Cache.data.cursorPos-userinput.length-1)+Cache.currentChunk.slice(Cache.data.cursorPos-userinput.length);
                    if(Cache.data.cursorPos > userinput.length)Cache.data.cursorPos -= 1;
                    readline.clearLine(process.stdout, 0);
                    readline.cursorTo(process.stdout, 0);
                    process.stdout.write(`${userinput}${Cache.currentChunk}`);
                    readline.cursorTo(process.stdout, Cache.data.cursorPos);
                    break;
                case 'delete':
                    Cache.currentChunk = Cache.currentChunk.slice(0, Cache.data.cursorPos-userinput.length)+Cache.currentChunk.slice(Cache.data.cursorPos-userinput.length+1);
                    readline.clearLine(process.stdout, 0);
                    readline.cursorTo(process.stdout, 0);
                    process.stdout.write(`${userinput}${Cache.currentChunk}`);
                    readline.cursorTo(process.stdout, Cache.data.cursorPos);
                    break;
                case "home":
                    readline.cursorTo(process.stdout, 0);
                    Cache.data.cursorPos = userinput.length;
                    break;
                case "end":
                    readline.cursorTo(process.stdout, Cache.currentChunk.length);
                    Cache.data.cursorPos = Cache.currentChunk.length;
                    break;
                default:
                    if(key.shift) str = key.sequence.toUpperCase()
                    Cache.currentChunk = Cache.currentChunk.slice(0, Cache.data.cursorPos-userinput.length)+str+Cache.currentChunk.slice(Cache.data.cursorPos-userinput.length);
                    Cache.data.cursorPos += 1;
                    readline.clearLine(process.stdout, 0);
                    readline.cursorTo(process.stdout, 0);
                    process.stdout.write(`${userinput}${Cache.currentChunk}`);
                    readline.cursorTo(process.stdout, Cache.data.cursorPos);
                    Cache.wasCurent = ""
                    Cache.data.pos = Cache.history.length;
                    break;
            }
        });
    }
}
function pause(){
    this.paused = true
}
function resume(){
    this.paused = false
}
function ask(question){
    let scope = this
    scope.paused = true
    return new Promise(resolve => {
        let readline = require('readline');
        readline.emitKeypressEvents(process.stdin);
        let res = false
        let userinput = question+" ";
        const Cache = {currentChunk:'', data:{cursorPos:userinput.length}};
        process.stdout.write(`${userinput}`);
        process.stdin.setRawMode(true);
        process.stdin.on("keypress", listenner);
        function listenner(str, key){
            if (res) return
            if(key.ctrl && key.name == 'c'){
                process.stdout.write('\n');
                process.exit();
            }
            switch (key.name) {
                case 'up':
                    break;
                case 'down':
                    break;
                case 'left':
                    if(Cache.data.cursorPos > userinput.length)Cache.data.cursorPos -= 1;
                    readline.cursorTo(process.stdout, Cache.data.cursorPos);
                    break;
                case 'right': 
                    if(Cache.data.cursorPos < Cache.currentChunk.length+userinput.length)Cache.data.cursorPos += 1;
                    readline.cursorTo(process.stdout, Cache.data.cursorPos);
                    break;
                case 'return':
                    process.stdout.write('\n');
                    res = true
                    scope.paused = false
                    process.stdin.setRawMode(false);
                    process.stdin.removeListener("keypress", listenner);
                    if(Cache.currentChunk == '') resolve(null)
                    resolve(Cache.currentChunk)
                    break;
                case 'backspace':
                    Cache.currentChunk = Cache.currentChunk.slice(0, Cache.data.cursorPos-userinput.length-1)+Cache.currentChunk.slice(Cache.data.cursorPos-userinput.length);
                    if(Cache.data.cursorPos > userinput.length)Cache.data.cursorPos -= 1;
                    readline.clearLine(process.stdout, 0);
                    readline.cursorTo(process.stdout, 0);
                    process.stdout.write(`${userinput}${Cache.currentChunk}`);
                    readline.cursorTo(process.stdout, Cache.data.cursorPos);
                    break;
                case 'delete':
                    Cache.currentChunk = Cache.currentChunk.slice(0, Cache.data.cursorPos-userinput.length)+Cache.currentChunk.slice(Cache.data.cursorPos-userinput.length+1);
                    readline.clearLine(process.stdout, 0);
                    readline.cursorTo(process.stdout, 0);
                    process.stdout.write(`${userinput}${Cache.currentChunk}`);
                    readline.cursorTo(process.stdout, Cache.data.cursorPos);
                    break;
                case "home":
                    readline.cursorTo(process.stdout, 0);
                    Cache.data.cursorPos = userinput.length;
                    break;
                case "end":
                    readline.cursorTo(process.stdout, Cache.currentChunk.length);
                    Cache.data.cursorPos = Cache.currentChunk.length;
                    break;
                default:
                    if(key.shift) str = key.sequence.toUpperCase()
                    Cache.currentChunk = Cache.currentChunk.slice(0, Cache.data.cursorPos-userinput.length)+str+Cache.currentChunk.slice(Cache.data.cursorPos-userinput.length);
                    Cache.data.cursorPos += 1;
                    readline.clearLine(process.stdout, 0);
                    readline.cursorTo(process.stdout, 0);
                    process.stdout.write(`${userinput}${Cache.currentChunk}`);
                    readline.cursorTo(process.stdout, Cache.data.cursorPos);
                    break;
            }
        }
    })
}


start()
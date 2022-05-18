const readline = require("readline");

class Terminal  {
  constructor(client, options){
    this.client = client;
    this.options = options;
    this.argsRegex = /\s*(-(?:[\w](?:-)?)+)(\s{1,}(?:\/?(?:"[^"]+")|(?:'[^']+')|(?:[\w]+))+)?\s*/gmu;
    this.stdinListener = (bufferedData) => this.handler(bufferedData.toString("utf-8"))

    process.stdin.on("data", this.stdinListener)
  };

  ask(){
    if (!this.client.started) {
      process.stdin.pause();
      if (Array.isArray(process.stdin._events.data)) process.stdin._events.data.forEach((f, index) => {
        if (f.toString().trim() == this.stdinListener.toString.trim()) delete process.stdin._events.data[index];
      });
      return process.stdout.write(`\u001b[31mExit ShellyEval, see you soon!\u001b[0m\n`);
    } else {
      process.stdin.setEncoding('utf8');
      process.stdin.resume();
      readline.clearLine(process.stdout, 0);
      readline.cursorTo(process.stdout, 0);
      process.stdout.write(this.options.askStyle);
    }
  }

  parseArgs(str){
    if (str?.constructor?.name !== "String") return [];
    else {
      const matched = str.match(this.argsRegex)
      if (Array.isArray(matched)) return matched.map((m) => m.match(this.argsRegex)).slice(1);
      else return [];
    }
  }

  handler(data){
    if (!(/^\./).test(data)) {
      if (data.trim().length > 0) {
        try {
          this.stdout(eval("'use strict';"+data), "eval")
        } catch(err) {
          this.stdout(`\u001b[31m${err}\u001b[0m`, "err")
        }
      } else this.stdout("\u001b[31m[ ShellyError ]: No code to execute\u001b[0m", "err")
      
    } else {
      const cmd = this.client.commands.find(({ name }) => name == data.trim().substring(1).toLowerCase().split(/\s+/)[0]);
      if (cmd) {
        // command found
        const res = cmd.exec(this.parseArgs(data.substring(1+cmd.name.length)), data, this.client);
        if ((/Async/).test(res.exec?.constructor?.name || "") && typeof res.then == "function") {
          res.then((res) => {
            if (res == "NO_RESPONSE") return this.ask();
            else this.stdout(res, "command")
          })
        } else {
          if (res == "NO_RESPONSE") return this.ask();
          else this.stdout(res, "command")
        };
      } else this.stdout("\u001b[31m[ ShellyError ]: No command found!\u001b[0m", "err")
    }
  }

  stdout(response, evalDisplayType = "command"){
    if (evalDisplayType == "eval") process.stdout.write(this.options.evalStyle + require("util").inspect(response,{ colors: true, depth: 0, showHidden: true })+"\n");
    else process.stdout.write(response+"\n");
    this.ask()
  }

  start(){
    this.ask(this.options.askStyle);
  }
}

module.exports = Terminal;
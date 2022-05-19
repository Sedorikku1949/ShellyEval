const Terminal = require("./tools/Terminal");
const Utils = require("./tools/Utils");

const defaultOptions = {
  askStyle:  "\u001b[34m>\u001b[0m ",
  username: "Player",
  evalStyle: "[ \u001b[32mShellyEval\u001b[0m ]: "
}

class ShellyEval {
  constructor(options){
    // parse options
    if (options?.constructor?.name !== "Object") options = {};
    this.options = {
      askStyle: ((options.askStyle?.constructor?.name == "String") && options.askStyle.length > 0) ? options.askStyle : defaultOptions.askStyle,
      username: ((options.username?.constructor?.name == "String") && options.username.length > 0) ? options.username : defaultOptions.username,
      evalStyle: ((options.evalStyle?.constructor?.name == "String") && options.evalStyle.length > 0) ? options.evalStyle : defaultOptions.evalStyle,
    }

    this.started = false;
    this.Terminal = new Terminal(this, this.options);
    this.Utils = Utils;


    const path = require("path");
    // find commands
    this.commands = this.Utils.queryFiles(path.resolve(__dirname, "commands"), { extension: "js" })
      .map((dir) => require(require.resolve(dir)));
  }

  start(){
    this.started = true;
    this.Terminal.start();
  }

  pause(){
    process.stdin.pause();
    this.started = false;
    process.stdout.write(this.Utils.colorized("$gShellyEval paused successfully!$0\n"));
  }

  resume(){
    this.start();
    process.stdout.write(this.Utils.colorized("$gShellyEval is up and running again$0\n"));
  }
}

module.exports = ShellyEval;
module.exports.Terminal = Terminal;
module.exports.Utils = Utils;
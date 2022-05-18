module.exports = {
  exec: (args, command, client) => {
    return client.Utils.colorized(`$b>>> Commands list:$0\n\n${client.commands.map(({ name, description }) => `$m${name}$0 -> $2${description}$0`).join("\n")}\n\n$gThank you for using ShellyEval !$0`)
  },
  name: "help",
  description: "You are already using it!"
}
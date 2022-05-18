module.exports = {
  exec: (args, command, client) => {
    client.started = false;
    return "NO_RESPONSE"
  },
  name: "exit",
  description: "This command will stop the ShellyEval process."
}
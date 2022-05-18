module.exports = {
  exec: (args, command, client) => {
    console.clear();
    return "The shell has been cleared."
  },
  name: "clear",
  description: "Clear the console!"
}
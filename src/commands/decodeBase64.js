module.exports = {
  exec: (args, command, client) => {
    const str = command.substring(14).trim();
    if (typeof str !== "string" || str.length < 1) return client.Utils.colorized("$rInvalid arguments, please use the command like \"decode-base64 your-string-to-decode-here\"$0")
    else return client.Utils.decodeBase64(str);
  },
  name: "decode-base64",
  description: "Decode Base64 string"
}
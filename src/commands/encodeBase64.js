module.exports = {
  exec: (args, command, client) => {
    const str = command.substring(14).trim();
    if (typeof str !== "string" || str.length < 1) return client.Utils.colorized("$rInvalid arguments, please use the command like \"encode-base64 your-string-to-encode-here\"$0")
    else return client.Utils.encodeBase64(str);
  },
  name: "encode-base64",
  description: "Encode Base64 string"
}
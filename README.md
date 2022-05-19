<div align="center">
  <br />
  <p>
    <img src="https://cdn-icons.flaticon.com/png/512/5433/premium/5433799.png?token=exp=1652900797~hmac=e35cdf881a598e1a7c1120408042219f" height="350" alt="ShellyEval" />
  </p>
  <br />
    <a href="https://www.npmjs.com/package/shellyeval"><img src="https://img.shields.io/npm/v/shellyeval?style=for-the-badge" alt="npm version" /></a>
    <a href="https://www.npmjs.com/package/shellyeval"><img src="https://img.shields.io/npm/dt/shellyeval?label=downloads&style=for-the-badge" alt="Downloads"></a>
</div>

# ShellyEval

## What is ShellyEval ?

> ShellyEval is a powerful npm modules for developpers. This module can give the opportunities to execute any javascript code and some useful tools in the shell.

## How to install ShellyEval ?

> Just run:

```js
npm i shellyeval@latest
```

## Example usage:

```js
const ShellyEval = require("shellyeval");

const Shelly = new ShellyEval();

Shelly.start();
```

You can also personnalize your Shelly:

```js
const ShellyEval = require("shellyeval");

const Shelly = new ShellyEval({ askStyle:  "\u001b[34m>\u001b[0m ", username: "Sedorikku" });

Shelly.start();
```

**Availables options:**

- askStyle: The style of the message in which you type your command line.
- username: You username if you want.
- evalStyle: The style of the response (doesn't affect errors and commands)

## Help

> If you don't understand anything, you can open a discussion in [this discussion tab](https://github.com/Sedorikku1949/ShellyEval/discussions) 😉

<div align="center">
  <p>
    <a href="https://npmjs.com/package/discordjs-button-pagination
/"><img src="https://nodei.co/npm/discordjs-button-pagination.png?downloads=true&stars=true" alt="NPM info" /></a>
  </p>
</div>
# discordjs-button-pagination
A simple package to paginate discord embeds via discord buttons introduced in [discord.js v13](https://github.com/discordjs/discord.js/tree/master).

# Installation
* `npm install discordjs-button-pagination`

# Requirements
Node.js 14.0.0 or newer is required
Discord.js 13.0.0


# Usage
__Basic Bot Example__
```js
// Import the discordjs-button-pagination package
const paginationEmbed = require('discordjs-button-pagination');

// Use either MessageEmbed or RichEmbed to make pages
// Keep in mind that Embeds should't have their footers set since the pagination method sets page info there
const { MessageEmbed , MessageButton} = require('discord.js');
const embed1 = new MessageEmbed()
                .setTitle('First Page')
                .setDescription('This is the first page');

const embed2 = new MessageEmbed()
                .setTitle('Second Page')
                .setDescription('This is the second page');

const button1 = new MessageButton()
                .setCustomID('previousbtn')
                .setLabel('Previous')
                .setStyle('DANGER');

const button2 = new MessageButton()
                .setCustomID('nextbtn')
                .setLabel('Next')
                .setStyle('SUCCESS');

// Create an array of embeds
pages = [
	embed1,
	embed2,
	//....
	//embedN
];

//create an array of buttons

buttonList = [
    button1,
    button2,
    //...
    //buttonN
]


// Call the paginationEmbed method, first three arguments are required
// timeout is the time till the reaction collectors are active, after this you can't change pages (in ms), defaults to 120000
paginationEmbed(msg, pages, buttonList, timeout);
// There you go, now you have paged embeds
```

# Note
This will not work with buttons whose style is set as 'LINK' as they do not trigger an interaction event. The buttons will auto disable once the the collector ends after the timeout.

# Preview

First Page

![pic1](https://raw.githubusercontent.com/ryzyx/discordjs-button-pagination/main/Example/pic1.PNG)


Second Page

![pic2](https://raw.githubusercontent.com/ryzyx/discordjs-button-pagination/main/Example/pic2.PNG)


Disabled Buttons after collector end

![pic3](https://raw.githubusercontent.com/ryzyx/discordjs-button-pagination/main/Example/pic3.PNG)

Inspired by:
<https://github.com/saanuregh/discord.js-pagination>
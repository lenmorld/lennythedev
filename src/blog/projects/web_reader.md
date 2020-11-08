---
cover_image: https://thepracticaldev.s3.amazonaws.com/i/zurkwbux35tsflyrmtid.PNG
path: "/blog/web-reader-using-web-speech-api"
date: "2019-12-14"
tags: ["tts", "js", "vanilla", "web api"]
title: Web Reader using Web Speech API
published: true
description: Let your browser read articles and web pages for you!
---

_Originally posted in_
[dev.to](https://dev.to/lenmorld/web-reader-using-web-speech-api-bkn)

Demo here: <a href="https://stupefied-curran-2254b8.netlify.com/" target="_blank">Web Reader @ Netlify</a>

Have you ever been TLDR (Too LAZY didn't read) to read an online article or any webpage of some sort...
and wished that your **browser would read it for you**?

Well, you're in luck! I built a Web Page Reader. 😆
Just copy-paste a URL or some text in the input and it would read it for you!
_Well, the readable parts at least_ 😅

![start talking](https://media.giphy.com/media/cnoAIZkiGPbHJuvzLa/giphy.gif)

## 💬 Web Speech API

I used **Speech Synthesis** from native browser's Web Speech API.
It is an experimental tech, but good chance you have this in your browser now!

Actually, we all had this since Chrome 33, Firefox 49, Edge 14. But check here in case you are using a tamagochi 🐰: [caniuse Web Speech API](https://caniuse.com/#search=web%20speech%20api).

### The speech inputs

User inputs are the following HTML elements:

- `textarea` for the **URL/text to read**
- `select` input for the **voice**
- `range` inputs for **pitch** and **rate**

The textarea contents are checked if it's a plain text or a URL.

The **rate** (how fast the speaking goes) ranges from 0.5 to 2.
The **pitch** (highness or lowness of voice) ranges from 0 to 2.
The **voice** select provides the voices available from the system.

### 🎤 `SpeechSynthesisVoice`

The voices available differs for every device, and is obtained via
`speechSynthesisInstance.getVoices()`.

This returns all the `SpeechSynthesisVoice` objects, which we stuff on the select options.

![Voice selection](https://thepracticaldev.s3.amazonaws.com/i/k0d5yw25ouut1h5w7uu9.png)
User selects one of this, or leave the default.

Now, what makes the browser actually talk is the `SpeechSynthesisUtterance` object.

![computer talking](https://media.giphy.com/media/l1KuihAZXiLNzkF4Q/giphy.gif)

### 🗣 `SpeechSynthesisUtterance`

A `SpeechSynthesisUtterance` object (`utterance`) is like an individual speech request, which we initialize with the string and attach all the speech elements like voice, rate and pitch.

Finally, trigger the utterance via `speechSynthesis.speak()`.

A `finishUtteranceCallback` is also supplied to enable play button and other controls when the text is finished.

This logic is encapsulated in **`speak(string, voice, pitch, rate, finishUtteranceCallback)`**

```javascript
  speak(string, voice, pitch, rate, finishUtteranceCallback) {
    if (this.synth.speaking) {
      console.error('🗣 already speaking');
      return;
    }

    if (string) {
      const utterance = new SpeechSynthesisUtterance(string);
      utterance.onend = () => {
        console.log('utterance end');

        finishUtteranceCallback();
      };
      utterance.voice = voice;
      utterance.pitch = pitch;
      utterance.rate = rate;

      this.synth.speak(utterance);
    }
  }
```

All of this functionality is wrapped in a `WebSpeechApi` to keep it modular. 📦

For a detailed look at Speech Utterance, check this out: [MDN Speech Utterance](https://developer.mozilla.org/en-US/docs/Web/API/SpeechSynthesisUtterance).

This [MDN page](https://developer.mozilla.org/en-US/docs/Web/API/SpeechSynthesis) has an awesome rundown and example where I built my app off of. Please check it out too!

## 🌐 URL check

User can input URL or text on the `textarea` to read.
But how does this detect if it's a URL?
A simple `try-catch` does the trick.

```javascript
// simple check if valid URL
try {
  new URL(urlOrText);
  isUrl = true;
} catch (error) {
  // not a URL, treat as string
  isUrl = false;
}
```

If it's a plain text, this is passed directly to the `speak()`.
If it is indeed a URL, GET request to load the page and scrape the readable elements.

## 🕷️ Web page scraping using `cheerio` and `axios`

`cheerio` is a subset of jQuery that is super fast, easy and flexible for parsing HTML.
(Seriously it's as easy as `cheerio.load(<p>some html</p>)`)

`axios` is a Promise-based client for fetching stuff from APIs, and in this case, getting the full HTTP get response from a webpage.

Combined, this is how I'm getting all the "readable" elements of a page.

```javascript
const getWebsiteTexts = (siteUrl) =>
  new Promise((resolve, reject) => {
    axios
      .get(siteUrl)
      .then((result) => {
        const $ = cheerio.load(result.data);
        const contents = $("p, h1, h2, h3").contents(); // get all "readable" element contents

        const texts = contents
          .toArray()
          .map((p) => p.data && p.data.trim())
          .filter((p) => p);

        resolve(texts);
      })
      .catch((err) => {
        // handle err
        const errorObj = err.toJSON();
        alert(
          `${errorObj.message} on ${errorObj.config.url}\nPlease try a different website`
        );
        urlOrTextInput.value = "";
        finishUtterance();
      });
  });
```

Some URLs error out so we catch the error, `alert()` user, clear the textarea and reset the form inputs.

**Why some URL doesn't work?**

![computer cry](https://media.giphy.com/media/3o6wO1GP7WCPaltkw8/giphy.gif)

### ⛔ CORS policy

**The scraper can't parse all websites out there**.
In fact, a lot of websites (try Medium articles) has a CORS policy.
So you'll get an error like this in some websites.
![Alt Text](https://thepracticaldev.s3.amazonaws.com/i/jmzlzp5qg519u6jambvt.png)
`CORS policy: No 'Access-Control-Allow-Origin'` means only the _Same Origin_ can do GET requests from a webapp script.

- Note that `cURL` and Postman may still work on these sites, just not from Javascript like this.

This is enabled from the server of the site we're trying to read, so nothing much we can do but move on to a different page. 😢

Here's a good rundown of CORS:
{% link g33konaut/understanding-cors-aaf %}

> **dev.to** pages work though! Try it out 🎉.
> **Thank you dev.to for allowing us to scrape** 🙏

## ▶️ play, pause, restart

Lastly, I added some basic playback control.
![Playback control](https://thepracticaldev.s3.amazonaws.com/i/q5xj948ja4t7bagflk8m.png)

Here's the _play_ function that starts or resume based on current `paused` status of the `speechSyntesis`. The other controls are just `disabled` except _pause_ and _stop_.

```javascript
playButton.addEventListener("click", () => {
  if (speechApi.synth.paused) {
    speechApi.synth.resume();
  } else {
    // start from beginning
    read();
  }

  playButton.disabled = true;
  pauseButton.disabled = false;
  stopButton.disabled = false;

  rateSlider.disabled = true;
  pitchSlider.disabled = true;
  voiceSelect.disabled = true;

  urlOrTextInput.disabled = true;
});
```

The _pause_ and _stop_ are more or less similar with different controls disabled.

## 📦 🚤 Build and Deployment

I used `parcel` for hassle-free no-config bundling, which is quite simple for vanilla JS projects like this.

Lastly, Netlify for easy static deploy. After setting up the Github repo in Netlify, it just picked up the `dist/` folder built by Parcel.

Done!

## 📃 Improvements

This is a quick project, so it could definitely use some improvements (and corrections).

👨‍💻 Here's the code. Hope this spark some ideas and help yo get started with some awesome text-to-speech projects. 😁

{% github lenmorld/web_reader %}

Any suggestions, comments, questions?
(like on a better way to check if string is a URL 😅 )
**_Please let me know in the comments!_**

Thanks and happy listen-reading! 👂📖

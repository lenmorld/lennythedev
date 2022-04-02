---
title: Your first Web Server with Node and Express in 5 minutes
published: true
date: "2019-12-08"
path: "/blog/node-express-server-five-minutes"
description: Build your first Server with Node and Express in 6 steps / 5 minutes
tags: ["node", "express", "beginners", "server"]
cover_image: https://upload.wikimedia.org/wikipedia/commons/d/d9/Node.js_logo.svg
series: Building Node and Express Stuff in 5 minutes
---

_Originally posted in_
[dev.to](https://dev.to/lenmorld/quick-server-with-node-and-express-in-5-minutes-17m7)

I know, I know... Another Node Express tutorial 😑.
But if you still haven't got around to learning Node and building a server, maybe this super-quick tutorial is the one you're waiting for! 😆

# Step 1: Install node

Ok, this must take more than 5 minutes, but if you have Node already, skip this and let's go!

### Install latest LTS version for your OS

https://nodejs.org/en/download/

To test if it works, create a file `server.js` in your project root

```javascript
// server.js
console.log("Hello World!");
```

And test it out

```bash
$ node server.js
Hello world!
```

Nice! We're ready to do some backend-fu!

# Step 2: Setup npm

We use NPM to manage our node packages.
Initialize npm and let it take defaults.

```bash
$ npm init -y
```

# Step 3: Install and import express middleware

> A **middleware** is a piece of code that has access to the `request` and `response` object. For now, think about _express_ making things easier for us by being a "middle-man" 🕵️ between our code and Node's HTTP stuff.

```bash
$ npm install express
```

```javascript
// server.js
const express = require("express");
const server = express();
```

# Step 4: Add a JSON **route handler**

Whenever client requests/accesses "/json" (localhost:4000/json), send JSON which is "Hello world" message

```javascript
// server.js
...
server.get("/json", (req, res) => {
   res.json({ message: "Hello world" });
});
```

# Step 5: Add a HTML **route handler**

Whenever client requests/accesses "/" (localhost:4000), send file which is an HTML page

> `__dirname` holds the directory of current module (server.js)

```javascript
// server.js
...
server.get("/", (req, res) => {
   res.sendFile(__dirname + '/index.html');
});
```

Create `index.html` in same level as `server.js`
Go to town with the HTML! Or you can copy-paste this if you like blue headings.

```
<!DOCTYPE html>
<html lang="en">
 <head>
   <title>Node Workshop</title>
 </head>
 <body>
     <h1 style="color: blue;">
        Express: HELLO WORLD
     </h1>
 </body>
</html>
```

# Step 5: Start server

```javascript
// server.js
...
const port = 4000;

server.listen(port, () => {
    console.log(`Server listening at ${port}`);
});
```

```bash
# CTRL+C to stop server if currently running
$ npm start
```

# Step 6: Test

```bash
# on another terminal

$ curl http://localhost:4000/json
{"message":"Hello world"}

$ curl http://localhost:4000
<!-- index.html --> ...
```

Or open a browser and go to

- http://localhost:4000/json
- http://localhost:4000

![hackerman](https://i.kym-cdn.com/entries/icons/facebook/000/021/807/ig9OoyenpxqdCQyABmOQBZDI0duHk2QZZmWg2Hxd4ro.jpg)

### Complete Code

```javascript
const express = require("express");
const server = express();
const port = 4000;

server.get("/", (req, res) => {
  res.sendFile(__dirname + "/index.html");
});

server.get("/json", (req, res) => {
  res.json({ message: "Hello world" });
});

server.listen(port, () => {
  console.log(`Server listening at ${port}`);
});
```

## "Okay, that was nice. But what can I do with this? "

Add a few more routes and HTML pages
and you got yourself an HTML + JSON server!

```javascript
...
server.get("/items", (req, res) => {
   res.json({ items: [{ "id": 1, "name": "banana" },
                      { "id": 2, "name": "apple" }
                     ]
           });
});

server.get("/info", (req, res) => {
   res.sendFile(__dirname + '/info.html');
});
...
```

We will need to cover more stuff to

- build a REST(ful) API Server that implements GET / POST / PUT / DELETE
- serve templates that accept data (instead of static HTML)
- much more!

## Next up:

[Part 2 - REST API with Node and Express](https://dev.to/lenmorld/quick-rest-api-with-node-and-express-in-5-minutes-336j)

**This article is part of a Node+Express series I'm working on.**

For the meantime, if you can't get enough of Node+Express 🤓,
checkout my Node workshop (Gihub repo and slides):

{% github lenmorld/node_workshop %}
Here we discussed:

- Using Node and Express
- Routing, request and response
- Building a REST API
- Server-rendered templates
- Connecting to a NoSQL (mongo) database
- Using external APIs, such as Spotify
- and much more!

---

Thanks for reading my first Dev post!
Happy server-ing!

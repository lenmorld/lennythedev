---
title: A detailed intro to OAuth
published: true
date: "2022-03-18"
path: "/blog/oauth2_intro"
description: Learn the basics of OAuth2
tags: ["oauth2", "auth", "node", "express", "security"]
cover_image: https://upload.wikimedia.org/wikipedia/commons/d/d9/Node.js_logo.svg
---

_Originally posted as part of_
[Node workshop](https://www.notion.so/lennythedev/Node-workshop-Homepage-56f2822d63e549b286c76102e6ea6b28)

A lot of the services and social media apps we love and use (Google, Facebook, Twitter, Spotify, ...) uses some form of **OAuth**.

> 💡 While OAuth1 is still used by some, the current industry standard is **OAuth2.**
> Even though some mechanisms, features, and standards changed from OAuth1 to 2, the underlying goal remains, which is to **allow an app to integrate with a 3rd party authentication provider** **on user's behalf**

# Why the switch from OAuth1 to OAuth2? ↔️

- OAuth1 has a complicated signature system that required some cryptography:
    - a **shared secret** to ensure only the registered client can use the tokens
    - each request has to be **signed with the secret**
    - complex **state management** for temporary and long-lasting tokens
- OAuth2 doesn't require signatures:
    - no more signatures, but relies on HTTPS to handle authenticity
    - more **stateless** than OAuth1, thanks to **bearer tokens**
    - less secure, since anyone with the token can use it
    - mitigate by: short-lived access tokens and long-lived refresh tokens

# OAuth - the Authorization part 🔐

OAuth is really an Authorization framework but is often used to build an authentication system. Here are the use cases for each group.

## As a user

OAuth allows you to "Login with Facebook", "Sign in with Google", and continue to the app you wanted to use.

## As an app developer

OAuth allows apps to rely on 3rd party providers (Facebook, Google, Twitter, etc) for authentication, so devs:

- don't have to implement their own Authentication system
- can integrate all the goodies that the Provider has

## As a 3rd party Authentication Provider

Facebook, Google, Twitter implements their own authentication system (username+password auth, etc). They provide API for apps to:

- have a way for user to sign-in via their auth
- access user data in their platform; apps can CRUD user's profile, friends, likes, playlists, apps, tweets, etc


# How does it look like in practice? 🔧

An app (as an Auth Client), can get access to all user's stuff on Provider, as long as the user "authorizes" the app

<!-- FIXME: make reusable -->
<!-- Layout pictures in one row, but responsive-->
<div style="display: grid; grid-gap: 30px; grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));">

![Spotify sign-in](https://res.cloudinary.com/dvfhgkkpe/image/upload/v1647709405/lennythedev/oauth2_intro/spotify_sign_in.png)

![Github sign-in](https://res.cloudinary.com/dvfhgkkpe/image/upload/v1647709400/lennythedev/oauth2_intro/github_sign_in.png)

![Notion sign-in](https://res.cloudinary.com/dvfhgkkpe/image/upload/v1647709404/lennythedev/oauth2_intro/notion_sign_in.png)

</div>
<!-- END of Layout -->

Here, you see a prompt *asking a user, to authorize an app to use their account information, log-in to the app with user's info, and make requests (read, write) to Auth Provider on user's behalf.*

<!-- FIXME: make reusable -->
<!-- Layout pictures in one row, but responsive-->
<div style="display: grid; grid-gap: 30px; grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));">

<div>

![sample app authorize](https://res.cloudinary.com/dvfhgkkpe/image/upload/v1647709401/lennythedev/oauth2_intro/sample_app_authorize.png)

<figcaption>
 <a href="https://developers.google.com/identity/protocols/oauth2/limited-input-device">
 From developers.google.com
 </a>
</figcaption>

</div>

<div>

![facebook login](https://res.cloudinary.com/dvfhgkkpe/image/upload/v1647709423/lennythedev/oauth2_intro/facebook_authorize.png)

<figcaption>
 <a href="https://serverless-stack.com/chapters/facebook-login-with-cognito-using-aws-amplify.html">
 From serverless-stack.com
 </a>
</figcaption>

</div>

</div>
<!-- END of Layout -->


# Definition of terms 📒
Let's get the authentication-specific language out of the way first!

**app**

As a dev, you are writing this app to integrate with a Provider

**Auth / Identity Provider (aka Provider)**

The service that you want to integrate in your app, aka the 3rd party auth provider: Google, Facebook, Spotify, Twitter, etc

App can make requests to the provider either with or without a user: 

- on user's behalf - (e.g. see user's friends, play user's playlist) as long as app gained authorization
- without a user - (e.g. search a song, see latest tweets on a topic) that are not really tied to a user

The different flows accommodate either of these two scenarios in different ways

**access token**

- aka "Bearer token"
- **You need this to send requests to the provider**
- All flows result to the app getting an `access token` but they all have different ways to get there

**scopes**

- What operations does the app have permission to do on behalf of user
- e.g. [in Spotify](https://developer.spotify.com/documentation/general/guides/scopes/), there are `user-library-read`, `user-read-playback-state`


# Implementing OAuth2 

## Creating an app on Provider's dev site

For any of these flows, you need to register an account on the Provider's developer site and **Create an App.** 

You usually supply:

- App name
- App description
- **Redirect uri, aka callback**: you must whitelist your URL here, which should be the same URL that you'll give to the first step of **Auth Code Flow**. Provider redirects to this URL after successful user auth.

You usually get these app credentials to connect with Provider and get an `access token`

- **Client ID**
- **Client secret**

## OAuth2 flows

A Provider usually offers one or more of these flows:

- Authorization Code
- Client credentials
- Password Grant
- Implicit grant
- others...

### Authorization Code

- aka 3-legged (app + provider + user = 3)
- A user is needed. Authentication and authorization in the context of the **user**
- TL;DR: **App directs user to Provider login. Provider redirects to app passing an authorization code, which app exchanges for an access token**


1. App provides a link/button with an ***authorization URL*** that directs user's browser to the Provider's authentication and authorization page
    - **scope** can be provided here
    - In some providers, there is a separate request to get this authorization URL
2. User successfully logs in and authorizes your app to access their data (see authorization prompt screenshots aboce)
    - Provider redirects to the **redirect uri** you supplied when you created the app, giving your app an **authorization code** specific to that user
3. App sends a request to **exchange the authorization code for an access token.** Response payload usually contains: 
    - `access token` - app sends this along every request to provider
    - `refresh token` - used to "renew" token
    - scope - reflects scope passed before
    - expiry - of access token
    - type: usually "Bearer"
4. App sends requests to Provider, attaching the `access token` in an Authorization header 
    
    ```bash
    Authorization: Bearer my_access_token
    ```
    
5. When access token expires, app sends a ***refresh*** request, sending the `refresh token` to get a new `access token`. Same response payload as in #3


## Client Credentials

- aka 2-legged (app + provider = 2)
- No user involved. Authentication and authorization in the context of the **app**
- TL;DR: **App exchanges app credentials (`client id` and `client secret`) with an `access token`**
- This is what we used in [Chapter 7 when we searched songs](https://www.notion.so/7-Using-Public-APIs-c88c70f9b7af4948a040563ab4702e01)


## Password Grant

- TL; DR: **app collects user's credentials (username, password) e.g. by a form, then exchanges them with an `access token`**

## Implicit grant

- TL;DR: **App directs user to Provider to login. Provider redirects to app giving `access token`**



# Example app with Spotify API and Authorization code flow

## Create app in Provider

Log in to [Spotify for Developers](https://developer.spotify.com/) and create an app.

![Create an app in Spotify](https://res.cloudinary.com/dvfhgkkpe/image/upload/v1647709401/lennythedev/oauth2_intro/spotify_app.png)

## Code

[`https://github.com/lenmorld/node_workshop/compare/appendix_baseline...appendix_oauth`](https://github.com/lenmorld/node_workshop/compare/appendix_baseline...appendix_oauth)

> This example is based off a [Node-express server](https://github.com/lenmorld/node_workshop/tree/appendix_baseline) developed as part of [Node workshop](https://www.notion.so/lennythedev/Node-workshop-Homepage-56f2822d63e549b286c76102e6ea6b28)

Make sure to add these to your `.env` file
(or alternatively, hard-code it on the `routes/auth2/index.js`  for less hassle) 😅

```bash
# OAuth2 Auth Code flow
SPOTIFY_CLIENT_ID=your_spotify_app_client_id
SPOTIFY_CLIENT_SECRET=your_spotify_app_client_secret
```

## To try code:

- `$ npm start`
- on your browser go to http://localhost:4000/auth2

## Demo

![Login with spotify oauth2](https://res.cloudinary.com/dvfhgkkpe/image/upload/v1647709449/lennythedev/oauth2_intro/login_with_spotify_oauth2_auth_code.gif)


### There you go! Now you can start implementing OAuth2 sign-in with your favorite Auth Providers. 🔐

# Additional resources

- [Differences Between OAuth 1 and 2 - OAuth 2.0 Simplified](https://www.oauth.com/oauth2-servers/differences-between-oauth-1-2/)

- [Authorization Guide | Spotify for Developers](https://developer.spotify.com/documentation/general/guides/authorization-guide/#implicit-grant-flow)

---
title: Caching API calls in React
published: false
date: "2022-07-08"
path: "/blog/caching-api-calls-react"
description: Experiments on different tchniques to cache API calls between different components in React
tags: ["react", "caching", "zustand", "intermediate"]
cover_image: https://upload.wikimedia.org/wikipedia/commons/d/d9/Node.js_logo.svg
---


Ever had a need to cache API calls between React components?

In most use cases, you can lift state up to fetch it once, pass it down to child components, then call it a day.
But what if you need to fetch the same API from two different or disconnected React components?
Or what if lifting the state up is simply not pragmatic, like maybe you don't have a common parent to use?

This challenge seemed to be straightforward, but with the nature of React rendering and async fetches, 
it was actually quite a challenge. In this article, I present to you a few things I've tried, what worked, and what didn't.

## Setup

In this example, we have two components fetching a sample post from the same API endpoint, `URL_TO_FETCH`.
Ideally, Component 1 fetches and caches the payload, then Component 2 should get the cached payload.
We need a shared piece of code that will store and use the cache, 
so we'll also hae a  `useFetch` hook that encapsulates all the fetching logic.

```jsx
import React, { useState, useEffect } from "react";

const useFetch = (urlToFetch) => {
  const [data, setData] = useState(null);

  useEffect(() => {
    const fetchFunc = async () => {
      console.log("Fetching...");

      const raw = await fetch(urlToFetch);
      const result = await raw.json();

      setData(result);
    };

    fetchFunc();
  }, []);

  return [data];
};

export default useFetch;

```

```jsx
// Component 1
import React from "react";
import useFetch from "./useFetch";
import { URL_TO_FETCH } from "./constants";

const Component1 = () => {
  const [post] = useFetch(URL_TO_FETCH);
  if (!post) {
    return <h3>Loading...</h3>;
  }
  return (
    <div>
      <h3>Component1</h3>
      {post.id} - {post.title}
    </div>
  );
};

export default Component1;
```

```jsx
// Component 2
import React from "react";
import useFetch from "./useFetch";
import { URL_TO_FETCH } from "./constants";

const Component2 = () => {
  const [post] = useFetch(URL_TO_FETCH);
  if (!post) {
    return <h3>Loading...</h3>;
  }
  return (
    <div>
      <h3>Component2</h3>
      {post.id} - {post.title}
    </div>
  );
};

export default Component2;
```

> The two components are pretty much copy-paste, yes! But I just want to show that they are different components fetching the same URL.


```jsx
// usage - root App

import Component1 from "./Component1";
import Component2 from "./Component2";

export default function App() {
  return (
    <div className="App">
      <Component1 />
      <Component2 />
    </div>
  );
}
```

Code: https://codesandbox.io/s/caching-api-calls-react-1-tdn7bx

![](res/2022-05-28-20-03-34.png)

I'll only show the rendered UI once since it will be the same.
We can focus on the logs, to see the fetches happening.

![](res/2022-05-28-20-24-53.png)

The fetch is called twice. Now let's try to implement some caching with refs.

## Cache try 1 - ref

Can we use a `ref` to memoize values of our fetch?
I mean, a `ref` can hold mutable values, 
so it can keep a cache throughout different calls to the hook, right?

```jsx
const useFetch = (urlToFetch) => {
  ...
  const cache = useRef({}); // use ref to hold cache

  useEffect(() => {
    const fetchFunc = async () => {
      // check cache first
      const cachedData = cache.current[urlToFetch];
      if (cachedData) {
        console.log("✅ CACHE HIT. Use cache!");
        setData(cachedData);
      } else {
        console.log("❌ CACHE MISS. Fetching...");
        const raw = await fetch(urlToFetch);
        const result = await raw.json();
        // save in cache
        cache.current[urlToFetch] = result;
        setData(result);
      }
    };

    fetchFunc();
  }, []);

  return [data];
};
```

Code: https://codesandbox.io/s/caching-api-calls-react-2-teix3t

![](res/2022-05-28-20-38-33.png)

🤔 It's not really caching it, but why?....

### Gotcha 1.1 - refs work in the context of a component, not the App (global)

Using a `ref` doesn't mean it's shared by different components using it in the shared hook.
The `ref` maintains its value, but within the scope of the specific component, not between components.
So we are not really doing any caching here between components 🤷‍♂️

To demonstrate this behavior further, see this isolated example: https://codesandbox.io/s/ref-not-shared-between-components-r53gvp?file=/src/useSharedRef.jsx

The ref has an effect that 

![](res/2022-05-29-07-01-55.png)

To solve this, maybe we can use a module level or global(window) level variable instead?

```jsx
import React, { useState, useEffect, useRef } from "react";

const cache = {};

const useFetch = (urlToFetch) => {
  ...
  useEffect(() => {
    const fetchFunc = async () => {
      const cachedData = cache[urlToFetch];
      if (cachedData) {
        ...
      } else {
        ...
        cache[urlToFetch] = result;
        setData(result);
      }
};

export default useFetch;
```

### Gotcha 1.2 - components all render, before the fetches are called

Since the fetch is an async operation, the components are all rendered first before any of the data arrives and ready to be used. Here's what the sequence of events might look like:

1. No cache yet. Component 1 triggers fetch
2. Data not there yet. No cache yet. Component 2 triggers fetch again.

This is because UI rendering always takes priority before async tasks in the JS engine queue. 🤯

> For more details on async task queuing and event loop: see this [article](https://dev.to/lydiahallie/javascript-visualized-event-loop-3dif)

To explore this point further, the cache works if the 2nd component is only rendered on click.
By the time the 2nd component is rendered, the Promise resolved already, thus the cache already have the value.

```jsx
export default function App() {
  const [displayMore, toggleDisplayMore] = useState(false);

  return (
    <div className="App">
      <Component1 />
      <button onClick={() => toggleDisplayMore((d) => !d)}>displayMore</button>
      {displayMore && (
        <>
          <Component2 />
        </>
      )}
    </div>
  );
}

```

Code: https://codesandbox.io/s/caching-api-calls-react-3-3bpqle

![](res/screencast_2022-05-29 08-03-01.gif)

### Cache try 2 - adding "isFetching" variable to track

One thing we can do is have a flag, so when Component 1 fetches for the first time, 
set flag to true. Only reset to false when fetching is done.
When Component 2 tries to fetch it again, don't fetch again until flag is false.

```jsx
let isFetching = false;
...
const useFetch = (urlToFetch) => {
  ...
  useEffect(() => {
    const fetchFunc = async () => {
      if (isFetching) {
        ...
      } else if (cachedData) {
        ...
      } else {
        isFetching = true;
        const raw = await fetch(urlToFetch);
        isFetching = false;
        ...
      }
    };

    fetchFunc();
  }, []);

  return [data];
};

export default useFetch;
```

Code: https://codesandbox.io/s/caching-api-calls-react-4-wrmcej

🤔 Hmm, Component2 fetch never seems to get the data at all, it's stucked with Loading...

![](res/2022-06-17-20-15-11.png)

Maybe we need a more "global" way to keep the flags?
Not the case. I tried with `window.isFetching` and still the same issue 

### Gotcha 2.1 - the flag change did not cause a re-render

Now the problem is when the hook runs:
1. Component 1 renders, triggers fetch. Data is currently being fetched
2. Component 2 renders, tries to fetch but previous fetch is still in progress. Wait...
3. `isFetching` still true, so does nothing and waits
4. Data arrives for Component 1. `isFetching` set to false. Save data to cache. Re-render Component 1.
5. ...then nothing. Component 2's hook didn't re-run at all to get data from cache and re-render!

The hook succesfully completed for Component1 from fetching to re-render.
Didn't happen for Component 2

### Cache try 3 - use React state for the flag

Replace `isFetching` variable with state

```jsx
  ...
  const [isFetching, setFetching] = useState(false);

  useEffect(() => {
    const fetchFunc = async () => {
      ...
      if (isFetching) {
        ...
      } else if (cachedData) {
        ...
      } else {
        setFetching(true);
        const raw = await fetch(urlToFetch);
        setFetching(false);
      }
    };

    fetchFunc();
  }, []);

  return [data];
};

export default useFetch;

```

Code: https://codesandbox.io/s/caching-api-calls-react-5-dfg7un

![](res/2022-06-17-20-31-10.png)

🤔 Now both Component renders fine, but the fetch is still called twice!

### Gotcha 3.1 - React state, like ref, is tied to the component!

We need a more global, but "component-aware" way of doing this. 
We can use a global store like Redux, 
but to make it simpler, we will use Zustand.

The nice thing with Zustand is the components subscribed to the data store gets 
automatically updated, and re-renders for every state change. 
But wihtout the boilerplate of Redux 😁


### Cache try 4 - global state using Zustand

Zustand can hold our global states, but also our updater functions 
so that our subscribed components can be updated.

To start with, we can create a store specifically for one post `postStore`.
Instead of using the `useFetch` hook this time, 
it's better to use `postStore` directly in the Components with `useEffect` because
the updates are taken care of by Zustand.

```js
// postStore

import create from "zustand";

const useStore = create((set, get) => ({
  post: null,
  isFetching: false,
  setFetching: (isFetching) => set({ isFetching }),
  setPost: (post) => set({ post }),
  fetchPost: async (urlToFetch) => {
    const { isFetching, post } = get();

    if (isFetching) {
      console.log("⚠️ still fetching... wait...");
    } else if (post) {
      console.log("✅ CACHE HIT. Use cache!");
    } else {
      console.log("❌ CACHE MISS. Fetching...");
      set({ isFetching: true });

      const raw = await fetch(urlToFetch);
      const result = await raw.json();

      console.log("📦 Fetching done! Data here");

      set({ post: result });
      set({ isFetching: false });
    }
  }
}));

export default useStore;
```

```jsx
// Component1 and Component2
...
import postsStore from "./postStore";
// import useFetch from "./useFetch";

const Component1 = () => {
  const post = postsStore((state) => state.post);
  const fetchPost = postsStore((state) => state.fetchPost);
  useEffect(() => {
    fetchPost(URL_TO_FETCH);
    return () => {
      "unmounting...";
    };
  }, [fetchPost]);
...
```

Code: https://codesandbox.io/s/caching-api-calls-react-6-24tv1w

![](res/2022-06-18-07-23-53.png)

🎉 Only fetched once!

So this is what's happening now:
1. Component 1 renders, triggers fetch. Data is currently being fetched
2. Component 2 renders, tries to fetch but previous fetch is still in progress. Wait...
3. `isFetching` still true, so does nothing and waits
4. Data arrives for Component 1. `isFetching` set to false. Save data to cache. Re-render.
5. Since data is now available, Zustand updates subscribe Component2 so it re-renders.

### Cache try 5 - generalizing the cache

Now that we know it's working, we can generalize the solution into an overall cache
that memoizes the payload per URL.

```js
// dataStore.js

import create from "zustand";

const useStore = create((set, get) => ({
  data: null,
  cache: {},    // add a cache that memoizes result per URL
  setCache: (cache) => set({ cache }),
  isFetching: false,
  setFetching: (isFetching) => set({ isFetching }),
  fetchData: async (urlToFetch) => {
    const { isFetching, cache } = get();

    console.log("cache: ", cache);

    if (isFetching) {
      console.log("⚠️ still fetching... wait...");
    } else if (cache[urlToFetch]) {
      console.log("✅ CACHE HIT. Use cache!");
    } else {
      console.log("❌ CACHE MISS. Fetching...");
      set({ isFetching: true });

      const raw = await fetch(urlToFetch);
      const result = await raw.json();

      console.log("📦 Fetching done! Data here");

      // memoize the payload of the given URL
      set({
        cache: {
          ...cache,
          [urlToFetch]: result
        }
      });

      set({ data: result });
      set({ isFetching: false });
    }
  }
}));

export default useStore;
```

```jsx
// Component1 and Component2
...
import dataStore from "./dataStore";

const Component1 = () => {
  const post = dataStore((state) => state.data);
  const fetchPost = dataStore((state) => state.fetchData);
  useEffect(() => {
    fetchPost(URL_TO_FETCH);
    return () => {
      "unmounting...";
    };
  }, [fetchPost]);
...
```

Code: https://codesandbox.io/s/caching-api-calls-react-7-uip9ju

![](res/2022-07-08-21-22-52.png)

😆 Still works!
🤔 But isn't the cache not used at all? Why is it empty?

Well, we are now using Zustand as our "inernal cache" that maintains the value of `data`.
We're pretty much telling it "fetch this URL, then as soon as the data changes when it arrives, 
update the two components (or more) that is subscribed to it"

Technically, we don't even need a cache for the initial render of our app. 
But we'll need it on any succeeding fetches, like event-driven ones.
I integrated the "load more data on click" example to illustrate this.

![](res/screencast 2022-07-08 21-31-23.gif)


### How about cache invalidation?

Given that this cache solution is only on the frontend, it should clear on page reload.
Now if you have a SPA that have frequent data updates on same page without a refresh, 
maybe frontend caching might not even be worth it.

Consider caching on the server-side instead.

If you need a quick solution on the frontend based on your custom logic, 
one way to force invalidation is to have a parameter that skips cache checking and go straight to fetching.

```js
  fetchData: async (urlToFetch, forceCacheClear) => {
    const { isFetching, cache } = get();

    console.log("cache: ", cache);

    if (isFetching && !forceCacheClear) {
      console.log("⚠️ still fetching... wait...");
    } else if (cache[urlToFetch] && !forceCacheClear) {
      console.log("✅ CACHE HIT. Use cache!");
    } else {
      console.log("❌ CACHE MISS. Fetching...");
      set({ isFetching: true });
```

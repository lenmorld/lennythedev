---
title: Caching API calls in React
published: false
date: "2022-08-19"
path: "/blog/react-caching-api-responses"
description: Exploring different use cases and solutions to cache responses on API fetch in React
tags: ["react", "cache", "zustand", "fetch", "advanced", "intermediate"]
date_updated: "2022-08-21"
---

# Intro

Caching API calls in your webapp can reduce network calls, reduce backend and database load, and thus improve the overall performance and user experience. 

There can be cases when your app might fetch data from a same set of API endpoints multiple times. Instead of doing a call twice, you can cache the payload per unique URL and save a trip to the backend. This becomes beneficial for larger payloads or slower APIs.

We'll explore different scenarios and possible caching techniques and tools.
Let's get into it!

# Scenarios

To cover our async bases, I'd like to differentiate the cases when the API is called. The fetch can be triggered by a "user event" like a button click or hitting a key; or triggered the first time the component loads.

Another factor is where the cache lives and how is it managed. The cache maybe only needed by one component instance, or shared by multiple components.

You'll see shortly why I made these distinctions, but just keep that in mind.

# I. One component fetching the same API on a user event

This is for when you have once component that may fetch the same URL multiple times, on a user event like a button click, form submit, etc

Suppose we have a simple search UI that calls [Hacker News Algolia API](https://hn.algolia.com/api) for a given search term. It's always the same results for the same search term, e.g. `/api/v1/search?hitsPerPage=5&query=react`, so we can cache per URL.

```jsx
import React, { useState } from "react";
const SEARCH_URL = "https://hn.algolia.com/api/v1/search?hitsPerPage=5&query="

const Component1 = () => {
  const [query, setQuery] = useState(null)
  const [results, setResults] = useState([])

  const handleSearch = async () => {
    const searchUrl = `${SEARCH_URL}${query}`
    console.log("🌏 Fetching...")

    const raw = await fetch(searchUrl);
    const result = await raw.json();
    setResults(result?.hits)
  }

  return (
    <div>
      <input type="text" onChange={(e) => setQuery(e.target.value)} />
      <button onClick={handleSearch}>Search</button>
      {/* render results */}
    </div>
  );
};

export default Component1;
```

<!-- FIXME: replace with MDX or custom markdown (![](video_url)) -->
<iframe 
    class="iframe-video"
    width="100%"
    height="400"
    frameBorder="0"
    src="https://res.cloudinary.com/dvfhgkkpe/video/upload/v1660992291/lennythedev/react_caching_api_calls/react_component_fetch_no_cache_1a.mp4"
    title="React component fetch no cache"
    webkitallowfullscreen="true"
    mozallowfullscreen="true"
    allowFullScreen
>
</iframe>

[see code in Github](https://github.com/lenmorld/lennythedev_src/tree/master/react_cache_api_calls/1a)

### Solution: add a cache using `ref` ✅

Add a cache to save the results per URL. 
- This cache is initially empty, then every unique query will populate it.
- When search is invoked, we check the cache first if the URL is there. 
- If found, we use the cached value. 
- Otherwise, we fetch the URL and we save the results for later use.

The cache will look something like this.

```js
{
    `https://hn.algolia.com/api/v1/search?hitsPerPage=5&query=react`: [{…}, {…}, {…}, {…}, {…}]
    `https://hn.algolia.com/api/v1/search?hitsPerPage=5&query=angular`: [{…}, {…}, {…}, {…}, {…}]
}
```

```jsx
...
const Component1 = () => {
  // ...
  const cache = useRef({})
  // ...
  const handleSearch = async () => {
    const searchUrl = `${SEARCH_URL}${query}`
    const cachedResults = cache.current[searchUrl] // check cache

    if (cachedResults) {  // cache hit
      console.log("✅ Using cached data")
      setResults(cachedResults)
    } else {  // cache miss
      console.log("🌏 Fetching...")
      const raw = await fetch(searchUrl);
      const result = await raw.json();
      const data = result?.hits

      cache.current[searchUrl] = data // save fetched data to cache
      setResults(data)
    }
  }
}
...
```

<!-- FIXME: replace with MDX or custom markdown (![](video_url)) -->
<iframe 
    class="iframe-video"
    width="100%"
    height="400"
    frameBorder="0"
    src="https://res.cloudinary.com/dvfhgkkpe/video/upload/v1660955048/lennythedev/react_caching_api_calls/react_component_fetch_with_cache_1b.mp4"
    title="React component fetch with cache using ref"
    webkitallowfullscreen="true"
    mozallowfullscreen="true"
    allowFullScreen
>
</iframe>

[see code in Github](https://github.com/lenmorld/lennythedev_src/tree/master/react_cache_api_calls/1b)

A `ref` works well here, because not only it can hold mutable values that persists throughout renders, it will also be cleaned up on unmount (compared to a module variable). 

# II. Two components fetching the same API on a user event

Can we extend the solution above to two components, with a shared hook that maintains the cache in a `ref`?

Let's say we have `<Component1 /><Component1 />`s next to each other,
or `<Component1 /><Component2 />` (with Component2 fetching same URL as Component1).

> Remember that two `<Component1>`s on the same render tree are still different instances, so they maintain their own execution scope (state, props).

### `useFetch` hook for fetch and cache logic

Let's create a hook to put the fetch and caching code that can be used by multiple components.

```jsx
// useFetch.js

const useFetch = (searchUrl, uniqueId) => {
    const [data, setData] = useState([]);

    useEffect(() => {
        if (!searchUrl) return
        const fetchFunc = async () => {
            console.log("🌏 Fetching...")
            const raw = await fetch(searchUrl);
            const result = await raw.json();
            const hits = result?.hits

            setData(hits)
        }
        fetchFunc()
    }, [searchUrl])

    return [data]
}
```

Then it will be used like this:

```jsx
// Component1.jsx, Component2.jsx

import useFetch from "./useFetch";
const SEARCH_URL = "https://hn.algolia.com/api/v1/search?hitsPerPage=5&query=";

const Component1 = () => {
  const [search, setSearch] = useState(null);
  const inputRef = useRef();
  const [results] = useFetch(search, "Component<1 or 2>");

  const handleSearch = () => {
    setSearch(`${SEARCH_URL}${inputRef.current.value}`);
    // small trick to allow searching the same input, to test cache
    setTimeout(() => {
      setSearch("");
    }, 500);
  };

  return (
    <div>
      <h3>Search Hacker News</h3>
      <input type="text" ref={inputRef} />
      <button onClick={handleSearch}>Search</button>
      {/* render results */}
    </div>
  );
};
```

```jsx
// App.jsx
export default function App() {
  return (
    <div className="App">
      <Component1 />
      <Component2 />
    </div>
  );
}
```

**Notes:**
- Pass a componentId (e.g. "Component1") to help debug the cache usage
- I added a trick to clear search term even if it didn't change, so we can still observe the cache

### Cache in a ref ❌

Here we add a cache using a `ref`

```jsx
// useFetch.js
const useFetch = (searchUrl, uniqueId) => {
    const [data, setData] = useState([]);
    const cache = useRef({}) // shared cache in ref

    useEffect(() => {
        if (!searchUrl) return
        const fetchFunc = async () => {
            const cachedResults = cache.current[searchUrl] // get from cache

            if (cachedResults) {
                console.log("✅ Using cached data")
                setData(cachedResults) // use cached data
            } else {
                console.log("🌏 Fetching...")
                const raw = await fetch(searchUrl);
                const result = await raw.json();
                const hits = result?.hits

                cache.current[searchUrl] = hits // save fetched data to cache
                setData(hits)
            }
        }
        fetchFunc()
    }, [searchUrl])

    return [data]
}
```

![React multiple components cache ref not working](https://res.cloudinary.com/dvfhgkkpe/image/upload/v1660955048/lennythedev/react_caching_api_calls/react_multiple_components_sharing_cache_ref_2a.png)

**nope, ref doesn't work**, since the `ref` is tied to a component instance. 
Each instance keeps its own cache. 🤦‍♂️

[see code in Github](https://github.com/lenmorld/lennythedev_src/tree/master/react_cache_api_calls/2a)

### Solution: Use a module level variable ✅

A module variable is not tied to a component, which allows us to share the cache for both Component1 and Component2 to read and update.

```jsx
const cache = {} // module level cache

const useFetch = (searchUrl, uniqueId) => {
    const [data, setData] = useState([]);

    useEffect(() => {
        // ...
        const fetchFunc = async () => {
            const cachedResults = cache[searchUrl] // get from cache
        
            if (cachedResults) {
                console.log("✅ Using cached data") 
                setData(cachedResults) // use cached data
              } else {
                console.log("🌏 Fetching...")
                const raw = await fetch(searchUrl);
                const result = await raw.json();
                const hits = result?.hits
                
                cache[searchUrl] = hits // save fetched data to cache
                setData(hits)
              }
        }
        fetchFunc()
    }, [searchUrl])

    return [data]
}
```
![React multiple components sharing cache module var working](https://res.cloudinary.com/dvfhgkkpe/image/upload/v1660955048/lennythedev/react_caching_api_calls/react_multiple_components_sharing_cache_module_var_2b.png)

[see code in Github](https://github.com/lenmorld/lennythedev_src/tree/master/react_cache_api_calls/2b)

😎 Cool that works!

To illustrate this behavior further, I have a version with counters inside the hook.
While the ref counters maintained values for the specific component instance (1 or 2), only the **module counters** effectively maintained data between succeeding calls to the two components (1 and 2).

![React multiple components sharing cache module var working with logs](https://res.cloudinary.com/dvfhgkkpe/image/upload/v1660955048/lennythedev/react_caching_api_calls/react_multiple_components_sharing_cache_module_var_with_logs_2c.png)

[see code in Github](https://github.com/lenmorld/lennythedev_src/react_cache_api_calls/2c)

Since it works on module level, it should also work on any global variable or browser storage like:
- window object
- browser storage API: localStorage, sessionStorage, IndexedDB, etc

# III. Two components fetching the same API on component load

Think of an SPA that has a header and a page body under the same React tree. 
The header component has to display username and avatar, and the page body has a profile component that has to display user details.

> We'll change up the components markup but the logic is more or less the same. This time we'll fetch a user from [fakestoreapi](https://fakestoreapi.com).

The cache will look something like this:
```js
{
    "https://fakestoreapi.com/users/1": {...},
    "https://fakestoreapi.com/users/2": {...},
    "https://fakestoreapi.com/users/3": {...}
}
```

```jsx
// useFetch.js hook didn't change much, still using module scope cache

// Component1, Component2
const FETCH_URL = "https://fakestoreapi.com/users/1";

const Component1 = () => {
  const [user] = useFetch(FETCH_URL, "Component<1 or 2>");
  return (
    <div>
      <h3>Header</h3>
      {/* render user */}
    </div>
  );
};
```

![React multiple components fetch on load sharing cache not working](https://res.cloudinary.com/dvfhgkkpe/image/upload/v1660955048/lennythedev/react_caching_api_calls/react_multiple_components_fetch_on_load_sharing_cache_module_3a.png)

[see code in github](https://github.com/lenmorld/lennythedev_src/tree/master/react_cache_api_calls/3a)

Okay, this probably doesn't look like a header and profile at all, but let's focus on the cache 😅.

Note that even though there is a shared module-level cache between the two, both components ended up fetching the same API. But why? how? 😧

t1 - Component 1 hook runs. Cache is empty. Fetch 1 is queued. Renders without data
t2 - Component 2 hook runs. Cache is still empty, because Fetch 1 didn't even run yet (it's queued). Fetch 2 is queued. Cache is empty. Renders without data
t3 - Both UI renders are done, so the fetches get to the call stack. Both Fetch 1 and 2 runs and finishes. Cache set twice for the same data
t4 - Component 1 and 2 re-renders with data

The issue is that UI rendering always takes priority before async tasks like fetch, in the JS engine queue. 🤯

> For more details on async task queuing and event loop: see this [article](https://dev.to/lydiahallie/javascript-visualized-event-loop-3dif)

We need a way to delay the fetch using a flag, like `isFetching`.
- When a component fetches, set flag to true.
- Don't fetch again while flag is true.
- When fetch finishes, set to false.

But where do we put this flag?

#### Add `isFetching` flag module variable ❌

What if we put it in module scope, similar to cache?

```jsx
const cache = {};
let isFetching = false; // module level flag

const useFetch = (searchUrl, uniqueId) => {
    useEffect(() => {
        const fetchFunc = async () => {
            // ...
            if (isFetching) { // while still fetching, don't do anything
                console.log("⏳ Fetch in progress...");
                return;
            }
            if (cachedData) { 
              // ...
            } else {
                // ...
                isFetching = true;  // set when fetch
                const raw = await fetch(searchUrl);
                const result = await raw.json();
                isFetching = false; // reset after fetch
                // ...
            }
        };
// ...
```

![React multiple components fetch on load sharing cache module var not working](https://res.cloudinary.com/dvfhgkkpe/image/upload/v1660955048/lennythedev/react_caching_api_calls/react_multiple_components_fetch_on_load_sharing_cache_module_flag_3b.png)

[see code in Github](https://github.com/lenmorld/lennythedev_src/tree/master/react_cache_api_calls/3b)

🤔 Hmm, Component1 is okay, Component2 fetch seems to not get the data at all, it's still empty...

* t1 - Component 1 hook runs. Cache is empty. Fetch 1 is queued. Renders without data
* t2 - Component 2 hook runs. isFetching true, so don't do anything for now.
* t3 - Data arrives for Component 1. `isFetching` set to false. Save data to cache. Re-render Component 1 with data.
* t4 - ...then nothing. Component 2's hook didn't re-run at all to get data from cache and re-render!

The issue is that our `isFetching` flag, being a module variable, is not "component aware". 
It's changes does not re-run the hook

#### Component state ❌

What if we put `isFetching` in our state, so that when data arrives and it changes, both our components re-render?

```jsx
const cache = {};

const useFetch = (searchUrl, uniqueId) => {
    const [isFetching, setFetching] = useState(false); // state flag

    useEffect(() => {
        const fetchFunc = async () => {
            // ...
            if (isFetching) { // while still fetching, don't do anything
                console.log("⏳ Fetch in progress...");
                return;
            }
            if (cachedData) {
                // ...
            } else {
                // ...
                setFetching(true);  // set when fetch
                const raw = await fetch(searchUrl);
                const result = await raw.json();
                setFetching(false); // reset after fetch
                // ...
            }
// ...
```

![React multiple components fetch on load sharing cache state var not working](https://res.cloudinary.com/dvfhgkkpe/image/upload/v1660955048/lennythedev/react_caching_api_calls/react_multiple_components_fetch_on_load_sharing_cache_state_flag_3c.png)

[see code in Github](https://github.com/lenmorld/lennythedev_src/tree/master/react_cache_api_calls/3c)

🤔 Now both Component re-renders fine with data, but the fetch is still called twice.

The reason is, like a ref, state is tied to component, and thus not sharable between two components!

We need a "component aware" way but also "global" 🤔

#### Solution 1: Move state up ✅

> "the simplest solution is almost always the best." - Occam's Razor

We can just move the state up to a parent component!
A common parent component can take care of all the fetch logic (fetching, caching), 
then simply pass down the data as props to the components. 


```jsx
// App.jsx - parent component
import useFetch from "./useFetch";
const FETCH_URL = "https://fakestoreapi.com/users/1";

export default function App() {
  const [user] = useFetch(FETCH_URL, "App");

  return (
    <div className="App">
      <Component1 user={user} />
      <Component2 user={user} />
    </div>
  );
}
```

```jsx
// useFetch.js - same as before but no isFetching flag!
```

```jsx
// Component1, Component2
const Component = ({ user }) => // render user
```

![React multiple components fetch on load sharing caching move state up working](https://res.cloudinary.com/dvfhgkkpe/image/upload/v1660955048/lennythedev/react_caching_api_calls/react_multiple_components_fetch_on_load_sharing_cache_move_state_up_4a.png)

[see code in Github](https://github.com/lenmorld/lennythedev_src/react_cache_api_calls/4a)

😏 No need for `isFetching` flag since fetching is done by one component.

There's less code, since the components that need the data don't need to call the hook anymore.
If these components are way down the tree, or if there's a lot of them, we can even use **Context** to avoid prop-drilling.

We can even get away without a `cache` in simple use cases, like here when we only need to fetch once on load.
If you also need to re-fetch again on a user event (like in I and II above), then a `cache` still makes sense.

#### Solution 2: Use a state management library ✅

Now in more complex scenarios when **you can't move state up** because of:
- refactoring costs
- no suitable parent (too far, too much state or effects already)
...then we still need another way

Specifically, we need a global, "component-aware" and declarative way. 
Wait, that's why we have global stores for, like Redux and Zustand!

The nice thing with Zustand is that you don't need to add a lot of boilerplate, 
nor refactor your code to fit a framework.

> Create a store, bind your components, use the hook anywhere! No providers needed. Select your state and the component will re-render on changes. - Zustand docs

```
npm install zustand
```

Since our states will be manage by Zustand, we can replace our `useFetch` hook with a `store` that will hold all of our state and updater functions.

```js
// useStore.js
import create from "zustand";

const useStore = create((set, get) => ({
  data: null,
  cache: {},
  isFetching: false,
  fetchData: async (url, uniqueId) => {
    const { isFetching, cache } = get();

    console.log(`${uniqueId} fetch function runs`);

    const cachedResults = cache[url]; // get from cache

    if (isFetching) {
      console.log("⏳ Fetch in progress...");
    } else if (cachedResults) {
      console.log("✅ Using cached data");
      set({ data: cachedResults });
    } else {
      console.log("🌏 Fetching...");
      set({ isFetching: true });

      const raw = await fetch(url);
      const result = await raw.json();
      set({ isFetching: false });

      console.log("📦 Data arrives!", result);
      // save to cache
      set({
        cache: {
          ...cache,
          [url]: result,
        },
      });

      // components subscribed to data will re-render
      set({ data: result });
      set({ isFetching: false });
    }
  },
}));
```

```jsx
// Component1, Component2
import dataStore from "./useStore";
const FETCH_URL = "https://fakestoreapi.com/users/1";

const Component1 = () => {
  // get data from store, also subscribing to its updates
  const user = dataStore((state) => state.data);
  // get fetcher from store
  const fetchData = dataStore((state) => state.fetchData);

  useEffect(() => {
    fetchData(FETCH_URL, "Component<1 or 2>");
  }, [fetchData]);
  // render user
};
```

![](https://res.cloudinary.com/dvfhgkkpe/image/upload/v1660955048/lennythedev/react_caching_api_calls/react_multiple_components_fetch_on_load_sharing_cache_zustand_5a.png)

[see code in Github](https://github.com/lenmorld/lennythedev_src/tree/master/react_cache_api_calls/5a)


Awesome! 🎉 
API is only fetched once, and we didn't need to move the state up!

Now that we made both the `isFetching` flag and the cache work, you might say that this is quite overkill. 🙄
Our `isFetching` flag prevents running the fetch function twice. 
So the cache is not even used (you can see that our `✅ Using cached data` log is not called).


## Generalizing the cache ✅

The nice thing with our cache now is that we can now use it for a lot of use cases:
- data fetches on load, with any number of components
- data fetches on event triggers, with any number of components
- combination of the two
- any other use case that might fetch the same URL within the app

1. multiple components fetching same API on load and on every click

    ```jsx
    // Component1, Component2
    const Component1 = () => {
      const [fetchCtr, setFetchCtr] = useState(1);

      const user = dataStore((state) => state.data);
      const fetchData = dataStore((state) => state.fetchData);

      // on load
      useEffect(() => {
        fetchData(FETCH_URL, "Component<1 or 2>");
      }, [fetchData]);

      // every click
      const fetchUser = () => {
        fetchData(FETCH_URL, "Component<1 or 2>");
        setFetchCtr((prev) => prev + 1);
      };
      // ...
      return (
          {/* ... */}
          <button onClick={fetchUser}>Fetch!</button>
          {/* ... */}
      );
    }
    ```

    ![](https://res.cloudinary.com/dvfhgkkpe/image/upload/v1660955048/lennythedev/react_caching_api_calls/react_multiple_components_fetch_same_api_on_load_and_every_click_cache_6a.png)

    [see code in Github](https://github.com/lenmorld/lennythedev_src/tree/master/react_cache_api_calls/6a)

    Here we can see the cache at work. If we didn't have it, the fetch will be called 8 times in total! (2 on initial render, and 3*2=6 times clicked)

2. multiple components fetching different APIs on load and on every click

    ```jsx
    // Component1, Component2
    const Component1 = () => {
      const [fetchCtr, setFetchCtr] = useState(1);

      const user = dataStore((state) => state.data);
      const fetchData = dataStore((state) => state.fetchData);

      // on load
      useEffect(() => {
        fetchData("https://fakestoreapi.com/users/1", "Component<1 or 2>");
      }, [fetchData]);

      // every click, fetch user from 1-3
      const fetchUser = () => {
        const nextUser = Math.ceil(fetchCtr / 2);
        fetchData(`${FETCH_URL}/${nextUser}`, "Component<1 or 2>");
        // rotate
        setFetchCtr((prev) => prev + 1);
      };
      // ...
      return (
          {/* ... */}
          <button onClick={fetchUser}>Fetch!</button>
          {/* ... */}
      );
    };

    export default Component1;
    ```

    ![](https://res.cloudinary.com/dvfhgkkpe/image/upload/v1660955048/lennythedev/react_caching_api_calls/react_multiple_components_fetch_different_apis_on_load_and_every_click_cache_6b.png)

    [see code in Github](https://github.com/lenmorld/lennythedev_src/tree/master/react_cache_api_calls/6b)

    Here we can see true value of the cache. The /users API was called in total 17 times (2 on load, and 8+7=15 clicks) with 4 unique URLs being called multiple times between Components 1 and 2. 

    The amazing thing is that there are only 4 fetches in the network tab! 
    This is also reflected by the 4 items in our cache towards the end of our run. 

## Persisting the cache on browser storage 💾

So far, these cache solutions are stored in memory, so it clears on page reload.
We can use any client-side data storage to persist between reloads.
Luckily, Zustand provides a [persist middleware](https://github.com/pmndrs/zustand/blob/main/docs/persisting-store-data.md) that makes this really simple.

> We'll use `localStorage` here for simplicity, but you can use `sessionStorage`, `IndexedDB`, even `AsyncStorage`. See the persist middleware for details.

Just wrap the entire store function in a `persist`

```js
// useStore.js

import create from "zustand";
import { persist } from "zustand/middleware";

const useStore = create(
  persist(
    (set, get) => ({
      data: null,
      cache: {},
      // entire store...
    }),
    {
      name: "cache-storage", // name of item in the storage (must be unique)
      getStorage: () => localStorage, // (optional) by default the 'localStorage' is used
    }
  )
);
```

<!-- FIXME: replace with MDX or custom markdown (![](video_url)) -->
<iframe 
    class="iframe-video"
    width="100%"
    height="400"
    frameBorder="0"
    src="https://res.cloudinary.com/dvfhgkkpe/video/upload/v1660955048/lennythedev/react_caching_api_calls/react_component_fetch_cache_local_storage_7a.mp4"
    webkitallowfullscreen="true"
    mozallowfullscreen="true"
    allowFullScreen
>
</iframe>

[see code in Github](https://github.com/lenmorld/lennythedev_src/tree/master/react_cache_api_calls/7a)

✨ Now, we can even use the cache after a reload! Isn't that wonderful?!

> Note that I enabled "Preserve log" in the network tab to keep the fetch calls visible between reloads.

## Redux

You can definitely implement all of the above on Redux as well.
Here's a really good article on [Redux caching with IndexedDB](https://www.twilio.com/blog/local-cache-react-redux)

# Cache invalidation

As we all know, [cache invalidation is a hard problem](https://martinfowler.com/bliki/TwoHardThings.html) 😵, but here are some possible solutions.

## Invalidating after a certain time ⏱

Let's say you want to invalidate the cache after some time, e.g. on average, maybe a user updates their profile once a week, so we have to refetch it every 7 days.

For the experiment's sake, we'll set the cache expiry to only 7 seconds, 
and only fetch `/users/1` to see the results.
We'll also tweak our cache to use a full object instead, that contains the data and the timestamp when the cache was created.

```js
{
 url1: {
   data: {...},
   createdAt: timeStamp1
 },
 url2: {
   data: {...},
   createdAt: timeStamp2
 },
}
```

```js
// useStore.js
import create from "zustand";
import { persist } from "zustand/middleware";

const CACHE_EXPIRY_MS = 7000 // 7s

const isCacheExpired = (cacheItem) => {
  const cacheCreatedAt = cacheItem?.createdAt;
  const currentTime = Date.now()
  return (currentTime - cacheCreatedAt > CACHE_EXPIRY_MS)
}

const useStore = create(
  // ...
  fetchData: async (url, uniqueId) => {
    // ...
    if (isFetching) { /* ... */ } 
    else if (cachedItem && !isCacheExpired(cachedItem)) { // only use cache if not expired yet
      console.log("✅ Using cached data");
      set({ data: cachedItem?.data });
    } else {
      // ...fetch...
      const timestamp = Date.now();

      set({
        cache: {
          ...cache,
          [url]: {
            createdAt: timestamp, // add timestamp to cache
            data: result,
          },
        },
      });
      // ...
```

<!-- FIXME: replace with MDX or custom markdown (![](video_url)) -->
<iframe 
    class="iframe-video"
    width="100%"
    height="400"
    frameBorder="0"
    src="https://res.cloudinary.com/dvfhgkkpe/video/upload/v1660955048/lennythedev/react_caching_api_calls/react_component_fetch_cache_invalidation_expiry_8a.mp4"
    webkitallowfullscreen="true"
    mozallowfullscreen="true"
    allowFullScreen
>
</iframe>

[see code in Github](https://github.com/lenmorld/lennythedev_src/tree/master/react_cache_api_calls/8a)

Nice! The cache is kept between the two components and even after reloads. Then every 7th second, the cache expires so we refetch.

## Invalidating on command 🔨

Lastly, we can also clear the cache based on some logic or user input.

[see code in Github](https://github.com/lenmorld/lennythedev_src/tree/master/react_cache_api_calls/8b)

<!-- FIXME: replace with MDX or custom markdown (![](video_url)) -->
<iframe 
    class="iframe-video"
    width="100%"
    height="400"
    frameBorder="0"
    src="https://res.cloudinary.com/dvfhgkkpe/video/upload/v1660955048/lennythedev/react_caching_api_calls/react_component_fetch_cache_invalidation_force_clear_8b.mp4"
    webkitallowfullscreen="true"
    mozallowfullscreen="true"
    allowFullScreen
>
</iframe>

Here, you can see that the cache is kept until we optionally clear it on fetch.
🥳 Awesome!

# Summary

Caching can really improve your app by reducing the fetch calls between components, regardless of when the fetch is done. Hopefully these various techniques can help you decide and implement a cache next time you identify multiple calls being made to the same set of URLs within your app. 

I'll *cache* you in the next one. Lol, I'll show myself out 🤣

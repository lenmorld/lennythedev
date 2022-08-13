---
title: Caching API calls in React
published: false
date: "2022-07-08"
path: "/blog/react-caching-api-calls"
description: Exploring on different use cases and solutions when caching API calls in React
tags: ["react", "caching", "zustand", "intermediate"]
cover_image: 
---

# Intro

Have you ever found yourself searching the same recipe or googling the same phrase again and again,
and thought of saving it somewhere to save some data? Don't worry, your browser "caches" some content for you to decrease the load time.

Your web app can definitely do the same thing! Well, if your app fetches data from the same API multiple times, there may be some opportunities to improve the performance, and thus improving the user experience.

Instead of doing the same call again and again, we can cache the payload per unique URL and save a network call.
This becomes benficial for large payloads or slower APIs.

We'll explore different scenarios and possible caching techniques and tools.
Let's get into it!

# Setup

We'll be searching keywords at [Hacker News Algolia API](https://hn.algolia.com/api) because it has so many articles and it requires no auth, so free and fast, two of my favorite things 😉.

# Scenarios

## I. One component fetching the same API on event trigger

> If you have a component that can fetch the same URL, triggered by an event.

Suppose we have a simple search UI that calls Hacker News Algolia API for a given search term. 
It's always the same results for the same search term, e.g. `/api/v1/search?hitsPerPage=5&query=react`
so we can cache per URL

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
      <h3>Search Hacker News</h3>
      <input type="text" onChange={(e) => setQuery(e.target.value)} />
      <button onClick={handleSearch}>Search</button>

      {
        !!results.length && (
          <div>
            <h3>Results</h3>
            <ul>
              {results.map(item => (
                <li key={item.url}>{item.title}</li>
              ))}
            </ul>
          </div>
        )
      }
    </div>
  );
};

export default Component1;
```

![](./res/1_fetching_same_component_before.gif)

[code](https://github.com/lenmorld/lennythedev_src/react_cache_api_calls/1)

#### Solution: add a cache using `ref`

We can add a cache to save the results per URL. 
This cache is initially empty, but every unique query will populate it.
When search is invoked, we check the cache first if the URL is there. 
If yes, we use the value in the cache. Otherwise, we fetch the URL, then we save the results for later use.
The cache will look something like this.

```
{
    `https://hn.algolia.com/api/v1/search?hitsPerPage=5&query=react`: [{…}, {…}, {…}, {…}, {…}]
    `https://hn.algolia.com/api/v1/search?hitsPerPage=5&query=angular`: [{…}, {…}, {…}, {…}, {…}]
}
```

```jsx
...
const Component1 = () => {
  ...
  const cache = useRef({})
...
  const handleSearch = async () => {
      const searchUrl = `${SEARCH_URL}${query}`
      const cachedResults = cache.current[searchUrl]

      if (cachedResults) {
        console.log("✅ Using cached data")
        setResults(cachedResults)
      } else {
        console.log("🌏 Fetching...")
        const raw = await fetch(searchUrl);
        const result = await raw.json();
        const data = result?.hits

        cache.current[searchUrl] = data
        setResults(data)
      }
  }
...
```

![](./res/1_fetching_same_component_after.gif)

[code](https://github.com/lenmorld/lennythedev_src/react_cache_api_calls/1b)

### Notes

A `ref` works well here, because not only it can hold mutable values that persists throughout renders, it will also be cleaned up on unmount (compared to a module variable). 

## II. Two components fetching the same API on event trigger

Can we extend the solution above to two components, with a shared hook that maintains the cache in a `ref`?

Let's say we have `<Component1 /><Component1 />`s next to each other,
or `<Component1 /><Component2 />` (with Component2 having similar code to Component1).

Short answer is **no**, since the `ref` is tied to a component "instance". 
Each instance keeps its own cache. 🤦‍♂️

#### Use a ref ❌

[code](https://github.com/lenmorld/lennythedev_src/react_cache_api_calls/2a)

*Note that I had to simplify the component to useFetch while keeping the trigger buton*

![](res/2_multiple_components_sharing_hook.png)


#### Solution: Use a module level variable ✅

A module variable is not tied to a component, which allows us to share the cache for both Component1 and Component2 to read and update.

![](res/2_multiple_components_sharing_hook.gif)

[code](https://github.com/lenmorld/lennythedev_src/react_cache_api_calls/2b)


To illustrate this behavior, I added different counters inside the hook.
To make the story short, while the ref counters maintained values for the specific component instance (1 or 2), only the **module counters** effectively maintained data between succeeding calls to the two components (1 and 2).

![](res/2_multiple_components_sharing_hook_with_logs)

![](res/2022-07-28-21-55-05.png)

[code](https://github.com/lenmorld/lennythedev_src/react_cache_api_calls/2c)

If it works on module level, it should also work on any global variable or browser storage like:
- window object
- browser storages: localStorage, IndexedDB, etc

## III. Two components fetching the same API on component load

In this case, you have two components that needs the same data on component load. Imagine a header component that has to fetch user and display username and avatar, and a profile component in the page body that also has to fetch user and display all user info.

We'll change up the components markup but the logic is more or less the same.
This time we'll fetch a user from [fakestoreapi](https://fakestoreapi.com)

![](res/3a.png)

[code](https://github.com/lenmorld/lennythedev_src/react_cache_api_calls/3a)

Okay, this probably doesn't look like a header and profile at all, but let's focus on the cache 😅.

Note that even though there is a shared cache between the two, both components ended up fetching the same API. But why? how? 😧

t1 - Component 1 hook runs. Cache is empty. Fetch 1 is queued. Renders without data
t2 - Component 2 hook runs. Cache is still empty, because Fetch 1 didn't even run yet (it's queued). Fetch 2 is queued. Cache is empty. Renders without data
t3 - Both UI renders are done, so the fetches get to the call stack. Both Fetch 1 and 2 runs and finishes. Cache set twice for the same data
t4 - Component 1 and 2 re-renders with data

The issue is that UI rendering always takes priority before async tasks like fetch, in the JS engine queue. 🤯

> For more details on async task queuing and event loop: see this [article](https://dev.to/lydiahallie/javascript-visualized-event-loop-3dif)

We need a way to delay the fetch using a flag, like `isFetching`.
When a component fetches, set flag to true.
Don't fetch again while flag is true.
When fetch finishes, set to false.

But where do we put this flag?

#### Module level variable ❌

![](res/2022-07-31-07-52-41.png)

[code](https://github.com/lenmorld/lennythedev_src/react_cache_api_calls/3b)

🤔 Hmm, Component1 is okay, Component2 fetch seems to not get the data at all, it's still empty...

* t1 - Component 1 hook runs. Cache is empty. Fetch 1 is queued. Renders without data
* t2 - Component 2 hook runs. isFetching true, so don't do anything for now.
* t3 - Data arrives for Component 1. `isFetching` set to false. Save data to cache. Re-render Component 1 with data.
* t4 - ...then nothing. Component 2's hook didn't re-run at all to get data from cache and re-render!

The issue is that our `isFetching` flag, being a module variable, is not "component aware". 
It's changes does not re-run the hook

#### Component state ❌

What if we put `isFetching` in our state, so that when data arrives and it changes, both our components re-render?

[code](https://github.com/lenmorld/lennythedev_src/react_cache_api_calls/3c)

![](res/3c.png)

🤔 Now both Component re-renders fine with data, but the fetch is still called twice.

The reason is, like a ref, state is tied to component, and thus not sharable between two components!

We need a "component aware" way but also "global" 🤔

#### Move state up ✅

> "the simplest solution is almost always the best." - Occam's Razor

We can just move the state up!
One parent component can take care of all the fetch logic (fetching, caching).
It can then simply pass down the data as props to the components. 

![](res/4a.png)

[code](https://github.com/lenmorld/lennythedev_src/react_cache_api_calls/4a)

No need for `isFetching` flag since fetching is done by one component.

There's less code, since the components that need the data don't need to call the hook anymore.
If these components are way down the tree, we can use **Context** to avoid prop-drilling.

If you're use case is simple enough like in this case, we only need to fetch once on load, 
you can even get away without a `cache`. 
If you need to fetch on load, then re-fetch again on a trigger (like in I and II above), then a `cache` still makes sense.

#### Use a state management library ✅

Now in more complex scenarios where **you can't move state up**, say because of refactoring costs,
or if the only common parent is not suitable (too far, too much state or effects already), 
then we still need another way.

Specifically a more global, "component-aware" and declarative way. 
Wait, we have libraries for that! 
You can use a global store like Redux or Zustand.

The nice thing with Zustand is that you don't need to add a lot of boilerplate, 
nor refactor your code to fit a framework.

> Create a store, bind your components, use the hook anywhere! No providers needed. Select your state and the component will re-render on changes. - Zustand docs

```
npm install zustand
```

Since our states will be manage by Zustand, we'll have to create a `store` that will hold all of our state and updater functions. We won't need the hook anymore. 

![](res/5a.png)

[code](https://github.com/lenmorld/lennythedev_src/react_cache_api_calls/5a)


Awesome! 🎉 
API is only fetched once, and we didn't need to move the state up!

Now that we made both the `isFetching` flag and the cache work, you might say that this is quite overkill. 🙄
Our `isFetching` flag prevents running the fetch function twice. 
So the cache is not even used (you can see that our `✅ Using cached data` log is not called).


## Generalizing the cache ✅

The nice thing with our cache now is that we can now use it for a lot of use cases:
- data fetches on load, with any number of components
- data fetches on event triggers, with any number of components
- any combination of the two

1. multiple components fetching same API on load and on every click

    ![](res/6a.png)

    [code](https://github.com/lenmorld/lennythedev_src/react_cache_api_calls/6a)

    Here we can see the cache at work. If we didn't have it, the fetch will be called 8 times in total (2 on initial render, and 3*2=6 times clicked!)

2. multiple components fetching different APIs on load and on every click

    ![](res/6b.png)

    [code](https://github.com/lenmorld/lennythedev_src/react_cache_api_calls/6b)

    Here we can see true value of the cache! The /users API was called in total 17 times (2 on load, and 8+7=15 clicks) with 4 unique URLs being called multiple times between Components 1 and 2. 
    The amazing thing is that there are only 4 fetches in the network tab! 
    This is also reflected by the 4 items in our cache towards the end of our run. 

## Persisting between reloads

So far, these cache solutions are stored in memory, so it clears on page reload.
You can use any client-side data storage to persist between reloads.
Luckily, Zustand provides a [persist middleware](https://github.com/pmndrs/zustand/blob/main/docs/persisting-store-data.md) that makes this really simple.

> We'll use `localStorage` here for simplicity, but you can use `sessionStorage`, `IndexedDB`, even `AsyncStorage`. See the persist middleware for details.

[code](https://github.com/lenmorld/lennythedev_src/react_cache_api_calls/7a)

![](res/7a.gif)

✨ Now, we can even use the cache after a reload! Isn't that wonderful?!

> Note that I enabled "Preserve log" in the network tab to keep the fetch calls visible between reloads.

## Redux

You can definitely implement all of the above on Redux as well.
Here's a really good article on [Redux caching with IndexedDB](https://www.twilio.com/blog/local-cache-react-redux)

# Cache invalidation

As we all know, [cache invalidation is a hard problem](https://martinfowler.com/bliki/TwoHardThings.html), 
so this would really depend on your use case and the API you're calling.

## Invalidating after a certain time

As a contrived example, let's say you want to invalidate the cache after some time, e.g. could be the average duration when user updates their profile, so we have to refetch it.

I'll only fetch `/users/1` for all clicks to see the cache behavior better.
I'll also set the cache expiry to only 7 seconds for test, but you get the idea 😉

[code](https://github.com/lenmorld/lennythedev_src/react_cache_api_calls/8a)

![](res/8a.gif)

The cache is kept between the two components and even after reloads. Then every 7th second, the cache expires so we refetch.

## Forcing cache clear

Lastly, we can also clear the cache on trigger, in special cases.

[code](https://github.com/lenmorld/lennythedev_src/react_cache_api_calls/8b)

![](res/8b.gif)

Here, you can see that the cache is kept until we clear it on fetch.

🥳 Awesome!


# Summary

Hopefully this helps you decide and implement an API cache next time you identify these cases. These patterns can really improve your app by reducing the fetch calls between components, whether the fetch is done on load and/or on an event.

"Cache" you in the next one. LOL. I'll show myself out 🤣

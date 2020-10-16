---
path: "/blog/testing_async_in_react_components_with_react_testing_library"
date: "2020-10-12"
tags: ["react", "test", "hooks", "react-testing-libary", "jest", "intermediate"]
title: Testing async behavior in React components with React Testing Library
published: true
description: Fix the "not wrapped in act(...)" and other issues when testing async behavior in React components
---

# 
When testing React components with async state changes, like when data fetching with `useEffect`, you might get this error:

![not wrapped in act error](https://res.cloudinary.com/dvfhgkkpe/image/upload/v1602539351/lennythedev/not_wrapped_in_act_error.png)

## TL;DR

**Issue**
```
Warning: An update to <SomeComponent> inside a test was not wrapped in act(...).
When testing, code that causes React state updates should be wrapped into act(...)
```

**Solution**
1. When using plain `react-dom/test-utils` or `react-test-renderer`,  wrap each and every state change in your component with an `act()`

2. When using React Testing Library, use **async utils** like `waitFor` and `findBy...`


# Async example - data fetching effect in `useEffect`

You have a React component that fetches data with `useEffect`.
Unless you're using the [experimental Suspense](https://reactjs.org/docs/concurrent-mode-suspense.html), you have something like this:

1. Loading/placeholder view
    - When data is not there yet, you may display a placeholder UI like a spinner, "Loading..." or some skeleton item. 

2. Data view
    - When data arrives, you set data to your state so it gets displayed in a Table, mapped into `<li>`s, or any data visualization have you.

![fetch component example](https://res.cloudinary.com/dvfhgkkpe/image/upload/v1602540049/lennythedev/react_testing_library_fetchy.gif)

```js
import React, { useEffect, useState } from "react";

const Fetchy = () => {
  const [data, setData] = useState([]);

  useEffect(() => {
    // simulate a fetch
    setTimeout(() => {
      setData([1, 2, 3]);
    }, 3000);
  }, []);

  return (
    <div>
      <h2>Fetchy</h2>
      <div>
        {data.length ? (
          <div>
            <h3>Data:</h3>
            {data.map((d) => (
              <div key={d}>{d}</div>
            ))}
          </div>
        ) : (
          <div>Loading</div>
        )}
      </div>
    </div>
  );
};

export default Fetchy;
```


# Testing a data fetch

😎 Now, you want to test this.
Here, we're using *React Testing Library*, but the concepts apply to *Enzyme* as well.

> Here's a good intro to [React Testing Library](https://testing-library.com/docs/react-testing-library/intro)

```js
describe.only("Fetchy", () => {
    beforeAll(() => {
        jest.useFakeTimers();
    })

    afterAll(() => {
        jest.useRealTimers()
    })

    it("shows Loading", async () => {
        render(<Fetchy />);

        screen.debug();
        expect(screen.getByText("Loading")).toBeInTheDocument();

        jest.advanceTimersByTime(3000);

        screen.debug();
        expect(screen.getByText("Data:")).toBeInTheDocument();
    });
});
```

> `getByText()` finds element on the page that contains the given text. For more info on queries: [RTL queries](https://testing-library.com/docs/dom-testing-library/api-queries#queries)

1. Render component
2. `screen.debug()` logs the current HTML of document.body
3. Assert Loading UI. It logs:
    ```
    ...
    <div>Loading</div>
    ...
    ```
4. Simulate to the time data arrives, by fast-forwarding 3 seconds. `jest.advanceTimersByTime` lets us do this
5. `screen.debug()`
6. Assert Data UI. It logs:
    ```
    ...
    <h3>Data:</h3>
    <div>1</div>
    <div>2</div>
    <div>3</div>
    ...
    ```

> 🕐 Note that we use `jest.advanceTimersByTime` to fake clock ticks. This is so test runner / CI don't have to actually waste time waiting.
To make it work, put `jest.useFakeTimers` on setup and `jest.useRealTimers` on teardown

> 🖥 You can also put a selector here like `screen.debug(screen.getByText('test'))`. For more info: [RTL screen.debug](https://testing-library.com/docs/dom-testing-library/api-queries#screendebug)


✅ Tests pass...

![all tests pass](https://res.cloudinary.com/dvfhgkkpe/image/upload/v1602539351/lennythedev/async_tests_pass.png)

😱 but we're getting some console warnings 🔴
![console warnings act error](https://res.cloudinary.com/dvfhgkkpe/image/upload/v1602539351/lennythedev/console_warnings_act_error.png)

> Note that it's not the `screen.debug` since even after commenting it out, the same warning shows.

## Wait, what is `act()`?

Part of React DOM test utils, `act()` is used to wrap renders and updates inside it, to prepare the component for assertions. 

[📚 Read more: act() in React docs](https://reactjs.org/docs/test-utils.html#act)

The error we got reminds us that all state updates must be accounted for, so that the test can "act" like it's running in the browser. 

In our case, when the data arrives after 3 seconds, the `data` state is updated, causing a re-render. The test has to know about these state updates, to allow us to assert the UI changes before and after the change.

```js
Warning: An update to Fetchy inside a test was not wrapped in act(...).
When testing, code that causes React state updates should be wrapped into act(...):
act(() => {
  /* fire events that update state */
});
/* assert on the output */
```

Coming back to the error message, it seems that we just have to wrap the render in `act()`. 
The error message even gives us a nice snippet to follow.

## Wrapping state updates in `act()`

### Wrap render in `act()`

```js
it("shows Loading", async () => {
    act(() => {
        render(<Fetchy />);
    });
    ...
});
```

😭 Oh no, we're still getting the same error...

Wrapping the render inside `act` allowed us to catch the state updates on the first render, **but we never caught the next update** which is when data arrives after 3 seconds.

### Wrap in `act()` with mock timer

```js
it("shows Loading and Data", async () => {
    act(() => {
        render(<Fetchy />);
    });
    ...
    act(() => {
        jest.advanceTimersByTime(3000);
    });
    ...
});
```

🎉 Awesome! It passes and no more errors!

### Using async utils in React Testing Library

React Testing Library provides **async utilities** to for more declarative and idiomatic testing.

```js
it("shows Loading and Data", async () => {
    render(<Fetchy />);
    
    expect(await screen.findByText("Loading")).toBeInTheDocument();
    screen.debug();

    expect(await screen.findByText("Data:")).toBeInTheDocument();
    screen.debug();
});
```

1. Instead of wrapping the render in `act()`, we just let it render normally. Then, we catch the async state updates by `await`-ing the assertion.
    - `findBy*` queries are special, that they return a promise that resolves when the element is eventually found

2. We don't even need the `advanceTimersByTime` anymore, since we can also just await the data to be loaded.

3. `screen.debug()` only after the `await`, to get the updated UI

This way, we are testing the component closer to how the user uses and sees it in the browser in the real world. No fake timers nor catching updates manually.

> 📚 Read more: [RTL async utilities](https://testing-library.com/docs/vue-testing-library/cheatsheet#async-utilities)

❌😭 Oh no! Tests are failing again!

![findBy timeout error](https://res.cloudinary.com/dvfhgkkpe/image/upload/v1602539351/lennythedev/find_by_timeout_error.png)

> Note that if you have the jest fake timers enabled for the test where you're using async utils like `findBy*`, it will take longer to timeout, since it's a fake timer after all 🙃

### Timeouts

The default timeout of `findBy*` queries is 1000ms (1 sec), which means it will fail if it doesn't find the element after 1 second. 

Sometimes you want it to wait longer before failing, like for our 3 second fetch. 
We can add a `timeout` in the third parameter object `waitForOptions`.

![findBy timeout options](https://res.cloudinary.com/dvfhgkkpe/image/upload/v1602539351/lennythedev/find_by_timeout_options.png)

```js
it("shows Loading and Data", async () => {
    render(<Fetchy />);

    expect(await screen.findByText("Loading", {}, { timeout: 3000 })).toBeInTheDocument();
    screen.debug();

    expect(await screen.findByText("Data:", {}, {timeout: 3000})).toBeInTheDocument();
    screen.debug();
});
```

![findBy timeout test passes](https://res.cloudinary.com/dvfhgkkpe/image/upload/v1602539351/lennythedev/find_by_timeout_passes.png)

✅😄 All green finally!

### Other async utils

`findBy*` is a combination of `getBy*` and `waitFor`. You can also do:

```js
await waitFor(() => screen.getByText('Loading'), { timeout: 3000 })
```

> 📚 More details on findBy: [RTL findBy](https://testing-library.com/docs/dom-testing-library/api-queries#findby)


# Async example 2 - an async state change

![async checkbox state example](https://res.cloudinary.com/dvfhgkkpe/image/upload/v1602540049/lennythedev/react_testing_library_checky.gif)

Say you have a simple checkbox that does some async calculations when clicked.
We'll simulate it here with a 2 second delay before the `label` is updated:

```js
import React, { useState } from "react";

const Checky = () => {
    const [isChecked, setChecked] = useState(false);

    function handleCheck() {
        // simulate a delay in state change
        setTimeout(() => {
            setChecked((prevChecked) => !prevChecked);
        }, 2000);
    }

    return (
        <div>
            <h2>Checky</h2>
            <h4>async state change: 2 second delay</h4>
            <input type="checkbox" onChange={handleCheck} id="checky2" />
            <label htmlFor="checky2">{isChecked.toString()}</label>
        </div>
    );
};

export default Checky;
```

### Wrap in `act()` with mock timer

Testing with `act()` can look like this:

```js
it("updates state with delay - act() + mock timers", async () => {
    act(() => {
        render(<Checky />);
    })

    screen.debug();
    let label = screen.getByLabelText("false");
    expect(label).toBeInTheDocument();

    act(() => {
        fireEvent.click(label);
        jest.advanceTimersByTime(2000);
    })

    screen.debug()
    expect(screen.getByLabelText("true")).toBeInTheDocument();
});
```

1. Render component, wrap in `act()` to catch the initial state
2. `screen.debug()` to see HTML of initial UI
    ```
    ...
    <input id="checky2" type="checkbox" />
    <label for="checky2">false</label>
    ...
    ```
3. Assert initial UI: "false" label
4. Click the label using `fireEvent`
5. Simulate to the time state is updated arrives, by fast-forwarding 2 seconds. `jest.advanceTimersByTime`
5. `screen.debug()`
6. Assert updated UI with label "true"
    ```
    ...
    <input id="checky2" type="checkbox" />
    <label for="checky2">true</label>
    ...
    ```

### Using async utils in React Testing Library

Like in the first example, we can also use **async utils** to simplify the test.

```js
it("updates state with delay - RTL async utils", async () => {
    render(<Checky />);

    let label = await screen.findByLabelText("false")
    expect(label).toBeInTheDocument();
    screen.debug();

    fireEvent.click(label);

    expect(await screen.findByLabelText("true", {}, { timeout: 2000 })).toBeInTheDocument();
    // await waitFor(() => screen.getByLabelText("true"), { timeout: 2000 });
    screen.debug()
});
```

As before, `await` when the label we expect is found. Remember that we have to use `findBy*` which returns a promise that we can await. 

Timeout is needed here since we are not under jest's fake timers, and state change only happens after 2 seconds.

An alternative to `expect(await screen.findBy...)` is `await waitFor(() => screen.getBy...);`.
getBy* commands fail if not found, so `waitFor` waits until getBy* succeeds.

![Checky all good](https://res.cloudinary.com/dvfhgkkpe/image/upload/v1602539351/lennythedev/checky_all_good.png)

✅ All good! Tests passes and no warnings! 😄💯


# Code

https://github.com/lenmorld/react-test-library-boilerplate


# Further reading

- For a more in-depth discussion on fixing the `"not wrapped in act(...)" warning` and more examples in both Class and Function components, see this article by Kent C Dodds

    - https://kentcdodds.com/blog/fix-the-not-wrapped-in-act-warning

- Common mistakes when using React Testing Library

    - https://kentcdodds.com/blog/common-mistakes-with-react-testing-library

- Here's the Github issue that I found when I struggled with this error before

    - https://github.com/testing-library/react-testing-library/issues/667

# Conclusion

🙌 That's all for now! Hope this helps when you encounter that dreaded `not wrapped in act(...)` error and gives you more confidence when testing async behavior in your React components with React Testing Library. 👍
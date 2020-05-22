---
path: "/blog/react-prop-drilling-context-hoc"
date: "2019-04-22"
tags: ["intermediate", "react", "context", "hoc"]
title: Prop-drilling, React Context and Higher Order Component (HoC)
published: true
description: When to use React Context, having a HoC to contain a Consumer, and using contextType to access this.context
---

_Originally posted in_
[dev.to](https://dev.to/lenmorld/prop-drilling-react-context-and-higher-order-component-hoc-40m9)

---

Curious about React Context, using an HoC to generalize a context consumer, why you might need to use contextType, or what is prop-drilling? 🤔

![prop drilling](https://images.unsplash.com/photo-1516562309708-05f3b2b2c238?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=crop&w=334&q=80)
_Photo by [Simon Caspersen](https://source.unsplash.com/oJ7SV6vQfBA)_

If yes, cool! Read on because this might be the guide that'll help you get started with context.

# Intro: Why you need React Context ?

![Theming with prop drilling](https://thepracticaldev.s3.amazonaws.com/i/fupirzu2t7zqttlpcdkb.png)

Let's say you have a `Card` component that gets the style from the current theme of `App`, so you end up passing the theme from `App` to `Card`, involving all the components in between unnecessarily.

> App --theme-->
> &nbsp; Container --theme-->
> &nbsp;&nbsp; Section --theme-->
> &nbsp;&nbsp;&nbsp; ThemedCard --theme-->
> &nbsp;&nbsp;&nbsp;&nbsp; Card

In code, it might look like this:

```javascript
// Card.jsx

import React from "react";
import styles from "./styles";

const Card = (props) => (
  <div style={styles[props.theme]}>
    <h1>Card</h1>
  </div>
);

export default Card;

// App.jsx

import React from "react";

const ThemedCard = (props) => <Card theme={props.theme} />;
const Section = (props) => <ThemedCard theme={props.theme} />;
const Container = (props) => <Section theme={props.theme} />;

class App extends React.Component {
  state = {
    theme: "dark"
  };

  switchTheme = () => {
    const newTheme = this.state.theme === "dark" ? "default" : "dark";
    this.setState({
      theme: newTheme
    });
  };

  render() {
    return (
      <div>
        <button onClick={this.switchTheme}>Switch theme</button>
        <Container theme={this.state.theme} />
      </div>
    );
  }
}
export default App;
```

Code for part 1 here: https://codesandbox.io/s/94p2p2nwop

This is called **prop-drilling**, and this gets even worse if you have more layers of components between the data source and user. One really good alternative is using **Context**.

### createContext

First thing is to create a context using `React.createContext`.

```javascript
// ThemeContext.jsx
import React from "react";
const ThemeContext = React.createContext();
export default ThemeContext;
```

### Context Provider: `<ThemeContext.Provider>`

Now we can wrap all the context users with the **Context Provider**, and pass the `value` that we want to 'broadcast'.

The value that we pass becomes the actual context later, so you can decide to put a single value or an entire object here.

> Note: We choose to do `value={this.state}` so we later access `context.theme`. If we do `value={this.state.theme}`, we access it via `context`

```javascript
// App.jsx

...
import ThemeContext from "./ThemeContext";
    ...
	return (
	    <div>
                <button onClick={this.switchTheme}>Switch theme</button>
                <ThemeContext.Provider value={this.state}>
                    <Container />
                </ThemeContext.Provider>
	    </div>
	);
    ...
```

So how do we access the `theme` from its descendant `Card` ?

### Context Consumer: `<ThemeContext.Consumer>`

To access the context, we use a **context consumer** `<ThemeContext.Consumer>` from any ancestor of `Card`.
Here we choose `ThemedCard` so we keep the `Card` presentational, without any context stuff.

Consumer gives access to the context and propagates it downwards.
The caveat is that it requires a _function child_ that takes the context value as a prop and returns React node that uses the context value.

This is also known as a _render prop_ pattern. More about [render prop here](https://reactjs.org/docs/render-props.html).

```javascript
<SomeContext.Consumer>
  {(context_value) => <div> ...do something with context_value </div>}
</SomeContext.Consumer>
```

In our case, we render `<Card>` taking the `theme` from the context object.
We destructure theme using `({theme})`, but you can also do `(context) => ...context.theme`, and/or add stuff to our App state and access them here via `({theme, name})`, which we will do later.

Note that we don't have to pass the `theme` prop to Container anymore, and we also don't need the `theme` prop from Section anymore, since we can 'tap' directly into the context using the Consumer.

```javascript
// App.jsx
...
const ThemedCard = () => (
  <ThemeContext.Consumer>
    {({theme}) => <Card theme={theme} />}
  </ThemeContext.Consumer>
)
...
const Section = () => <ThemedCard />
const Container = () => <Section />

```

Finally, we can use the theme in our Card to style it.

```javascript
// Card.jsx
...
const Card = props => (
    <div style={styles[props.theme]}>
        <h1>Card</h1>
    </div>
)
...
```

Code in part 2 here: https://codesandbox.io/s/5wrzoqp7ok

Now our context provider and consumer works great!
We have our root component `<App />` that holds the state, propagating it through the _Provider_ and a presentation component `<ThemedCard />` that uses a _Consumer_ to access the context and use it to style `<Card />`.

# Using a Higher Order Component (HoC) to generalize a Context container

Having a `ThemedCard` is nice for theming `Card`s but what if we want to theme other things, like an Avatar, Button, or Text. Does that mean we have to create `Themed...` for each of these?

We could, but there is a better way to generalize the _theming container_ so we can use it for any component we want to use our theme context.

## withTheme HoC

> A **HoC** in React is a function that takes a component and returns another component.

Instead of a `ThemedWhatever`, we create a `withTheme` HoC that returns a generic component `ThemedComponent` that wraps **ANY** component we want to theme with the **Context Consumer**.
So whatever that component is: Card, Avatar, Button, Text, whatever, it would have access to our context! :smiley:

```javascript
// withTheme.js

import React from "react";

import ThemeContext from "./ThemeContext";

const withTheme = (Component) => {
  class ThemedComponent extends React.Component {
    render() {
      return (
        <ThemeContext.Consumer>
          {({ theme }) => <Component theme={theme} />}
        </ThemeContext.Consumer>
      );
    }
  }

  return ThemedComponent;
};

export default withTheme;
```

Notice that the Consumer part is similar to the ones before, and the only thing that we added is the `ThemedComponent` that wraps it.

But how do we use this HoC for Card?

## using the HoC

We could toss the `ThemedCard`! since we don't need it anymore! :yes:
Section can now render Card directly

```javascript
// App.jsx
...
// remove/comment out const ThemedCard = () => ()

const Section = () => <Card />;
const Container = () => <Section />;
...
```

To use the HoC, we only need to call the HoC function `withTheme`.
No other changes to our component, and it stays as presentational. We're just 'wrapping' it with out theme context.

`export default withTheme(Card)`

Here is the new version of `Card`:

```javascript
// Card.jsx
import React from "react";

import withTheme from "./withTheme";
import styles from "./styles";

const Card = (props) => (
  <div style={styles[props.theme]}>
    <h1>Card</h1>
  </div>
);

export default withTheme(Card);
```

Code in part 3 here: https://codesandbox.io/s/9l82k7y2w

Nice! Now we have a HoC to theme components. We could also easily have a
`Avatar` or `Button` component that has access to the context.

For example:

```javascript
const Avatar = props => (
    <div style={styles[props.theme]}>
        ...  all avatar stuff
)
export default withTheme(Avatar);
```

# Access `this.context` using `contextType`

Here's a little note about how flexible the HoC component can be.
What if, for some reason, you want to have lifecycle methods inside `ThemedComponent` ?

```javascript
// withTheme.js
...
  class ThemedComponent extends React.Component {
    componentDidMount() {
        // NO ACCESS TO context here 😱
        console.log(`current theme: ${ this.context.theme }`);
        // -> ERROR: this.context is undefined ❌
    }

    render() {...}
    ...
```

React 16.6 introduced `contextType` which allows you to access `this.context` to:

- Access context inside the lifecycle methods
- Use context without using the _render prop_ pattern

How? Just declare a static var in the class and assign it to the context object.

```javascript
// withTheme.js
...
class ThemedComponent extends React.Component {
    static contextType = ThemeContext;

    componentDidMount() {
      console.log(`current theme: ${ this.context.theme }`);
      // -> current theme: dark ✅
    }
    ...
```

We could also change our Consumer now to a simpler, more familiar syntax.
Instead of `<ThemeContext.Consumer>{theme => <Component theme={theme}>}</ThemedContext.Consumer>`, we could do this:

```javascript
// withTheme.js
...
    render() {
      return (
        <Component theme={this.context.theme} />
      );
    }
```

Code in part 4: https://codesandbox.io/s/9l82k7y2w

That's more like it. Simple and less confusing brackets.
The only caveat with this is you're limited to subscribing to a single context with this. More on [Multiple context here](https://reactjs.org/docs/context.html#consuming-multiple-contexts)

# Adding stuff to the context

As mentioned before, you can structure the data you expose in the context through the Provider any way you want, as long as you access it accordingly in the Consumer.

Let's say you add `themes` in the context in the Provider...

**Provider**

```javascript
// App.jsx

class App extends React.Component {
    state = {
        theme: 'dark',
        themes: ['light', 'dark'],
    }
    ...
```

In the Consumer, you can pass the entire `this.context` instead
and you can pass the context as `themeData` prop to `<Card />`, and access its attributes from Card.

**Consumer**

```javascript
// withTheme.js
...
    render() {
      return (
        <Component themeData={this.context} />
      );
    }
...

// Card.jsx
...
const Card = ({themeData}) => (
	<div style={styles[themeData.theme]}>
		<h1>Cards</h1>
		<p>{themeData.themes.toString()}</p>
	</div>
)
...
```

![Adding data in context](https://thepracticaldev.s3.amazonaws.com/i/w2rjfhptvf9ui18710z3.png)

Code in part 5 here: https://codesandbox.io/s/l2z1wxm8lq

That's all! I hope that helped clarify why you need context and the different ways of implementing it. Feel free to post any questions, comments or any suggestions.

> If you want to learn React by building a mini-Spotify, and you like following slides, check out [my React workshop repo](https://github.com/lenmorld/react_workshop)

Happy context-ing 🤓!

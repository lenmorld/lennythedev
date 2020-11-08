---
title: Custom radio button
published: true
cover_image: 
path: "/blog/html-custom-radio-button"
date: "2020-09-22"
tags: ["css", "html", "a11y"]
description: "Snazz up your basic radio buttons with some basic CSS styles"
---

Tired of the native radio button that the browser gives you? 😩
Too small? Too basic? Too blue? No hover color?

![](https://res.cloudinary.com/dvfhgkkpe/image/upload/v1600818622/lennythedev/custom_radio.gif)

I hear you!

Here's a quick sandbox with some CSS tricks to get you started!

<iframe src="https://codesandbox.io/embed/custom-radio-buttons-g0571?fontsize=14&hidenavigation=1&theme=dark"
     style="width:100%; height:500px; border:0; border-radius: 4px; overflow:hidden;"
     title="Custom radio buttons"
     allow="accelerometer; ambient-light-sensor; camera; encrypted-media; geolocation; gyroscope; hid; microphone; midi; payment; usb; vr; xr-spatial-tracking"
     sandbox="allow-forms allow-modals allow-popups allow-presentation allow-same-origin allow-scripts"
   ></iframe>

# Highlights

## `opacity: 0` to hide the input

We want to hide the original input.

- ❌ `display: none` completely omits the element.
- ❌ `visibility: hidden` takes up space, but stays invisible.

The above options successfully hide the element, but they make them invisible to screen readers. 
Here's alternatives that use `position: absolute`:

- 🤔`left: -99999999px` moves an element off the page.
It works but hard to debug, since it's there but nowhere to be found.

![](https://res.cloudinary.com/dvfhgkkpe/image/upload/v1600818622/lennythedev/hide_element_left_99999.png)

- ✅`opacity: 0` hides it by making it completely transparent, and still "findable"

```css
.container input {
  position: absolute;
  opacity: 0;
}
```

![](https://res.cloudinary.com/dvfhgkkpe/image/upload/v1600818622/lennythedev/hide_element_opacity_0.png)

> There's another one `clip-path: polygon(0 0)`, but still not very cross-browser ready

## Go big or go home!

My main complaint about stock browser radio is it's too small!

```css
.container .radio {
  position: absolute;
  top: 0;
  left: 0;
  width: 20px;
  height: 20px;
  background-color: lightgray;
  border-radius: 50%;
}
```

Note that our custom radio needs to be absolutely positioned to take the place of the original that is now hidden.


## Hover

Hover effects make it even nicer!

```css
.container:hover input ~ .radio {
  background-color: rgb(120, 91, 128);
}
```

## Associate label with our custom input

There's two ways to do this:

1. Include an `id` in the input and refer that label with `for`
  ```html
  <input type="radio" id="cat" />
  <label for="cat"></label>
  ```

2. Implicitly associate a label with a control by enclosing it

    Source: [w3 Label element specs](https://www.w3.org/TR/html401/interact/forms.html#h-17.9.1)

    ```html
    <label>
        <input type="radio" />
    </label>
    ```

    The 2nd one seems more appropriate in a custom radio, since we're enclosing the orig. input and the custom one.

    ```html
    <label class="container">
        <span class="label">Dog</span>
        <input type="radio" name="pets" value="dog" />
        <span class="radio"></span>
    </label>

    ```

## indicator using `:after` 

We use a pseudo-element here to put the inner circular white dot (aka checkmark) when a radio is selected. 

Since we styled the outer radio circle a bit bigger, we also made the checkmark bigger but keeping it in the center.

```css
.container .check:after {
  content: "";

  position: absolute;
  top: 5px;
  left: 5px;
  width: 10px;
  height: 10px;
  background-color: white;
  border-radius: 50%;

  display: none;
}

.container input:checked ~ .check:after {
  display: block;
}
```

Have fun customizing your radio inputs!


## References and Additional Reading

[w3cschool: custom radio](https://www.w3schools.com/howto/howto_css_custom_checkbox.asp)

[Bitsrc: Customize radio with a11y](https://blog.bitsrc.io/customise-radio-buttons-without-compromising-accessibility-b03061b5ba93)

[Freecodecamp: How to disappear completely](https://www.freecodecamp.org/news/how-to-disappear-completely-2f23ddb14835/)
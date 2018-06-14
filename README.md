# css-in-js-to-pcss README

Convert css in js code to nested pcss code for react styles injector.

## About

/!\ This is probably not a great extension. /!\

This tool is used to migrate a specific codebase from a style (css in js) to another (pcss). It is probably useless for you. But you can chek how the extension is build if you need a simple example.

## How to use

Select an object litteral in your editor that is a valid css in js object.

```JavaScript
{
    display: 'block',

    '> div': {
        color: '#c00',
    },
}
```

Open the command panel with `CMD + shift + P`, then run the command `CSS-IN-JS-TO-PCSS`. Your code is now:

```CSS
.__SCOPE{
    display:block;
    > div{
        color:#c00}}
```

Save to format.

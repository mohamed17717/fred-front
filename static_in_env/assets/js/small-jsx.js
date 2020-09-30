/*
## Types of args that pass to elm ##

  An object defining the props for the element
  A string defining some text to display
  A single element
  An array of elements

*/

function updateELm(elm, child) {
  if (Array.isArray(child))
    appendArray(elm, child);

  else if (child instanceof window.Element)
    appendChild(elm, child);

  else if (typeof child === `string`)
    appendText(elm, child);

  else if (typeof child === `object`)
    appendAttrs(elm, child);
}

function appendArray(elm, children) {
  children.forEach((child) => {
    updateELm(elm, child)
  });
}

function appendChild(elm, child) {
  elm.appendChild(child);
}

function appendText(elm, text) {
  const textNode = document.createTextNode(text);
  elm.appendChild(textNode);
}

function setStyles(el, styles) {
  if (!styles) {
    el.removeAttribute(`styles`);
    return;
  }

  Object.keys(styles).forEach((styleName) => {
    if (styleName in el.style)
      el.style[styleName] = styles[styleName];
    else
      console.warn(`${styleName} is not a valid style for a <${el.tagName.toLowerCase()}>`);
  });
}

function appendAttrs(elm, attrs) {
  Object.keys(attrs).forEach((attr) => {
    if (attr in elm || attributeExceptions.includes(attr)) {
      const value = attrs[attr];

      if (attr === `style`)
        setStyles(elm, value);
      else if (value)
        elm[attr] = value;

    } else
      console.warn(`${attr} is not a valid property of a <${type}>`);

  });
}

function createElm(tagName, textOrPropsOrChild, ...otherChildren) {
  const elm = document.createElement(tagName);

  updateELm(elm, textOrPropsOrChild)

  if (otherChildren) appendArray(elm, otherChildren);

  return elm;
}

const a = (...args) => createElm(`a`, ...args);
const button = (...args) => createElm(`button`, ...args);
const div = (...args) => createElm(`div`, ...args);
const h1 = (...args) => createElm(`h1`, ...args);
const header = (...args) => createElm(`header`, ...args);
const p = (...args) => createElm(`p`, ...args);
const span = (...args) => createElm(`span`, ...args);



// test
document.body.appendChild(
  div({
      id: `app`
    },
    header({
        className: `header`
      },
      h1({
        className: `header__title`
      }, `Know It All`),
      a({
          className: `header__help`,
          target: `_blank`,
          rel: `noopener noreferrer`,
          title: `Find out more about know it all`,
          href: `https://hackernoon.com/what-you-dont-know-about-web-development-d7d631f5d468#.ex2yp6d64`,
        },
        `What is this?`,
      ),
    ),
    div({
      className: `skill-table`
    }),
  )
);
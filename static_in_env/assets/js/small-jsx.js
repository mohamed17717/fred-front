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
    // if (attr in elm) {
    const value = attrs[attr];

    if (attr === `style`)
      setStyles(elm, value);
    else if (value) {
      // console.log('elm: ', elm)
      // console.log('attr:', attr)

      // elm[attr] = value;
      elm.setAttribute(attr, value)
    }

    // } else
    // console.warn(`${attr} is not a valid property of a <${type}>`);

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
const img = (...args) => createElm(`img`, ...args);
const i = (...args) => createElm(`i`, ...args);
const nav = (...args) => createElm(`nav`, ...args);
const ul = (...args) => createElm(`ul`, ...args);
const li = (...args) => createElm(`li`, ...args);
const input = (...args) => createElm(`input`, ...args);
const footer = (...args) => createElm(`footer`, ...args);
const h3 = (...args) => createElm(`h3`, ...args);
const aside = (...args) => createElm(`aside`, ...args);
const link = (...args) => createElm(`link`, ...args);
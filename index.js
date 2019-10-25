var a = [
  {
    type: 'element',
    tagName: 'span',
    properties: { className: ['keyword'] },
    children: [{ type: 'text', value: 'var' }],
  },
  { type: 'text', value: ' rehype = ' },
  {
    type: 'element',
    tagName: 'span',
    properties: { className: ['built_in'] },
    children: [{ type: 'text', value: 'require' }],
  },
  { type: 'text', value: '(' },
  {
    type: 'element',
    tagName: 'span',
    properties: { className: ['string'] },
    children: [{ type: 'text', value: "'rehype'" }],
  },
  { type: 'text', value: ')\n' },
  {
    type: 'element',
    tagName: 'span',
    properties: { className: ['keyword'] },
    children: [{ type: 'text', value: 'var' }],
  },
  { type: 'text', value: ' html = rehype()\n  .stringify({' },
  {
    type: 'element',
    tagName: 'span',
    properties: { className: ['attr'] },
    children: [{ type: 'text', value: 'type' }],
  },
  { type: 'text', value: ': ' },
  {
    type: 'element',
    tagName: 'span',
    properties: { className: ['string'] },
    children: [{ type: 'text', value: "'root'" }],
  },
  { type: 'text', value: ', ' },
  {
    type: 'element',
    tagName: 'span',
    properties: { className: ['attr'] },
    children: [{ type: 'text', value: 'children' }],
  },
  { type: 'text', value: ': tree})\n  .toString()\n\n' },
  {
    type: 'element',
    tagName: 'span',
    properties: { className: ['built_in'] },
    children: [{ type: 'text', value: 'console' }],
  },
  { type: 'text', value: '.log(html)' },
];

const apply = (text, start, end, name) =>
  console.log({ text, start, end, name });

const travel = (cb, nodes, index, name) => {
  let currentIndex = index;

  nodes.forEach(node => {
    if (node.type === 'text') {
      cb(
        node.value,
        currentIndex,
        (currentIndex += node.value.length),
        name
      );
    } else if (node.type === 'element') {
      const newName = node.properties.className;

      currentIndex = travel(cb, node.children, currentIndex, newName);
    }
  });

  return currentIndex;
};

travel(apply, a, 0, '');

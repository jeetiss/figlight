import parse from 'color-parse';

const valuesToRGB = ({ values: [r, g, b] }) => ({
  r: r /= 255,
  g: g /= 255,
  b: b /= 255,
});
const paint = (_: String, color: String) => ({
  type: 'SOLID',
  color: valuesToRGB(parse(color)),
});

const First = {
  default: paint('default', '#000'),

  string: paint('string', '#756bb1'),
  meta: paint('meta', '#756bb1'),
  symbol: paint('symbol', '#756bb1'),
  'template-tag': paint('template-tag', '#756bb1'),
  'template-variable': paint('template-variable', '#756bb1'),
  addition: paint('addition', '#756bb1'),

  comment: paint('comment', '#636363'),
  quote: paint('quote', '#636363'),

  number: paint('number', '#31a354'),
  regexp: paint('regexp', '#31a354'),
  literal: paint('literal', '#31a354'),
  bullet: paint('bullet', '#31a354'),
  link: paint('link', '#31a354'),

  deletion: paint('deletion', '#88f'),
  variable: paint('variable', '#88f'),

  keyword: paint('keyword', '#3182bd'),
  'selector-tag': paint('selector-tag', '#3182bd'),
  title: paint('title', '#3182bd'),
  section: paint('section', '#3182bd'),
  built_in: paint('built_in', '#3182bd'),
  doctag: paint('doctag', '#3182bd'),
  type: paint('type', '#3182bd'),
  tag: paint('tag', '#3182bd'),
  name: paint('name', '#3182bd'),
  'selector-id': paint('selector-id', '#3182bd'),
  'selector-class': paint('selector-class', '#3182bd'),
  strong: paint('strong', '#3182bd'),

  attr: paint('attr', '#e6550d'),
  attribute: paint('attribute', '#e6550d'),
};

export default First;

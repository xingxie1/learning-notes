'use strict';

const { slugize } = require('hexo-util');
const configuredParsers = new WeakSet();

function escapeHtml(value) {
  return String(value)
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#39;');
}

function headingText(token) {
  return (token.children || [])
    .filter(child => !child.type.endsWith('_open') && !child.type.endsWith('_close'))
    .map(child => child.content)
    .join('')
    .trim();
}

function buildTree(items) {
  const root = { level: 0, children: [] };
  const stack = [root];

  for (const item of items) {
    while (stack.length > 1 && stack[stack.length - 1].level >= item.level) {
      stack.pop();
    }
    const node = { item, level: item.level, children: [] };
    stack[stack.length - 1].children.push(node);
    stack.push(node);
  }

  return root.children;
}

function renderTree(nodes) {
  return `<ol>${nodes.map(node => {
    const { item } = node;
    const children = node.children.length ? renderTree(node.children) : '';
    return `<li><a href="#${escapeHtml(item.id)}">${escapeHtml(item.title)}</a>${children}</li>`;
  }).join('')}</ol>`;
}

function transformToc(state) {
  const tokens = state.tokens;
  const anchors = hexo.config.markdown.anchors || {};
  const slugOptions = { transform: anchors.case, ...anchors };
  const usedSlugs = Object.create(null);
  const items = [];

  for (let index = 0; index < tokens.length; index++) {
    if (tokens[index].type !== 'heading_open') continue;

    const level = Number(tokens[index].tag.slice(1));
    const title = headingText(tokens[index + 1]);
    if (!title) continue;

    let id = slugize(title, slugOptions);
    if (Object.prototype.hasOwnProperty.call(usedSlugs, id)) {
      usedSlugs[id] += 1;
      id += `-${anchors.collisionSuffix || ''}${usedSlugs[id]}`;
    } else {
      usedSlugs[id] = 1;
    }
    items.push({ level, title, id });
  }

  for (let index = 0; index < tokens.length - 2; index++) {
    if (tokens[index].type !== 'paragraph_open' ||
        tokens[index + 1].type !== 'inline' ||
        tokens[index + 2].type !== 'paragraph_close' ||
        !/^\[toc\]$/i.test(tokens[index + 1].content.trim())) {
      continue;
    }

    const toc = new state.Token('markdown_toc', 'nav', 0);
    toc.meta = { items };
    tokens.splice(index, 3, toc);
    index--;
  }
}

hexo.extend.filter.register('markdown-it:renderer', function(parser) {
  if (configuredParsers.has(parser)) return;
  configuredParsers.add(parser);

  parser.core.ruler.after('inline', 'markdown_toc', transformToc);
  parser.renderer.rules.markdown_toc = (tokens, index) => {
    const items = tokens[index].meta.items;
    if (!items.length) return '';
    return `<nav class="markdown-toc" aria-label="文章目录">${renderTree(buildTree(items))}</nav>\n`;
  };
});

'use strict';

const configuredParsers = new WeakSet();

const ALERTS = {
  NOTE: { label: 'NOTE · 说明', className: 'note' },
  TIP: { label: 'TIP · 技巧', className: 'tip' },
  IMPORTANT: { label: 'IMPORTANT · 重点', className: 'important' },
  WARNING: { label: 'WARNING · 警告', className: 'warning' },
  CAUTION: { label: 'CAUTION · 注意风险', className: 'caution' }
};

const markerPattern = /^\[!(NOTE|TIP|IMPORTANT|WARNING|CAUTION)\](?:[ \t]*\r?\n|[ \t]*)/i;

function transformAlerts(state) {
  const tokens = state.tokens;

  for (let index = 0; index < tokens.length; index++) {
    if (tokens[index].type !== 'blockquote_open') continue;

    const open = tokens[index];
    let closeIndex = index + 1;
    let depth = 1;
    for (; closeIndex < tokens.length && depth; closeIndex++) {
      if (tokens[closeIndex].type === 'blockquote_open') depth++;
      if (tokens[closeIndex].type === 'blockquote_close') depth--;
    }
    closeIndex--;
    if (depth !== 0) continue;

    const inlineIndex = tokens.findIndex((token, tokenIndex) =>
      tokenIndex > index && tokenIndex < closeIndex && token.type === 'inline'
    );
    if (inlineIndex < 0) continue;

    const inline = tokens[inlineIndex];
    const match = inline.content.match(markerPattern);
    if (!match) continue;

    const alert = ALERTS[match[1].toUpperCase()];
    const body = inline.content.slice(match[0].length);

    if (body.trim()) {
      inline.content = body;
      inline.children = [];
      state.md.inline.parse(body, state.md, state.env, inline.children);
    } else {
      // Support the GitHub form with a blank line after the marker:
      // > [!NOTE]\n>\n> content
      tokens.splice(inlineIndex - 1, 3);
      closeIndex -= 3;
    }

    open.type = 'github_alert_open';
    open.tag = 'div';
    open.attrs = [['class', `markdown-alert markdown-alert-${alert.className}`]];
    open.meta = alert;

    const title = new state.Token('github_alert_title', 'div', 0);
    title.level = open.level + 1;
    title.meta = alert;
    tokens.splice(index + 1, 0, title);
    closeIndex++;

    const close = tokens[closeIndex];
    close.type = 'github_alert_close';
    close.tag = 'div';
    index = closeIndex;
  }
}

hexo.extend.filter.register('markdown-it:renderer', function(parser) {
  if (configuredParsers.has(parser)) return;
  configuredParsers.add(parser);

  parser.core.ruler.after('inline', 'github_alerts', transformAlerts);

  parser.renderer.rules.github_alert_open = (tokens, index) => {
    return `<div class="${tokens[index].attrGet('class')}">\n`;
  };

  parser.renderer.rules.github_alert_title = (tokens, index) => {
    return `<div class="markdown-alert-title"><span class="markdown-alert-icon" aria-hidden="true"></span><span>${tokens[index].meta.label}</span></div>\n`;
  };

  parser.renderer.rules.github_alert_close = () => '</div>\n';
});

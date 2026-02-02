import sanitizeHtml from 'sanitize-html';

export const sanitizeText = (str: string) => {
  return sanitizeHtml(str, {
    allowedTags: [
      // Headings
      'h1',
      'h2',
      'h3',
      'h4',
      'h5',
      'h6',
      // Paragraphs & breaks
      'p',
      'br',
      'hr',
      'div',
      'span',
      // Text formatting
      'strong',
      'b',
      'em',
      'i',
      'u',
      's',
      'del',
      'mark',
      'sub',
      'sup',
      // Links
      'a',
      // Lists
      'ul',
      'ol',
      'li',
      // Quotes & code
      'blockquote',
      'code',
      'pre',
      // Media
      'img',
      'figure',
      'figcaption',
      'video',
      'audio',
      'source',
      'iframe',
      // Tables
      'table',
      'thead',
      'tbody',
      'tfoot',
      'tr',
      'th',
      'td',
      'caption',
      'col',
      'colgroup'
    ],

    allowedAttributes: {
      '*': ['class', 'id', 'style'],
      a: ['href', 'target', 'rel', 'title'],
      img: [
        'src',
        'alt',
        'title',
        'width',
        'height',
        'loading',
        'srcset',
        'sizes'
      ],
      video: [
        'src',
        'controls',
        'width',
        'height',
        'poster',
        'preload',
        'autoplay',
        'loop',
        'muted'
      ],
      audio: ['src', 'controls', 'preload', 'autoplay', 'loop', 'muted'],
      source: ['src', 'type', 'media'],
      iframe: [
        'src',
        'width',
        'height',
        'frameborder',
        'allowfullscreen',
        'allow',
        'title'
      ],
      td: ['colspan', 'rowspan', 'headers'],
      th: ['colspan', 'rowspan', 'scope', 'headers'],
      col: ['span'],
      colgroup: ['span']
    },

    allowedSchemes: ['http', 'https', 'mailto', 'tel', 'data'],

    allowedSchemesByTag: {
      img: ['http', 'https', 'data'],
      video: ['http', 'https'],
      audio: ['http', 'https'],
      source: ['http', 'https']
    },

    allowedStyles: {
      '*': {
        color: [
          /^#[0-9a-fA-F]{3,6}$/,
          /^rgb\(/,
          /^rgba\(/,
          /^hsl\(/,
          /^hsla\(/
        ],
        background: [
          /^#[0-9a-fA-F]{3,6}$/,
          /^rgb\(/,
          /^rgba\(/,
          /^hsl\(/,
          /^hsla\(/
        ],
        'background-color': [
          /^#[0-9a-fA-F]{3,6}$/,
          /^rgb\(/,
          /^rgba\(/,
          /^hsl\(/,
          /^hsla\(/
        ],

        'text-align': [/^left$/, /^right$/, /^center$/, /^justify$/],
        'text-decoration': [/^none$/, /^underline$/, /^line-through$/],
        'font-size': [/^\d+(?:px|em|rem|%|pt)$/],
        'font-weight': [/^\d+$/, /^bold$/, /^normal$/, /^lighter$/, /^bolder$/],
        'font-family': [/.*/],
        'font-style': [/^normal$/, /^italic$/, /^oblique$/],
        'line-height': [/^\d+(?:\.\d+)?(?:px|em|rem|%)?$/],
        'letter-spacing': [/^-?\d+(?:px|em|rem)$/],

        margin: [/^\d+(?:px|em|rem|%)(?: \d+(?:px|em|rem|%))*$/],
        'margin-top': [/^\d+(?:px|em|rem|%)$/],
        'margin-right': [/^\d+(?:px|em|rem|%)$/],
        'margin-bottom': [/^\d+(?:px|em|rem|%)$/],
        'margin-left': [/^\d+(?:px|em|rem|%)$/],
        padding: [/^\d+(?:px|em|rem|%)(?: \d+(?:px|em|rem|%))*$/],
        'padding-top': [/^\d+(?:px|em|rem|%)$/],
        'padding-right': [/^\d+(?:px|em|rem|%)$/],
        'padding-bottom': [/^\d+(?:px|em|rem|%)$/],
        'padding-left': [/^\d+(?:px|em|rem|%)$/],

        width: [/^\d+(?:px|em|rem|%|vw)$/, /^auto$/],
        height: [/^\d+(?:px|em|rem|%|vh)$/, /^auto$/],
        'max-width': [/^\d+(?:px|em|rem|%|vw)$/],
        'max-height': [/^\d+(?:px|em|rem|%|vh)$/],
        'min-width': [/^\d+(?:px|em|rem|%|vw)$/],
        'min-height': [/^\d+(?:px|em|rem|%|vh)$/],

        display: [
          /^block$/,
          /^inline$/,
          /^inline-block$/,
          /^flex$/,
          /^grid$/,
          /^none$/
        ],
        'vertical-align': [/^top$/, /^middle$/, /^bottom$/, /^baseline$/],

        border: [
          /^\d+(?:px|em|rem) (?:solid|dashed|dotted) #[0-9a-fA-F]{3,6}$/
        ],
        'border-radius': [/^\d+(?:px|em|rem|%)$/],
        'border-width': [/^\d+(?:px|em|rem)$/],
        'border-color': [/^#[0-9a-fA-F]{3,6}$/, /^rgb\(/, /^rgba\(/],
        'border-style': [/^solid$/, /^dashed$/, /^dotted$/, /^none$/],

        'list-style-type': [
          /^disc$/,
          /^circle$/,
          /^square$/,
          /^decimal$/,
          /^none$/
        ],
        'list-style-position': [/^inside$/, /^outside$/]
      }
    },

    allowedIframeHostnames: [
      'www.youtube.com',
      'youtube.com',
      'player.vimeo.com',
      'vimeo.com',
      'www.facebook.com',
      'facebook.com',
      'player.twitch.tv',
      'twitch.tv',
      'soundcloud.com',
      'w.soundcloud.com'
    ],

    transformTags: {
      a: (tagName, attribs) => ({
        tagName,
        attribs: {
          ...attribs,
          rel: 'noopener noreferrer',
          target: attribs.target || '_blank'
        }
      }),
      img: (tagName, attribs) => ({
        tagName,
        attribs: {
          ...attribs,
          loading: attribs.loading || 'lazy'
        }
      })
    },

    disallowedTagsMode: 'discard',

    allowProtocolRelative: true,

    enforceHtmlBoundary: false
  });
};

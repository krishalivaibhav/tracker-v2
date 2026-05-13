const PY_KW  = new Set(['False','None','True','and','as','assert','async','await','break','class','continue','def','del','elif','else','except','finally','for','from','global','if','import','in','is','lambda','nonlocal','not','or','pass','raise','return','try','while','with','yield']);
const PY_BI  = new Set(['abs','all','any','bin','bool','bytes','callable','chr','dict','dir','divmod','enumerate','eval','exec','filter','float','format','frozenset','getattr','globals','hasattr','hash','help','hex','id','input','int','isinstance','issubclass','iter','len','list','locals','map','max','min','next','object','oct','open','ord','pow','print','property','range','repr','reversed','round','set','setattr','slice','sorted','staticmethod','str','sum','super','tuple','type','vars','zip']);
const CPP_KW = new Set(['auto','bool','break','case','catch','char','class','const','constexpr','continue','default','delete','do','double','else','enum','explicit','extern','false','float','for','friend','goto','if','inline','int','long','mutable','namespace','new','noexcept','nullptr','operator','private','protected','public','return','short','signed','sizeof','static','struct','switch','template','this','throw','true','try','typedef','typename','union','unsigned','using','virtual','void','volatile','while','override','final']);
const CPP_BI = new Set(['string','vector','map','unordered_map','set','unordered_set','pair','tuple','array','deque','queue','stack','priority_queue','list','shared_ptr','unique_ptr','cout','cin','cerr','endl','sort','find','lower_bound','upper_bound','min','max','swap','abs','pow','sqrt','make_pair','make_shared','make_unique','ios_base','sync_with_stdio']);
const C_KW   = new Set(['auto','break','case','char','const','continue','default','do','double','else','enum','extern','float','for','goto','if','inline','int','long','register','restrict','return','short','signed','sizeof','static','struct','switch','typedef','union','unsigned','void','volatile','while','NULL','true','false','_Bool','_Complex']);
const C_BI   = new Set(['printf','scanf','fprintf','fscanf','sprintf','sscanf','malloc','calloc','realloc','free','strlen','strcpy','strncpy','strcat','strcmp','strncmp','memcpy','memset','memmove','fopen','fclose','fread','fwrite','fgets','fputs','abs','sqrt','pow','floor','ceil','atoi','atof','atol','exit','srand','rand']);
const JAVA_KW = new Set(['abstract','assert','boolean','break','byte','case','catch','char','class','const','continue','default','do','double','else','enum','extends','final','finally','float','for','goto','if','implements','import','instanceof','int','interface','long','native','new','package','private','protected','public','return','short','static','strictfp','super','switch','synchronized','this','throw','throws','transient','try','void','volatile','while','true','false','null','var','record','sealed','permits']);
const JAVA_BI = new Set(['String','Integer','Long','Double','Float','Boolean','Character','Byte','Short','Object','List','ArrayList','LinkedList','HashMap','HashSet','TreeMap','TreeSet','Map','Set','Queue','Deque','ArrayDeque','Arrays','Collections','Math','System','Scanner','StringBuilder','StringBuffer','Optional','Comparator','Iterator','Exception','RuntimeException','NullPointerException','IllegalArgumentException','IOException']);
const JS_KW   = new Set(['break','case','catch','class','const','continue','debugger','default','delete','do','else','export','extends','false','finally','for','function','if','import','in','instanceof','let','new','null','return','super','switch','this','throw','true','try','typeof','undefined','var','void','while','with','yield','async','await','of','from','static','get','set']);
const JS_BI   = new Set(['console','Array','Object','String','Number','Boolean','Math','JSON','Promise','Set','Map','WeakMap','WeakSet','Symbol','Proxy','Reflect','Date','RegExp','Error','parseInt','parseFloat','isNaN','isFinite','setTimeout','clearTimeout','setInterval','clearInterval','require','module','exports','process','Buffer','global','window','document','navigator','fetch','Infinity','NaN']);

function e(s) { return s.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;'); }

export function highlight(src, lang) {
  const isPy  = lang === 'python';
  const isJS  = lang === 'javascript';
  const isC   = lang === 'c';
  const isJava = lang === 'java';
  const hasCStyleComments = !isPy;
  const hasCPreprocessor  = isC || lang === 'cpp';

  const kw = isPy ? PY_KW : isJS ? JS_KW : isC ? C_KW : isJava ? JAVA_KW : CPP_KW;
  const bi = isPy ? PY_BI : isJS ? JS_BI : isC ? C_BI : isJava ? JAVA_BI : CPP_BI;

  let out = '', i = 0;

  while (i < src.length) {
    const c = src[i];

    if (isPy && c === '#') {
      const end = src.indexOf('\n', i); const t = end < 0 ? src.slice(i) : src.slice(i, end);
      out += `<span class="hl-c">${e(t)}</span>`; i += t.length; continue;
    }
    if (hasCStyleComments && c === '/' && src[i+1] === '/') {
      const end = src.indexOf('\n', i); const t = end < 0 ? src.slice(i) : src.slice(i, end);
      out += `<span class="hl-c">${e(t)}</span>`; i += t.length; continue;
    }
    if (hasCStyleComments && c === '/' && src[i+1] === '*') {
      const end = src.indexOf('*/', i+2); const t = end < 0 ? src.slice(i) : src.slice(i, end+2);
      out += `<span class="hl-c">${e(t)}</span>`; i += t.length; continue;
    }
    if (hasCPreprocessor && c === '#' && (i === 0 || src[i-1] === '\n')) {
      const end = src.indexOf('\n', i); const t = end < 0 ? src.slice(i) : src.slice(i, end);
      out += `<span class="hl-pp">${e(t)}</span>`; i += t.length; continue;
    }
    if (isPy && (src.slice(i,i+3) === '"""' || src.slice(i,i+3) === "'''")) {
      const q = src.slice(i,i+3); const end = src.indexOf(q, i+3);
      const t = end < 0 ? src.slice(i) : src.slice(i, end+3);
      out += `<span class="hl-s">${e(t)}</span>`; i += t.length; continue;
    }
    if (isJS && c === '`') {
      let j = i+1;
      while (j < src.length && src[j] !== '`') { if (src[j]==='\\') j++; j++; }
      const t = src.slice(i, Math.min(j+1, src.length));
      out += `<span class="hl-s">${e(t)}</span>`; i += t.length; continue;
    }
    if (c === '"' || c === "'") {
      let j = i+1;
      while (j < src.length && src[j] !== c && src[j] !== '\n') { if (src[j]==='\\') j++; j++; }
      const t = src.slice(i, Math.min(j+1, src.length));
      out += `<span class="hl-s">${e(t)}</span>`; i += t.length; continue;
    }
    if (/[0-9]/.test(c) || (c==='.' && /[0-9]/.test(src[i+1]||''))) {
      let j = i; while (j < src.length && /[0-9a-fA-FxXoObBlLeE_.]/.test(src[j])) j++;
      out += `<span class="hl-n">${e(src.slice(i,j))}</span>`; i = j; continue;
    }
    if (/[a-zA-Z_]/.test(c)) {
      let j = i; while (j < src.length && /\w/.test(src[j])) j++;
      const w = src.slice(i, j);
      if      (kw.has(w))      out += `<span class="hl-k">${e(w)}</span>`;
      else if (bi.has(w))      out += `<span class="hl-b">${e(w)}</span>`;
      else if (src[j] === '(') out += `<span class="hl-f">${e(w)}</span>`;
      else                     out += e(w);
      i = j; continue;
    }
    if (/[+\-*/%=<>!&|^~@]/.test(c)) {
      let j = i; while (j < src.length && /[+\-*/%=<>!&|^~@]/.test(src[j])) j++;
      out += `<span class="hl-op">${e(src.slice(i,j))}</span>`; i = j; continue;
    }
    out += e(c); i++;
  }
  return out;
}

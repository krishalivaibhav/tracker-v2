function analyseInput(rawInput, type) {
  if (type === 'pattern') return { shape: 'single_int' };
  const s = String(rawInput || '').trim();
  if (!s) return { shape: 'custom' };

  const lines = s.split('\n');
  const isNum = v => v !== '' && !isNaN(v);

  const l0 = lines[0].trim().split(/\s+/).filter(Boolean);
  const l1 = lines.length > 1 ? lines[1].trim().split(/\s+/).filter(Boolean) : [];

  if (lines.length === 1) {
    if (l0.length === 1)  return isNum(l0[0]) ? { shape: 'single_int' }  : { shape: 'single_str' };
    if (l0.length === 2)  return l0.every(isNum) ? { shape: 'two_ints_sameline' } : { shape: 'two_strs_sameline' };
    if (l0.every(isNum)) return { shape: 'array_sameline', n: l0.length };
    return { shape: 'custom' };
  }
  if (lines.length === 2) {
    if (l0.length === 1 && isNum(l0[0]) && l1.length > 1 && l1.every(isNum))
      return { shape: 'n_then_array' };
    if (l0.length === 1 && l1.length === 1)
      return { shape: 'two_ints_twolines' };
    if (l0.length > 1 && l1.length > 1)
      return { shape: 'two_arrays' };
  }
  if (lines.length === 3) {
    if (l0.length === 1 && isNum(l0[0]))
      return { shape: 'n_then_two_arrays' };
  }
  return { shape: 'custom' };
}

export function starterCode(problem, lang) {
  const type    = problem.type || 'custom';
  const firstEx = (problem.examples || [])[0];
  const { shape } = analyseInput(firstEx ? firstEx.input : '', type);

  const pyHead = 'import sys\ninput = sys.stdin.readline\n\n';
  const pyBody = {
    single_int:        'n = int(input())\n\n# write your solution here\nprint(n)\n',
    single_str:        's = input().strip()\n\n# write your solution here\nprint(s)\n',
    two_ints_sameline: 'a, b = map(int, input().split())\n\n# write your solution here\nprint(a + b)\n',
    two_strs_sameline: 'a, b = input().split()\n\n# write your solution here\n',
    two_ints_twolines: 'a = int(input())\nb = int(input())\n\n# write your solution here\n',
    n_then_array:      'n = int(input())\narr = list(map(int, input().split()))\n\n# write your solution here\nprint(*arr)\n',
    array_sameline:    'arr = list(map(int, input().split()))\n\n# write your solution here\nprint(*arr)\n',
    two_arrays:        'arr1 = list(map(int, input().split()))\narr2 = list(map(int, input().split()))\n\n# write your solution here\n',
    n_then_two_arrays: 'n = int(input())\narr1 = list(map(int, input().split()))\narr2 = list(map(int, input().split()))\n\n# write your solution here\n',
    pattern:           'n = int(input())\n\nfor i in range(1, n + 1):\n    print("*" * i)\n',
    custom:            '# write your solution here\n',
  };

  const cppHead = '#include <bits/stdc++.h>\nusing namespace std;\n\nint main() {\n    ios_base::sync_with_stdio(false);\n    cin.tie(NULL);\n\n';
  const cppTail = '\n    // write your solution here\n\n    return 0;\n}\n';
  const cppBody = {
    single_int:        '    int n;\n    cin >> n;\n',
    single_str:        '    string s;\n    cin >> s;\n',
    two_ints_sameline: '    int a, b;\n    cin >> a >> b;\n',
    two_strs_sameline: '    string a, b;\n    cin >> a >> b;\n',
    two_ints_twolines: '    int a, b;\n    cin >> a >> b;\n',
    n_then_array:      '    int n;\n    cin >> n;\n    vector<int> arr(n);\n    for (int i = 0; i < n; i++) cin >> arr[i];\n',
    array_sameline:    '    int x;\n    vector<int> arr;\n    while (cin >> x) arr.push_back(x);\n',
    two_arrays:        '    int n;\n    cin >> n;\n    vector<int> a(n), b(n);\n    for (int i = 0; i < n; i++) cin >> a[i];\n    for (int i = 0; i < n; i++) cin >> b[i];\n',
    n_then_two_arrays: '    int n;\n    cin >> n;\n    vector<int> a(n), b(n);\n    for (int i = 0; i < n; i++) cin >> a[i];\n    for (int i = 0; i < n; i++) cin >> b[i];\n',
    pattern:           '    int n;\n    cin >> n;\n    for (int i = 1; i <= n; i++) {\n        for (int j = 0; j < i; j++) cout << "*";\n        cout << "\\n";\n    }\n',
    custom:            '',
  };

  const cHead = '#include <stdio.h>\n#include <stdlib.h>\n#include <string.h>\n\nint main() {\n';
  const cTail = '\n    // write your solution here\n\n    return 0;\n}\n';
  const cBody = {
    single_int:        '    int n;\n    scanf("%d", &n);\n',
    single_str:        '    char s[1024];\n    scanf("%s", s);\n',
    two_ints_sameline: '    int a, b;\n    scanf("%d %d", &a, &b);\n',
    two_strs_sameline: '    char a[512], b[512];\n    scanf("%s %s", a, b);\n',
    two_ints_twolines: '    int a, b;\n    scanf("%d %d", &a, &b);\n',
    n_then_array:      '    int n;\n    scanf("%d", &n);\n    int arr[100005];\n    for (int i = 0; i < n; i++) scanf("%d", &arr[i]);\n',
    array_sameline:    '    int arr[100005], n = 0;\n    while (scanf("%d", &arr[n]) == 1) n++;\n',
    two_arrays:        '    int n = 0;\n    int a[100005], b[100005];\n    // read first array then second\n',
    n_then_two_arrays: '    int n;\n    scanf("%d", &n);\n    int a[100005], b[100005];\n    for (int i = 0; i < n; i++) scanf("%d", &a[i]);\n    for (int i = 0; i < n; i++) scanf("%d", &b[i]);\n',
    pattern:           '    int n;\n    scanf("%d", &n);\n    for (int i = 1; i <= n; i++) {\n        for (int j = 0; j < i; j++) printf("*");\n        printf("\\n");\n    }\n    return 0;\n',
    custom:            '',
  };

  const javaHead = 'import java.util.*;\nimport java.io.*;\n\nclass Main {\n    public static void main(String[] args) throws IOException {\n        Scanner sc = new Scanner(System.in);\n\n';
  const javaTail = '\n        // write your solution here\n    }\n}\n';
  const javaBody = {
    single_int:        '        int n = sc.nextInt();\n',
    single_str:        '        String s = sc.next();\n',
    two_ints_sameline: '        int a = sc.nextInt(), b = sc.nextInt();\n',
    two_strs_sameline: '        String a = sc.next(), b = sc.next();\n',
    two_ints_twolines: '        int a = sc.nextInt();\n        int b = sc.nextInt();\n',
    n_then_array:      '        int n = sc.nextInt();\n        int[] arr = new int[n];\n        for (int i = 0; i < n; i++) arr[i] = sc.nextInt();\n',
    array_sameline:    '        String[] tok = sc.nextLine().trim().split(" ");\n        int[] arr = Arrays.stream(tok).mapToInt(Integer::parseInt).toArray();\n',
    two_arrays:        '        String[] t1 = sc.nextLine().trim().split(" ");\n        String[] t2 = sc.nextLine().trim().split(" ");\n        int[] a = Arrays.stream(t1).mapToInt(Integer::parseInt).toArray();\n        int[] b = Arrays.stream(t2).mapToInt(Integer::parseInt).toArray();\n',
    n_then_two_arrays: '        int n = sc.nextInt();\n        int[] a = new int[n], b = new int[n];\n        for (int i = 0; i < n; i++) a[i] = sc.nextInt();\n        for (int i = 0; i < n; i++) b[i] = sc.nextInt();\n',
    pattern:           '        int n = sc.nextInt();\n        for (int i = 1; i <= n; i++) {\n            for (int j = 0; j < i; j++) System.out.print("*");\n            System.out.println();\n        }\n',
    custom:            '',
  };

  const jsHead = 'const lines = require(\'fs\').readFileSync(\'/dev/stdin\', \'utf8\').trim().split(\'\\n\');\n\n';
  const jsBody = {
    single_int:        'const n = parseInt(lines[0]);\n\n// write your solution here\nconsole.log(n);\n',
    single_str:        'const s = lines[0].trim();\n\n// write your solution here\nconsole.log(s);\n',
    two_ints_sameline: 'const [a, b] = lines[0].split(\' \').map(Number);\n\n// write your solution here\n',
    two_strs_sameline: 'const [a, b] = lines[0].split(\' \');\n\n// write your solution here\n',
    two_ints_twolines: 'const a = parseInt(lines[0]);\nconst b = parseInt(lines[1]);\n\n// write your solution here\n',
    n_then_array:      'const n = parseInt(lines[0]);\nconst arr = lines[1].split(\' \').map(Number);\n\n// write your solution here\nconsole.log(arr.join(\' \'));\n',
    array_sameline:    'const arr = lines[0].split(\' \').map(Number);\n\n// write your solution here\nconsole.log(arr.join(\' \'));\n',
    two_arrays:        'const a = lines[0].split(\' \').map(Number);\nconst b = lines[1].split(\' \').map(Number);\n\n// write your solution here\n',
    n_then_two_arrays: 'const n = parseInt(lines[0]);\nconst a = lines[1].split(\' \').map(Number);\nconst b = lines[2].split(\' \').map(Number);\n\n// write your solution here\n',
    pattern:           'const n = parseInt(lines[0]);\nfor (let i = 1; i <= n; i++) console.log(\'*\'.repeat(i));\n',
    custom:            '// write your solution here\n',
  };

  if (lang === 'python')     return pyHead + (pyBody[shape] || pyBody.custom);
  if (lang === 'cpp')        return cppHead + (cppBody[shape] || '') + cppTail;
  if (lang === 'c')          return cHead + (cBody[shape] || '') + cTail;
  if (lang === 'java')       return javaHead + (javaBody[shape] || '') + javaTail;
  if (lang === 'javascript') return jsHead + (jsBody[shape] || jsBody.custom);
  return '// write your solution here\n';
}

export function buildProblemDesc(problem) {
  const e = s => String(s).replace(/</g,'&lt;').replace(/>/g,'&gt;');

  const firstEx = (problem.examples || [])[0];
  const { shape } = analyseInput(firstEx ? firstEx.input : '', problem.type || 'custom');
  const inputFmtMap = {
    single_int:        'A single integer on one line.',
    single_str:        'A single string on one line.',
    two_ints_sameline: 'A single line containing two space-separated integers.',
    two_strs_sameline: 'A single line containing two space-separated strings.',
    two_ints_twolines: 'Two lines, each containing one integer.',
    n_then_array:      'Line 1: integer N (array size).\nLine 2: N space-separated integers.',
    array_sameline:    'A single line of space-separated integers.',
    two_arrays:        'Line 1: N space-separated integers.\nLine 2: N space-separated integers.',
    n_then_two_arrays: 'Line 1: integer N.\nLine 2: N integers (first array).\nLine 3: N integers (second array).',
    pattern:           'A single integer N.',
    custom:            'See examples below.',
  };
  const inputFmt = inputFmtMap[shape] || 'See examples below.';

  const firstOut = firstEx ? String(firstEx.output).trim() : '';
  const outIsMultiLine = firstOut.includes('\n');
  const outputFmt = outIsMultiLine
    ? 'Multiple lines as described in the problem.'
    : !isNaN(firstOut) && firstOut !== '' ? 'A single number.'
    : firstOut.toLowerCase() === 'true' || firstOut.toLowerCase() === 'false'
      ? '"true" or "false" (case-insensitive).'
      : 'A single line of output.';

  const constraintsMap = {
    E: '1 ≤ N ≤ 10<sup>5</sup>',
    M: '1 ≤ N ≤ 10<sup>5</sup> &nbsp;·&nbsp; Values may be negative',
    H: '1 ≤ N ≤ 10<sup>6</sup> &nbsp;·&nbsp; Optimise for time and space',
  };

  const examplesHtml = (problem.examples || []).map((ex, idx) => `
    <div class="prob-example">
      <div class="prob-example-label">Example ${idx + 1}</div>
      <div class="prob-io-grid">
        <div class="prob-io-box"><div class="prob-io-label">Input</div><pre class="prob-io-pre">${e(ex.input)}</pre></div>
        <div class="prob-io-box"><div class="prob-io-label">Output</div><pre class="prob-io-pre">${e(ex.output)}</pre></div>
      </div>
      ${ex.explanation ? `<div class="prob-explanation"><strong>Explanation:</strong> ${e(ex.explanation)}</div>` : ''}
    </div>`).join('');

  return `
    <div class="prob-header">
      <div class="prob-title">${e(problem.t)}</div>
      <div class="prob-badges">${problem.d === 'E' ? '<span class="diff diff-easy">Easy</span>' : problem.d === 'M' ? '<span class="diff diff-medium">Medium</span>' : '<span class="diff diff-hard">Hard</span>'}${problem.gfg ? `&nbsp;<a href="${problem.gfg}" target="_blank" class="prob-gfg-link">GFG ↗</a>` : ''}</div>
    </div>
    <div class="prob-section"><div class="prob-section-body prob-statement">${(problem.desc || '').replace(/\n/g,'<br>')}</div></div>
    <div class="prob-section"><div class="prob-section-title">Input Format</div><div class="prob-section-body">${inputFmt.replace(/\n/g,'<br>')}</div></div>
    <div class="prob-section"><div class="prob-section-title">Output Format</div><div class="prob-section-body">${outputFmt}</div></div>
    <div class="prob-section"><div class="prob-section-title">Constraints</div><div class="prob-section-body">${constraintsMap[problem.d] || '1 ≤ N ≤ 10<sup>5</sup>'}</div></div>
    ${examplesHtml ? `<div class="prob-section"><div class="prob-section-title">Examples</div>${examplesHtml}</div>` : ''}`;
}

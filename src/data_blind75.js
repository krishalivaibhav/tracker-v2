// data_blind75.js — Blind 75 (75 problems)
// Q(title, slug, difficulty, lcSlug)
const Q = (t, s, d, lc = null) => ({ t, s, d, lc, gfg: null, desc: null, examples: null, type: null, done: false });

export const BLIND75_STEPS = [
  {
    id: 'b75-s1', name: 'Arrays', color: '#6366F1',
    substeps: [{ id: 'b75-s1-1', name: 'Array Problems', problems: [
      Q('Two Sum',                              'b75-two-sum',           'E', 'two-sum'),
      Q('Best Time to Buy and Sell Stock',      'b75-buy-sell-stock',    'E', 'best-time-to-buy-and-sell-stock'),
      Q('Contains Duplicate',                  'b75-contains-dup',      'E', 'contains-duplicate'),
      Q('Product of Array Except Self',         'b75-product-except',    'M', 'product-of-array-except-self'),
      Q('Maximum Subarray',                    'b75-max-subarray',      'M', 'maximum-subarray'),
      Q('Maximum Product Subarray',            'b75-max-product',       'M', 'maximum-product-subarray'),
      Q('Find Minimum in Rotated Sorted Array', 'b75-min-rotated',       'M', 'find-minimum-in-rotated-sorted-array'),
      Q('Search in Rotated Sorted Array',       'b75-search-rotated',    'M', 'search-in-rotated-sorted-array'),
      Q('3Sum',                                'b75-3sum',              'M', '3sum'),
      Q('Container With Most Water',           'b75-container-water',   'M', 'container-with-most-water'),
    ]}],
  },
  {
    id: 'b75-s2', name: 'Bit Manipulation', color: '#8B5CF6',
    substeps: [{ id: 'b75-s2-1', name: 'Binary & Bits', problems: [
      Q('Sum of Two Integers',   'b75-sum-two-ints',   'M', 'sum-of-two-integers'),
      Q('Number of 1 Bits',      'b75-num-1-bits',     'E', 'number-of-1-bits'),
      Q('Counting Bits',         'b75-counting-bits',  'E', 'counting-bits'),
      Q('Missing Number',        'b75-missing-number', 'E', 'missing-number'),
      Q('Reverse Bits',          'b75-reverse-bits',   'E', 'reverse-bits'),
    ]}],
  },
  {
    id: 'b75-s3', name: 'Dynamic Programming', color: '#EC4899',
    substeps: [{ id: 'b75-s3-1', name: 'DP Problems', problems: [
      Q('Climbing Stairs',                 'b75-climbing-stairs',  'E', 'climbing-stairs'),
      Q('Coin Change',                     'b75-coin-change',      'M', 'coin-change'),
      Q('Longest Increasing Subsequence',  'b75-lis',              'M', 'longest-increasing-subsequence'),
      Q('Longest Common Subsequence',      'b75-lcs',              'M', 'longest-common-subsequence'),
      Q('Word Break',                      'b75-word-break',       'M', 'word-break'),
      Q('Combination Sum IV',              'b75-combo-sum-iv',     'M', 'combination-sum-iv'),
      Q('House Robber',                    'b75-house-robber',     'M', 'house-robber'),
      Q('House Robber II',                 'b75-house-robber-2',   'M', 'house-robber-ii'),
      Q('Decode Ways',                     'b75-decode-ways',      'M', 'decode-ways'),
      Q('Unique Paths',                    'b75-unique-paths',     'M', 'unique-paths'),
      Q('Jump Game',                       'b75-jump-game',        'M', 'jump-game'),
    ]}],
  },
  {
    id: 'b75-s4', name: 'Graph', color: '#10B981',
    substeps: [{ id: 'b75-s4-1', name: 'Graph Problems', problems: [
      Q('Clone Graph',                                     'b75-clone-graph',         'M', 'clone-graph'),
      Q('Course Schedule',                                 'b75-course-schedule',     'M', 'course-schedule'),
      Q('Pacific Atlantic Water Flow',                     'b75-pacific-atlantic',    'M', 'pacific-atlantic-water-flow'),
      Q('Number of Islands',                               'b75-num-islands',         'M', 'number-of-islands'),
      Q('Longest Consecutive Sequence',                    'b75-longest-consec',      'M', 'longest-consecutive-sequence'),
      Q('Alien Dictionary',                                'b75-alien-dict',          'H', 'alien-dictionary'),
      Q('Graph Valid Tree',                                'b75-graph-valid-tree',    'M', 'graph-valid-tree'),
      Q('Number of Connected Components in Undirected Graph', 'b75-num-connected',    'M', 'number-of-connected-components-in-an-undirected-graph'),
    ]}],
  },
  {
    id: 'b75-s5', name: 'Intervals', color: '#F59E0B',
    substeps: [{ id: 'b75-s5-1', name: 'Interval Problems', problems: [
      Q('Insert Interval',                              'b75-insert-interval',  'M', 'insert-interval'),
      Q('Merge Intervals',                              'b75-merge-intervals',  'M', 'merge-intervals'),
      Q('Non-overlapping Intervals',                    'b75-non-overlap',      'M', 'non-overlapping-intervals'),
      Q('Meeting Rooms',                                'b75-meeting-rooms',    'E', 'meeting-rooms'),
      Q('Meeting Rooms II',                             'b75-meeting-rooms-2',  'M', 'meeting-rooms-ii'),
      Q('Minimum Number of Arrows to Burst Balloons',   'b75-min-arrows',       'M', 'minimum-number-of-arrows-to-burst-balloons'),
    ]}],
  },
  {
    id: 'b75-s6', name: 'Linked List', color: '#14B8A6',
    substeps: [{ id: 'b75-s6-1', name: 'Linked List Problems', problems: [
      Q('Reverse Linked List',                'b75-rev-ll',           'E', 'reverse-linked-list'),
      Q('Linked List Cycle',                  'b75-ll-cycle',         'E', 'linked-list-cycle'),
      Q('Merge Two Sorted Lists',             'b75-merge-two-sorted', 'E', 'merge-two-sorted-lists'),
      Q('Remove Nth Node From End of List',   'b75-remove-nth',       'M', 'remove-nth-node-from-end-of-list'),
      Q('Reorder List',                       'b75-reorder-list',     'M', 'reorder-list'),
      Q('Merge K Sorted Lists',               'b75-merge-k',          'H', 'merge-k-sorted-lists'),
    ]}],
  },
  {
    id: 'b75-s7', name: 'Matrix', color: '#F97316',
    substeps: [{ id: 'b75-s7-1', name: 'Matrix Problems', problems: [
      Q('Set Matrix Zeroes', 'b75-set-matrix-zero', 'M', 'set-matrix-zeroes'),
      Q('Spiral Matrix',     'b75-spiral-matrix',   'M', 'spiral-matrix'),
      Q('Rotate Image',      'b75-rotate-image',    'M', 'rotate-image'),
      Q('Word Search',       'b75-word-search',     'M', 'word-search'),
    ]}],
  },
  {
    id: 'b75-s8', name: 'String', color: '#EF4444',
    substeps: [{ id: 'b75-s8-1', name: 'String Problems', problems: [
      Q('Longest Substring Without Repeating Characters', 'b75-longest-substr',     'M', 'longest-substring-without-repeating-characters'),
      Q('Longest Repeating Character Replacement',        'b75-char-replacement',   'M', 'longest-repeating-character-replacement'),
      Q('Minimum Window Substring',                       'b75-min-window',         'H', 'minimum-window-substring'),
      Q('Valid Anagram',                                  'b75-valid-anagram',      'E', 'valid-anagram'),
      Q('Group Anagrams',                                 'b75-group-anagrams',     'M', 'group-anagrams'),
      Q('Valid Parentheses',                              'b75-valid-parens',       'E', 'valid-parentheses'),
      Q('Valid Palindrome',                               'b75-valid-palindrome',   'E', 'valid-palindrome'),
      Q('Longest Palindromic Substring',                  'b75-longest-palindrome', 'M', 'longest-palindromic-substring'),
      Q('Palindromic Substrings',                         'b75-palindromic-substrs','M', 'palindromic-substrings'),
      Q('Encode and Decode Strings',                      'b75-encode-decode',      'M', 'encode-and-decode-strings'),
    ]}],
  },
  {
    id: 'b75-s9', name: 'Tree', color: '#84CC16',
    substeps: [
      { id: 'b75-s9-1', name: 'Binary Tree', problems: [
        Q('Maximum Depth of Binary Tree',                             'b75-max-depth-bt',    'E', 'maximum-depth-of-binary-tree'),
        Q('Same Tree',                                               'b75-same-tree',       'E', 'same-tree'),
        Q('Invert Binary Tree',                                      'b75-invert-bt',       'E', 'invert-binary-tree'),
        Q('Binary Tree Maximum Path Sum',                            'b75-bt-max-path',     'H', 'binary-tree-maximum-path-sum'),
        Q('Serialize and Deserialize Binary Tree',                   'b75-serialize-bt',    'H', 'serialize-and-deserialize-binary-tree'),
        Q('Binary Tree Level Order Traversal',                       'b75-level-order',     'M', 'binary-tree-level-order-traversal'),
        Q('Subtree of Another Tree',                                 'b75-subtree',         'E', 'subtree-of-another-tree'),
        Q('Construct Binary Tree from Preorder and Inorder',         'b75-construct-bt',    'M', 'construct-binary-tree-from-preorder-and-inorder-traversal'),
      ]},
      { id: 'b75-s9-2', name: 'BST & Trie', problems: [
        Q('Validate Binary Search Tree',                             'b75-validate-bst',    'M', 'validate-binary-search-tree'),
        Q('Kth Smallest Element in a BST',                          'b75-kth-smallest-bst','M', 'kth-smallest-element-in-a-bst'),
        Q('Lowest Common Ancestor of a BST',                        'b75-lca-bst',         'M', 'lowest-common-ancestor-of-a-binary-search-tree'),
        Q('Implement Trie (Prefix Tree)',                            'b75-trie',            'M', 'implement-trie-prefix-tree'),
        Q('Design Add and Search Words Data Structure',              'b75-add-search-words','M', 'design-add-and-search-words-data-structure'),
      ]},
    ],
  },
  {
    id: 'b75-s10', name: 'Heap', color: '#A78BFA',
    substeps: [{ id: 'b75-s10-1', name: 'Heap Problems', problems: [
      Q('Find Median from Data Stream', 'b75-median-stream', 'H', 'find-median-from-data-stream'),
      Q('Top K Frequent Elements',      'b75-top-k-freq',    'M', 'top-k-frequent-elements'),
    ]}],
  },
];

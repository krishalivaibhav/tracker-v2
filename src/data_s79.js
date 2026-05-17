// data_s79.js — Last Moment 79 (79 must-know problems before placement)
const Q = (t, s, d, lc = null) => ({ t, s, d, lc, gfg: null, desc: null, examples: null, type: null, done: false });

export const S79_STEPS = [
  {
    id: 's79-s1', name: 'Arrays & Hashing', color: '#6366F1',
    substeps: [{ id: 's79-s1-1', name: 'Core Array Problems', problems: [
      Q('Two Sum',                        's79-two-sum',         'E', 'two-sum'),
      Q('Group Anagrams',                 's79-group-anagrams',  'M', 'group-anagrams'),
      Q('Top K Frequent Elements',        's79-top-k-freq',      'M', 'top-k-frequent-elements'),
      Q('Product of Array Except Self',   's79-product-except',  'M', 'product-of-array-except-self'),
      Q('Valid Sudoku',                   's79-valid-sudoku',    'M', 'valid-sudoku'),
      Q('Longest Consecutive Sequence',   's79-longest-consec',  'M', 'longest-consecutive-sequence'),
      Q('Encode and Decode Strings',      's79-encode-decode',   'M', 'encode-and-decode-strings'),
      Q('Trapping Rain Water',            's79-trapping-rain',   'H', 'trapping-rain-water'),
    ]}],
  },
  {
    id: 's79-s2', name: 'Binary Search', color: '#8B5CF6',
    substeps: [{ id: 's79-s2-1', name: 'Binary Search Problems', problems: [
      Q('Binary Search',                           's79-binary-search',    'E', 'binary-search'),
      Q('Search a 2D Matrix',                      's79-search-2d',        'M', 'search-a-2d-matrix'),
      Q('Koko Eating Bananas',                     's79-koko',             'M', 'koko-eating-bananas'),
      Q('Find Minimum in Rotated Sorted Array',    's79-min-rotated',      'M', 'find-minimum-in-rotated-sorted-array'),
      Q('Search in Rotated Sorted Array',          's79-search-rotated',   'M', 'search-in-rotated-sorted-array'),
      Q('Time Based Key-Value Store',              's79-time-kv',          'M', 'time-based-key-value-store'),
      Q('Find K Closest Elements',                 's79-k-closest-elems',  'M', 'find-k-closest-elements'),
      Q('Median of Two Sorted Arrays',             's79-median-two-arrays','H', 'median-of-two-sorted-arrays'),
    ]}],
  },
  {
    id: 's79-s3', name: 'Linked List', color: '#14B8A6',
    substeps: [{ id: 's79-s3-1', name: 'Linked List Problems', problems: [
      Q('Reverse Linked List',               's79-rev-ll',          'E', 'reverse-linked-list'),
      Q('Merge Two Sorted Lists',            's79-merge-two',       'E', 'merge-two-sorted-lists'),
      Q('Reorder List',                      's79-reorder-list',    'M', 'reorder-list'),
      Q('Remove Nth Node From End of List',  's79-remove-nth',      'M', 'remove-nth-node-from-end-of-list'),
      Q('Copy List with Random Pointer',     's79-copy-random',     'M', 'copy-list-with-random-pointer'),
      Q('Merge K Sorted Lists',              's79-merge-k',         'H', 'merge-k-sorted-lists'),
    ]}],
  },
  {
    id: 's79-s4', name: 'Recursion & Backtracking', color: '#F59E0B',
    substeps: [{ id: 's79-s4-1', name: 'Backtracking Problems', problems: [
      Q('Subsets',          's79-subsets',     'M', 'subsets'),
      Q('Combination Sum',  's79-combo-sum',   'M', 'combination-sum'),
      Q('Permutations',     's79-perms',       'M', 'permutations'),
      Q('Subsets II',       's79-subsets-2',   'M', 'subsets-ii'),
      Q('Combination Sum II','s79-combo-sum-2','M', 'combination-sum-ii'),
      Q('Word Search',      's79-word-search', 'M', 'word-search'),
    ]}],
  },
  {
    id: 's79-s5', name: 'Stacks & Queues', color: '#EF4444',
    substeps: [{ id: 's79-s5-1', name: 'Stack & Queue Problems', problems: [
      Q('Valid Parentheses',                   's79-valid-parens',   'E', 'valid-parentheses'),
      Q('Min Stack',                           's79-min-stack',      'M', 'min-stack'),
      Q('Evaluate Reverse Polish Notation',    's79-eval-rpn',       'M', 'evaluate-reverse-polish-notation'),
      Q('Generate Parentheses',               's79-gen-parens',     'M', 'generate-parentheses'),
      Q('Daily Temperatures',                  's79-daily-temps',    'M', 'daily-temperatures'),
      Q('Largest Rectangle in Histogram',      's79-largest-rect',   'H', 'largest-rectangle-in-histogram'),
    ]}],
  },
  {
    id: 's79-s6', name: 'Heaps', color: '#A78BFA',
    substeps: [{ id: 's79-s6-1', name: 'Heap Problems', problems: [
      Q('Kth Largest Element in a Stream', 's79-kth-largest-stream', 'E', 'kth-largest-element-in-a-stream'),
      Q('K Closest Points to Origin',      's79-k-closest-points',   'M', 'k-closest-points-to-origin'),
      Q('Find Median from Data Stream',    's79-median-stream',       'H', 'find-median-from-data-stream'),
    ]}],
  },
  {
    id: 's79-s7', name: 'Trees (BT + BST)', color: '#84CC16',
    substeps: [
      { id: 's79-s7-1', name: 'Binary Tree', problems: [
        Q('Invert Binary Tree',                 's79-invert-bt',        'E', 'invert-binary-tree'),
        Q('Maximum Depth of Binary Tree',       's79-max-depth-bt',     'E', 'maximum-depth-of-binary-tree'),
        Q('Diameter of Binary Tree',            's79-diameter-bt',      'E', 'diameter-of-binary-tree'),
        Q('Balanced Binary Tree',               's79-balanced-bt',      'E', 'balanced-binary-tree'),
        Q('Same Tree',                          's79-same-tree',        'E', 'same-tree'),
        Q('Subtree of Another Tree',            's79-subtree',          'E', 'subtree-of-another-tree'),
        Q('Binary Tree Level Order Traversal',  's79-level-order',      'M', 'binary-tree-level-order-traversal'),
        Q('Binary Tree Right Side View',        's79-right-side-view',  'M', 'binary-tree-right-side-view'),
      ]},
      { id: 's79-s7-2', name: 'BST', problems: [
        Q('Lowest Common Ancestor of BST', 's79-lca-bst',       'M', 'lowest-common-ancestor-of-a-binary-search-tree'),
        Q('Validate Binary Search Tree',   's79-validate-bst',  'M', 'validate-binary-search-tree'),
        Q('Kth Smallest in BST',           's79-kth-smallest',  'M', 'kth-smallest-element-in-a-bst'),
      ]},
    ],
  },
  {
    id: 's79-s8', name: 'Graphs', color: '#10B981',
    substeps: [{ id: 's79-s8-1', name: 'Graph Problems', problems: [
      Q('Number of Islands',                                    's79-num-islands',         'M', 'number-of-islands'),
      Q('Clone Graph',                                          's79-clone-graph',         'M', 'clone-graph'),
      Q('Max Area of Island',                                   's79-max-area-island',     'M', 'max-area-of-island'),
      Q('Pacific Atlantic Water Flow',                          's79-pacific-atlantic',    'M', 'pacific-atlantic-water-flow'),
      Q('Surrounded Regions',                                   's79-surrounded-regions',  'M', 'surrounded-regions'),
      Q('Rotting Oranges',                                      's79-rotting-oranges',     'M', 'rotting-oranges'),
      Q('Walls and Gates',                                      's79-walls-gates',         'M', 'walls-and-gates'),
      Q('Course Schedule',                                      's79-course-schedule',     'M', 'course-schedule'),
      Q('Course Schedule II',                                   's79-course-schedule-2',   'M', 'course-schedule-ii'),
      Q('Redundant Connection',                                 's79-redundant-conn',      'M', 'redundant-connection'),
      Q('Word Ladder',                                          's79-word-ladder',         'H', 'word-ladder'),
      Q('Number of Connected Components in Undirected Graph',   's79-num-connected',       'M', 'number-of-connected-components-in-an-undirected-graph'),
    ]}],
  },
  {
    id: 's79-s9', name: 'Dynamic Programming', color: '#F97316',
    substeps: [
      { id: 's79-s9-1', name: '1D DP', problems: [
        Q('Climbing Stairs',                'bs79-climb-stairs',    'E', 'climbing-stairs'),
        Q('Min Cost Climbing Stairs',       's79-min-cost-stairs',  'E', 'min-cost-climbing-stairs'),
        Q('House Robber',                   's79-house-robber',     'M', 'house-robber'),
        Q('House Robber II',                's79-house-robber-2',   'M', 'house-robber-ii'),
        Q('Decode Ways',                    's79-decode-ways',      'M', 'decode-ways'),
        Q('Jump Game',                      's79-jump-game',        'M', 'jump-game'),
      ]},
      { id: 's79-s9-2', name: '2D / Advanced DP', problems: [
        Q('Longest Palindromic Substring',  's79-longest-pal',      'M', 'longest-palindromic-substring'),
        Q('Palindromic Substrings',         's79-pal-substrs',      'M', 'palindromic-substrings'),
        Q('Coin Change',                    's79-coin-change',      'M', 'coin-change'),
        Q('Maximum Product Subarray',       's79-max-product',      'M', 'maximum-product-subarray'),
        Q('Word Break',                     's79-word-break',       'M', 'word-break'),
        Q('Longest Increasing Subsequence', 's79-lis',              'M', 'longest-increasing-subsequence'),
      ]},
    ],
  },
  {
    id: 's79-s10', name: 'Tries', color: '#EC4899',
    substeps: [{ id: 's79-s10-1', name: 'Trie Problems', problems: [
      Q('Implement Trie (Prefix Tree)',                   's79-trie',            'M', 'implement-trie-prefix-tree'),
      Q('Design Add and Search Words Data Structure',     's79-add-search-words','M', 'design-add-and-search-words-data-structure'),
      Q('Word Search II',                                 's79-word-search-2',   'H', 'word-search-ii'),
    ]}],
  },
  {
    id: 's79-s11', name: 'String', color: '#06B6D4',
    substeps: [{ id: 's79-s11-1', name: 'Sliding Window Strings', problems: [
      Q('Longest Substring Without Repeating Characters', 's79-longest-substr',   'M', 'longest-substring-without-repeating-characters'),
      Q('Longest Repeating Character Replacement',        's79-char-replacement', 'M', 'longest-repeating-character-replacement'),
      Q('Minimum Window Substring',                       's79-min-window',       'H', 'minimum-window-substring'),
      Q('Valid Anagram',                                  's79-valid-anagram',    'E', 'valid-anagram'),
    ]}],
  },
];

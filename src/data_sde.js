// data_sde.js — SDE Interview Sheet (191 problems)
// Top coding interview problems organized by topic
const Q = (t, s, d, lc = null) => ({ t, s, d, lc, gfg: null, desc: null, examples: null, type: null, done: false });

export const SDE_STEPS = [
  /* ── Arrays I ── */
  {
    id: 'sde-s1', name: 'Arrays I', color: '#6366F1',
    substeps: [{ id: 'sde-s1-1', name: 'Array Basics', problems: [
      Q('Set Matrix Zeroes',                      'sde-set-matrix-zero',    'M', 'set-matrix-zeroes'),
      Q("Pascal's Triangle",                      'sde-pascals-triangle',   'E', 'pascals-triangle'),
      Q('Next Permutation',                       'sde-next-permutation',   'M', 'next-permutation'),
      Q('Maximum Subarray (Kadane\'s)',            'sde-kadane',             'M', 'maximum-subarray'),
      Q('Sort Colors (Dutch Flag)',                'sde-sort-colors',        'M', 'sort-colors'),
      Q('Best Time to Buy and Sell Stock',        'sde-buy-sell',           'E', 'best-time-to-buy-and-sell-stock'),
    ]}],
  },
  /* ── Arrays II ── */
  {
    id: 'sde-s2', name: 'Arrays II', color: '#7C3AED',
    substeps: [{ id: 'sde-s2-1', name: 'Intermediate Arrays', problems: [
      Q('Rotate Image',                           'sde-rotate-image',       'M', 'rotate-image'),
      Q('Merge Intervals',                        'sde-merge-intervals',    'M', 'merge-intervals'),
      Q('Merge Sorted Array',                     'sde-merge-sorted-arr',   'E', 'merge-sorted-array'),
      Q('Find the Duplicate Number',              'sde-find-duplicate',     'M', 'find-the-duplicate-number'),
      Q('Reverse Pairs',                          'sde-reverse-pairs',      'H', 'reverse-pairs'),
      Q('Set Mismatch',                           'sde-set-mismatch',       'E', 'set-mismatch'),
    ]}],
  },
  /* ── Arrays III ── */
  {
    id: 'sde-s3', name: 'Arrays III', color: '#4F46E5',
    substeps: [{ id: 'sde-s3-1', name: 'Advanced Arrays', problems: [
      Q('Search a 2D Matrix',                     'sde-search-2d',          'M', 'search-a-2d-matrix'),
      Q('Pow(x, n)',                              'sde-pow-x-n',            'M', 'powx-n'),
      Q('Majority Element',                       'sde-majority-1',         'E', 'majority-element'),
      Q('Majority Element II',                    'sde-majority-2',         'M', 'majority-element-ii'),
      Q('Unique Paths',                           'sde-unique-paths',       'M', 'unique-paths'),
      Q('Maximum Score from Performing Multiplication Ops', 'sde-max-score-ops', 'H', 'maximum-score-from-performing-multiplication-operations'),
    ]}],
  },
  /* ── Arrays IV ── */
  {
    id: 'sde-s4', name: 'Arrays IV', color: '#3730A3',
    substeps: [{ id: 'sde-s4-1', name: 'Array Mastery', problems: [
      Q('Two Sum',                                'sde-two-sum',            'E', 'two-sum'),
      Q('4Sum',                                   'sde-4sum',               'M', '4sum'),
      Q('Longest Consecutive Sequence',           'sde-longest-consec',     'M', 'longest-consecutive-sequence'),
      Q('Subarray Sum Equals K',                  'sde-subarray-sum-k',     'M', 'subarray-sum-equals-k'),
      Q('3Sum',                                   'sde-3sum',               'M', '3sum'),
      Q('Count Number of Texts',                  'sde-count-nice-pairs',   'M', 'count-number-of-texts'),
    ]}],
  },
  /* ── Linked List I ── */
  {
    id: 'sde-s5', name: 'Linked List I', color: '#0891B2',
    substeps: [{ id: 'sde-s5-1', name: 'LL Fundamentals', problems: [
      Q('Reverse Linked List',                    'sde-rev-ll',             'E', 'reverse-linked-list'),
      Q('Middle of the Linked List',              'sde-middle-ll',          'E', 'middle-of-the-linked-list'),
      Q('Merge Two Sorted Lists',                 'sde-merge-two-ll',       'E', 'merge-two-sorted-lists'),
      Q('Remove Nth Node From End of List',       'sde-remove-nth',         'M', 'remove-nth-node-from-end-of-list'),
      Q('Add Two Numbers',                        'sde-add-two-nums',       'M', 'add-two-numbers'),
      Q('Delete Node in a Linked List',           'sde-delete-node',        'M', 'delete-node-in-a-linked-list'),
    ]}],
  },
  /* ── Linked List II ── */
  {
    id: 'sde-s6', name: 'Linked List II', color: '#0E7490',
    substeps: [{ id: 'sde-s6-1', name: 'Advanced LL', problems: [
      Q('Intersection of Two Linked Lists',       'sde-ll-intersection',    'E', 'intersection-of-two-linked-lists'),
      Q('Linked List Cycle',                      'sde-ll-cycle',           'E', 'linked-list-cycle'),
      Q('Linked List Cycle II',                   'sde-ll-cycle-2',         'M', 'linked-list-cycle-ii'),
      Q('Reverse Nodes in k-Group',               'sde-reverse-k-group',    'H', 'reverse-nodes-in-k-group'),
      Q('Palindrome Linked List',                 'sde-ll-palindrome',      'E', 'palindrome-linked-list'),
      Q('Flatten a Multilevel Doubly Linked List','sde-flatten-ll',         'M', 'flatten-a-multilevel-doubly-linked-list'),
    ]}],
  },
  /* ── Linked List and Arrays ── */
  {
    id: 'sde-s7', name: 'Linked List and Arrays', color: '#155E75',
    substeps: [{ id: 'sde-s7-1', name: 'Mixed Problems', problems: [
      Q('Rotate List',                            'sde-rotate-list',        'M', 'rotate-list'),
      Q('Copy List with Random Pointer',          'sde-copy-random-ll',     'M', 'copy-list-with-random-pointer'),
      Q('Trapping Rain Water',                    'sde-trapping-rain',      'H', 'trapping-rain-water'),
      Q('Remove Duplicates from Sorted Array',    'sde-remove-dup-sorted',  'E', 'remove-duplicates-from-sorted-array'),
      Q('Max Consecutive Ones',                   'sde-max-consec-ones',    'E', 'max-consecutive-ones'),
      Q('Sliding Window Maximum',                 'sde-sliding-window-max', 'H', 'sliding-window-maximum'),
    ]}],
  },
  /* ── Greedy ── */
  {
    id: 'sde-s8', name: 'Greedy Algorithm', color: '#D97706',
    substeps: [{ id: 'sde-s8-1', name: 'Greedy Problems', problems: [
      Q('Non-overlapping Intervals',              'sde-non-overlap',        'M', 'non-overlapping-intervals'),
      Q('Jump Game',                              'sde-jump-game',          'M', 'jump-game'),
      Q('Jump Game II',                           'sde-jump-game-2',        'M', 'jump-game-ii'),
      Q('Gas Station',                            'sde-gas-station',        'M', 'gas-station'),
      Q('Candy',                                  'sde-candy',              'H', 'candy'),
      Q('Assign Cookies',                         'sde-assign-cookies',     'E', 'assign-cookies'),
    ]}],
  },
  /* ── Recursion ── */
  {
    id: 'sde-s9', name: 'Recursion', color: '#B45309',
    substeps: [{ id: 'sde-s9-1', name: 'Recursion Fundamentals', problems: [
      Q('Subsets',                                'sde-subsets',            'M', 'subsets'),
      Q('Subsets II',                             'sde-subsets-2',          'M', 'subsets-ii'),
      Q('Combination Sum',                        'sde-combo-sum',          'M', 'combination-sum'),
      Q('Combination Sum II',                     'sde-combo-sum-2',        'M', 'combination-sum-ii'),
      Q('Palindrome Partitioning',                'sde-palindrome-part',    'M', 'palindrome-partitioning'),
      Q('Permutation Sequence',                   'sde-perm-seq',           'H', 'permutation-sequence'),
    ]}],
  },
  /* ── Recursion and Backtracking ── */
  {
    id: 'sde-s10', name: 'Recursion and Backtracking', color: '#92400E',
    substeps: [{ id: 'sde-s10-1', name: 'Backtracking', problems: [
      Q('Combination Sum III',                    'sde-combo-sum-3',        'M', 'combination-sum-iii'),
      Q('Letter Combinations of Phone Number',    'sde-letter-combos',      'M', 'letter-combinations-of-a-phone-number'),
      Q('Permutations',                           'sde-permutations',       'M', 'permutations'),
      Q('N-Queens',                               'sde-n-queens',           'H', 'n-queens'),
      Q('Sudoku Solver',                          'sde-sudoku-solver',      'H', 'sudoku-solver'),
      Q('Word Search',                            'sde-word-search',        'M', 'word-search'),
    ]}],
  },
  /* ── Binary Search ── */
  {
    id: 'sde-s11', name: 'Binary Search', color: '#047857',
    substeps: [{ id: 'sde-s11-1', name: 'Binary Search Problems', problems: [
      Q('Binary Search',                          'sde-binary-search',      'E', 'binary-search'),
      Q('Sqrt(x)',                                'sde-sqrt',               'E', 'sqrtx'),
      Q('Koko Eating Bananas',                    'sde-koko',               'M', 'koko-eating-bananas'),
      Q('Find Minimum in Rotated Sorted Array',   'sde-min-rotated',        'M', 'find-minimum-in-rotated-sorted-array'),
      Q('Single Element in a Sorted Array',       'sde-single-elem',        'M', 'single-element-in-a-sorted-array'),
      Q('Search in Rotated Sorted Array',         'sde-search-rotated',     'M', 'search-in-rotated-sorted-array'),
      Q('Median of Two Sorted Arrays',            'sde-median-two',         'H', 'median-of-two-sorted-arrays'),
      Q('Search a 2D Matrix II',                  'sde-search-2d-2',        'M', 'search-a-2d-matrix-ii'),
    ]}],
  },
  /* ── Heaps ── */
  {
    id: 'sde-s12', name: 'Heaps', color: '#065F46',
    substeps: [{ id: 'sde-s12-1', name: 'Heap Problems', problems: [
      Q('Kth Largest Element in an Array',        'sde-kth-largest',        'M', 'kth-largest-element-in-an-array'),
      Q('Find K Pairs with Smallest Sums',        'sde-k-pairs-smallest',   'M', 'find-k-pairs-with-smallest-sums'),
      Q('Find Median from Data Stream',           'sde-median-stream',      'H', 'find-median-from-data-stream'),
      Q('Merge K Sorted Lists',                   'sde-merge-k-lists',      'H', 'merge-k-sorted-lists'),
      Q('Top K Frequent Elements',                'sde-top-k-freq',         'M', 'top-k-frequent-elements'),
      Q('K Closest Points to Origin',             'sde-k-closest-pts',      'M', 'k-closest-points-to-origin'),
    ]}],
  },
  /* ── Stack and Queue I ── */
  {
    id: 'sde-s13', name: 'Stack and Queue', color: '#EF4444',
    substeps: [{ id: 'sde-s13-1', name: 'Stack & Queue Fundamentals', problems: [
      Q('Implement Stack using Queues',           'sde-stack-queue',        'E', 'implement-stack-using-queues'),
      Q('Implement Queue using Stacks',           'sde-queue-stack',        'E', 'implement-queue-using-stacks'),
      Q('Min Stack',                              'sde-min-stack',          'M', 'min-stack'),
      Q('Next Greater Element I',                 'sde-next-greater-1',     'E', 'next-greater-element-i'),
      Q('Next Greater Element II',                'sde-next-greater-2',     'M', 'next-greater-element-ii'),
      Q('Asteroid Collision',                     'sde-asteroid-coll',      'M', 'asteroid-collision'),
      Q('Valid Parentheses',                      'sde-valid-parens',       'E', 'valid-parentheses'),
    ]}],
  },
  /* ── Stack and Queue II ── */
  {
    id: 'sde-s14', name: 'Stack and Queue II', color: '#DC2626',
    substeps: [{ id: 'sde-s14-1', name: 'Advanced Stack & Queue', problems: [
      Q('Sliding Window Maximum',                 'sde-slide-max',          'H', 'sliding-window-maximum'),
      Q('Largest Rectangle in Histogram',         'sde-largest-rect',       'H', 'largest-rectangle-in-histogram'),
      Q('Maximal Rectangle',                      'sde-maximal-rect',       'H', 'maximal-rectangle'),
      Q('Trapping Rain Water (Stack)',             'sde-trap-rain-stack',    'H', 'trapping-rain-water'),
      Q('Daily Temperatures',                     'sde-daily-temps',        'M', 'daily-temperatures'),
      Q('Sum of Subarray Minimums',               'sde-subarray-min-sum',   'M', 'sum-of-subarray-minimums'),
      Q('Online Stock Span',                      'sde-stock-span',         'M', 'online-stock-span'),
      Q('Remove K Digits',                        'sde-remove-k-digits',    'M', 'remove-k-digits'),
      Q('132 Pattern',                            'sde-132-pattern',        'M', '132-pattern'),
      Q('Number of Visible People in a Queue',    'sde-visible-people',     'H', 'number-of-visible-people-in-a-queue'),
    ]}],
  },
  /* ── String I ── */
  {
    id: 'sde-s15', name: 'String I', color: '#7C3AED',
    substeps: [{ id: 'sde-s15-1', name: 'String Fundamentals', problems: [
      Q('Reverse Words in a String',              'sde-rev-words',          'M', 'reverse-words-in-a-string'),
      Q('Longest Palindromic Substring',          'sde-longest-pal',        'M', 'longest-palindromic-substring'),
      Q('Roman to Integer',                       'sde-roman-to-int',       'E', 'roman-to-integer'),
      Q('Integer to Roman',                       'sde-int-to-roman',       'M', 'integer-to-roman'),
      Q('Implement strStr()',                      'sde-strstr',             'E', 'find-the-index-of-the-first-occurrence-in-a-string'),
      Q('Longest Common Prefix',                  'sde-longest-prefix',     'E', 'longest-common-prefix'),
    ]}],
  },
  /* ── String II ── */
  {
    id: 'sde-s16', name: 'String II', color: '#6D28D9',
    substeps: [{ id: 'sde-s16-1', name: 'Advanced Strings', problems: [
      Q('Minimum Window Substring',               'sde-min-window',         'H', 'minimum-window-substring'),
      Q('Valid Anagram',                          'sde-valid-anagram',      'E', 'valid-anagram'),
      Q('Rabin-Karp / KMP Pattern Matching',      'sde-pattern-match',      'H', 'find-the-index-of-the-first-occurrence-in-a-string'),
      Q('Longest Repeating Character Replacement','sde-char-replace',       'M', 'longest-repeating-character-replacement'),
      Q('Group Anagrams',                         'sde-group-anagrams',     'M', 'group-anagrams'),
      Q('Encode and Decode Strings',              'sde-encode-decode',      'M', 'encode-and-decode-strings'),
    ]}],
  },
  /* ── Binary Tree I ── */
  {
    id: 'sde-s17', name: 'Binary Tree I', color: '#16A34A',
    substeps: [{ id: 'sde-s17-1', name: 'BT Traversals', problems: [
      Q('Binary Tree Inorder Traversal',          'sde-bt-inorder',         'E', 'binary-tree-inorder-traversal'),
      Q('Binary Tree Preorder Traversal',         'sde-bt-preorder',        'E', 'binary-tree-preorder-traversal'),
      Q('Binary Tree Postorder Traversal',        'sde-bt-postorder',       'E', 'binary-tree-postorder-traversal'),
      Q('Morris Traversal (Inorder without stack)','sde-morris-inorder',    'M', 'binary-tree-inorder-traversal'),
      Q('Binary Tree Level Order Traversal',      'sde-level-order',        'M', 'binary-tree-level-order-traversal'),
      Q('Binary Tree Right Side View',            'sde-right-side-view',    'M', 'binary-tree-right-side-view'),
      Q('Binary Tree Zigzag Level Order',         'sde-zigzag-level',       'M', 'binary-tree-zigzag-level-order-traversal'),
      Q('Vertical Order Traversal',               'sde-vertical-order',     'H', 'vertical-order-traversal-of-a-binary-tree'),
      Q('Top View of Binary Tree',                'sde-top-view-bt',        'M', null),
      Q('Bottom View of Binary Tree',             'sde-bottom-view-bt',     'M', null),
      Q('Boundary Traversal',                     'sde-boundary-trav',      'M', 'boundary-of-binary-tree'),
      Q('Maximum Width of Binary Tree',           'sde-max-width-bt',       'M', 'maximum-width-of-binary-tree'),
    ]}],
  },
  /* ── Binary Tree II ── */
  {
    id: 'sde-s18', name: 'Binary Tree II', color: '#15803D',
    substeps: [{ id: 'sde-s18-1', name: 'BT Properties', problems: [
      Q('Maximum Depth of Binary Tree',           'sde-max-depth-bt',       'E', 'maximum-depth-of-binary-tree'),
      Q('Balanced Binary Tree',                   'sde-balanced-bt',        'E', 'balanced-binary-tree'),
      Q('Diameter of Binary Tree',                'sde-diameter-bt',        'E', 'diameter-of-binary-tree'),
      Q('Maximum Path Sum',                       'sde-max-path-sum',       'H', 'binary-tree-maximum-path-sum'),
      Q('Lowest Common Ancestor of Binary Tree',  'sde-lca-bt',             'M', 'lowest-common-ancestor-of-a-binary-tree'),
      Q('Same Tree',                              'sde-same-tree',          'E', 'same-tree'),
      Q('Symmetric Tree',                         'sde-symmetric-tree',     'E', 'symmetric-tree'),
      Q('Path Sum II',                            'sde-path-sum-2',         'M', 'path-sum-ii'),
    ]}],
  },
  /* ── Binary Tree III ── */
  {
    id: 'sde-s19', name: 'Binary Tree III', color: '#166534',
    substeps: [{ id: 'sde-s19-1', name: 'BT Advanced', problems: [
      Q('Construct BT from Preorder and Inorder', 'sde-construct-pre-in',   'M', 'construct-binary-tree-from-preorder-and-inorder-traversal'),
      Q('Construct BT from Inorder and Postorder','sde-construct-in-post',  'M', 'construct-binary-tree-from-inorder-and-postorder-traversal'),
      Q('Serialize and Deserialize Binary Tree',  'sde-serialize-bt',       'H', 'serialize-and-deserialize-binary-tree'),
      Q('Flatten Binary Tree to Linked List',     'sde-flatten-bt',         'M', 'flatten-binary-tree-to-linked-list'),
      Q('Count Complete Tree Nodes',              'sde-count-complete',     'E', 'count-complete-tree-nodes'),
      Q('Binary Tree Cameras',                    'sde-bt-cameras',         'H', 'binary-tree-cameras'),
      Q('All Nodes Distance K in Binary Tree',    'sde-nodes-dist-k',       'M', 'all-nodes-distance-k-in-binary-tree'),
    ]}],
  },
  /* ── BST I ── */
  {
    id: 'sde-s20', name: 'Binary Search Tree I', color: '#14532D',
    substeps: [{ id: 'sde-s20-1', name: 'BST Fundamentals', problems: [
      Q('Search in BST',                          'sde-search-bst',         'E', 'search-in-a-binary-search-tree'),
      Q('Insert into BST',                        'sde-insert-bst',         'M', 'insert-into-a-binary-search-tree'),
      Q('Delete Node in BST',                     'sde-delete-bst',         'M', 'delete-node-in-a-bst'),
      Q('Validate Binary Search Tree',            'sde-validate-bst',       'M', 'validate-binary-search-tree'),
      Q('Lowest Common Ancestor of BST',          'sde-lca-bst',            'M', 'lowest-common-ancestor-of-a-binary-search-tree'),
      Q('Kth Smallest Element in BST',            'sde-kth-smallest-bst',   'M', 'kth-smallest-element-in-a-bst'),
      Q('BST Iterator',                           'sde-bst-iterator',       'M', 'binary-search-tree-iterator'),
    ]}],
  },
  /* ── BST II ── */
  {
    id: 'sde-s21', name: 'Binary Search Tree II', color: '#713F12',
    substeps: [{ id: 'sde-s21-1', name: 'Advanced BST', problems: [
      Q('Two Sum IV (Input is BST)',               'sde-two-sum-bst',        'E', 'two-sum-iv-input-is-a-bst'),
      Q('Recover Binary Search Tree',             'sde-recover-bst',        'M', 'recover-binary-search-tree'),
      Q('Largest BST Subtree',                    'sde-largest-bst',        'M', 'largest-bst-subtree'),
      Q('Serialize and Deserialize BST',          'sde-serialize-bst',      'M', 'serialize-and-deserialize-bst'),
      Q('Convert BST to Greater Tree',            'sde-bst-greater-tree',   'M', 'convert-bst-to-greater-tree'),
      Q('Balance a Binary Search Tree',           'sde-balance-bst',        'M', 'balance-a-binary-search-tree'),
      Q('Construct BST from Preorder Traversal',  'sde-bst-from-preorder',  'M', 'construct-binary-search-tree-from-preorder-traversal'),
      Q('Merge Two BSTs',                         'sde-merge-two-bst',      'H', null),
    ]}],
  },
  /* ── Binary Trees Miscellaneous ── */
  {
    id: 'sde-s22', name: 'Binary Trees Miscellaneous', color: '#78350F',
    substeps: [{ id: 'sde-s22-1', name: 'Tree Misc', problems: [
      Q('Invert Binary Tree',                     'sde-invert-bt',          'E', 'invert-binary-tree'),
      Q('Subtree of Another Tree',                'sde-subtree',            'E', 'subtree-of-another-tree'),
      Q('Count Good Nodes in Binary Tree',        'sde-good-nodes',         'M', 'count-good-nodes-in-binary-tree'),
      Q('Path Sum',                               'sde-path-sum',           'E', 'path-sum'),
      Q('Sum Root to Leaf Numbers',               'sde-sum-root-leaf',      'M', 'sum-root-to-leaf-numbers'),
      Q('Time Needed to Inform All Employees',    'sde-inform-employees',   'M', 'time-needed-to-inform-all-employees'),
    ]}],
  },
  /* ── Graph I ── */
  {
    id: 'sde-s23', name: 'Graph', color: '#065F46',
    substeps: [{ id: 'sde-s23-1', name: 'Graph Fundamentals', problems: [
      Q('Number of Islands',                      'sde-num-islands',        'M', 'number-of-islands'),
      Q('Clone Graph',                            'sde-clone-graph',        'M', 'clone-graph'),
      Q('Pacific Atlantic Water Flow',            'sde-pacific-atlantic',   'M', 'pacific-atlantic-water-flow'),
      Q('Course Schedule',                        'sde-course-schedule',    'M', 'course-schedule'),
      Q('Course Schedule II',                     'sde-course-sched-2',     'M', 'course-schedule-ii'),
      Q('Number of Connected Components',         'sde-num-components',     'M', 'number-of-connected-components-in-an-undirected-graph'),
      Q('Graph Valid Tree',                       'sde-graph-valid-tree',   'M', 'graph-valid-tree'),
      Q('Redundant Connection',                   'sde-redundant-conn',     'M', 'redundant-connection'),
      Q('Rotting Oranges',                        'sde-rotting-oranges',    'M', 'rotting-oranges'),
      Q('Walls and Gates',                        'sde-walls-gates',        'M', 'walls-and-gates'),
      Q('Surrounded Regions',                     'sde-surrounded',         'M', 'surrounded-regions'),
      Q('Max Area of Island',                     'sde-max-area-island',    'M', 'max-area-of-island'),
    ]}],
  },
  /* ── Graph II ── */
  {
    id: 'sde-s24', name: 'Graph II', color: '#064E3B',
    substeps: [{ id: 'sde-s24-1', name: 'Advanced Graphs', problems: [
      Q('Word Ladder',                            'sde-word-ladder',        'H', 'word-ladder'),
      Q('Word Ladder II',                         'sde-word-ladder-2',      'H', 'word-ladder-ii'),
      Q('Network Delay Time (Dijkstra)',           'sde-network-delay',      'M', 'network-delay-time'),
      Q('Cheapest Flights Within K Stops',        'sde-cheapest-flights',   'M', 'cheapest-flights-within-k-stops'),
      Q('Find Critical and Pseudo-Critical Edges','sde-critical-edges',     'H', 'find-critical-and-pseudo-critical-edges-in-minimum-spanning-tree'),
      Q('Reconstruct Itinerary',                  'sde-reconstruct-itin',   'H', 'reconstruct-itinerary'),
    ]}],
  },
  /* ── DP I ── */
  {
    id: 'sde-s25', name: 'Dynamic Programming I', color: '#F97316',
    substeps: [{ id: 'sde-s25-1', name: '1D DP', problems: [
      Q('Climbing Stairs',                        'sde-climbing-stairs',    'E', 'climbing-stairs'),
      Q('House Robber',                           'sde-house-robber',       'M', 'house-robber'),
      Q('House Robber II',                        'sde-house-robber-2',     'M', 'house-robber-ii'),
      Q('Decode Ways',                            'sde-decode-ways',        'M', 'decode-ways'),
      Q('Jump Game',                              'sde-dp-jump-game',       'M', 'jump-game'),
      Q('Partition Equal Subset Sum',             'sde-partition-subset',   'M', 'partition-equal-subset-sum'),
      Q('Word Break',                             'sde-word-break',         'M', 'word-break'),
    ]}],
  },
  /* ── DP II ── */
  {
    id: 'sde-s26', name: 'Dynamic Programming II', color: '#EA580C',
    substeps: [{ id: 'sde-s26-1', name: '2D / Sequence DP', problems: [
      Q('Unique Paths II',                        'sde-unique-paths-2',     'M', 'unique-paths-ii'),
      Q('Coin Change',                            'sde-coin-change',        'M', 'coin-change'),
      Q('Longest Increasing Subsequence',         'sde-lis',                'M', 'longest-increasing-subsequence'),
      Q('Longest Common Subsequence',             'sde-lcs',                'M', 'longest-common-subsequence'),
      Q('Edit Distance',                          'sde-edit-distance',      'M', 'edit-distance'),
      Q('Maximal Square',                         'sde-maximal-square',     'M', 'maximal-square'),
      Q('Burst Balloons',                         'sde-burst-balloons',     'H', 'burst-balloons'),
      Q('Distinct Subsequences',                  'sde-distinct-subseqs',   'H', 'distinct-subsequences'),
    ]}],
  },
  /* ── Trie ── */
  {
    id: 'sde-s27', name: 'Trie', color: '#9333EA',
    substeps: [{ id: 'sde-s27-1', name: 'Trie Problems', problems: [
      Q('Implement Trie (Prefix Tree)',            'sde-trie',               'M', 'implement-trie-prefix-tree'),
      Q('Design Add and Search Words DS',         'sde-add-search-words',   'M', 'design-add-and-search-words-data-structure'),
      Q('Word Search II',                         'sde-word-search-2',      'H', 'word-search-ii'),
      Q('Replace Words',                          'sde-replace-words',      'M', 'replace-words'),
      Q('Map Sum Pairs',                          'sde-map-sum',            'M', 'map-sum-pairs'),
      Q('Longest Word in Dictionary',             'sde-longest-word',       'M', 'longest-word-in-dictionary'),
      Q('Index Pairs of a String',                'sde-index-pairs',        'E', 'index-pairs-of-a-string'),
    ]}],
  },
];

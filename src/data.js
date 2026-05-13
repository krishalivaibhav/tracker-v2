// data.js — Striver's A2Z DSA Sheet (474 problems)
// Q(title, slug, difficulty, lcSlug, gfgUrl, desc, examples, type)
// type: 'number'|'array'|'string'|'pattern'|'custom' — used for starter-code generation

const Q = (t, s, d, lc = null, gfg = null, desc = null, examples = null, type = null) =>
  ({ t, s, d, lc, gfg, desc, examples, type, done: false });

const A2Z_STEPS = [
  /* ─────────────── STEP 1 · Learn the Basics (54) ─────────────── */
  {
    id: 'step1', name: 'Learn the Basics', color: '#6366F1',
    substeps: [
      {
        id: 's1-1', name: 'Things to Know in C++/Java/Python',
        problems: [
          Q('User Input / Output','basics-io','E',null,null,'Read two integers A and B. Print their sum on one line.',
            [{input:'3 5',output:'8'},{input:'100 200',output:'300'}],'number'),
          Q('Data Types','basics-datatypes','E',null,null,'Read a float and an int. Print the float divided by the int rounded to 2 decimal places.',
            [{input:'7.0 2',output:'3.50'},{input:'10.0 4',output:'2.50'}],'custom'),
          Q('If-Else Statements','basics-ifelse','E',null,null,'Read an integer N. Print "Positive" if N>0, "Negative" if N<0, else "Zero".',
            [{input:'5',output:'Positive'},{input:'-3',output:'Negative'},{input:'0',output:'Zero'}],'number'),
          Q('Switch Statement','basics-switch','E',null,null,'Read an integer N (1-7). Print the corresponding day of the week (1=Monday … 7=Sunday). Print "Invalid" for other values.',
            [{input:'1',output:'Monday'},{input:'7',output:'Sunday'},{input:'8',output:'Invalid'}],'number'),
          Q('What are Arrays & Strings','basics-arrays-strings','E',null,null,'Read N integers into an array. Print the array in reverse order on one line.',
            [{input:'5\n1 2 3 4 5',output:'5 4 3 2 1'}],'array'),
          Q('For Loops','basics-forloop','E',null,null,'Read an integer N. Print the multiplication table of N (N×1 through N×10), one per line.',
            [{input:'3',output:'3\n6\n9\n12\n15\n18\n21\n24\n27\n30'}],'number'),
          Q('While Loops','basics-whileloop','E',null,null,'Read an integer N. Print all even numbers from 2 to N inclusive.',
            [{input:'10',output:'2\n4\n6\n8\n10'}],'number'),
          Q('Functions (Pass by Value & Reference)','basics-functions','E',null,null,'Read N integers. Using a function, find and print the maximum element.',
            [{input:'5\n3 1 4 1 5',output:'5'},{input:'3\n7 2 9',output:'9'}],'array'),
          Q('Time Complexity Basics','basics-timecomplexity','E',null,null,'Read N. Print the sum of the first N natural numbers without using a loop (use the formula N*(N+1)/2).',
            [{input:'10',output:'55'},{input:'100',output:'5050'}],'number'),
        ]
      },
      {
        id: 's1-2', name: 'Build-up Logical Thinking (Patterns)',
        problems: [
          Q('Pattern 1: Rectangular Star Pattern','pat-1','E',null,null,'Read N. Print an N×N rectangle of * characters.',
            [{input:'3',output:'***\n***\n***'},{input:'4',output:'****\n****\n****\n****'}],'pattern'),
          Q('Pattern 2: Right-Angled Triangle','pat-2','E',null,null,'Read N. Print a right-angled triangle where row i has i stars (i from 1 to N).',
            [{input:'4',output:'*\n**\n***\n****'}],'pattern'),
          Q('Pattern 3: Right-Angled Number Pyramid','pat-3','E',null,null,'Read N. Print a right-angled triangle where row i contains numbers 1 to i.',
            [{input:'4',output:'1\n12\n123\n1234'}],'pattern'),
          Q('Pattern 4: Number Pyramid II','pat-4','E',null,null,'Read N. Print a right-angled triangle where row i contains the number i repeated i times.',
            [{input:'4',output:'1\n22\n333\n4444'}],'pattern'),
          Q('Pattern 5: Inverted Right Pyramid','pat-5','E',null,null,'Read N. Print an inverted right-angled triangle — row 1 has N stars, row 2 has N-1, …, row N has 1.',
            [{input:'4',output:'****\n***\n**\n*'}],'pattern'),
          Q('Pattern 6: Inverted Numbered Pyramid','pat-6','E',null,null,'Read N. Inverted triangle where row i has numbers 1..(N-i+1).',
            [{input:'4',output:'1234\n123\n12\n1'}],'pattern'),
          Q('Pattern 7: Star Triangle','pat-7','E',null,null,'Read N. Print a centred star triangle of N rows (spaces + stars).',
            [{input:'4',output:'   *\n  ***\n *****\n*******'}],'pattern'),
          Q('Pattern 8: Reverse Star Triangle','pat-8','E',null,null,'Read N. Print an inverted centred star triangle.',
            [{input:'4',output:'*******\n *****\n  ***\n   *'}],'pattern'),
          Q('Pattern 9: Diamond Star Pattern','pat-9','E',null,null,'Read N. Print a full diamond of height 2N-1.',
            [{input:'3',output:'  *\n ***\n*****\n ***\n  *'}],'pattern'),
          Q('Pattern 10: Half Diamond','pat-10','E',null,null,'Read N. Print a half diamond — stars increase then decrease.',
            [{input:'3',output:'*\n**\n***\n**\n*'}],'pattern'),
          Q('Pattern 11: Binary Triangle','pat-11','E',null,null,'Read N. Print triangle where each cell is 1 if (row+col) is even else 0.',
            [{input:'4',output:'1\n01\n101\n0101'}],'pattern'),
          Q('Pattern 12: Number Crown Pattern','pat-12','E',null,null,'Read N. For each row i: print i, then spaces 2*(N-i), then i again.',
            [{input:'3',output:'1    1\n12  21\n123321'}],'pattern'),
          Q('Pattern 13: Increasing Number Triangle','pat-13','E',null,null,'Read N. Print triangle with consecutive numbers starting from 1, filling rows.',
            [{input:'4',output:'1\n2 3\n4 5 6\n7 8 9 10'}],'pattern'),
          Q('Pattern 14: Increasing Letter Triangle','pat-14','E',null,null,'Read N. Print triangle with letters starting at A, filling rows.',
            [{input:'4',output:'A\nAB\nABC\nABCD'}],'pattern'),
          Q('Pattern 15: Reverse Letter Triangle','pat-15','E',null,null,'Read N. Inverted triangle of letters: row 1 has A..N, row 2 has A..(N-1), etc.',
            [{input:'4',output:'ABCD\nABC\nAB\nA'}],'pattern'),
          Q('Pattern 16: Alpha-Ramp Pattern','pat-16','E',null,null,'Read N. Row i contains the letter at position i repeated i times.',
            [{input:'4',output:'A\nBB\nCCC\nDDDD'}],'pattern'),
          Q('Pattern 17: Alpha-Hill Pattern','pat-17','E',null,null,'Read N. Centred hill pattern with letters: A at top, row i has letters A..chr(A+i-1)..A.',
            [{input:'3',output:'  A\n ABA\nABCBA'}],'pattern'),
          Q('Pattern 18: Alpha-Triangle','pat-18','E',null,null,'Read N. Each row i (1-indexed): first letter of row i is chr(A+N-i), filling to N characters in ascending order.',
            [{input:'4',output:'ABC D\nBC D\nC D\nD'}],'pattern'),
          Q('Pattern 19: Symmetric-Void Pattern','pat-19','E',null,null,'Read N. Print a symmetric star pattern with a void (empty) centre.',
            [{input:'4',output:'********\n***  ***\n**    **\n*      *\n*      *\n**    **\n***  ***\n********'}],'pattern'),
          Q('Pattern 20: Sandglass Pattern','pat-20','E',null,null,'Read N. Print a star sandglass (full top row decreasing, then increasing back).',
            [{input:'4',output:'*******\n *****\n  ***\n   *\n  ***\n *****\n*******'}],'pattern'),
          Q('Pattern 21: Number Pattern','pat-21','E',null,null,'Read N. For each row (0..N-1), print: for each col (0..2N-1) print min(row, col, N-1-row, 2N-1-col)+1.',
            [{input:'4',output:'1111111\n1222221\n1223221\n1222221\n1111111'}],'pattern'),
          Q('Pattern 22: Spiral Letter Pattern','pat-22','E',null,null,'Read N. Print an N×N matrix filled with letters in spiral order starting from A.',
            [{input:'3',output:'ABC\nHIG\nDEF'}],'pattern'),
        ]
      },
      {
        id: 's1-3', name: 'Learn STL / Java Collections / Python',
        problems: [
          Q('Sorting using STL / Built-ins','stl-sort','E',null,null,'Read N integers. Sort them in ascending order and print. (Practice using language built-in sort.)',
            [{input:'5\n3 1 4 1 5',output:'1 1 3 4 5'}],'array'),
          Q('Pairs and Tuples','stl-pairs','E',null,null,'Read N pairs of integers. Sort by first element; if equal sort by second. Print sorted pairs.',
            [{input:'3\n1 3\n2 1\n1 2',output:'1 2\n1 3\n2 1'}],'custom'),
          Q('Maps and Frequency Count','stl-maps','E',null,null,'Read N integers. For each unique element print "element frequency" in sorted order of element.',
            [{input:'6\n1 2 2 3 1 2',output:'1 2\n2 3\n3 1'}],'array'),
        ]
      },
      {
        id: 's1-4', name: 'Know Basic Maths',
        problems: [
          Q('Count Digits','maths-count-digits','E',null,'https://www.geeksforgeeks.org/problems/count-digits5716/1','Count the number of digits in a positive integer N.',
            [{input:'12345',output:'5'},{input:'7',output:'1'}],'number'),
          Q('Reverse a Number','maths-reverse-number','E','reverse-integer',null),
          Q('Check Palindrome','maths-palindrome','E','palindrome-number',null),
          Q('GCD or HCF','maths-gcd','E',null,'https://www.geeksforgeeks.org/problems/lcm-and-gcd4516/1','Find GCD of two numbers A and B.',
            [{input:'12 8',output:'4'},{input:'100 75',output:'25'}],'custom'),
          Q('Armstrong Numbers','maths-armstrong','E',null,'https://www.geeksforgeeks.org/problems/armstrong-numbers2727/1','Check if a number is an Armstrong number (sum of each digit raised to the power of number of digits equals the number).',
            [{input:'153',output:'true'},{input:'10',output:'false'}],'number'),
          Q('Print All Divisors','maths-divisors','E',null,'https://www.geeksforgeeks.org/problems/all-divisors-of-a-number/1','Print all divisors of N in sorted order.',
            [{input:'12',output:'1 2 3 4 6 12'},{input:'7',output:'1 7'}],'number'),
          Q('Check for Prime','maths-prime','E',null,'https://www.geeksforgeeks.org/problems/prime-number2314/1','Check if a number N is prime.',
            [{input:'7',output:'Prime'},{input:'12',output:'Not Prime'}],'number'),
        ]
      },
      {
        id: 's1-5', name: 'Learn Basic Recursion',
        problems: [
          Q('Print 1 to N using Recursion','rec-1-to-n','E',null,'https://www.geeksforgeeks.org/problems/print-1-to-n-without-using-loops-1587115620/1','Print numbers from 1 to N using recursion (no loops).',
            [{input:'5',output:'1 2 3 4 5'}],'number'),
          Q('Print N to 1 using Recursion','rec-n-to-1','E',null,'https://www.geeksforgeeks.org/problems/print-n-to-1-without-loop/1','Print numbers from N to 1 using recursion.',
            [{input:'5',output:'5 4 3 2 1'}],'number'),
          Q('Sum of First N Numbers','rec-sum','E',null,null,'Find the sum of first N natural numbers using recursion.',
            [{input:'10',output:'55'},{input:'5',output:'15'}],'number'),
          Q('Factorial of N','rec-factorial','E',null,'https://www.geeksforgeeks.org/problems/find-all-factorial-numbers-less-than-or-equal-to-n3548/1','Find N! using recursion.',
            [{input:'5',output:'120'},{input:'0',output:'1'}],'number'),
          Q('Reverse an Array','rec-reverse-array','E',null,'https://www.geeksforgeeks.org/problems/reverse-an-array/1','Reverse an array using recursion (no extra array).',
            [{input:'5\n1 2 3 4 5',output:'5 4 3 2 1'}],'array'),
          Q('Check if String is Palindrome','rec-palindrome-string','E',null,null,'Check if a string is palindrome using recursion.',
            [{input:'racecar',output:'true'},{input:'hello',output:'false'}],'string'),
          Q('Fibonacci Number','fibonacci-number','E','fibonacci-number',null),
          Q('Sum of Digits','rec-sum-digits','E',null,null,'Find sum of digits of N using recursion.',
            [{input:'1234',output:'10'},{input:'99',output:'18'}],'number'),
        ]
      },
      {
        id: 's1-6', name: 'Learn Basic Hashing',
        problems: [
          Q('Count Frequency of Each Element','hash-freq-array','E',null,'https://www.geeksforgeeks.org/problems/frequency-of-array-elements-1587115620/1','Count and print the frequency of each element in an array.',
            [{input:'5\n1 2 2 3 1',output:'1->2\n2->2\n3->1'}],'array'),
          Q('Find Highest and Lowest Frequency','hash-hi-lo-freq','E',null,'https://www.geeksforgeeks.org/problems/find-the-highest-and-lowest-frequency-element/1','Find the element with highest frequency and the element with lowest frequency in an array.',
            [{input:'5\n1 2 2 3 1',output:'2 3'}],'array'),
          Q('Count Frequency of a Character','hash-char-freq','E',null,null,'Read a string S and a character C. Count how many times C appears in S.',
            [{input:'hello\nl',output:'2'},{input:'banana\na',output:'3'}],'custom'),
          Q('Two Sum (Hashing Approach)','lc-two-sum','E','two-sum',null),
          Q('Intersection of Two Arrays','hash-intersection','E',null,'https://www.geeksforgeeks.org/problems/intersection-of-two-arrays2404/1','Find the intersection of two arrays (common elements, no duplicates).',
            [{input:'5\n1 2 3 4 5\n5\n3 4 5 6 7',output:'3 4 5'}],'custom'),
        ]
      },
    ]
  },

  /* ─────────────── STEP 2 · Sorting Techniques (7) ─────────────── */
  {
    id: 'step2', name: 'Learn Important Sorting Techniques', color: '#EC4899',
    substeps: [
      {
        id: 's2-1', name: 'Sorting — I',
        problems: [
          Q('Selection Sort','sort-selection','E',null,'https://www.geeksforgeeks.org/problems/selection-sort/1','Implement Selection Sort. Sort the array in ascending order.',
            [{input:'5\n64 25 12 22 11',output:'11 12 22 25 64'}],'array'),
          Q('Bubble Sort','sort-bubble','E',null,'https://www.geeksforgeeks.org/problems/bubble-sort/1','Implement Bubble Sort.',
            [{input:'5\n5 4 3 2 1',output:'1 2 3 4 5'}],'array'),
          Q('Insertion Sort','sort-insertion','E',null,'https://www.geeksforgeeks.org/problems/insertion-sort/0','Implement Insertion Sort.',
            [{input:'5\n12 11 13 5 6',output:'5 6 11 12 13'}],'array'),
        ]
      },
      {
        id: 's2-2', name: 'Sorting — II',
        problems: [
          Q('Merge Sort','sort-merge','M',null,'https://www.geeksforgeeks.org/problems/merge-sort/1','Implement Merge Sort.',
            [{input:'5\n5 4 3 2 1',output:'1 2 3 4 5'}],'array'),
          Q('Quick Sort','sort-quick','M',null,'https://www.geeksforgeeks.org/problems/quick-sort/1','Implement Quick Sort.',
            [{input:'5\n10 7 8 9 1',output:'1 7 8 9 10'}],'array'),
          Q('Recursive Bubble Sort','sort-rec-bubble','M',null,'https://www.geeksforgeeks.org/problems/bubble-sort/1','Implement Bubble Sort using recursion (no loops in your sort logic).',
            [{input:'5\n5 1 4 2 8',output:'1 2 4 5 8'}],'array'),
          Q('Recursive Insertion Sort','sort-rec-insertion','M',null,'https://www.geeksforgeeks.org/problems/insertion-sort/0','Implement Insertion Sort using recursion.',
            [{input:'5\n4 3 2 10 12',output:'2 3 4 10 12'}],'array'),
        ]
      },
    ]
  },

  /* ─────────────── STEP 3 · Arrays (40) ─────────────── */
  {
    id: 'step3', name: 'Solve Problems on Arrays [Easy → Medium → Hard]', color: '#F59E0B',
    substeps: [
      {
        id: 's3-1', name: 'Easy',
        problems: [
          Q('Largest Element in an Array','arr-largest','E',null,'https://www.geeksforgeeks.org/problems/largest-element-in-array4009/1','Find and return the largest element in the array.',
            [{input:'5\n1 8 7 56 90',output:'90'}],'array'),
          Q('Second Largest Element in an Array','arr-second-largest','E',null,'https://www.geeksforgeeks.org/problems/second-largest3735/1','Find the second largest distinct element. If it doesn\'t exist, return -1.',
            [{input:'5\n12 35 1 10 34 1',output:'34'}],'array'),
          Q('Check if Array is Sorted','arr-is-sorted','E',null,'https://www.geeksforgeeks.org/problems/check-if-an-array-is-sorted0701/1','Return true if the array is sorted in non-decreasing order.',
            [{input:'5\n1 2 3 4 5',output:'true'},{input:'3\n3 1 2',output:'false'}],'array'),
          Q('Remove Duplicates from Sorted Array','arr-remove-dups','E','remove-duplicates-from-sorted-array',null),
          Q('Left Rotate Array by One Place','arr-rotate-1','E',null,'https://www.geeksforgeeks.org/problems/cyclically-rotate-an-array-by-one2614/1','Left rotate the array by one position.',
            [{input:'5\n1 2 3 4 5',output:'2 3 4 5 1'}],'array'),
          Q('Left Rotate Array by D Places','arr-rotate-d','E',null,'https://www.geeksforgeeks.org/problems/rotate-array-by-n-elements-1587115621/1','Left rotate the array by D positions.',
            [{input:'7 2\n1 2 3 4 5 6 7',output:'3 4 5 6 7 1 2'}],'custom'),
          Q('Move Zeros to End','arr-move-zeros','E','move-zeroes',null),
          Q('Linear Search','arr-linear-search','E',null,'https://www.geeksforgeeks.org/problems/who-will-win-1587115621/1','Return the index of the first occurrence of target X in the array, or -1.',
            [{input:'5 3\n1 2 3 4 5',output:'2'}],'custom'),
          Q('Find the Union of Two Sorted Arrays','arr-union','E',null,'https://www.geeksforgeeks.org/problems/union-of-two-sorted-arrays-1587115621/1','Find the union of two sorted arrays (sorted, no duplicates).',
            [{input:'5 4\n1 2 3 4 5\n1 2 3 6 7',output:'1 2 3 4 5 6 7'}],'custom'),
          Q('Find Missing Number in an Array','arr-missing','E','missing-number',null),
          Q('Maximum Consecutive Ones','arr-max-ones','E','max-consecutive-ones',null),
          Q('Single Number (appears once)','arr-single-number','E','single-number',null),
          Q('Longest Subarray with Sum K (Positives)','arr-subarray-sum-k-pos','E',null,'https://www.geeksforgeeks.org/problems/longest-sub-array-with-sum-k0809/1','Find the length of the longest subarray whose sum equals K (all positive elements).',
            [{input:'6 3\n1 2 3 1 1 1',output:'3'}],'custom'),
          Q('Longest Subarray with Sum K (Positives + Negatives)','arr-subarray-sum-k-neg','E',null,'https://www.geeksforgeeks.org/problems/longest-sub-array-with-sum-k0809/1','Find the length of the longest subarray with sum K (array can have negatives and zeros).',
            [{input:'6 3\n1 -1 5 -2 3',output:'4'}],'custom'),
        ]
      },
      {
        id: 's3-2', name: 'Medium',
        problems: [
          Q('Two Sum','arr-2sum','M','two-sum',null),
          Q('Sort an Array of 0s, 1s and 2s','arr-sort-012','M','sort-colors',null),
          Q('Majority Element (> n/2 times)','arr-majority-half','M','majority-element',null),
          Q("Kadane's Algorithm — Maximum Subarray Sum",'arr-kadane','M','maximum-subarray',null),
          Q('Stock Buy and Sell','arr-stock-1','M','best-time-to-buy-and-sell-stock',null),
          Q('Rearrange Array Elements by Sign','arr-rearrange-sign','M','rearrange-array-elements-by-sign',null),
          Q('Next Permutation','arr-next-perm','M','next-permutation',null),
          Q('Leaders in an Array','arr-leaders','M',null,'https://www.geeksforgeeks.org/problems/leaders-in-an-array-1587115620/1','An element is a leader if it is greater than all elements to its right. Print all leaders.',
            [{input:'6\n16 17 4 3 5 2',output:'17 5 2'}],'array'),
          Q('Longest Consecutive Sequence','arr-longest-consec','M','longest-consecutive-sequence',null),
          Q('Set Matrix Zeroes','arr-set-zeros','M','set-matrix-zeroes',null),
          Q('Rotate Matrix by 90 Degrees','arr-rotate-matrix','M','rotate-image',null),
          Q('Spiral Traversal of Matrix','arr-spiral','M','spiral-matrix',null),
          Q('Count Subarrays with Sum K','arr-subarray-sum-k','M','subarray-sum-equals-k',null),
          Q('4Sum — Find All Quadruplets','arr-4sum','M','4sum',null),
          Q('Largest Subarray with 0 Sum','arr-0sum-subarray','M',null,'https://www.geeksforgeeks.org/problems/largest-subarray-with-0-sum/1','Find the length of the largest subarray with sum equal to 0.',
            [{input:'8\n15 -2 2 -8 1 7 10 23',output:'5'}],'array'),
        ]
      },
      {
        id: 's3-3', name: 'Hard',
        problems: [
          Q("Pascal's Triangle",'arr-pascal','H','pascals-triangle',null),
          Q('Majority Element (> n/3 times)','arr-majority-third','H','majority-element-ii',null),
          Q('3Sum','arr-3sum','H','3sum',null),
          Q('Count Subarrays with XOR = K','arr-xor-k','H',null,'https://www.geeksforgeeks.org/problems/count-subarray-with-given-xor/1','Count subarrays whose XOR equals K.',
            [{input:'5 2\n4 2 2 6 4',output:'4'}],'custom'),
          Q('Merge Overlapping Subintervals','arr-merge-intervals','H','merge-intervals',null),
          Q('Merge Two Sorted Arrays Without Extra Space','arr-merge-no-extra','H',null,'https://www.geeksforgeeks.org/problems/merge-two-sorted-arrays-1587115620/1','Merge two sorted arrays A and B in-place such that the combined elements are in sorted order across A and B.',
            [{input:'3 3\n1 4 8\n2 3 9',output:'1 2 3\n4 8 9'}],'custom'),
          Q('Find the Repeating and Missing Number','arr-rep-missing','H',null,'https://www.geeksforgeeks.org/problems/find-missing-and-repeating2512/1','Find the element that is repeated and the element that is missing in an array of 1..N.',
            [{input:'5\n4 3 6 2 1 1',output:'Missing: 5 Repeating: 1'}],'array'),
          Q('Count Inversions in an Array','arr-inversions','H',null,'https://www.geeksforgeeks.org/problems/inversion-of-array-1587115620/1','Count the number of inversions: pairs (i,j) where i<j and A[i]>A[j].',
            [{input:'5\n2 4 1 3 5',output:'3'}],'array'),
          Q('Reverse Pairs','arr-reverse-pairs','H','reverse-pairs',null),
          Q('Maximum Product Subarray','arr-max-product','H','maximum-product-subarray',null),
          Q('Merge Two Sorted Arrays (in-place variant)','arr-merge-inplace','H','merge-sorted-array',null),
        ]
      },
    ]
  },

  /* ─────────────── STEP 4 · Binary Search (32) ─────────────── */
  {
    id: 'step4', name: 'Binary Search [1D, 2D Arrays, Search Space]', color: '#10B981',
    substeps: [
      {
        id: 's4-1', name: 'BS on 1D Arrays',
        problems: [
          Q('Binary Search','bs-basic','E','binary-search',null),
          Q('Implement Lower Bound','bs-lower-bound','E',null,'https://www.geeksforgeeks.org/problems/floor-in-a-sorted-array-1587115620/1','Return the index of the first element ≥ X. Return n if no such element.',
            [{input:'5 3\n1 2 3 4 5',output:'2'},{input:'5 6\n1 2 3 4 5',output:'5'}],'custom'),
          Q('Implement Upper Bound','bs-upper-bound','E',null,'https://www.geeksforgeeks.org/problems/implement-upper-bound/1','Return the index of the first element > X.',
            [{input:'5 3\n1 2 3 4 5',output:'3'}],'custom'),
          Q('Search Insert Position','bs-insert','E','search-insert-position',null),
          Q('Floor and Ceil in Sorted Array','bs-floor-ceil','E',null,'https://www.geeksforgeeks.org/problems/floor-in-a-sorted-array-1587115620/1','Find floor (largest ≤ X) and ceil (smallest ≥ X) of X in sorted array.',
            [{input:'5 3\n1 2 3 4 8',output:'3 3'},{input:'5 5\n1 2 3 4 8',output:'4 8'}],'custom'),
          Q('First and Last Occurrence in Sorted Array','bs-first-last','M','find-first-and-last-position-of-element-in-sorted-array',null),
          Q('Count Occurrences in Sorted Array','bs-count-occur','M',null,'https://www.geeksforgeeks.org/problems/number-of-occurrence2259/1','Count how many times X appears in a sorted array.',
            [{input:'7 2\n1 1 2 2 2 3 4',output:'3'}],'custom'),
          Q('Search in Rotated Sorted Array I','bs-rotated-1','M','search-in-rotated-sorted-array',null),
          Q('Search in Rotated Sorted Array II','bs-rotated-2','M','search-in-rotated-sorted-array-ii',null),
          Q('Find Minimum in Rotated Sorted Array','bs-min-rotated','M','find-minimum-in-rotated-sorted-array',null),
          Q('How Many Times Array is Rotated','bs-rotation-count','M',null,'https://www.geeksforgeeks.org/problems/rotation4723/1','Find how many times a sorted array was right-rotated (find index of minimum element).',
            [{input:'5\n4 5 1 2 3',output:'2'}],'array'),
          Q('Single Element in a Sorted Array','bs-single-sorted','M','single-element-in-a-sorted-array',null),
          Q('Find Peak Element','bs-peak','M','find-peak-element',null),
        ]
      },
      {
        id: 's4-2', name: 'BS on Answers',
        problems: [
          Q('Sqrt(x) — Square Root via Binary Search','bs-sqrt','E','sqrtx',null),
          Q('Find Nth Root of a Number','bs-nth-root','M',null,'https://www.geeksforgeeks.org/problems/find-nth-root-of-m5843/1','Find the Nth integer root of M. If it doesn\'t exist return -1.',
            [{input:'2 9',output:'3'},{input:'3 9',output:'-1'}],'custom'),
          Q('Koko Eating Bananas','bs-koko','M','koko-eating-bananas',null),
          Q('Minimum Days to Make M Bouquets','bs-bouquets','M','minimum-number-of-days-to-make-m-bouquets',null),
          Q('Find the Smallest Divisor','bs-smallest-divisor','M','smallest-divisor-given-a-threshold',null),
          Q('Capacity to Ship Packages Within D Days','bs-ship','M','capacity-to-ship-packages-within-d-days',null),
          Q('Kth Missing Positive Number','bs-kth-missing','E','kth-missing-positive-number',null),
          Q('Aggressive Cows','bs-aggressive-cows','M',null,'https://www.geeksforgeeks.org/problems/aggressive-cows/1','Place C cows in N stalls such that the minimum distance between any two cows is maximised.',
            [{input:'5 3\n1 2 4 8 9',output:'3'}],'custom'),
          Q('Book Allocation Problem','bs-book-alloc','M',null,'https://www.geeksforgeeks.org/problems/allocate-minimum-number-of-pages0937/1','Allocate N books to M students minimising the maximum pages assigned to a student.',
            [{input:'4 2\n12 34 67 90',output:'113'}],'custom'),
        ]
      },
      {
        id: 's4-3', name: 'BS on 2D Arrays',
        problems: [
          Q('Row with Maximum Number of 1s','bs-row-max-ones','M',null,'https://www.geeksforgeeks.org/problems/row-with-max-1s0023/1','In a 2D binary matrix where each row is sorted, find the row with maximum 1s.',
            [{input:'4 4\n0 1 1 1\n0 0 1 1\n1 1 1 1\n0 0 0 0',output:'2'}],'custom'),
          Q('Search in a 2D Matrix','bs-search-2d','M','search-a-2d-matrix',null),
          Q('Search in Row-Column Sorted Matrix','bs-search-2d-2','M','search-a-2d-matrix-ii',null),
          Q('Find Peak Element in 2D Matrix','bs-peak-2d','H','find-peak-element-ii',null),
          Q('Matrix Median','bs-matrix-median','H',null,'https://www.geeksforgeeks.org/problems/median-in-a-row-wise-sorted-matrix1527/1','Find the median of a row-wise sorted odd-sized matrix.',
            [{input:'3 3\n1 3 5\n2 6 9\n3 6 9',output:'5'}],'custom'),
          Q('Median of Two Sorted Arrays','bs-median-2-arrays','H','median-of-two-sorted-arrays',null),
          Q('Kth Element of Two Sorted Arrays','bs-kth-two-arrays','M',null,'https://www.geeksforgeeks.org/problems/k-th-element-of-two-sorted-array1317/1','Find Kth smallest element of two combined sorted arrays.',
            [{input:'5 4 4\n2 3 6 7 9\n1 4 8 10',output:'4'}],'custom'),
          Q('Minimise Maximum Distance Between Gas Stations','bs-gas-stations','H',null,'https://www.geeksforgeeks.org/problems/minimize-max-distance-to-gas-station/1','Add K new gas stations on a line to minimise the maximum distance between consecutive stations.',
            [{input:'5 1\n1 2 3 4 5',output:'1.0'}],'custom'),
          Q('Split Array — Largest Sum','bs-split-array','H','split-array-largest-sum',null),
          Q('Painter Partition Problem','bs-painter','H',null,'https://www.geeksforgeeks.org/problems/the-painters-partition-problem1535/1','Minimise the time taken by K painters to paint N boards, each painter paints continuous boards.',
            [{input:'4 2\n10 20 30 40',output:'60'}],'custom'),
        ]
      },
    ]
  },

  /* ─────────────── STEP 5 · Strings (15) ─────────────── */
  {
    id: 'step5', name: 'Strings [Basic and Medium]', color: '#8B5CF6',
    substeps: [
      {
        id: 's5-1', name: 'Basic String Problems',
        problems: [
          Q('Remove Outermost Parentheses','str-outer-parens','E','remove-outermost-parentheses',null),
          Q('Reverse Words in a String','str-rev-words','M','reverse-words-in-a-string',null),
          Q('Largest Odd Number in String','str-largest-odd','E','largest-odd-number-in-string',null),
          Q('Longest Common Prefix','str-lcp','E','longest-common-prefix',null),
          Q('Isomorphic Strings','str-isomorphic','E','isomorphic-strings',null),
          Q('Check Whether Two Strings are Anagram of Each Other','str-anagram','E','valid-anagram',null),
        ]
      },
      {
        id: 's5-2', name: 'Medium String Problems',
        problems: [
          Q('Sort Characters by Frequency','str-char-freq','M','sort-characters-by-frequency',null),
          Q('Maximum Nesting Depth of Parentheses','str-nesting-depth','E','maximum-nesting-depth-of-the-parentheses',null),
          Q('Roman to Integer','str-roman','E','roman-to-integer',null),
          Q('String to Integer (atoi)','str-atoi','M','string-to-integer-atoi',null),
          Q('Count Number of Substrings','str-count-substrings','M',null,'https://www.geeksforgeeks.org/problems/count-number-of-substrings4528/1','Count substrings of S that have at least K distinct characters.',
            [{input:'abcab 2',output:'10'}],'custom'),
          Q('Longest Palindromic Substring','str-longest-pal-sub','M','longest-palindromic-substring',null),
          Q('Sum of Beauty of All Substrings','str-beauty-sum','M','sum-of-beauty-of-all-substrings',null),
          Q('Minimum Characters to Add at Front for Palindrome','str-min-chars-palindrome','H',null,'https://www.geeksforgeeks.org/problems/minimum-characters-to-be-added-at-front-to-make-string-palindrome/1','Find minimum chars to add at front to make string a palindrome.',
            [{input:'abc',output:'2'},{input:'aacecaaa',output:'1'}],'string'),
          Q('Check if String is a Rotation of Another','str-rotation','E','rotate-string',null),
        ]
      },
    ]
  },

  /* ─────────────── STEP 6 · Linked List (31) ─────────────── */
  {
    id: 'step6', name: 'Learn LinkedList [Single LL, Double LL, Medium, Hard]', color: '#06B6D4',
    substeps: [
      {
        id: 's6-1', name: 'Learn Single Linked List',
        problems: [
          Q('Introduction to Linked List','ll-intro','E',null,'https://www.geeksforgeeks.org/problems/introduction-to-linked-list/1','Create a linked list from an array and print it.',
            [{input:'5\n1 2 3 4 5',output:'1->2->3->4->5->NULL'}],'custom'),
          Q('Insert at Head and Tail of LL','ll-insert','E',null,'https://www.geeksforgeeks.org/problems/linked-list-insertion-1587115620/1','Given a LL, insert a node at the head and another at the tail.',
            [{input:'3\n1 2 3\n0 4',output:'0->1->2->3->4->NULL'}],'custom'),
          Q('Delete a Node in LL','ll-delete','E',null,'https://www.geeksforgeeks.org/problems/delete-a-node-in-single-linked-list/1','Delete the node at position K (1-indexed) in the linked list.',
            [{input:'5 2\n1 2 3 4 5',output:'1->3->4->5->NULL'}],'custom'),
          Q('Find Length of LL','ll-length','E',null,'https://www.geeksforgeeks.org/problems/count-nodes-of-linked-list/1','Count the number of nodes in a linked list.',
            [{input:'5\n1 2 3 4 5',output:'5'}],'custom'),
          Q('Search in LL','ll-search','E',null,'https://www.geeksforgeeks.org/problems/search-in-linked-list-1664434193/1','Search for an element in a linked list. Return true/false.',
            [{input:'5 3\n1 2 3 4 5',output:'true'}],'custom'),
          Q('Reverse a Linked List','ll-reverse','E','reverse-linked-list',null),
          Q('Linked List Cycle Detection','ll-cycle','E','linked-list-cycle',null),
        ]
      },
      {
        id: 's6-2', name: 'Learn Doubly Linked List',
        problems: [
          Q('Introduction to Doubly Linked List','dll-intro','E',null,'https://www.geeksforgeeks.org/problems/introduction-to-doubly-linked-list/1','Create a DLL and print it forward and backward.',
            [{input:'4\n1 2 3 4',output:'1<->2<->3<->4<->NULL\n4<->3<->2<->1<->NULL'}],'custom'),
          Q('Insert at Head and Tail of DLL','dll-insert','E',null,'https://www.geeksforgeeks.org/problems/insert-a-node-in-doubly-linked-list/1','Insert a node at the head and at the tail of a DLL.',
            [{input:'3\n1 2 3\n0 4',output:'0<->1<->2<->3<->4<->NULL'}],'custom'),
          Q('Delete Head or Tail from DLL','dll-delete','E',null,'https://www.geeksforgeeks.org/problems/delete-node-in-doubly-linked-list/1','Delete the head or tail of a DLL based on a flag.',
            [{input:'5 H\n1 2 3 4 5',output:'2<->3<->4<->5<->NULL'}],'custom'),
          Q('Reverse a Doubly Linked List','dll-reverse','E',null,'https://www.geeksforgeeks.org/problems/reverse-a-doubly-linked-list/1','Reverse a doubly linked list.',
            [{input:'4\n1 2 3 4',output:'4<->3<->2<->1<->NULL'}],'custom'),
        ]
      },
      {
        id: 's6-3', name: 'Medium Problems on LL',
        problems: [
          Q('Middle of the Linked List','ll-middle','E','middle-of-the-linked-list',null),
          Q('Detect a Loop in LL','ll-detect-loop','E','linked-list-cycle',null),
          Q('Find Starting Point of Loop in LL','ll-loop-start','M','linked-list-cycle-ii',null),
          Q('Length of Loop in LL','ll-loop-length','M',null,'https://www.geeksforgeeks.org/problems/find-length-of-loop/1','Find the length of the cycle in a linked list, or 0 if no cycle.',
            [{input:'5 2\n1 2 3 4 5',output:'4'}],'custom'),
          Q('Check if LL is Palindrome','ll-palindrome','M','palindrome-linked-list',null),
          Q('Segregate Odd and Even Nodes','ll-odd-even','M','odd-even-linked-list',null),
          Q('Remove N-th Node from End of LL','ll-remove-nth','M','remove-nth-node-from-end-of-list',null),
          Q('Delete the Middle Node of LL','ll-delete-middle','M','delete-the-middle-node-of-a-linked-list',null),
          Q('Sort LL','ll-sort','M','sort-list',null),
          Q('Sort LL of 0s, 1s, and 2s','ll-sort-012','M',null,'https://www.geeksforgeeks.org/problems/given-a-linked-list-of-0s-1s-and-2s-sort-it/1','Sort a linked list containing only 0s, 1s, and 2s without swapping nodes.',
            [{input:'7\n1 2 2 1 2 0 2 2',output:'0->1->1->2->2->2->2->NULL'}],'custom'),
          Q('Find Intersection Point of Two LLs','ll-intersection','M','intersection-of-two-linked-lists',null),
          Q('Add Two Numbers as Linked Lists','ll-add-numbers','M','add-two-numbers',null),
          Q('Delete All Occurrences of Key in DLL','dll-delete-key','M',null,'https://www.geeksforgeeks.org/problems/delete-all-occurrences-of-a-given-key-in-a-doubly-linked-list/1','Delete all nodes with value K from a DLL.',
            [{input:'8 2\n10 2 3 2 2 10 8 2',output:'10<->3<->10<->8<->NULL'}],'custom'),
          Q('Find Pairs with Given Sum in DLL','dll-pair-sum','M',null,'https://www.geeksforgeeks.org/problems/find-pairs-with-given-sum-in-doubly-linked-list/1','Find all pairs in a sorted DLL whose sum equals target.',
            [{input:'5 9\n1 2 4 5 9',output:'4 5\n9'}],'custom'),
        ]
      },
      {
        id: 's6-4', name: 'Hard Problems on LL',
        problems: [
          Q('Reverse LL in Groups of K','ll-rev-k','H','reverse-nodes-in-k-group',null),
          Q('Rotate a Linked List','ll-rotate','M','rotate-list',null),
          Q('Flattening a Linked List','ll-flatten','H',null,'https://www.geeksforgeeks.org/problems/flattening-a-linked-list/1','Flatten a LL where each node has a "down" pointer to a sorted sub-list.',
            [{input:'5 nodes: 5->10->19->28->NULL with down lists',output:'5->7->8->10->19->20->22->28->30->NULL'}],'custom'),
          Q('Copy List with Random Pointer','ll-copy-random','H','copy-list-with-random-pointer',null),
          Q('LRU Cache','ll-lru','H','lru-cache',null),
          Q('Merge K Sorted Lists','ll-merge-k','H','merge-k-sorted-lists',null),
        ]
      },
    ]
  },

  /* ─────────────── STEP 7 · Recursion (25) ─────────────── */
  {
    id: 'step7', name: 'Recursion [PatternWise]', color: '#EF4444',
    substeps: [
      {
        id: 's7-1', name: 'Get a Strong Hold',
        problems: [
          Q('Print All Subsequences','rec-subsequences','M',null,'https://www.geeksforgeeks.org/problems/power-set4302/1','Print all possible subsequences (subsets) of an array.',
            [{input:'3\n1 2 3',output:'[]\n[1]\n[2]\n[1,2]\n[3]\n[1,3]\n[2,3]\n[1,2,3]'}],'array'),
          Q('Subset Sum I — Print Subset Sums','rec-subset-sum-1','M',null,'https://www.geeksforgeeks.org/problems/subset-sums2234/1','Print all distinct sums of subsets in sorted order.',
            [{input:'3\n2 3 5',output:'0 2 3 5 5 7 8 10'}],'array'),
          Q('Subset Sum II — Unique Subsets','rec-subset-2','M','subsets-ii',null),
          Q('Combination Sum I','rec-comb-1','M','combination-sum',null),
          Q('Combination Sum II','rec-comb-2','M','combination-sum-ii',null),
        ]
      },
      {
        id: 's7-2', name: 'Subsequences Pattern',
        problems: [
          Q('Print all Subsequences with Sum K','rec-subseq-sum-k','M',null,'https://www.geeksforgeeks.org/problems/print-all-subsets-with-given-sum/1','Print all subsequences with sum exactly K.',
            [{input:'4 2\n1 2 1 2',output:'[1,1]\n[2]\n[2]'}],'custom'),
          Q('Count all Subsequences with Sum K','rec-count-subseq-k','M',null,'https://www.geeksforgeeks.org/problems/number-of-subsets-equal-to-given-sum/1','Count the number of subsequences with sum K.',
            [{input:'6 10\n2 3 5 6 8 10',output:'4'}],'custom'),
          Q('Combination Sum III','rec-comb-3','M','combination-sum-iii',null),
          Q('Letter Combinations of a Phone Number','rec-phone','M','letter-combinations-of-a-phone-number',null),
          Q('Palindrome Partitioning','rec-pal-partition','M','palindrome-partitioning',null),
          Q('Permutations I','rec-perms-1','M','permutations',null),
          Q('Permutations II (with duplicates)','rec-perms-2','M','permutations-ii',null),
          Q('Generate Parentheses','rec-gen-parens','M','generate-parentheses',null),
        ]
      },
      {
        id: 's7-3', name: 'Trying Out All Combos / Hard',
        problems: [
          Q('Word Search','rec-word-search','M','word-search',null),
          Q('N-Queens','rec-n-queens','H','n-queens',null),
          Q('Rat in a Maze','rec-rat-maze','M',null,'https://www.geeksforgeeks.org/problems/rat-in-a-maze-problem/1','Find all paths from top-left to bottom-right in a grid of 0s and 1s.',
            [{input:'4\n1 0 0 0\n1 1 0 1\n1 1 0 0\n0 1 1 1',output:'DDRDRR DRDDRR'}],'custom'),
          Q('M Coloring Problem','rec-m-color','M',null,'https://www.geeksforgeeks.org/problems/m-coloring-problem-1587115620/1','Determine if a graph can be coloured with M colours such that no two adjacent nodes share a colour.',
            [{input:'4 5 3\n0 1\n1 2\n2 3\n3 0\n0 2',output:'true'}],'custom'),
          Q('Sudoku Solver','rec-sudoku','H','sudoku-solver',null),
          Q('Expression Add Operators','rec-add-ops','H','expression-add-operators',null),
          Q('Power Set','rec-power-set','M','subsets',null),
          Q('Partition to K Equal Sum Subsets','rec-k-subsets','M','partition-to-k-equal-sum-subsets',null),
          Q('Remove Invalid Parentheses','rec-remove-parens','H','remove-invalid-parentheses',null),
          Q('Beautiful Arrangement','rec-beautiful','M','beautiful-arrangement',null),
          Q('Count Inversions (Merge Sort)','rec-inversions','M',null,'https://www.geeksforgeeks.org/problems/inversion-of-array-1587115620/1','Count inversions using merge sort.',
            [{input:'5\n1 20 6 4 5',output:'5'}],'array'),
          Q('Reverse Stack using Recursion','rec-rev-stack','M',null,'https://www.geeksforgeeks.org/problems/reverse-a-stack/1','Reverse a stack using recursion only (no other data structure).',
            [{input:'5\n1 2 3 4 5',output:'5 4 3 2 1'}],'custom'),
        ]
      },
    ]
  },

  /* ─────────────── STEP 8 · Bit Manipulation (18) ─────────────── */
  {
    id: 'step8', name: 'Bit Manipulation [Concepts & Problems]', color: '#F97316',
    substeps: [
      {
        id: 's8-1', name: 'Learn Bit Manipulation',
        problems: [
          Q('Check if ith Bit is Set','bit-check-ith','E',null,'https://www.geeksforgeeks.org/problems/check-whether-k-th-bit-is-set-or-not-1587115620/1','Check if the Kth bit (0-indexed) of N is set.',
            [{input:'5 1',output:'1'},{input:'5 2',output:'1'}],'custom'),
          Q('Number of 1 Bits','bit-count-ones','E','number-of-1-bits',null),
          Q('Power of 2','bit-power-of-2','E','power-of-two',null),
          Q('Minimum Bit Flips to Convert Number','bit-min-flips','E','minimum-bit-flips-to-convert-number',null),
          Q('Count Set Bits from 1 to N','bit-count-set-n','M',null,'https://www.geeksforgeeks.org/problems/count-total-set-bits-1587115620/1','Count the total number of set bits in all numbers from 1 to N.',
            [{input:'4',output:'5'},{input:'17',output:'35'}],'number'),
          Q('Swap Two Numbers using XOR','bit-swap-xor','E',null,'https://www.geeksforgeeks.org/problems/swap-two-numbers3844/1','Swap two integers using bitwise XOR (no temp variable).',
            [{input:'3 5',output:'5 3'}],'custom'),
          Q('Divide Two Integers without Division','bit-divide','M','divide-two-integers',null),
        ]
      },
      {
        id: 's8-2', name: 'Interview Problems',
        problems: [
          Q('Single Number I','bit-single-1','E','single-number',null),
          Q('Single Number II','bit-single-2','M','single-number-ii',null),
          Q('Single Number III (Two Numbers)','bit-single-3','M','single-number-iii',null),
          Q('XOR of Numbers in Range [L, R]','bit-xor-range','M',null,'https://www.geeksforgeeks.org/problems/find-xor-of-numbers-from-l-to-r/1','Compute XOR of all integers from L to R.',
            [{input:'1 4',output:'4'},{input:'1 5',output:'1'}],'custom'),
          Q('Two Numbers with Odd Occurrences','bit-two-odd','M',null,'https://www.geeksforgeeks.org/problems/two-numbers-with-odd-occurrences5846/1','Find the two numbers appearing odd number of times in an array.',
            [{input:'6\n4 2 4 5 2 3',output:'5 3'}],'array'),
          Q('Find Missing and Repeating using XOR','bit-missing-repeat','M',null,'https://www.geeksforgeeks.org/problems/find-missing-and-repeating2512/1','Find the missing and repeating number using XOR.',
            [{input:'4\n2 2 3 4',output:'Missing: 1 Repeating: 2'}],'array'),
          Q('Reverse Bits','bit-reverse-bits','E','reverse-bits',null),
          Q('Generate Power Set using Bits','bit-power-set','M',null,'https://www.geeksforgeeks.org/problems/power-set4302/1','Generate all subsets of an array using bit masking.',
            [{input:'3\n1 2 3',output:'{}\n{1}\n{2}\n{1,2}\n{3}\n{1,3}\n{2,3}\n{1,2,3}'}],'array'),
          Q('Minimum XOR Value Pair','bit-min-xor','M',null,'https://www.geeksforgeeks.org/problems/minimum-xor-value-pair/1','Find the pair in an array with minimum XOR value.',
            [{input:'4\n0 2 5 7',output:'2'}],'array'),
          Q('XOR of All Subsets','bit-xor-subsets','M',null,'https://www.geeksforgeeks.org/problems/all-subsets-xor/1','Find XOR of XOR of all subsets of an array.',
            [{input:'3\n1 2 3',output:'0'}],'array'),
        ]
      },
    ]
  },

  /* ─────────────── STEP 9 · Stack and Queues (30) ─────────────── */
  {
    id: 'step9', name: 'Stack and Queues [Learning, Pre-In-Post-fix, Monotonic Stack, Implementation]', color: '#84CC16',
    substeps: [
      {
        id: 's9-1', name: 'Learning',
        problems: [
          Q('Implement Stack using Arrays','stk-array','E',null,'https://www.geeksforgeeks.org/problems/implement-stack-using-array/1','Implement a stack supporting push, pop, peek, and isEmpty operations.',
            [{input:'push 1\npush 2\npeek\npop\npop',output:'2\n2\n1'}],'custom'),
          Q('Implement Stack using Linked List','stk-ll','E',null,'https://www.geeksforgeeks.org/problems/implement-stack-using-linked-list/1','Implement a stack using a linked list.',
            [{input:'push 1\npush 2\npop\npush 3\ntop',output:'2\n3'}],'custom'),
          Q('Implement Queue using Arrays','que-array','E',null,'https://www.geeksforgeeks.org/problems/implement-queue-using-array/1','Implement a queue supporting enqueue, dequeue, front operations.',
            [{input:'enq 1\nenq 2\nfront\ndeq',output:'1\n1'}],'custom'),
          Q('Implement Stack using Two Queues','stk-two-queues','M','implement-stack-using-queues',null),
          Q('Implement Queue using Two Stacks','que-two-stacks','M','implement-queue-using-stacks',null),
          Q('Valid Parentheses','stk-valid-parens','E','valid-parentheses',null),
        ]
      },
      {
        id: 's9-2', name: 'Prefix, Infix, Postfix Conversion',
        problems: [
          Q('Infix to Postfix Conversion','stk-infix-postfix','M',null,'https://www.geeksforgeeks.org/problems/infix-to-postfix-1587115620/1','Convert an infix expression to postfix.',
            [{input:'a+b*(c^d-e)^(f+g*h)-i',output:'abcd^e-fgh*+^*+i-'}],'custom'),
          Q('Postfix Evaluation','stk-eval-postfix','M',null,'https://www.geeksforgeeks.org/problems/evaluation-of-postfix-expression1735/1','Evaluate a postfix expression.',
            [{input:'231*+9-',output:'-4'}],'custom'),
          Q('Prefix to Infix','stk-prefix-infix','M',null,'https://www.geeksforgeeks.org/problems/prefix-to-infix-conversion/1','Convert a prefix expression to infix.',
            [{input:'*+AB-CD',output:'((A+B)*(C-D))'}],'custom'),
          Q('Prefix to Postfix','stk-prefix-postfix','M',null,'https://www.geeksforgeeks.org/problems/prefix-to-postfix-conversion/1','Convert a prefix expression to postfix.',
            [{input:'*+AB-CD',output:'AB+CD-*'}],'custom'),
          Q('Postfix to Prefix','stk-postfix-prefix','M',null,'https://www.geeksforgeeks.org/problems/postfix-to-prefix-conversion/1','Convert a postfix expression to prefix.',
            [{input:'AB+CD-*',output:'*+AB-CD'}],'custom'),
        ]
      },
      {
        id: 's9-3', name: 'Monotonic Stack / Queue Problems',
        problems: [
          Q('Next Greater Element I','stk-nge-1','E','next-greater-element-i',null),
          Q('Next Greater Element II (circular)','stk-nge-2','M','next-greater-element-ii',null),
          Q('Next Smaller Element','stk-nse','M',null,'https://www.geeksforgeeks.org/problems/next-smaller-element-1587115621/1','For each element find the nearest smaller element to its right.',
            [{input:'4\n1 6 2 5',output:'-1 2 -1 -1'}],'array'),
          Q('Trapping Rain Water','stk-rain','H','trapping-rain-water',null),
          Q('Sum of Subarray Minimums','stk-subarray-min','M','sum-of-subarray-minimums',null),
          Q('Asteroid Collision','stk-asteroid','M','asteroid-collision',null),
          Q('Sum of Subarray Ranges','stk-subarray-ranges','M','sum-of-subarray-ranges',null),
          Q('Remove K Digits','stk-remove-k','M','remove-k-digits',null),
          Q('Largest Rectangle in Histogram','stk-histogram','H','largest-rectangle-in-histogram',null),
          Q('Maximal Rectangle','stk-maximal-rect','H','maximal-rectangle',null),
        ]
      },
      {
        id: 's9-4', name: 'Implementation Problems',
        problems: [
          Q('Online Stock Span','stk-stock-span','M','online-stock-span',null),
          Q('The Celebrity Problem','stk-celebrity','M',null,'https://www.geeksforgeeks.org/problems/the-celebrity-problem/1','Find the person (if any) that everyone knows but knows nobody.',
            [{input:'4\n0 1 0\n0 0 0\n0 1 0\n0 1 0',output:'1'}],'custom'),
          Q('LRU Cache','stk-lru','H','lru-cache',null),
          Q('LFU Cache','stk-lfu','H','lfu-cache',null),
          Q('Sliding Window Maximum','stk-sliding-max','H','sliding-window-maximum',null),
          Q('Min Stack','stk-min-stack','M','min-stack',null),
          Q('Gas Station — Circular Tour','stk-gas','M','gas-station',null),
          Q('Find Maximum of Minimums of Every Window','stk-max-of-min','H',null,'https://www.geeksforgeeks.org/problems/maximum-of-minimum-for-every-window-size3453/1','For each window size k, find the maximum of the minimums of all windows of size k.',
            [{input:'6\n10 20 30 50 10 70 30',output:'70 30 20 20 10 10'}],'array'),
          Q('Decode the String','stk-decode-string','M','decode-string',null),
        ]
      },
    ]
  },

  /* ─────────────── STEP 10 · Sliding Window & Two Pointer (12) ─────────────── */
  {
    id: 'step10', name: 'Sliding Window & Two Pointer Combined Problems', color: '#14B8A6',
    substeps: [
      {
        id: 's10-1', name: 'Medium / Hard Problems',
        problems: [
          Q('Longest Substring Without Repeating Characters','sw-no-repeat','M','longest-substring-without-repeating-characters',null),
          Q('Max Consecutive Ones III','sw-max-ones-3','M','max-consecutive-ones-iii',null),
          Q('Fruit Into Baskets','sw-fruits','M','fruit-into-baskets',null),
          Q('Longest Repeating Character Replacement','sw-char-replace','M','longest-repeating-character-replacement',null),
          Q('Binary Subarrays with Sum','sw-binary-sum','M','binary-subarrays-with-sum',null),
          Q('Count Number of Nice Subarrays','sw-nice','M','count-number-of-nice-subarrays',null),
          Q('Number of Substrings Containing All Three Characters','sw-all-three','M','number-of-substrings-containing-all-three-characters',null),
          Q('Maximum Points from Cards','sw-cards','M','maximum-points-you-can-obtain-from-cards',null),
          Q('Longest Substring with At Most K Distinct Characters','sw-k-distinct','M','longest-substring-with-at-most-k-distinct-characters',null),
          Q('Subarrays with K Different Integers','sw-k-diff','H','subarrays-with-k-different-integers',null),
          Q('Minimum Window Substring','sw-min-window','H','minimum-window-substring',null),
          Q('Minimum Window Subsequence','sw-min-subseq','H',null,'https://www.geeksforgeeks.org/problems/minimum-window-subsequence/1','Find smallest window in S containing all characters of T as a subsequence.',
            [{input:'abcdebdde bde',output:'bcde'}],'custom'),
        ]
      },
    ]
  },

  /* ─────────────── STEP 11 · Heaps (17) ─────────────── */
  {
    id: 'step11', name: 'Heaps [Learning, Medium, Hard Problems]', color: '#A78BFA',
    substeps: [
      {
        id: 's11-1', name: 'Learning',
        problems: [
          Q('Implement Min Heap','heap-min','E',null,'https://www.geeksforgeeks.org/problems/operations-on-binary-min-heap/1','Implement a min-heap supporting insert, extractMin, and getMin.',
            [{input:'insert 3\ninsert 1\ninsert 2\ngetMin\nextractMin\ngetMin',output:'1\n1\n2'}],'custom'),
          Q('Kth Largest Element in Array','heap-kth-largest','M','kth-largest-element-in-an-array',null),
          Q('Kth Smallest Element in Array','heap-kth-smallest','M',null,'https://www.geeksforgeeks.org/problems/kth-smallest-element5635/1','Find the Kth smallest element without sorting.',
            [{input:'6 3\n7 10 4 3 20 15',output:'7'}],'custom'),
        ]
      },
      {
        id: 's11-2', name: 'Medium Problems',
        problems: [
          Q('Task Scheduler','heap-task','M','task-scheduler',null),
          Q('Seat Reservation Manager','heap-seat','M','seat-reservation-manager',null),
          Q('Minimum Operations to Halve Array Sum','heap-halve','M','minimum-operations-to-halve-array-sum',null),
          Q('Last Stone Weight','heap-stone','E','last-stone-weight',null),
          Q('Find K Closest Elements','heap-k-closest-elem','M','find-k-closest-elements',null),
          Q('Top K Frequent Elements','heap-top-k','M','top-k-frequent-elements',null),
        ]
      },
      {
        id: 's11-3', name: 'Hard Problems',
        problems: [
          Q('Merge K Sorted Arrays','heap-merge-k-arr','H',null,'https://www.geeksforgeeks.org/problems/merge-k-sorted-arrays/1','Merge K sorted arrays into a single sorted array.',
            [{input:'3\n1 3 5 7\n2 4 6 8\n0 9 10 11',output:'0 1 2 3 4 5 6 7 8 9 10 11'}],'custom'),
          Q('Kth Largest Sum Contiguous Subarray','heap-kth-sum-sub','H',null,'https://www.geeksforgeeks.org/problems/k-th-largest-sum-contiguous-subarray/1','Find the Kth largest sum among all contiguous subarrays.',
            [{input:'4 3\n3 -2 5 -1',output:'5'}],'custom'),
          Q('Find Median from Data Stream','heap-median-stream','H','find-median-from-data-stream',null),
          Q('Merge K Sorted Lists','heap-merge-k-lists','H','merge-k-sorted-lists',null),
          Q('Smallest Range Covering K Lists','heap-smallest-range','H','smallest-range-covering-elements-from-k-lists',null),
          Q('IPO — Maximize Capital','heap-ipo','H','ipo',null),
          Q('Maximum Performance of a Team','heap-max-perf','H','maximum-performance-of-a-team',null),
          Q('K Closest Points to Origin','heap-k-closest','M','k-closest-points-to-origin',null),
        ]
      },
    ]
  },

  /* ─────────────── STEP 12 · Greedy Algorithms (15) ─────────────── */
  {
    id: 'step12', name: 'Greedy Algorithms [Easy, Medium/Hard]', color: '#22C55E',
    substeps: [
      {
        id: 's12-1', name: 'Easy Problems',
        problems: [
          Q('Assign Cookies','gr-cookies','E','assign-cookies',null),
          Q('Fractional Knapsack','gr-frac-knapsack','M',null,'https://www.geeksforgeeks.org/problems/fractional-knapsack-1587115620/1','Select items fractionally to maximise value within weight W.',
            [{input:'3 50\n60 10\n100 20\n120 30',output:'240.00'}],'custom'),
          Q('Minimum Coins (Greedy)','gr-min-coins','E',null,'https://www.geeksforgeeks.org/problems/number-of-coins1824/1','Find minimum coins needed to make amount N using denominations [1,2,5,10,20,50,100,500,1000].',
            [{input:'49',output:'5'},{input:'11',output:'2'}],'number'),
          Q('Lemonade Change','gr-lemonade','E','lemonade-change',null),
          Q('Valid Parenthesis String','gr-valid-parens-str','M','valid-parenthesis-string',null),
          Q('N Meetings in One Room','gr-n-meetings','M',null,'https://www.geeksforgeeks.org/problems/n-meetings-in-one-room-1587115620/1','Maximise the number of meetings you can attend in one room.',
            [{input:'6\n1 3\n3 4\n0 5\n5 7\n8 9\n5 9',output:'4'}],'custom'),
        ]
      },
      {
        id: 's12-2', name: 'Medium / Hard Problems',
        problems: [
          Q('Jump Game I','gr-jump-1','M','jump-game',null),
          Q('Jump Game II','gr-jump-2','M','jump-game-ii',null),
          Q('Job Sequencing Problem','gr-job-seq','M',null,'https://www.geeksforgeeks.org/problems/job-sequencing-problem-1587115620/1','Maximise profit by scheduling deadline-constrained jobs.',
            [{input:'5\nA 2 100\nB 1 19\nC 2 27\nD 1 25\nE 3 15',output:'2 142'}],'custom'),
          Q('Candy (Distribute Fairly)','gr-candy','H','candy',null),
          Q('Shortest Job First (Average Waiting Time)','gr-sjf','M',null,'https://www.geeksforgeeks.org/problems/shortest-job-first/1','Compute average waiting time using Shortest Job First (non-preemptive).',
            [{input:'5\n1 6\n2 8\n1 7\n3 3\n2 4',output:'9'}],'custom'),
          Q('Insert Interval','gr-insert-interval','M','insert-interval',null),
          Q('Non-overlapping Intervals','gr-non-overlap','M','non-overlapping-intervals',null),
          Q('Minimum Platforms Required','gr-min-platforms','M',null,'https://www.geeksforgeeks.org/problems/minimum-platforms-1587115620/1','Find minimum platforms needed at a railway station.',
            [{input:'6\n900 940 950 1100 1500 1800\n910 1200 1120 1130 1900 2000',output:'3'}],'custom'),
          Q('Page Faults in Optimal Page Replacement','gr-page-faults','M',null,'https://www.geeksforgeeks.org/problems/page-faults-in-lru5545/1','Find number of page faults using LRU page replacement.',
            [{input:'4 4\n7 0 1 2 0 3 0 4 2 3 0 3 2',output:'6'}],'custom'),
        ]
      },
    ]
  },

  /* ─────────────── STEP 13 · Binary Trees (38) ─────────────── */
  {
    id: 'step13', name: 'Binary Trees [Traversals, Medium and Hard Problems]', color: '#0EA5E9',
    substeps: [
      {
        id: 's13-1', name: 'Traversals',
        problems: [
          Q('Introduction to Trees','bt-intro','E',null,'https://www.geeksforgeeks.org/problems/create-a-tree/1','Build a binary tree from level-order input and print its nodes.',
            [{input:'1 2 3 4 5 -1 6',output:'1 2 3 4 5 6'}],'custom'),
          Q('Preorder Traversal','bt-preorder','E','binary-tree-preorder-traversal',null),
          Q('Inorder Traversal','bt-inorder','E','binary-tree-inorder-traversal',null),
          Q('Postorder Traversal','bt-postorder','E','binary-tree-postorder-traversal',null),
          Q('Level Order Traversal','bt-level-order','M','binary-tree-level-order-traversal',null),
          Q('Iterative Preorder Traversal','bt-iter-preorder','M',null,'https://www.geeksforgeeks.org/problems/preorder-traversal-iterative/1','Do a preorder traversal without recursion.',
            [{input:'1 2 3',output:'1 2 3'}],'custom'),
          Q('Iterative Inorder Traversal','bt-iter-inorder','M',null,'https://www.geeksforgeeks.org/problems/inorder-traversal-iterative/1','Do an inorder traversal without recursion.',
            [{input:'1 2 3',output:'2 1 3'}],'custom'),
          Q('Iterative Postorder (2 Stacks)','bt-iter-postorder','M',null,'https://www.geeksforgeeks.org/problems/postorder-traversal-iterative/1','Postorder traversal without recursion using 2 stacks.',
            [{input:'1 2 3',output:'2 3 1'}],'custom'),
          Q('Left View of Binary Tree','bt-left-view','M',null,'https://www.geeksforgeeks.org/problems/left-view-of-binary-tree/1','Print the left view (leftmost node at each level) of a binary tree.',
            [{input:'1 2 3 4 5',output:'1 2 4'}],'custom'),
          Q('Right View of Binary Tree','bt-right-view','M','binary-tree-right-side-view',null),
          Q('Top View of Binary Tree','bt-top-view','M',null,'https://www.geeksforgeeks.org/problems/top-view-of-binary-tree/1','Print the top view of a binary tree.',
            [{input:'1 2 3 4 5 6 7',output:'4 2 1 3 7'}],'custom'),
          Q('Bottom View of Binary Tree','bt-bottom-view','M',null,'https://www.geeksforgeeks.org/problems/bottom-view-of-binary-tree/1','Print the bottom view of a binary tree.',
            [{input:'20 8 22 5 3 25 -1 -1 -1 10 14',output:'5 10 3 14 25'}],'custom'),
          Q('Zigzag / Spiral Level Order Traversal','bt-zigzag','M','binary-tree-zigzag-level-order-traversal',null),
          Q('Boundary Traversal','bt-boundary','M',null,'https://www.geeksforgeeks.org/problems/boundary-traversal-of-binary-tree/1','Print boundary nodes (left boundary, leaves, right boundary in reverse).',
            [{input:'1 2 3 4 5 6 7',output:'1 2 4 5 6 7 3'}],'custom'),
          Q('Vertical Order Traversal','bt-vertical','H','vertical-order-traversal-of-a-binary-tree',null),
        ]
      },
      {
        id: 's13-2', name: 'Medium Problems',
        problems: [
          Q('Maximum Depth of Binary Tree','bt-max-depth','E','maximum-depth-of-binary-tree',null),
          Q('Balanced Binary Tree','bt-balanced','E','balanced-binary-tree',null),
          Q('Diameter of Binary Tree','bt-diameter','E','diameter-of-binary-tree',null),
          Q('Binary Tree Maximum Path Sum','bt-max-path','H','binary-tree-maximum-path-sum',null),
          Q('Same Tree','bt-same','E','same-tree',null),
          Q('Symmetric Tree','bt-symmetric','E','symmetric-tree',null),
          Q('Construct Tree from Inorder and Preorder','bt-construct-pre-in','M','construct-binary-tree-from-preorder-and-inorder-traversal',null),
          Q('Construct Tree from Inorder and Postorder','bt-construct-in-post','M','construct-binary-tree-from-inorder-and-postorder-traversal',null),
          Q('Flatten Binary Tree to Linked List','bt-flatten','M','flatten-binary-tree-to-linked-list',null),
          Q('Path Sum','bt-path-sum','E','path-sum',null),
          Q('Maximum Width of Binary Tree','bt-max-width','M','maximum-width-of-binary-tree',null),
          Q('Sum of Left Leaves','bt-sum-left','E','sum-of-left-leaves',null),
        ]
      },
      {
        id: 's13-3', name: 'Hard Problems',
        problems: [
          Q('Root to Node Path in Binary Tree','bt-root-path','M',null,'https://www.geeksforgeeks.org/problems/root-to-leaf-paths/1','Print all root-to-leaf paths.',
            [{input:'1 2 3 -1 -1 4 5',output:'1->2\n1->3->4\n1->3->5'}],'custom'),
          Q('Lowest Common Ancestor in Binary Tree','bt-lca','M','lowest-common-ancestor-of-a-binary-tree',null),
          Q('All Nodes at Distance K in Binary Tree','bt-dist-k','M','all-nodes-distance-k-in-binary-tree',null),
          Q('Burn Binary Tree from a Node','bt-burn','H',null,'https://www.geeksforgeeks.org/problems/burning-tree/1','Find the minimum time to burn a binary tree starting from a given target leaf node.',
            [{input:'tree: 1 2 3 4 5 -1 6 target: 2',output:'3'}],'custom'),
          Q('Count Total Nodes in Complete Binary Tree','bt-count-complete','M','count-complete-tree-nodes',null),
          Q('Check Children Sum Property','bt-child-sum','M',null,'https://www.geeksforgeeks.org/problems/children-sum-parent/1','Check if for every node, its value equals the sum of its children.',
            [{input:'10 8 2 3 5 -1 -1',output:'Yes'}],'custom'),
          Q('Serialize and Deserialize Binary Tree','bt-serialize','H','serialize-and-deserialize-binary-tree',null),
          Q('Path Sum II (All Paths)','bt-path-sum-2','M','path-sum-ii',null),
          Q('Unique Binary Trees (count)','bt-unique-count','M','unique-binary-search-trees',null),
          Q('Unique Binary Trees II (generate all)','bt-unique-gen','M','unique-binary-search-trees-ii',null),
          Q('Morris Inorder Traversal','bt-morris','H',null,'https://www.geeksforgeeks.org/problems/inorder-traversal/1','Do inorder traversal with O(1) space using Morris traversal.',
            [{input:'4 2 6 1 3 5 7',output:'1 2 3 4 5 6 7'}],'custom'),
        ]
      },
    ]
  },

  /* ─────────────── STEP 14 · BST (16) ─────────────── */
  {
    id: 'step14', name: 'Binary Search Trees [Concept and Problems]', color: '#FB923C',
    substeps: [
      {
        id: 's14-1', name: 'Concepts',
        problems: [
          Q('Search in a BST','bst-search','E','search-in-a-binary-search-tree',null),
          Q('Floor in BST','bst-floor','M',null,'https://www.geeksforgeeks.org/problems/floor-in-bst/1','Find the largest value ≤ X in the BST.',
            [{input:'8 nodes BST, X=14',output:'12'}],'custom'),
          Q('Ceil in BST','bst-ceil','M',null,'https://www.geeksforgeeks.org/problems/implementing-ceil-in-bst/1','Find the smallest value ≥ X in the BST.',
            [{input:'8 nodes BST, X=11',output:'12'}],'custom'),
          Q('Insert into BST','bst-insert','M','insert-into-a-binary-search-tree',null),
          Q('Delete Node in BST','bst-delete','M','delete-node-in-a-bst',null),
          Q('Kth Smallest Element in BST','bst-kth-smallest','M','kth-smallest-element-in-a-bst',null),
          Q('Kth Largest Element in BST','bst-kth-largest','M',null,'https://www.geeksforgeeks.org/problems/kth-largest-element-in-bst/1','Find the Kth largest element in a BST.',
            [{input:'K=3 BST: 4 2 6 1 3 5 7',output:'5'}],'custom'),
        ]
      },
      {
        id: 's14-2', name: 'Problems',
        problems: [
          Q('Validate BST','bst-validate','M','validate-binary-search-tree',null),
          Q('LCA in BST','bst-lca','M','lowest-common-ancestor-of-a-binary-search-tree',null),
          Q('Construct BST from Preorder Traversal','bst-from-preorder','M','construct-binary-search-tree-from-preorder-traversal',null),
          Q('Inorder Successor in BST','bst-inorder-succ','M','inorder-successor-in-bst',null),
          Q('BST Iterator','bst-iterator','M','binary-search-tree-iterator',null),
          Q('Two Sum IV — Input is BST','bst-two-sum','M','two-sum-iv-input-is-a-bst',null),
          Q('Recover BST (Swap Two Nodes)','bst-recover','H','recover-binary-search-tree',null),
          Q('Largest BST in Binary Tree','bst-largest-bst','H',null,'https://www.geeksforgeeks.org/problems/largest-bst/1','Find the largest subtree which is a BST.',
            [{input:'5 2 4 1 3 -1 -1',output:'3'}],'custom'),
          Q('Merge Two BSTs into Sorted List','bst-merge','H',null,'https://www.geeksforgeeks.org/problems/merge-two-bst-s/1','Merge two BSTs and return a sorted list of all elements.',
            [{input:'BST1: 2 1 3\nBST2: 7 0 8',output:'0 1 2 3 7 8'}],'custom'),
        ]
      },
    ]
  },

  /* ─────────────── STEP 15 · Graphs (53) ─────────────── */
  {
    id: 'step15', name: 'Graphs [Concepts & Problems]', color: '#E11D48',
    substeps: [
      {
        id: 's15-1', name: 'Learning',
        problems: [
          Q('Graph Representation (Adjacency List/Matrix)','gr-repr','E',null,'https://www.geeksforgeeks.org/problems/print-adjacency-list-1587115620/1','Build and print the adjacency list of an undirected graph.',
            [{input:'5 7\n0 1\n0 4\n1 2\n1 3\n1 4\n2 3\n3 4',output:'0: 1 4\n1: 0 2 3 4\n2: 1 3\n3: 1 2 4\n4: 0 1 3'}],'custom'),
          Q('BFS of Graph','gr-bfs','E',null,'https://www.geeksforgeeks.org/problems/bfs-traversal-of-graph/1','BFS traversal of a connected undirected graph from vertex 0.',
            [{input:'5 4\n0 1\n0 2\n0 3\n2 4',output:'0 1 2 3 4'}],'custom'),
          Q('DFS of Graph','gr-dfs','E',null,'https://www.geeksforgeeks.org/problems/depth-first-traversal-for-a-graph/1','DFS traversal from vertex 0.',
            [{input:'4 4\n0 1\n0 3\n1 2\n2 3',output:'0 1 2 3'}],'custom'),
          Q('Number of Provinces (Connected Components)','gr-provinces','M','number-of-provinces',null),
          Q('Number of Islands','gr-islands','M','number-of-islands',null),
          Q('Flood Fill','gr-flood','E','flood-fill',null),
        ]
      },
      {
        id: 's15-2', name: 'BFS / DFS Problems',
        problems: [
          Q('Rotten Oranges','gr-rotten','M','rotting-oranges',null),
          Q('Cycle Detection in Undirected Graph (BFS)','gr-cycle-undir-bfs','M',null,'https://www.geeksforgeeks.org/problems/detect-cycle-in-an-undirected-graph/1','Detect if there is a cycle in an undirected graph using BFS.',
            [{input:'4 2\n1 2\n3 4',output:'No'}],'custom'),
          Q('Cycle Detection in Undirected Graph (DFS)','gr-cycle-undir-dfs','M',null,'https://www.geeksforgeeks.org/problems/detect-cycle-in-an-undirected-graph/1','Detect if there is a cycle in an undirected graph using DFS.',
            [{input:'5 5\n0 1\n1 2\n2 0\n1 3\n3 4',output:'Yes'}],'custom'),
          Q('Distance of Nearest Cell Having 1','gr-nearest-1','M',null,'https://www.geeksforgeeks.org/problems/distance-of-nearest-cell-having-1-1587115620/1','Find distance of nearest 1 for every cell in a binary grid.',
            [{input:'3 4\n0 0 0 1\n0 0 1 1\n0 1 1 0',output:'3 2 1 0\n2 1 0 0\n1 0 0 1'}],'custom'),
          Q('Surrounded Regions','gr-surrounded','M','surrounded-regions',null),
          Q('Number of Enclaves','gr-enclaves','M','number-of-enclaves',null),
          Q('Word Ladder I','gr-word-ladder-1','H','word-ladder',null),
          Q('Word Ladder II','gr-word-ladder-2','H','word-ladder-ii',null),
          Q('Number of Distinct Islands','gr-distinct-islands','M',null,'https://www.geeksforgeeks.org/problems/number-of-distinct-islands/1','Count number of distinct island shapes in a binary grid.',
            [{input:'4 5\n1 1 0 1 1\n1 0 0 0 0\n0 0 0 0 1\n1 1 0 1 1',output:'3'}],'custom'),
          Q('Bipartite Graph Check (BFS)','gr-bipartite','M','is-graph-bipartite',null),
          Q('Cycle Detection in Directed Graph (DFS)','gr-cycle-dir','M',null,'https://www.geeksforgeeks.org/problems/detect-cycle-in-a-directed-graph/1','Detect cycle in a directed graph using DFS.',
            [{input:'4 4\n0 1\n0 2\n1 2\n2 0',output:'Yes'}],'custom'),
          Q('Eventual Safe States','gr-safe','M','find-eventual-safe-states',null),
        ]
      },
      {
        id: 's15-3', name: 'Topological Sort / BFS (Kahn\'s)',
        problems: [
          Q('Topological Sort (DFS)','gr-topo-dfs','M',null,'https://www.geeksforgeeks.org/problems/topological-sort/1','Topological sort of a DAG using DFS.',
            [{input:'6 6\n5 2\n5 0\n4 0\n4 1\n2 3\n3 1',output:'5 4 2 3 1 0'}],'custom'),
          Q("Topological Sort — Kahn's Algorithm (BFS)",'gr-topo-bfs','M',null,'https://www.geeksforgeeks.org/problems/topological-sort/1','Topological sort using Kahn\'s BFS algorithm.',
            [{input:'4 3\n0 1\n1 2\n2 3',output:'0 1 2 3'}],'custom'),
          Q('Cycle Detection in Directed Graph (BFS)','gr-cycle-dir-bfs','M',null,'https://www.geeksforgeeks.org/problems/detect-cycle-in-a-directed-graph/1','Detect cycle in directed graph using Kahn\'s algorithm.',
            [{input:'4 4\n0 1\n1 2\n2 3\n3 0',output:'Yes'}],'custom'),
          Q('Course Schedule I','gr-course-1','M','course-schedule',null),
          Q('Course Schedule II','gr-course-2','M','course-schedule-ii',null),
          Q('Find Eventual Safe States (Topo)','gr-safe-topo','M','find-eventual-safe-states',null),
          Q('Alien Dictionary','gr-alien','H',null,'https://www.geeksforgeeks.org/problems/alien-dictionary/1','Determine character ordering from a sorted list of alien words.',
            [{input:'5 4\nbaa\nabcd\nabca\ncab\ncaa',output:'bdac'}],'custom'),
        ]
      },
      {
        id: 's15-4', name: 'Shortest Path Algorithms',
        problems: [
          Q('Shortest Path in Undirected Graph (Unit Weights)','gr-sp-unweighted','M',null,'https://www.geeksforgeeks.org/problems/shortest-path-in-undirected-graph-having-unit-distance/1','Shortest path from source to all nodes (unit weights).',
            [{input:'9 10 0\n0 1\n0 3\n3 4\n4 5\n5 6\n1 2\n2 6\n6 7\n7 8\n6 8',output:'0 1 2 1 2 3 3 4 4'}],'custom'),
          Q('Shortest Path in DAG','gr-sp-dag','M',null,'https://www.geeksforgeeks.org/problems/shortest-path-in-undirected-graph/1','Shortest path from source 0 in a DAG.',
            [{input:'6 7 0\n0 1 2\n0 4 1\n4 5 4\n4 2 2\n1 2 3\n2 3 6\n5 3 1',output:'0 2 3 6 1 5'}],'custom'),
          Q("Dijkstra's Algorithm",'gr-dijkstra','M',null,'https://www.geeksforgeeks.org/problems/implementing-dijkstra-set-1-adjacency-matrix/1','Find shortest path from source using Dijkstra.',
            [{input:'3 3 0\n0 1 4\n0 2 8\n1 2 3',output:'0 4 7'}],'custom'),
          Q('Bellman-Ford Algorithm','gr-bellman','M',null,'https://www.geeksforgeeks.org/problems/bellman-ford/1','Find shortest paths detecting negative weight cycles.',
            [{input:'5 8 0\n0 1 -1\n0 2 4\n1 2 3\n1 3 2\n1 4 2\n3 2 5\n3 1 1\n4 3 -3',output:'0 -1 2 -2 1'}],'custom'),
          Q('Floyd-Warshall Algorithm','gr-floyd','M',null,'https://www.geeksforgeeks.org/problems/implementing-floyd-warshall2042/1','Find shortest paths between all pairs of nodes.',
            [{input:'4\n0 3 INF 7\n8 0 2 INF\n5 INF 0 1\nINF 2 INF 0',output:'0 3 5 6\n8 0 2 3\n5 8 0 1\n10 2 12 0'}],'custom'),
          Q('Path with Minimum Effort','gr-min-effort','M','path-with-minimum-effort',null),
          Q('Cheapest Flights Within K Stops','gr-cheapest-flights','M','cheapest-flights-within-k-stops',null),
          Q('Network Delay Time','gr-network-delay','M','network-delay-time',null),
        ]
      },
      {
        id: 's15-5', name: 'MST / Disjoint Set Union',
        problems: [
          Q('Minimum Spanning Tree (Prim\'s)','gr-prim','M',null,'https://www.geeksforgeeks.org/problems/minimum-spanning-tree/1','Find the MST weight using Prim\'s algorithm.',
            [{input:'5 6\n1 2 2\n1 3 3\n2 3 1\n2 4 1\n3 5 1\n4 5 2',output:'5'}],'custom'),
          Q("Disjoint Set (Union-Find by Rank)",'gr-dsu','M',null,'https://www.geeksforgeeks.org/problems/disjoint-set-union-find/1','Implement Union-Find with union by rank and path compression.',
            [{input:'5 3\nunion 0 2\nunion 4 2\nfind 0 4',output:'Same'}],'custom'),
          Q("Kruskal's Algorithm",'gr-kruskal','M',null,'https://www.geeksforgeeks.org/problems/minimum-spanning-tree/1','Find the MST weight using Kruskal\'s algorithm.',
            [{input:'4 5\n0 1 10\n0 2 6\n0 3 5\n1 3 15\n2 3 4',output:'19'}],'custom'),
          Q('Making a Large Island','gr-large-island','H','making-a-large-island',null),
          Q('Accounts Merge','gr-accounts','M','accounts-merge',null),
          Q('Number of Islands II (Online Queries)','gr-islands-2','H',null,'https://www.geeksforgeeks.org/problems/number-of-islands-ii/1','Add 1s one by one and output island count after each addition.',
            [{input:'4 5\n5\n0 0\n0 1\n1 2\n2 1\n3 3',output:'1 1 2 3 4'}],'custom'),
          Q('Most Stones Removed with Same Row or Column','gr-stones','M','most-stones-removed-with-same-row-or-column',null),
          Q('Satisfiability of Equality Equations','gr-eq-satisfy','M','satisfiability-of-equality-equations',null),
        ]
      },
      {
        id: 's15-6', name: 'Other Algorithms',
        problems: [
          Q('Bridges in Graph (Tarjan\'s)','gr-bridges','H','critical-connections-in-a-network',null),
          Q('Articulation Points','gr-artic','H',null,'https://www.geeksforgeeks.org/problems/articulation-point-1/1','Find all articulation points (cut vertices) in a graph.',
            [{input:'5 5\n0 1\n1 4\n1 2\n1 3\n3 4',output:'1'}],'custom'),
          Q("Kosaraju's Algorithm (SCCs)",'gr-kosaraju','H',null,'https://www.geeksforgeeks.org/problems/strongly-connected-components-kosarajus-algo/1','Find number of Strongly Connected Components.',
            [{input:'5 5\n0 1\n1 2\n2 0\n1 3\n3 4',output:'3'}],'custom'),
          Q("Bellman-Ford (Negative Cycle)",'gr-neg-cycle','M',null,'https://www.geeksforgeeks.org/problems/negative-weight-cycle3504/1','Detect if a graph has a negative weight cycle.',
            [{input:'3 3\n0 1 1\n1 2 -1\n2 0 -1',output:'Yes'}],'custom'),
          Q('Number of Ways to Arrive at Destination','gr-ways-dest','M','number-of-ways-to-arrive-at-destination',null),
          Q('Minimum Multiplications to Reach End','gr-min-mult','M',null,'https://www.geeksforgeeks.org/problems/minimum-multiplications-to-reach-end/1','Find minimum multiplications to convert start to end using given array, mod 100000.',
            [{input:'3 3 4 2 5 7',output:'2'}],'custom'),
          Q('Shortest Path in Binary Matrix','gr-sp-binary','M','shortest-path-in-binary-matrix',null),
          Q('Swim in Rising Water','gr-swim','H','swim-in-rising-water',null),
          Q('Path with Maximum Probability','gr-max-prob','M','path-with-maximum-probability',null),
          Q('Word Search II (Trie + Graph)','gr-word-search-2','H','word-search-ii',null),
          Q('Clone a Graph','gr-clone','M','clone-graph',null),
          Q('Count Unreachable Pairs','gr-unreachable','M','count-unreachable-pairs-of-nodes-in-an-undirected-graph',null),
        ]
      },
    ]
  },

  /* ─────────────── STEP 16 · Dynamic Programming (55) ─────────────── */
  {
    id: 'step16', name: 'Dynamic Programming [Patterns and Problems]', color: '#7C3AED',
    substeps: [
      {
        id: 's16-1', name: '1D DP',
        problems: [
          Q('Climbing Stairs','dp-climb','E','climbing-stairs',null),
          Q('Frog Jump — Minimal Cost','dp-frog-1','M',null,'https://www.geeksforgeeks.org/problems/geek-jump/1','A frog can jump 1 or 2 steps. Find minimum energy cost to reach last stair.',
            [{input:'4\n10 20 30 10',output:'20'}],'array'),
          Q('Frog Jump K Distance','dp-frog-k','M',null,'https://www.geeksforgeeks.org/problems/minimal-cost/1','Frog can jump 1..K steps. Minimize total energy.',
            [{input:'6 2\n10 30 40 50 20 10',output:'30'}],'custom'),
          Q('House Robber I','dp-rob-1','M','house-robber',null),
          Q('House Robber II (Circular)','dp-rob-2','M','house-robber-ii',null),
          Q("Ninja's Training","dp-ninja",'M',null,'https://www.geeksforgeeks.org/problems/ninja-s-training/1','Ninja does one task per day (from 3 choices); same task cannot be done on consecutive days. Maximize total merit.',
            [{input:'3\n1 2 5\n3 1 1\n3 3 3',output:'11'}],'custom'),
        ]
      },
      {
        id: 's16-2', name: '2D / Grid DP',
        problems: [
          Q('Unique Paths','dp-unique-paths','M','unique-paths',null),
          Q('Unique Paths II (with obstacles)','dp-unique-paths-2','M','unique-paths-ii',null),
          Q('Minimum Path Sum','dp-min-path','M','minimum-path-sum',null),
          Q('Triangle — Minimum Path Sum','dp-triangle','M','triangle',null),
          Q('Minimum Falling Path Sum','dp-falling','M','minimum-falling-path-sum',null),
          Q('Cherry Pickup II (3D DP)','dp-cherry','H','cherry-pickup-ii',null),
          Q('Chocolate Pickup (Maximize Collection)','dp-chocolate','H',null,'https://www.geeksforgeeks.org/problems/chocolates-pickup/1','Two people start at row 0. Person A at col 0, Person B at col N-1. Maximize total chocolate collected without both picking same cell.',
            [{input:'3 4\n2 3 1 2\n3 4 2 2\n5 6 3 5',output:'21'}],'custom'),
        ]
      },
      {
        id: 's16-3', name: 'DP on Subsequences',
        problems: [
          Q('Subset Sum Problem','dp-subset-sum','M',null,'https://www.geeksforgeeks.org/problems/subset-sum-problem-1611555638/1','Determine if any subset of the array sums to K.',
            [{input:'6 26\n3 34 4 12 5 2',output:'Yes'}],'custom'),
          Q('Partition Equal Subset Sum','dp-partition-equal','M','partition-equal-subset-sum',null),
          Q('Partition to Minimum Difference','dp-min-diff','M',null,'https://www.geeksforgeeks.org/problems/minimum-sum-partition3317/1','Partition array into two subsets to minimize |sum1 - sum2|.',
            [{input:'4\n1 6 11 5',output:'1'}],'array'),
          Q('Count Subsets with Sum K','dp-count-subsets','M',null,'https://www.geeksforgeeks.org/problems/perfect-sum-problem5633/1','Count total subsets with sum equal to K.',
            [{input:'6 10\n2 3 5 6 8 10',output:'4'}],'custom'),
          Q('Count Partitions with Given Difference','dp-count-partitions','M',null,'https://www.geeksforgeeks.org/problems/partitions-with-given-difference/1','Count ways to partition array into two subsets with difference D.',
            [{input:'4 3\n5 2 6 4',output:'1'}],'custom'),
          Q('0/1 Knapsack','dp-knapsack','M',null,'https://www.geeksforgeeks.org/problems/0-1-knapsack-problem0945/1','Classic 0/1 knapsack — maximize value within weight W.',
            [{input:'3 4\n1 3 4\n1 4 5',output:'7'}],'custom'),
          Q('Coin Change — Minimum Coins','dp-coin-change','M','coin-change',null),
          Q('Coin Change II — Number of Ways','dp-coin-ways','M','coin-change-ii',null),
          Q('Unbounded Knapsack','dp-unbounded','M',null,'https://www.geeksforgeeks.org/problems/knapsack-with-duplicate-items4201/1','Knapsack where each item can be used multiple times.',
            [{input:'4 8\n1 3 4 5\n10 40 50 70',output:'110'}],'custom'),
          Q('Rod Cutting Problem','dp-rod-cut','M',null,'https://www.geeksforgeeks.org/problems/rod-cutting0840/1','Cut rod of length N to maximize price.',
            [{input:'8\n1 5 8 9 10 17 17 20',output:'22'}],'array'),
        ]
      },
      {
        id: 's16-4', name: 'DP on Strings',
        problems: [
          Q('Longest Common Subsequence','dp-lcs','M','longest-common-subsequence',null),
          Q('Print Longest Common Subsequence','dp-print-lcs','M',null,'https://www.geeksforgeeks.org/problems/print-all-lcs-sequences3413/1','Print one LCS of two strings.',
            [{input:'AGGTAB\nGXTXAYB',output:'GTAB'}],'custom'),
          Q('Longest Common Substring','dp-lcsubstr','M',null,'https://www.geeksforgeeks.org/problems/longest-common-substring1452/1','Find length of longest common substring (contiguous).',
            [{input:'ABCDGH\nACBCF',output:'2'}],'custom'),
          Q('Longest Palindromic Subsequence','dp-lpal-subseq','M','longest-palindromic-subsequence',null),
          Q('Minimum Insertions to Make Palindrome','dp-min-ins-pal','M','minimum-insertion-steps-to-make-a-string-palindrome',null),
          Q('Minimum Insertions/Deletions to Convert','dp-min-ins-del','M','delete-operation-for-two-strings',null),
          Q('Shortest Common Supersequence','dp-scs','M','shortest-common-supersequence',null),
        ]
      },
      {
        id: 's16-5', name: 'DP on Stocks',
        problems: [
          Q('Stock Buy and Sell I (1 transaction)','dp-stock-1','E','best-time-to-buy-and-sell-stock',null),
          Q('Stock Buy and Sell II (unlimited)','dp-stock-2','M','best-time-to-buy-and-sell-stock-ii',null),
          Q('Stock Buy and Sell III (2 transactions)','dp-stock-3','H','best-time-to-buy-and-sell-stock-iii',null),
          Q('Stock Buy and Sell IV (K transactions)','dp-stock-4','H','best-time-to-buy-and-sell-stock-iv',null),
          Q('Stock with Cooldown','dp-stock-cool','M','best-time-to-buy-and-sell-stock-with-cooldown',null),
          Q('Stock with Transaction Fee','dp-stock-fee','M','best-time-to-buy-and-sell-stock-with-transaction-fee',null),
        ]
      },
      {
        id: 's16-6', name: 'DP on LIS',
        problems: [
          Q('Longest Increasing Subsequence','dp-lis','M','longest-increasing-subsequence',null),
          Q('Print Longest Increasing Subsequence','dp-print-lis','M',null,'https://www.geeksforgeeks.org/problems/longest-increasing-subsequence-1587115620/1','Print one LIS of the array.',
            [{input:'6\n5 4 11 1 16 8',output:'4 11 16'}],'array'),
          Q('Longest Bitonic Subsequence','dp-bitonic','M',null,'https://www.geeksforgeeks.org/problems/longest-bitonic-subsequence0824/1','Find length of longest bitonic (increases then decreases) subsequence.',
            [{input:'7\n0 8 4 12 2 10 6',output:'5'}],'array'),
          Q('Number of Longest Increasing Subsequences','dp-num-lis','M','number-of-longest-increasing-subsequence',null),
          Q('Maximum Sum Increasing Subsequence','dp-max-sum-lis','M',null,'https://www.geeksforgeeks.org/problems/maximum-sum-increasing-subsequence4749/1','Find max sum of an increasing subsequence.',
            [{input:'7\n1 101 2 3 100 4 5',output:'106'}],'array'),
        ]
      },
      {
        id: 's16-7', name: 'MCM / Partition DP',
        problems: [
          Q('Matrix Chain Multiplication','dp-mcm','H',null,'https://www.geeksforgeeks.org/problems/matrix-chain-multiplication0303/1','Find minimum cost of multiplying N matrices.',
            [{input:'4\n10 30 5 60',output:'27000'}],'array'),
          Q('Minimum Cost to Cut a Stick','dp-cut-stick','H','minimum-cost-to-cut-a-stick',null),
          Q('Burst Balloons','dp-burst','H','burst-balloons',null),
          Q('Evaluate Boolean Expression to True','dp-bool-eval','H',null,'https://www.geeksforgeeks.org/problems/boolean-evaluation/1','Count ways to parenthesise a boolean expression to make it True.',
            [{input:'T|F&T^F',output:'4'}],'custom'),
          Q('Palindrome Partitioning II','dp-pal-partition-2','H','palindrome-partitioning-ii',null),
          Q('Partition Array for Maximum Sum','dp-partition-max','M','partition-array-for-maximum-sum',null),
          Q('Strange Printer','dp-strange-printer','H','strange-printer',null),
        ]
      },
      {
        id: 's16-8', name: 'DP on Squares',
        problems: [
          Q('Maximal Square','dp-max-sq','M','maximal-square',null),
          Q('Count Square Submatrices with All Ones','dp-count-sq','M','count-square-submatrices-with-all-ones',null),
          Q('Count Submatrices with All Ones','dp-count-sub-ones','M','count-submatrices-with-all-ones',null),
          Q('Largest Rectangle in Histogram','dp-lrh','H','largest-rectangle-in-histogram',null),
          Q('Maximal Rectangle (all 1s)','dp-max-rect','H','maximal-rectangle',null),
          Q('Maximum Sum Rectangle in 2D Matrix','dp-max-sum-rect','H',null,'https://www.geeksforgeeks.org/problems/maximum-sum-rectangle2948/1','Find maximum sum sub-rectangle in a 2D matrix.',
            [{input:'4 5\n1 2 -1 -4 -20\n-8 -3 4 2 1\n3 8 10 1 3\n-4 -1 1 7 -6',output:'29'}],'custom'),
          Q('Count Paths in Grid with Obstacles','dp-grid-paths','M','unique-paths-ii',null),
        ]
      },
    ]
  },

  /* ─────────────── STEP 17 · Tries (7) ─────────────── */
  {
    id: 'step17', name: 'Tries', color: '#0891B2',
    substeps: [
      {
        id: 's17-1', name: 'Trie Problems',
        problems: [
          Q('Implement Trie (Prefix Tree)','trie-impl','M','implement-trie-prefix-tree',null),
          Q('Implement Trie — II (count ops)','trie-impl-2','M',null,'https://www.geeksforgeeks.org/problems/trie-insert-and-search0651/1','Implement Trie with insert, countWordsEqualTo, countWordsStartingWith, erase.',
            [{input:'insert apple\ninsert apple\ncountWordsEqualTo apple\ncountWordsStartingWith ap\nerase apple\ncountWordsEqualTo apple',output:'2\n2\n1'}],'custom'),
          Q('Search Suggestions System','trie-suggestions','M','search-suggestions-system',null),
          Q('Maximum XOR of Two Numbers','trie-max-xor','M','maximum-xor-of-two-numbers-in-an-array',null),
          Q('Maximum XOR with Element from Array','trie-max-xor-q','H','maximum-xor-with-an-element-from-array',null),
          Q('Word Search II (Trie)','trie-word-search','H','word-search-ii',null),
          Q('Phone Directory','trie-phone','M',null,'https://www.geeksforgeeks.org/problems/phone-directory4628/1','Return all suggestions from a contact list matching each prefix of the query.',
            [{input:'3 hel\nhello\nhell\nworld',output:'hello hell\nhello hell\nhello hell'}],'custom'),
        ]
      },
    ]
  },

  /* ─────────────── STEP 18 · Strings — Advanced (9) ─────────────── */
  {
    id: 'step18', name: 'Strings [Advanced]', color: '#BE185D',
    substeps: [
      {
        id: 's18-1', name: 'Advanced String Problems',
        problems: [
          Q('Z-Function Algorithm','str-adv-z','H',null,'https://www.geeksforgeeks.org/problems/search-pattern/1','Implement Z-function and use it to find all occurrences of a pattern in a text.',
            [{input:'aabxaaabxab\naabx',output:'0 7'}],'custom'),
          Q('KMP Algorithm (Pattern Matching)','str-adv-kmp','M',null,'https://www.geeksforgeeks.org/problems/search-pattern0205/1','Implement KMP to find all occurrences of a pattern in a text.',
            [{input:'abesabe\nabe',output:'0 4'}],'custom'),
          Q('Minimum Characters to Make Palindrome (using KMP)','str-adv-min-pal','H',null,'https://www.geeksforgeeks.org/problems/minimum-characters-to-be-added-at-front-to-make-string-palindrome/1','Use KMP failure function to find minimum characters to add at front.',
            [{input:'AACECAAAA',output:'2'}],'custom'),
          Q('Anagram Check using KMP','str-adv-anagram-kmp','M',null,'https://www.geeksforgeeks.org/problems/anagram/1','Check if one string is a rotation of another (use KMP on doubled string).',
            [{input:'ABCD CDAB',output:'Yes'}],'custom'),
          Q('Longest Happy Prefix','str-adv-happy','H','longest-happy-prefix',null),
          Q('Count Occurrences of Anagrams','str-adv-count-anagram','M',null,'https://www.geeksforgeeks.org/problems/count-occurences-of-anagrams5839/1','Count occurrences of anagrams of pattern P in text T.',
            [{input:'forxxorfxdofr for',output:'3'}],'custom'),
          Q('Shortest Palindrome (via KMP)','str-adv-short-pal','H','shortest-palindrome',null),
          Q('Longest Substring with At Most Two Distinct Characters','str-adv-two-dist','M',null,'https://www.geeksforgeeks.org/problems/count-distinct-elements-in-every-window/1','Find length of longest substring with at most 2 distinct characters.',
            [{input:'eceba',output:'3'}],'string'),
          Q('Rabin-Karp Algorithm','str-adv-rabin','M',null,'https://www.geeksforgeeks.org/problems/search-pattern0205/1','Implement Rabin-Karp rolling hash for pattern searching.',
            [{input:'aabaabaa\naab',output:'0 3'}],'custom'),
        ]
      },
    ]
  },
];

window.A2Z_STEPS = A2Z_STEPS;
export { A2Z_STEPS };

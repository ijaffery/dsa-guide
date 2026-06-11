---
layout: default
title: C++ DSA Concepts Guide
---

# C++ DSA Concepts Guide

**Pseudocode & Notes for Every Topic**

142 concepts across 11 categories · C++17 syntax

---

## Table of Contents

- [Arrays & Hashing](#arrays--hashing)
- [Two Pointers & Sliding Window](#two-pointers--sliding-window)
- [Stack & Queue](#stack--queue)
- [Binary Search](#binary-search)
- [Linked Lists](#linked-lists)
- [Trees & Tries](#trees--tries)
- [Graphs](#graphs)
- [Dynamic Programming](#dynamic-programming)
- [Intervals & Greedy](#intervals--greedy)
- [Matrices](#matrices)
- [Bit Manipulation](#bit-manipulation)

---

<a id="arrays--hasing"></a>

## Arrays ## Arrays & Hashing Hashing

### 1. Hash Sets

An unordered collection of unique elements with O(1) average insert, delete, and lookup. Use it to answer "have I seen this before?" in constant time. Backed by a hash table; worst case O(n) due to collisions but rare in practice.

```cpp
unordered_set<int> seen;
for (int x : nums) {
    if (seen.count(x)) return true; // duplicate found
    seen.insert(x);
}
return false;
```

---

### 2. Sorting

Rearranging elements into a defined order. Once sorted, many problems become tractable: binary search, two-pointer, duplicate detection, and interval merging all require sorted input. `std::sort` is O(n log n) and accepts a custom comparator lambda.

```cpp
sort(v.begin(), v.end());             // ascending O(n log n)
sort(v.begin(), v.end(), [](int a, int b){
    return a > b;                     // descending
});
```

---

### 3. Basic Array Traversal

The simplest strategy: compare every pair with two nested loops. O(n²) time, O(1) space. Rarely optimal but always correct — useful as a baseline or when n is very small.

```cpp
// O(n^2) brute force -- compare all pairs
for (int i = 0; i < n; i++)
    for (int j = i + 1; j < n; j++)
        if (nums[i] == nums[j]) return true;
return false;
```

---

### 4. Hash Maps

A key-to-value store with O(1) average insert and lookup. Essential for frequency counting, index caching, and grouping items by a common key. Use `unordered_map` for O(1) average or `map` for O(log n) with sorted keys.

```cpp
unordered_map<int, int> freq;
for (int x : nums) freq[x]++;
if (freq.count(key))   { /* key exists */ }
int val = freq[key];   // 0 if not present
```

---

### 5. Arrays

Contiguous memory with O(1) random access by index. For small bounded alphabets (e.g. a–z) a plain `int freq[26]` is faster and simpler than a hash map. `std::vector` is the dynamic version.

```cpp
int freq[26] = {};          // fast fixed alphabet
for (char c : s) freq[c - 'a']++;
vector<int> v = {1, 2, 3}; // dynamic
for (int i = 0; i < (int)v.size(); i++) { /* v[i] */ }
```

---

### 6. Array Traversal

A single pass tracking both element value and its index. The fundamental building block used in almost every array algorithm.

```cpp
for (int i = 0; i < (int)nums.size(); i++) {
    int val = nums[i]; // use both value and index
}
```

---

### 7. Hash Maps / Dictionaries

When items share a common property, use that property as the map key and accumulate matching items into a list. Classic example: group anagrams by their sorted character signature.

```cpp
unordered_map<string, vector<string>> groups;
for (string& w : words) {
    string key = w;
    sort(key.begin(), key.end()); // "eat" -> "aet"
    groups[key].push_back(w);
}
```

---

### 8. String Manipulation

Building, slicing, and transforming strings: iterating character-by-character, extracting substrings with `substr`, reversing with `std::reverse`, filtering, and changing case with `toupper` / `tolower`.

```cpp
string res;
for (char c : s)
    if (isalnum(c)) res += tolower(c);
reverse(res.begin(), res.end());
string sub = s.substr(start, len);
```

---

### 9. Character Frequency Counting

Count how often each character appears. For ASCII lowercase letters a fixed `int[26]` array is faster than a hash map — index with `c - 'a'`. Useful for anagram checks, window validity, and character constraints.

```cpp
int freq[26] = {};
for (char c : s) freq[c - 'a']++;
// Two strings are anagrams iff their freq arrays match
```

---

### 10. Hash Keys

Transforming mutable or composite data into a single immutable string that can be used as a map key. Sorting a string's characters is the classic trick for grouping anagrams.

```cpp
string key = word;
sort(key.begin(), key.end()); // canonical form
anagrams[key].push_back(word);
```

---

### 11. Heap / Priority Queue

A binary heap giving O(1) access to the min (min-heap) or max (max-heap) element, with O(log n) push/pop. Use `priority_queue` for top-k problems, scheduling, and greedy algorithms that always need the smallest/largest element next.

```cpp
priority_queue<int, vector<int>, greater<int>> minH;
priority_queue<int> maxH;           // default max-heap
minH.push(x);
int top = minH.top(); minH.pop();
```

---

### 12. Bucket Sort

Instead of comparing elements, place each value into a bucket whose index equals the value. Reading buckets in order produces a sorted result in O(n). Ideal when the value range is bounded, e.g. frequencies 1 to n.

```cpp
int n = nums.size();
vector<vector<int>> bucket(n + 1);
for (auto& [val, cnt] : freq) bucket[cnt].push_back(val);
vector<int> res;
for (int i = n; i >= 0 && (int)res.size() < k; i--)
    for (int v : bucket[i]) res.push_back(v);
```

---

### 13. Delimiter Design

When encoding a list of strings into one string, choose a separator that cannot appear in the data, or use length-prefixing to make the delimiter unnecessary.

```cpp
string encoded;
for (auto& s : strs)
    encoded += s + '\x1F'; // unit separator char
```

---

### 14. Length-Prefix Encoding

Encode each string as its length, a separator, then the string content: `3#eat4#love`. Decoding reads the length, jumps exactly that many characters, and repeats. No delimiter collision is possible.

```cpp
// Encode: length + '#' + string
string encode(vector<string>& strs) {
    string res;
    for (auto& s : strs) res += to_string(s.size()) + '#' + s;
    return res;
}
// Decode: parse length, skip '#', read that many chars
```

---

### 15. Prefix Sum / Product

Precompute cumulative sums or products so any subarray query is O(1). For products-excluding-self, make two passes: left-to-right accumulating the left product, then right-to-left accumulating the right product.

```cpp
int n = nums.size();
vector<int> out(n, 1);
int L = 1;
for (int i = 0; i < n; i++)     { out[i] = L; L *= nums[i]; }
int R = 1;
for (int i = n - 1; i >= 0; i--){ out[i] *= R; R *= nums[i]; }
```

---

### 16. Array Traversal (Multi-Pass)

Multiple passes through an array, each building on results from the previous pass. Common in prefix-sum, two-pass product, and Dutch National Flag problems.

```cpp
// Two-pass pattern
for (int i = 0; i < n; i++)       left[i]  = /* prefix */;
for (int i = n - 1; i >= 0; i--) right[i] = /* suffix */;
```

---

### 17. Character Classification

Determine whether a character is alphanumeric, alphabetic, a digit, etc. using `isalpha`, `isdigit`, `isalnum`. Essential for palindrome checks and string parsing.

```cpp
for (char c : s) {
    if (!isalnum(c)) continue;  // skip non-alphanumeric
    result += tolower(c);
}
```

---

### 18. Handling Duplicates

After sorting, identical values are adjacent. Skip them with `if (i > 0 && nums[i] == nums[i-1]) continue` to avoid producing duplicate results in two-sum / three-sum problems.

```cpp
sort(nums.begin(), nums.end());
for (int i = 0; i < (int)nums.size(); i++) {
    if (i > 0 && nums[i] == nums[i - 1]) continue;
    // process nums[i] -- guaranteed first occurrence
}
```

---

### 19. Hash Map (Optional)

Store each character's most-recently-seen index. When a duplicate is encountered, the left pointer jumps directly past the earlier occurrence rather than inching forward one step at a time.

```cpp
unordered_map<char, int> last;
int lo = 0;
for (int hi = 0; hi < (int)s.size(); hi++) {
    if (last.count(s[hi])) lo = max(lo, last[s[hi]] + 1);
    last[s[hi]] = hi;
}
```

---

### 20. Hash Set (Sliding Window)

See *Hash Sets*. Particularly useful inside a sliding window to test membership in O(1) and remove stale entries in O(1) as the window shrinks.

```cpp
unordered_set<int> seen(nums.begin(), nums.end());
for (int x : nums)
    if (!seen.count(x - 1)) // x is a sequence start
        while (seen.count(x)) x++;
```

---

<a id="two-pointers"></a>

## Two Pointers ## Two Pointers & Sliding Window Sliding Window

### 21. Two Pointers Technique

Sort first, then use two pointers. Advance the left pointer when the sum is too small, retreat the right pointer when too large. Reduces O(n³) brute force for three-sum to O(n²).

```cpp
sort(nums.begin(), nums.end());
for (int i = 0; i < n; i++) {
    int lo = i + 1, hi = n - 1;
    while (lo < hi) {
        int s = nums[i] + nums[lo] + nums[hi];
        if      (s == 0) { /* record */ lo++; hi--; }
        else if (s <  0) lo++;
        else             hi--;
    }
}
```

---

### 22. Two Pointers

Maintain two indices that move through the array — usually from each end, or both from the left at different speeds. Eliminates the inner loop of a brute-force O(n²) solution, reducing it to O(n).

```cpp
int lo = 0, hi = (int)nums.size() - 1;
while (lo < hi) {
    int s = nums[lo] + nums[hi];
    if      (s == target) { /* found */ break; }
    else if (s <  target) lo++;
    else                  hi--;
}
```

---

### 23. Greedy Algorithms

At each step commit to the locally optimal choice and never reconsider it. Works when the problem has the *greedy-choice property*: local optima compose into a global optimum. Examples: buy-sell stock, jump game, interval scheduling.

```cpp
int minBuy = INT_MAX, maxProfit = 0;
for (int p : prices) {
    minBuy    = min(minBuy, p);
    maxProfit = max(maxProfit, p - minBuy);
}
```

---

### 24. Sliding Window Technique

A variable- or fixed-size window defined by two pointers. Expand the right pointer to grow; shrink the left pointer when a constraint is violated. Achieves O(n) for problems that would otherwise be O(n²).

```cpp
unordered_set<char> win;
int lo = 0, best = 0;
for (int hi = 0; hi < (int)s.size(); hi++) {
    while (win.count(s[hi])) win.erase(s[lo++]);
    win.insert(s[hi]);
    best = max(best, hi - lo + 1);
}
```

---

### 25. Sliding Window

The core two-pointer window pattern for finding the longest/shortest subarray or substring satisfying some condition. Expand right, shrink left when the invariant is violated.

```cpp
// Fixed-size window of length k
int sum = 0;
for (int i = 0; i < k; i++) sum += nums[i];
int best = sum;
for (int i = k; i < (int)nums.size(); i++) {
    sum += nums[i] - nums[i - k];
    best = max(best, sum);
}
```

---

### 26. Hash Map / Frequency Counting (Window)

Track how many times each element appears inside the current window. The maximum frequency determines whether the window can be made uniform with at most k replacements.

```cpp
unordered_map<char,int> freq;
int lo = 0, maxFreq = 0;
for (int hi = 0; hi < (int)s.size(); hi++) {
    maxFreq = max(maxFreq, ++freq[s[hi]]);
    if ((hi - lo + 1) - maxFreq > k) freq[s[lo++]]--;
}
```

---

<a id="stack"></a>

## Stack ## Stack & Queue Queue

### 27. Stack Data Structure

Last-In-First-Out (LIFO). Push elements when processing; pop when a matching or complementary element is found, e.g. bracket matching. `std::stack` wraps a `deque` by default.

```cpp
unordered_map<char,char> match;
match.emplace(')', '{');
match.emplace(']', '[');
match.emplace('}', '{');
stack<char> st;
for (char c : s) {
    if (match.count(c)) {
        if (st.empty() || st.top() != match[c]) return false;
        st.pop();
    } else st.push(c);
}
return st.empty();
```

---

### 28. String Traversal

Iterate over a string character-by-character using a range-based `for` loop or index. Build new strings or test conditions as you go.

```cpp
for (int i = 0; i < (int)s.size(); i++) {
    char c = s[i]; // process character c
}
```

---

### 29. Queue Data Structure

First-In-First-Out (FIFO). `std::queue`: `push` to back, `front` to peek, `pop` to remove. Essential for BFS. Snapshot `q.size()` before the inner loop to process one level at a time.

```cpp
queue<int> q;
q.push(1); q.push(2);       // enqueue
int front = q.front(); q.pop(); // FIFO: front = 1
// In BFS: enqueue neighbors, dequeue to process
```

---

<a id="binary-search"></a>

## Binary Search

### 30. Binary Search

Repeatedly halve the search space by comparing the middle element to the target. Requires a sorted (or monotone) input. Always compute `mid = left + (right - left) / 2` to avoid integer overflow. Time O(log n).

```cpp
int lo = 0, hi = (int)nums.size() - 1;
while (lo <= hi) {
    int mid = lo + (hi - lo) / 2; // avoids overflow
    if      (nums[mid] == target) return mid;
    else if (nums[mid] <  target) lo = mid + 1;
    else                          hi = mid - 1;
}
return -1;
```

---

### 31. Array Rotation Concept

A rotated sorted array splits into two sorted halves. Exactly one of the two halves defined by `mid` is always fully sorted — use that to determine which half the target lies in.

```cpp
// Find minimum in rotated sorted array
int lo = 0, hi = (int)nums.size() - 1;
while (lo < hi) {
    int mid = lo + (hi - lo) / 2;
    if (nums[mid] > nums[hi]) lo = mid + 1; // min in right
    else                      hi = mid;     // min in left (incl mid)
}
return nums[lo];
```

---

### 32. Sorted Array Properties

In a rotated array like `[4,5,6,7,0,1,2]`, comparing `nums[left]` to `nums[mid]` reveals which half is contiguous and sorted. Binary search then proceeds on the sorted half.

```cpp
int lo = 0, hi = (int)nums.size() - 1;
while (lo <= hi) {
    int mid = lo + (hi - lo) / 2;
    if (nums[mid] == target) return mid;
    if (nums[lo] <= nums[mid]) { // left half sorted
        if (target >= nums[lo] && target < nums[mid]) hi = mid - 1;
        else lo = mid + 1;
    } else {                     // right half sorted
        if (target > nums[mid] && target <= nums[hi]) lo = mid + 1;
        else hi = mid - 1;
    }
}
return -1;
```

---

<a id="linked-lists"></a>

## Linked Lists

### 33. Linked List Fundamentals

A chain of nodes, each holding a value and a pointer to the next node. Traversal is O(n); random access does not exist. Always check for `nullptr` before dereferencing.

```cpp
struct ListNode {
    int val; ListNode* next;
    ListNode(int x) : val(x), next(nullptr) {}
};
for (ListNode* c = head; c; c = c->next)
    process(c->val);
```

---

### 34. Pointer Manipulation

Redirecting `next` pointers is the core linked-list operation. Always save the next node before overwriting a pointer to avoid losing the rest of the list.

```cpp
// Always save next before overwriting
ListNode* nxt = cur->next; // save
cur->next     = prev;      // redirect
prev          = cur;       // advance prev
cur           = nxt;       // advance cur
```

---

### 35. Recursion Basics

A function that calls itself on a smaller version of the problem. The base case stops recursion. Useful when the recursive structure mirrors the data structure, e.g. linked lists or trees.

```cpp
// Reverse a linked list recursively
ListNode* reverse(ListNode* head) {
    if (!head || !head->next) return head;
    ListNode* newHead = reverse(head->next);
    head->next->next = head;
    head->next = nullptr;
    return newHead;
}
```

---

### 36. Linked Lists (Key Patterns)

Key patterns: dummy head node, runner (fast/slow) technique, and in-place reversal. Traversal is O(n); insertions and deletions at a known pointer are O(1).

```cpp
// Runner: advance fast n steps ahead first
ListNode *slow = head, *fast = head;
for (int i = 0; i < n; i++) fast = fast->next;
while (fast->next) { slow = slow->next; fast = fast->next; }
slow->next = slow->next->next; // remove nth from end
```

---

### 37. Dummy Nodes

Prepend a sentinel node so the head can be treated like any other node. Eliminates special-casing the head in insertions and deletions. Return `dummy.next` as the new head.

```cpp
ListNode dummy(0);
dummy.next = head;
ListNode* prev = &dummy;
// manipulate via prev->next ...
return dummy.next; // new head
```

---

### 38. Fast and Slow Pointers

Two pointers advancing at different speeds (1 vs 2 steps). When fast reaches the end, slow is at the midpoint. If there is a cycle, the pointers will eventually meet.

```cpp
ListNode *slow = head, *fast = head;
while (fast && fast->next) {
    slow = slow->next;
    fast = fast->next->next;
    if (slow == fast) return true; // cycle detected
}
return false;
```

---

### 39. Linked List Reversal

Change each node's `next` pointer to its predecessor. Requires three variables: `prev`, `cur`, `nxt`. After the loop `prev` is the new head.

```cpp
ListNode* prev = nullptr, *cur = head;
while (cur) {
    ListNode* nxt = cur->next;
    cur->next = prev;
    prev = cur; cur = nxt;
}
return prev; // new head
```

---

### 40. Merging Linked Lists

Interleave two lists by alternately picking from each. Used in reorder-list after finding the midpoint and reversing the second half.

```cpp
// Interleave: l1->l2->l1->l2->...
ListNode *p1 = head, *p2 = second;
while (p2) {
    ListNode *n1 = p1->next, *n2 = p2->next;
    p1->next = p2; p2->next = n1;
    p1 = n1; p2 = n2;
}
```

---

### 41. Dummy Node Pattern (Remove Nth from End)

See *Dummy Nodes*. For remove-nth-from-end: advance a leader pointer n steps ahead, then walk both pointers until the leader hits `nullptr`; the trailer is now just before the target.

```cpp
ListNode dummy(0); dummy.next = head;
ListNode *prev = &dummy, *fast = head;
for (int i = 0; i < n; i++) fast = fast->next;
while (fast) { prev = prev->next; fast = fast->next; }
prev->next = prev->next->next;
return dummy.next;
```

---

### 42. Fast and Slow Pointers (Floyd's Algorithm)

If a cycle exists, the fast pointer laps the slow pointer and they meet inside the cycle. To find the cycle entry: reset one pointer to head and advance both one step at a time until they meet again.

```cpp
// Phase 1: detect
ListNode *slow = head, *fast = head;
while (fast && fast->next) {
    slow = slow->next; fast = fast->next->next;
    if (slow == fast) break;
}
// Phase 2: find entry
slow = head;
while (slow != fast) { slow = slow->next; fast = fast->next; }
return slow; // cycle entry node
```

---

### 43. Merge Two Sorted Lists

Compare the heads of both lists, attach the smaller node to the result, and advance that pointer. Use a dummy head to avoid edge-case handling for the first node. Time O(n+m).

```cpp
ListNode* merge(ListNode* l1, ListNode* l2) {
    ListNode d(0); ListNode* c = &d;
    while (l1 && l2) {
        if (l1->val <= l2->val) { c->next = l1; l1 = l1->next; }
        else                    { c->next = l2; l2 = l2->next; }
        c = c->next;
    }
    c->next = l1 ? l1 : l2;
    return d.next;
}
```

---

### 44. Min Heap / Priority Queue (Merge K Lists)

See *Heap/Priority Queue*. For merge-k-sorted-lists, always extract the globally smallest node across all lists in O(log k) per extraction using a min-heap of (value, node) pairs.

```cpp
// Merge k sorted lists with a min-heap
priority_queue<pair<int,ListNode*>,
    vector<pair<int,ListNode*>>, greater<>> pq;
for (auto* l : lists) if (l) pq.push({l->val, l});
ListNode d(0); ListNode* cur = &d;
while (!pq.empty()) {
    auto [v, node] = pq.top(); pq.pop();
    cur->next = node; cur = cur->next;
    if (node->next) pq.push({node->next->val, node->next});
}
return d.next;
```

---

<a id="trees"></a>

## Trees ## Trees & Tries Tries

### 45. Divide and Conquer

Split the problem in half, recurse on each half independently, then combine results. Merge sort and binary tree construction are canonical examples. Time is often O(n log n).

```cpp
ListNode* mergeK(vector<ListNode*>& L, int l, int r) {
    if (l == r) return L[l];
    int mid = l + (r - l) / 2;
    return merge(mergeK(L, l, mid), mergeK(L, mid+1, r));
}
```

---

### 46. Binary Trees

Each node has at most two children (left and right). The structure naturally fits recursive algorithms: solve for the left subtree, solve for the right, combine at the root.

```cpp
struct TreeNode {
    int val; TreeNode *left, *right;
    TreeNode(int x) : val(x), left(nullptr), right(nullptr) {}
};
// Always check: if (!node) return; before accessing children
```

---

### 47. Breadth-First Search (BFS)

Visit all nodes at depth d before any node at depth d+1. Implemented with a queue. Snapshot `q.size()` at the start of each while-loop iteration to isolate one level.

```cpp
queue<TreeNode*> q;
if (root) q.push(root);
while (!q.empty()) {
    for (int sz = q.size(); sz > 0; sz--) {
        auto* n = q.front(); q.pop();
        process(n->val);
        if (n->left)  q.push(n->left);
        if (n->right) q.push(n->right);
    }
}
```

---

### 48. Depth-First Search (DFS)

Explore as deep as possible before backtracking. Three orderings for trees: preorder (root first), inorder (root between children — sorted for BST), postorder (root last, useful when parent depends on children).

```cpp
void dfs(TreeNode* node, int depth) {
    if (!node) return;           // base case
    process(node->val, depth);   // preorder: root first
    dfs(node->left,  depth + 1);
    dfs(node->right, depth + 1);
}
```

---

### 49. Stack-based Iteration

Convert recursive DFS to an explicit loop using `std::stack`. Push right child before left so that left is processed first, mirroring preorder recursion.

```cpp
// Iterative preorder DFS
stack<TreeNode*> st;
if (root) st.push(root);
while (!st.empty()) {
    auto* n = st.top(); st.pop();
    process(n->val);
    if (n->right) st.push(n->right); // push right first
    if (n->left)  st.push(n->left);
}
```

---

### 50. Binary Tree Structure

Every recursive tree function should handle: (1) `nullptr` base case, (2) process current node, (3) recurse left, (4) recurse right. The `TreeNode` struct holds `val`, `left`, and `right`.

```cpp
int height(TreeNode* node) {
    if (!node) return 0; // base case
    return 1 + max(height(node->left), height(node->right));
}
```

---

### 51. Tree Traversal (DFS)

Recursively visit nodes in a defined order. Inorder on a BST yields values in ascending order. Choose the order based on what the problem needs from each subtree.

```cpp
void inorder(TreeNode* node, vector<int>& out) {
    if (!node) return;
    inorder(node->left, out);
    out.push_back(node->val); // root between children
    inorder(node->right, out);
}
```

---

### 52. Base Case Handling

In any tree recursion, return immediately when `node == nullptr`. This provides the termination condition and the base value, e.g. 0 for height or `true` for structural equality.

```cpp
bool balanced(TreeNode* node) {
    if (!node) return true;         // null is balanced
    int l = height(node->left);
    int r = height(node->right);
    return abs(l - r) <= 1 && balanced(node->left)
                            && balanced(node->right);
}
```

---

### 53. Binary Tree Structure (Balanced Check)

The `TreeNode` struct defines `val`, `left`, and `right`. Build intuition by tracing small examples by hand. Every tree algorithm either returns a value bottom-up or passes state top-down.

```cpp
bool isBalanced(TreeNode* n) {
    if (!n) return true;
    int l = height(n->left), r = height(n->right);
    return abs(l-r) <= 1 && isBalanced(n->left)
                          && isBalanced(n->right);
}
```

---

### 54. Depth First Search (DFS) (Same Tree)

Same Tree / subtree problems: at each node check if both are null (equal), one is null (not equal), or values differ (not equal), then recurse on children.

```cpp
bool sameTree(TreeNode* p, TreeNode* q) {
    if (!p && !q) return true;
    if (!p || !q || p->val != q->val) return false;
    return sameTree(p->left,  q->left)
        && sameTree(p->right, q->right);
}
```

---

### 55. Tree Comparison

Two trees are identical if both are null, or both are non-null with equal values and recursively identical left and right subtrees. One mismatch anywhere returns `false`.

```cpp
bool isSame(TreeNode* p, TreeNode* q) {
    if (!p && !q) return true;
    if (!p || !q) return false;
    return p->val == q->val && isSame(p->left, q->left)
                             && isSame(p->right, q->right);
}
```

---

### 56. Binary Search Tree Properties

All values in the left subtree are strictly less than the node; all in the right subtree are strictly greater. This ordering enables O(log n) search, insert, and delete on balanced BSTs.

```cpp
bool validate(TreeNode* n, long lo, long hi) {
    if (!n) return true;
    if (n->val <= lo || n->val >= hi) return false;
    return validate(n->left,  lo,     n->val)
        && validate(n->right, n->val, hi);
}
// Call: validate(root, LONG_MIN, LONG_MAX)
```

---

### 57. Tree Traversal (Orderings)

Choose based on need: preorder to serialize/clone, inorder to get sorted BST values, postorder when the parent's result depends on its children, BFS for level information.

```cpp
void pre (TreeNode* n) { visit(n); pre(n->left);  pre(n->right);  }
void in  (TreeNode* n) { in(n->left);  visit(n); in(n->right);   }
void post(TreeNode* n) { post(n->left); post(n->right); visit(n); }
```

---

### 58. Recursion (Optional - BST Search)

BST traversal can be done iteratively with a stack or recursively by passing min/max constraints down. Recursive form is usually cleaner for BST validation and range queries.

```cpp
// Iterative BST search
TreeNode* search(TreeNode* node, int t) {
    while (node && node->val != t)
        node = (t < node->val) ? node->left : node->right;
    return node;
}
```

---

### 59. Tree Traversal (DFS/BFS - Path Sum)

DFS (recursive or stack) suits path problems and subtree queries. BFS (queue) suits shortest-path and level-order output. Choose based on which information you need first.

```cpp
// Path sum -- DFS
bool hasPath(TreeNode* n, int target) {
    if (!n) return false;
    if (!n->left && !n->right) return n->val == target;
    return hasPath(n->left,  target - n->val)
        || hasPath(n->right, target - n->val);
}
```

---

### 60. Tree Traversal Orders

Preorder (root → left → right) for serialization. Inorder (left → root → right) for sorted BST output. Postorder (left → right → root) when a parent's result depends on children.

```cpp
// Serialize with preorder
void serialize(TreeNode* n, string& out) {
    if (!n) { out += "N,"; return; }
    out += to_string(n->val) + ",";
    serialize(n->left,  out);
    serialize(n->right, out);
}
```

---

### 61. Recursion / DFS (Diameter)

Combine recursion with DFS to build results bottom-up: recurse into children first, then compute the parent's result from the children's return values (e.g. diameter, path sum).

```cpp
// Diameter = longest path through any node
int diam = 0;
int depth(TreeNode* n) {
    if (!n) return 0;
    int l = depth(n->left), r = depth(n->right);
    diam = max(diam, l + r);
    return 1 + max(l, r);
}
```

---

### 62. Breadth First Search (BFS - Level Order)

See *Breadth-First Search (BFS)*. For level-order output, collect all nodes at each level into a list before moving to the next.

```cpp
vector<vector<int>> levels;
queue<TreeNode*> q;
if (root) q.push(root);
while (!q.empty()) {
    vector<int> level;
    for (int i = q.size(); i > 0; i--) {
        auto* n = q.front(); q.pop();
        level.push_back(n->val);
        if (n->left)  q.push(n->left);
        if (n->right) q.push(n->right);
    }
    levels.push_back(level);
}
```

---

### 63. Binary Search Tree (BST)

Search in O(log n) on average by exploiting ordering: go left when target is smaller, right when larger. Inorder traversal yields sorted values — use this for kth-smallest.

```cpp
// Kth smallest: inorder gives sorted values
int k, result;
void inorder(TreeNode* n) {
    if (!n) return;
    inorder(n->left);
    if (--k == 0) result = n->val;
    inorder(n->right);
}
```

---

### 64. Tree Traversal (DFS - Good Nodes)

Pass state top-down (e.g. max value seen on path from root) to make decisions at each node without needing a global variable for every query.

```cpp
// Count "good" nodes (no greater value on path from root)
int good(TreeNode* n, int mx) {
    if (!n) return 0;
    int cnt = (n->val >= mx) ? 1 : 0;
    mx = max(mx, n->val);
    return cnt + good(n->left, mx) + good(n->right, mx);
}
```

---

### 65. Inorder Traversal

Left → root → right. For a BST this produces values in non-decreasing order. Useful for kth-smallest, validating BST property, and converting BST to sorted array.

```cpp
// Iterative inorder
stack<TreeNode*> st; TreeNode* cur = root;
while (cur || !st.empty()) {
    while (cur) { st.push(cur); cur = cur->left; }
    cur = st.top(); st.pop();
    process(cur->val);
    cur = cur->right;
}
```

---

### 66. Recursion with Return Values

Functions that both perform work on the current node and return a value to the parent. The return value is typically a local optimum (e.g. best one-sided path) that the parent uses to update a global result.

```cpp
int maxPath = INT_MIN;
int gain(TreeNode* n) {
    if (!n) return 0;
    int l = max(0, gain(n->left));
    int r = max(0, gain(n->right));
    maxPath = max(maxPath, l + n->val + r); // global
    return n->val + max(l, r);              // local: one branch up
}
```

---

### 67. Handling Negative Numbers

When combining subtree contributions, clamp negative values to zero with `max(0, subtreeResult)`. A negative contribution is always worse than simply not taking that branch.

```cpp
int dfs(TreeNode* n) {
    if (!n) return 0;
    int l = max(0, dfs(n->left));  // discard if negative
    int r = max(0, dfs(n->right));
    globalMax = max(globalMax, l + n->val + r);
    return n->val + max(l, r);
}
```

---

### 68. Global vs Local State

Use a class-member or reference variable for the global answer (e.g. max path sum). Return only the single-branch maximum from each DFS call so the parent can extend the path upward.

```cpp
int globalMax = INT_MIN;
int local(TreeNode* n) {
    if (!n) return 0;
    int l = max(0, local(n->left));
    int r = max(0, local(n->right));
    globalMax = max(globalMax, l + n->val + r); // update global
    return n->val + max(l, r);                  // return local
}
```

---

### 69. Tree Traversal (BFS - Level Size)

Level-order traversal. Capture `q.size()` before the inner `for` loop to know exactly how many nodes belong to the current level.

```cpp
queue<TreeNode*> q;
if (root) q.push(root);
while (!q.empty()) {
    int sz = q.size();         // snapshot level size
    for (int i = 0; i < sz; i++) {
        auto* n = q.front(); q.pop();
        processLevelNode(n);
        if (n->left)  q.push(n->left);
        if (n->right) q.push(n->right);
    }
}
```

---

### 70. Tree Data Structures (N-ary)

N-ary trees generalize binary trees: each node holds a value and a `vector<Node*>` of children. DFS and BFS patterns are identical to binary trees.

```cpp
struct Node {
    int val;
    vector<Node*> children;
};
void dfs(Node* n) {
    if (!n) return;
    for (Node* c : n->children) dfs(c);
}
```

---

### 71. Hash Maps / Arrays for Children

In a trie, use a fixed `children[26]` array for O(1) access with a known alphabet, or `unordered_map<char, Node*>` when the alphabet is large or sparse.

```cpp
// Fixed 26-child array (O(1) access for a-z)
struct TrieNode {
    array<TrieNode*, 26> ch{};
    bool end = false;
};
// Sparse alphabet: use unordered_map<char, TrieNode*>
```

---

### 72. String Processing (Character Iteration)

Character-by-character iteration with ASCII arithmetic. `c - 'a'` maps a lowercase letter to 0–25. `toupper` / `tolower` convert case. `isalpha` and `isdigit` test character type.

```cpp
for (char c : s) {
    int idx  = c - 'a';      // 0-25 for lowercase
    char up  = toupper(c);
    bool alp = isalpha(c);
    bool dig = isdigit(c);
}
```

---

### 73. Object-Oriented Design

Encapsulate data structure state in a class. The constructor initializes internal state (e.g. a trie root). Public methods expose the interface (`insert`, `search`). Private members hide implementation details.

```cpp
class WordDictionary {
    TrieNode* root;
public:
    WordDictionary() : root(new TrieNode()) {}
    void addWord(const string& w);  // insert into trie
    bool search(const string& w);   // DFS, '.' is wildcard
};
```

---

### 74. Trie (Prefix Tree)

A tree where each edge represents one character. All words sharing a prefix share the same path from the root. Supports O(m) insert and search where m is the word length. Each node stores a children array and an `isEnd` flag.

```cpp
struct T { T* ch[26]{}; bool end=false; };
void insert(T* root, const string& w) {
    for (char c : w) {
        int i = c - 'a';
        if (!root->ch[i]) root->ch[i] = new T();
        root = root->ch[i];
    }
    root->end = true;
}
```

---

<a id="graphs"></a>

## Graphs

### 75. Recursion

A function that calls itself on a strictly smaller subproblem, terminating at a base case. The call stack implicitly stores intermediate state. Convert to iterative with an explicit stack if stack-overflow is a concern for deep inputs.

```cpp
ReturnType solve(State s) {
    if (isBase(s)) return baseValue(s);
    if (memo.count(s)) return memo[s];    // optional
    ReturnType r = combine(solve(smaller(s)));
    return memo[s] = r;
}
```

---

### 76. Arrays / Lists

`std::vector` is the go-to dynamic array in C++. `push_back` is amortized O(1). Random access is O(1). Use `emplace_back` to construct in-place and avoid copies.

```cpp
vector<int> v;
v.push_back(3);           // O(1) amortized
v.pop_back();             // O(1)
v.insert(v.begin()+i, x);// O(n)
v.erase(v.begin()+i);    // O(n)
```

---

### 77. 2D Arrays / Matrices

Represented as `vector<vector<int>>`. Access element at row r, column c with `grid[r][c]`. Retrieve dimensions with `grid.size()` and `grid[0].size()`.

```cpp
int R = grid.size(), C = grid[0].size();
for (int r = 0; r < R; r++)
    for (int c = 0; c < C; c++)
        process(grid[r][c]);
```

---

### 78. Union-Find (Disjoint Set Union)

Tracks which elements belong to the same connected component. `find` with path compression returns the representative in nearly O(1). `union` with rank merges two components. Near-linear total for n operations.

```cpp
int par[N], rnk[N];
int find(int x) {
    return par[x]==x ? x : par[x]=find(par[x]);
}
void unite(int a, int b) {
    a=find(a); b=find(b); if(a==b) return;
    if (rnk[a]<rnk[b]) swap(a,b);
    par[b]=a; if(rnk[a]==rnk[b]) rnk[a]++;
}
```

---

### 79. 2D Matrix / Grid Traversal

BFS from multiple sources simultaneously (multi-source BFS) finds the minimum distance from any source to every cell in O(rows × cols). Seed the queue with all sources at distance 0.

```cpp
// Multi-source BFS
queue<pair<int,int>> q;
for (auto& s : sources) { q.push(s); dist[s]= 0; }
while (!q.empty()) {
    auto [r,c] = q.front(); q.pop();
    for (int d=0;d<4;d++) {
        int nr=r+dr[d], nc=c+dc[d];
        if (inBounds(nr,nc) && dist[nr][nc]==-1)
            { dist[nr][nc]=dist[r][c]+1; q.push({nr,nc}); }
    }
}
```

---

### 80. Multi-source Search

Seed BFS/DFS with all source cells at once — all sources start at distance 0. To identify cells reachable only from the boundary, flood-fill from every boundary cell and mark them; everything else is isolated.

```cpp
// Flood-fill from every boundary cell
queue<pair<int,int>> q;
for (int r=0;r<R;r++) for (int c=0;c<C;c++)
    if ((r==0||r==R-1||c==0||c==C-1) && grid[r][c]=='O')
        { grid[r][c]='S'; q.push({r,c}); }
while (!q.empty()) { /* BFS, mark reachable 'S' */ }
// Remaining 'O' are isolated; 'S' reverts to 'O'
```

---

### 81. Graph Representation

Store a graph as an adjacency list: `vector<vector<int>> adj(n)`. For directed graphs add one direction; for undirected add both. Adjacency matrices cost O(V²) space — use only for dense graphs.

```cpp
int n = 5;
vector<vector<int>> adj(n);
adj[u].push_back(v);             // directed
adj[u].push_back(v); adj[v].push_back(u); // undirected
```

---

### 82. DFS / BFS Traversal

Graph DFS uses a visited array to avoid revisiting nodes and to detect cycles. Graph BFS guarantees the shortest path by hop count in unweighted graphs. Both run in O(V + E).

```cpp
// Graph DFS
vector<bool> vis(n,false);
function<void(int)> dfs=[&](int u){
    vis[u]=true;
    for(int v:adj[u]) if(!vis[v]) dfs(v);
};
// Graph BFS
queue<int> q; vis[src]=true; q.push(src);
while(!q.empty()){int u=q.front();q.pop();
    for(int v:adj[u]) {
  if(!vis[v]) {
    vis[v]=true;
    q.push(v);
  }
}
```

---

### 83. Topological Sort (Kahn's Algorithm)

Compute in-degrees, enqueue all zero-in-degree nodes, repeatedly dequeue and decrement neighbors' in-degrees, enqueuing any that reach zero. If output contains all n nodes, no cycle exists.

```cpp
vector<int> indeg(n,0);
for(auto& [u,v]:edges) indeg[v]++;
queue<int> q;
for(int i=0;i<n;i++) if(!indeg[i]) q.push(i);
vector<int> order;
while(!q.empty()){
    int u=q.front(); q.pop(); order.push_back(u);
    for(int v:adj[u]) if(--indeg[v]==0) q.push(v);
}
bool ok = (int)order.size()==n; // false => cycle
```

---

### 84. Cycle Detection

DFS cycle detection colors nodes: white (unvisited), gray (in current stack), black (done). A gray neighbor indicates a back edge — a cycle. For undirected graphs, a visited non-parent neighbor is a cycle.

```cpp
// 0=unvisited, 1=in-stack, 2=done
vector<int> st(n,0);
bool cycle(int u){
    st[u]=1;
    for(int v:adj[u]){
        if(st[v]==1) return true;
        if(!st[v] && cycle(v)) return true;
    }
    st[u]=2; return false;
}
```

---

### 85. Topological Sort (DFS)

A linear ordering of a DAG's nodes such that for every edge u → v, u appears before v. Produced by either DFS post-order reversed, or Kahn's BFS algorithm.

```cpp
// DFS post-order reversed
vector<bool> vis(n,false); stack<int> stk;
function<void(int)> dfs=[&](int u){
    vis[u]=true;
    for(int v:adj[u]) if(!vis[v]) dfs(v);
    stk.push(u); // push after all descendants
};
// Read stk top-to-bottom for topological order
```

---

### 86. Kahn's Algorithm (BFS - Prerequisites)

See *Topological Sort (Kahn's Algorithm)*. The in-degree of a node equals its number of prerequisites. Nodes with in-degree 0 have no remaining prerequisites and can be processed.

```cpp
// Same as Topological Sort (Kahn's Algorithm).
// In-degree = number of prerequisites for that node.
// Nodes with in-degree 0 are ready to be processed.
```

---

### 87. String Comparison (Alien Dictionary)

To extract character ordering from a sorted alien-language dictionary, compare each adjacent word pair. The first differing character gives one ordering rule. Build a directed graph and topologically sort.

```cpp
for(int i=0;i+1<(int)words.size();i++){
    auto& w1=words[i]; auto& w2=words[i+1];
    for(int j=0;j<(int)min(w1.size(),w2.size());j++){
        if(w1[j]!=w2[j]){
            adj[w1[j]-'a'].push_back(w2[j]-'a');
            break;
        }
    }
}
```

---

<a id="dp"></a>

## Dynamic Programming

### 88. Dynamic Programming

Break a problem into overlapping subproblems, solve each once, and cache the result. Two styles: top-down memoization (recursive + cache) and bottom-up tabulation (iterative DP array). Requires optimal substructure and overlapping subproblems.

```cpp
// Bottom-up
vector<int> dp(n+1,0); dp[0]=BASE;
for(int i=1;i<=n;i++) dp[i]=RECURRENCE(dp[i-1]);
return dp[n];

// Top-down
unordered_map<int,int> memo;
int rec(int i){
    if(memo.count(i)) return memo[i];
    return memo[i]=RECURRENCE(rec(i-1));
}
```

---

### 89. Fibonacci Sequence

The canonical DP example: `f(n) = f(n-1) + f(n-2)`. Naive recursion is O(2ⁿ). Memoization or tabulation reduces it to O(n) time. Space-optimized bottom-up uses only two variables.

```cpp
int fib(int n){
    if(n<=1) return n;
    int a=0,b=1;
    for(int i=2;i<=n;i++){int c=a+b;a=b;b=c;}
    return b; // O(n) time, O(1) space
}
```

---

### 90. Dynamic Programming Fundamentals

Two required properties: (1) *optimal substructure* — the optimal solution is built from optimal solutions to subproblems; (2) *overlapping subproblems* — the same subproblem recurs many times. If both hold, DP applies.

```cpp
// Climbing stairs: ways to reach step n
vector<int> dp(n+1);
dp[0]=1; dp[1]=1;
for(int i=2;i<=n;i++) dp[i]=dp[i-1]+dp[i-2];
return dp[n];
```

---

### 91. Memoization

Top-down DP: add a cache (`unordered_map` or array) to a recursive function. Before computing, check if the answer is already cached; if so, return immediately. Converts exponential recursion to polynomial time.

```cpp
unordered_map<int,int> memo;
int solve(int n){
    if(n<=1) return n;
    if(memo.count(n)) return memo[n];
    return memo[n]=solve(n-1)+solve(n-2);
}
```

---

### 92. Dynamic Programming (1D)

A 1-D array `dp[i]` stores the answer for a subproblem of size i. The recurrence relates `dp[i]` to previous entries. House Robber: `dp[i] = max(dp[i-1], dp[i-2] + nums[i])`.

```cpp
// House Robber: dp[i] = max loot from first i houses
int rob(vector<int>& nums){
    int prev2=0,prev1=0;
    for(int x:nums){
        int cur=max(prev1,prev2+x);
        prev2=prev1; prev1=cur;
    }
    return prev1;
}
```

---

### 93. House Robber I (Circular)

The circular variant cannot rob both the first and last house. Solve two linear sub-problems — exclude the last house, or exclude the first — and take the maximum. Each sub-problem is identical to the original linear house robber.

```cpp
auto linear=[&](int l,int r){
    int a=0,b=0;
    for(int i=l;i<=r;i++){int c=max(b,a+nums[i]);a=b;b=c;}
    return b;
};
return max(linear(0,n-2),linear(1,n-1));
```

---

### 94. Recursion with Memoization

See *Memoization*. The top-down style mirrors the problem's recursive structure, which is often easier to derive first. Convert to bottom-up once correctness is confirmed.

```cpp
unordered_map<int,bool> memo;
bool canBreak(const string& s,unordered_set<string>& d,int i){
    if(i==(int)s.size()) return true;
    if(memo.count(i)) return memo[i];
    bool ok=false;
    for(int j=i+1;j<=(int)s.size()&&!ok;j++)
        if(d.count(s.substr(i,j-i))) ok=canBreak(s,d,j);
    return memo[i]=ok;
}
```

---

### 95. Dynamic Programming (2D)

A 2-D table `dp[i][j]` parameterized by two indices, e.g. two strings, a grid, or start/end of a substring. The palindrome DP table stores `true` if `s[i..j]` is a palindrome.

```cpp
int n=s.size();
vector<vector<bool>> dp(n,vector<bool>(n,false));
for(int i=0;i<n;i++) dp[i][i]=true;
for(int i=n-2;i>=0;i--)
    for(int j=i+1;j<n;j++)
        dp[i][j]=(s[i]==s[j])&&(j-i<3||dp[i+1][j-1]);
```

---

### 96. Manacher's Algorithm (Advanced)

O(n) algorithm for all palindromic substrings. Reuses previously computed palindrome radii to avoid redundant comparisons. A palindrome mirrored inside a larger palindrome has a known minimum radius.

```cpp
string t="#";
for(char c:s){t+=c;t+='#';}
int n=t.size(); vector<int> p(n,0);
int c=0,r=0;
for(int i=0;i<n;i++){
    if(i<r) p[i]=min(r-i,p[2*c-i]);
    while(i+p[i]+1<n&&i-p[i]-1>=0
        &&t[i+p[i]+1]==t[i-p[i]-1]) p[i]++;
    if(i+p[i]>r){c=i;r=i+p[i];}
}
```

---

### 97. Dynamic Programming (Memoization - Coin Change)

See *Memoization*. In coin change, the state is the remaining amount; the transition tries every coin denomination and takes the minimum.

```cpp
// Coin change top-down
unordered_map<int,int> memo;
int coins_(vector<int>& C,int amt){
    if(amt==0) return 0; if(amt<0) return INT_MAX;
    if(memo.count(amt)) return memo[amt];
    int best=INT_MAX;
    for(int c:C){int s=coins_(C,amt-c);
        if(s!=INT_MAX) best=min(best,s+1);}
    return memo[amt]=best;
}
```

---

### 98. Dynamic Programming (Tabulation - Coin Change)

Bottom-up DP: fill the table from the smallest subproblems upward. For coin change, `dp[amt]` is the fewest coins needed for amount `amt`. Initialize `dp[0]=0` and all others to a large sentinel, then iterate.

```cpp
vector<int> dp(amount+1,amount+1);
dp[0]=0;
for(int a=1;a<=amount;a++)
    for(int c:coins)
        if(c<=a) dp[a]=min(dp[a],dp[a-c]+1);
return dp[amount]>amount ? -1 : dp[amount];
```

---

### 99. Trie (Optional - Word Break Acceleration)

An optional acceleration for word-break DP: store dictionary words in a trie so prefix checks during DP are O(m) per character rather than O(m) per dictionary word.

```cpp
// Word break with hash set
vector<bool> dp(n+1,false); dp[0]=true;
for(int i=1;i<=n;i++)
    for(int j=0;j<i;j++)
        if(dp[j]&&dict.count(s.substr(j,i-j)))
            {dp[i]=true;break;}
```

---

### 100. Dynamic Programming (Kadane's Algorithm)

The DP formulation: `dp[i]` = max subarray sum ending at index i = `max(nums[i], dp[i-1] + nums[i])`. Only the previous state is needed, so space is O(1).

```cpp
// dp[i] = max sum ending at index i
int cur=nums[0],best=nums[0];
for(int i=1;i<(int)nums.size();i++){
    cur=max(nums[i],cur+nums[i]);
    best=max(best,cur);
}
return best;
```

---

### 101. Handling Negative Numbers in Products

Unlike sums, a very negative product can become the maximum after multiplying by another negative. Track both `curMax` and `curMin` at each step. Swap them when the current element is negative, then apply the recurrence.

```cpp
int lo=nums[0],hi=nums[0],res=nums[0];
for(int i=1;i<(int)nums.size();i++){
    if(nums[i]<0) swap(lo,hi);   // flip on negative
    hi=max(nums[i],hi*nums[i]);
    lo=min(nums[i],lo*nums[i]);
    res=max(res,hi);
}
return res;
```

---

### 102. Prefix / Suffix Products

Two passes: left-to-right fills the prefix product for each index; right-to-left fills the suffix product. The answer for index i is `left[i] * right[i]`. O(1) extra space with two passes into the output array.

```cpp
int n=nums.size();
vector<int> out(n,1);
int L=1; for(int i=0;i<n;i++)    {out[i]*=L;L*=nums[i];}
int R=1; for(int i=n-1;i>=0;i--) {out[i]*=R;R*=nums[i];}
```

---

### 103. Combinatorics (Grid Paths)

Counting paths in a grid (only right or down) equals C(m+n-2, m-1). The DP approach builds this naturally: `dp[i][j] = dp[i-1][j] + dp[i][j-1]`, since each cell is reachable from above or from the left.

```cpp
vector<vector<int>> dp(m,vector<int>(n,1));
for(int i=1;i<m;i++)
    for(int j=1;j<n;j++)
        dp[i][j]=dp[i-1][j]+dp[i][j-1];
return dp[m-1][n-1];
```

---

### 104. Space Optimization

When a DP recurrence only references the immediately previous row, replace the 2-D table with a 1-D rolling array. For grid DP, one row of size n suffices instead of an m×n table.

```cpp
// Replace 2D table with 1D rolling row
vector<int> dp(n+1,0);
for(int i=0;i<m;i++)
    for(int j=1;j<=n;j++)
        dp[j]=f(dp[j],dp[j-1]); // reuse previous row
```

---

### 105. Kadane's Algorithm (Full)

Scan left to right maintaining the max subarray sum ending at the current index. At each step, either extend the previous subarray or start fresh: `cur = max(nums[i], cur + nums[i])`. Update the global max after each step.

```cpp
int cur=nums[0],best=nums[0];
for(int i=1;i<(int)nums.size();i++){
    cur=max(nums[i],cur+nums[i]);
    best=max(best,cur);
}
return best;
```

---

<a id="intervals"></a>

## Intervals ## Intervals & Greedy Greedy

### 106. Interval Problems

Intervals are `[start, end]` pairs. Always sort by start time first. Two intervals overlap when `a.end > b.start` (given sorted order). Master the merge, insert, and non-overlap-selection patterns.

```cpp
// Always sort by start first
sort(v.begin(),v.end());
// Overlap check: cur.start <= last.end
```

---

### 107. Merging Logic

After sorting by start, scan left to right. If the current interval overlaps the last merged one (`cur.start <= last.end`), extend the end with `max`; otherwise append a new interval.

```cpp
sort(v.begin(),v.end());
vector<vector<int>> res={v[0]};
for(auto& cur:v){
    auto& last=res.back();
    if(cur[0]<=last[1]) last[1]=max(last[1],cur[1]);
    else res.push_back(cur);
}
```

---

### 108. Binary Search (Optimized Interval Solution)

In non-overlapping interval counting, binary search finds the last interval ending before the current one starts. Use `upper_bound` on the sorted array of end times.

```cpp
// Last interval ending before current starts
auto it=upper_bound(ends.begin(),ends.end(),ivs[i][0]-1);
int idx=(int)(it-ends.begin())-1;
```

---

### 109. Intervals (Sub-patterns)

See *Interval Problems*. Key sub-patterns: merging overlapping intervals, inserting a new interval into a sorted list, finding the minimum removals for non-overlap, and allocating meeting rooms.

```cpp
bool overlap(vector<int>& a,vector<int>& b){
    return a[0]<b[1] && b[0]<a[1]; // half-open
}
```

---

### 110. Sweep Line Algorithm

Model interval events as points on a timeline: +1 at each start and -1 at each end. Sort events and scan left to right with a running counter. The peak count is the answer (e.g. maximum simultaneous meetings).

```cpp
vector<pair<int,int>> ev;
for(auto& iv:v){ev.push_back({iv[0],1});ev.push_back({iv[1],-1});}
sort(ev.begin(),ev.end());
int cur=0,peak=0;
for(auto& [t,d]:ev){cur+=d;peak=max(peak,cur);}
return peak;
```

---

### 111. Greedy Algorithms (Interval Scheduling)

See *Greedy Algorithms*. For interval scheduling, always pick the interval with the earliest end time — this leaves the most room for future intervals.

```cpp
// Non-overlapping: pick by earliest end time
sort(v.begin(),v.end(),[](auto& a,auto& b){return a[1]<b[1];});
int cnt=0,last=INT_MIN;
for(auto& iv:v) if(iv[0]>=last){last=iv[1];cnt++;}
return (int)v.size()-cnt;
```

---

### 112. Overlap Detection

Two intervals `[a,b]` and `[c,d]` overlap when `a < d && c < b` (half-open). After sorting by start, only compare each interval to its immediate predecessor.

```cpp
// After sorting by start
for(int i=1;i<(int)v.size();i++)
    if(v[i][0]<v[i-1][1]) { /* overlap */ }
```

---

<a id="matrices"></a>

## Matrices

### 113. 2D Array Indexing

Access `matrix[row][col]`. For in-place 90-degree clockwise rotation: first transpose (swap `m[i][j]` with `m[j][i]`), then reverse each row.

```cpp
// 90-degree clockwise: transpose then reverse rows
for(int i=0;i<n;i++) for(int j=i+1;j<n;j++) swap(m[i][j],m[j][i]);
for(auto& row:m) reverse(row.begin(),row.end());
```

---

### 114. Matrix Transpose

Swap `matrix[i][j]` with `matrix[j][i]` for all `j > i`. For 90-degree clockwise rotation: transpose then reverse each row. For counter-clockwise: reverse each row then transpose.

```cpp
for(int i=0;i<n;i++)
    for(int j=i+1;j<n;j++)
        swap(matrix[i][j],matrix[j][i]);
```

---

### 115. In-Place Manipulation (Rotation)

Rotate a matrix without allocating a copy by processing one ring at a time with a 4-way element swap. Outer loop over layers; inner loop over positions within each layer.

```cpp
int lo=0,hi=n-1;
while(lo<hi){
    for(int i=0;i<hi-lo;i++){
        int tmp=m[lo][lo+i];
        m[lo][lo+i]  =m[hi-i][lo];
        m[hi-i][lo]  =m[hi][hi-i];
        m[hi][hi-i]  =m[lo+i][hi];
        m[lo+i][hi]  =tmp;
    }
    lo++;hi--;
}
```

---

### 116. Layer-by-Layer Processing

Process a matrix from the outermost ring inward, tracking `left` / `right` (or `top` / `bottom`) boundaries and shrinking them after each layer. Used in spiral traversal and in-place rotation.

```cpp
int t=0,b=R-1,l=0,r=C-1;
while(t<=b&&l<=r){
    for(int c=l;c<=r;c++) res.push_back(m[t][c]); t++;
    for(int c=t;c<=b;c++) res.push_back(m[c][r]); r--;
    if(t<=b){for(int c=r;c>=l;c--) res.push_back(m[b][c]);b--;}
    if(l<=r){for(int c=b;c>=t;c--) res.push_back(m[c][l]);l++;}
}
```

---

### 117. 2D Array Traversal

Row-major traversal visits all columns of row 0, then all of row 1, etc. Spiral traversal follows the boundary inward using shrinking bound variables.

```cpp
for(int r=0;r<R;r++)
    for(int c=0;c<C;c++)
        process(matrix[r][c]);
```

---

### 118. Boundary Tracking

Use four variables `top, bottom, left, right` for the current spiral layer. After processing each side, increment/decrement the corresponding variable to shrink inward.

```cpp
int top=0,bot=R-1,left=0,right=C-1;
while(top<=bot&&left<=right){
    // process top row, right col, bottom row, left col
    top++; right--; bot--; left++;
}
```

---

### 119. Direction Vectors

Encode the four cardinal moves as parallel arrays `dr[]{0,0,1,-1}` and `dc[]{1,-1,0,0}`. Loop over d = 0..3 and compute `nr = r+dr[d], nc = c+dc[d]`. Check bounds before visiting.

```cpp
int dr[]{0,0,1,-1}, dc[]{1,-1,0,0};
for(int d=0;d<4;d++){
    int nr=r+dr[d],nc=c+dc[d];
    if(nr>=0&&nr<R&&nc>=0&&nc<C) visit(nr,nc);
}
```

---

### 120. 2D Arrays / Matrices (Grid)

See *2D Arrays/Matrices*. A `vector<vector<int>>` grid is accessed as `grid[r][c]`. Pass `rows = grid.size()` and `cols = grid[0].size()` to helper functions.

```cpp
int R=grid.size(),C=grid[0].size();
vector<vector<bool>> vis(R,vector<bool>(C,false));
// Access: grid[r][c]  Mark visited: vis[r][c]=true
```

---

### 121. In-Place Modification

Use the sign or a sentinel value of existing matrix entries as flags rather than allocating a separate boolean matrix. Make two passes: the first marks, the second applies the change.

```cpp
// Two passes: mark then update
for(int r=0;r<R;r++) for(int c=0;c<C;c++)
    if(m[r][c]==0){rowSet.insert(r);colSet.insert(c);}
for(int r:rowSet) fill(m[r].begin(),m[r].end(),0);
for(int c:colSet) for(int r=0;r<R;r++) m[r][c]=0;
```

---

### 122. Marker Techniques

Use index-as-flag: for a value `x` in an array, negate `nums[|x|-1]` to record that `|x|` has been seen. A second pass finds any index still positive — that index+1 was never present.

```cpp
// Sign as flag: mark index abs(x)-1 as negative
for(int x:nums){int i=abs(x)-1;nums[i]=-abs(nums[i]);}
for(int i=0;i<n;i++)
    if(nums[i]>0) return i+1; // i+1 never appeared
return n+1;
```

---

<a id="bit-manipulation"></a>

## Bit Manipulation

### 123. Binary Number Representation

An integer is stored as a sequence of bits. Bit k (0-indexed from the right) has value 2^k. The 32-bit signed integer range is -2³¹ to 2³¹-1.

```cpp
// Print 32-bit binary
for(int k=31;k>=0;k--)
    cout<<((x>>k)&1);
// Or: bitset<32>(x)
```

---

### 124. Bitwise AND Operator

`x & y` produces 1 only where both inputs are 1. Uses: test if bit k is set (`x & (1 << k)`), test even/odd (`x & 1`), clear the lowest set bit (`x & (x-1)`).

```cpp
bool odd     = x & 1;           // LSB check
bool isPow2  = x>0 && !(x&(x-1));
int  noLowBit= x & (x-1);         // clears lowest set bit
int  testK   = (x>>k) & 1;        // extract bit k
```

---

### 125. Bit Shifting

`x << k` multiplies by 2^k; `x >> k` divides by 2^k. Use `(x >> k) & 1` to extract bit k. Use `1 << k` to create a mask for bit k. Combine with OR to set, AND-NOT to clear.

```cpp
int mask  = 1 << k;   // select bit k
int set_  = x | mask; // set bit k
int clr   = x & ~mask;// clear bit k
int tog   = x ^ mask; // toggle bit k
int div4  = x >> 2;
int mul8  = x << 3;
```

---

### 126. Bitwise Tricks

`n & (n-1)` clears the lowest set bit — useful for counting set bits (Brian Kernighan) and testing powers of two. `n & (-n)` isolates the lowest set bit.

```cpp
// Count set bits (Brian Kernighan)
int cnt=0;
for(int t=x;t;t&=t-1) cnt++;

bool isPow2 = x>0 && !(x&(x-1));
int lsb     = x & (-x); // isolate lowest set bit
```

---

### 127. Bit Manipulation (XOR Single Non-Duplicate)

Operate directly on the binary representation using AND, OR, XOR, NOT, and shifts. Often achieves O(1) or O(log n) solutions for problems involving binary representations, missing numbers, or parity.

```cpp
// Find the single non-duplicate via XOR
int res=0;
for(int x:nums) res^=x; // duplicates cancel
return res;
```

---

### 128. Binary Number System (DP on Bit Count)

Integers in base 2. DP on bit count: `dp[i] = dp[i >> 1] + (i & 1)`. Use `__builtin_popcount(x)` (GCC/Clang) or Brian Kernighan's loop to count set bits.

```cpp
// Count bits for all 0..n using DP
vector<int> dp(n+1,0);
for(int i=1;i<=n;i++) dp[i]=dp[i>>1]+(i&1);
return dp;
```

---

### 129. Bit Manipulation Operators

The fundamental operators: AND (`&`), OR (`|`), XOR (`^`), NOT (`~`), left shift (`<<`), right shift (`>>`). Combine them to set, clear, toggle, and test individual bits.

```cpp
int a=5,b=3;       // 101, 011
cout<<(a&b) <<"\n"; // AND: 001 = 1
cout<<(a|b) <<"\n"; // OR:  111 = 7
cout<<(a^b) <<"\n"; // XOR: 110 = 6
cout<<(~a)  <<"\n"; // NOT: ...11111010
cout<<(a<<1)<<"\n"; // SHL: 1010 = 10
cout<<(a>>1)<<"\n"; // SHR: 010  = 2
```

---

### 130. Extracting and Setting Individual Bits

Extract bit k: `(n >> k) & 1`. Set: `n |= (1 << k)`. Clear: `n &= ~(1 << k)`. Toggle: `n ^= (1 << k)`. Build a number bit by bit with `result |= (bit << k)`.

```cpp
int get = (n>>k)&1;     // extract bit k
int set = n|(1<<k);     // set bit k
int clr = n&~(1<<k);   // clear bit k
int tog = n^(1<<k);    // toggle bit k
result |= (bit<<k);    // place bit at position k
```

---

### 131. Bitwise XOR (Single Non-Duplicate & Missing)

XOR key properties: `a ^ a = 0` (self-cancellation) and `a ^ 0 = a` (identity). XOR all array elements together: duplicates cancel and only the unique element remains.

```cpp
// Single non-duplicate
int res=0;
for(int x:nums) res^=x;
return res;

// Missing number
int miss=n;
for(int i=0;i<n;i++) miss^=i^nums[i];
```

---

### 132. Math (Sum Formula)

Sum of 0 through n is n(n+1)/2. Subtracting the actual array sum from the expected sum gives the missing number in O(n) time and O(1) space — no hashing or sorting required.

```cpp
int n=nums.size();
int expected=n*(n+1)/2;
int actual=accumulate(nums.begin(),nums.end(),0);
return expected-actual;
```

---

### 133. Bit Manipulation Basics

Start with binary representation, then AND/OR/XOR truth tables, then shifts. Many trick solutions become obvious once you think in binary: even/odd, powers of two, swapping without a temp variable.

```cpp
// AND  (&) : keep bits set in BOTH
// OR   (|) : keep bits set in EITHER
// XOR  (^) : keep bits set in EXACTLY ONE
// NOT  (~) : flip all bits
// SHL (<<) : shift left  (x2)
// SHR (>>) : shift right (/2)
```

---

### 134. Two's Complement Representation

Negative integers are stored as the bitwise NOT of their positive counterpart plus one. `-1` is all ones (`0xFFFFFFFF`). Right-shifting a negative signed integer fills with 1s (arithmetic shift in C++).

```cpp
int neg = ~x + 1;         // negate x
bool isNeg = (x>>31) & 1; // sign bit
// INT_MIN = 0x80000000; -INT_MIN overflows!
// Use (long long) when negating INT_MIN
```

---

### 135. Binary Addition

Add two integers without the `+` operator: XOR gives the sum bits ignoring carry; AND followed by left-shift gives the carry bits. Repeat until no carry remains.

```cpp
int add(int a,int b){
    while(b){
        int carry=(unsigned)(a&b)<<1;
        a=a^b; b=carry;
    }
    return a;
}
```

---

## Backtracking (Bonus)

### 136. Backtracking

Explore all possibilities by making a choice, recursing, then *undoing* the choice before trying the next option. The invariant: state before and after a recursive call is identical. Used for permutations, combinations, and constraint satisfaction.

```cpp
void bt(int i, vector<int>& cur, vector<vector<int>>& res) {
    res.push_back(cur);            // record current state
    for (int j = i; j < n; j++) {
        cur.push_back(nums[j]);    // choose
        bt(j + 1, cur, res);       // explore
        cur.pop_back();            // undo
    }
}
```

---

### 137. 2D Grid Traversal

Move through a matrix in four directions using delta arrays. Validate bounds and visited status before visiting a neighbor. Mark cells visited in-place or with a separate `visited` array.

```cpp
int dr[]{0,0,1,-1}, dc[]{1,-1,0,0};
void dfs(vector<vector<char>>& g, int r, int c) {
    int R=g.size(), C=g[0].size();
    if (r<0||r>=R||c<0||c>=C||g[r][c]!='1') return;
    g[r][c] = '0'; // mark visited in-place
    for (int d=0;d<4;d++) dfs(g, r+dr[d], c+dc[d]);
}
```

---

### 138. Heap / Priority Queue (Two-Heap Median)

The two-heap median-finder uses a max-heap for the lower half and a min-heap for the upper half, keeping their sizes balanced to within one. Median is the top of the larger heap or the average of both tops.

```cpp
// Two-heap median finder
priority_queue<int> lo;
priority_queue<int,vector<int>,greater<int>> hi;
void addNum(int n) {
    lo.push(n); hi.push(lo.top()); lo.pop();
    if (lo.size() < hi.size()) { lo.push(hi.top()); hi.pop(); }
}
double median() {
    return lo.size() > hi.size() ? lo.top()
           : (lo.top() + hi.top()) / 2.0;
}
```

---

### 139. Data Stream Design

Design a class that processes elements one at a time and supports efficient queries on the running data. Maintain invariants on each insertion so that queries are answered in O(1) or O(log n). The median-finder is the canonical example.

```cpp
// General pattern: maintain invariants on insert
//   so queries are O(1) or O(log n).
// Median finder: see Heap / Priority Queue above.
// Running sum/mean: accumulate count and total.
```

---

## Additional Concepts

### 140. Recursion (General Pattern)

A function that calls itself on a strictly smaller subproblem, terminating at a base case. The call stack implicitly stores intermediate state. Convert to iterative with an explicit stack if stack-overflow is a concern for deep inputs.

```cpp
ReturnType solve(State s) {
    if (isBase(s)) return baseValue(s);
    if (memo.count(s)) return memo[s];    // optional
    ReturnType r = combine(solve(smaller(s)));
    return memo[s] = r;
}
```

---

### 141. Arrays / Lists (vector)

`std::vector` is the go-to dynamic array in C++. `push_back` is amortized O(1). Random access is O(1). Use `emplace_back` to construct in-place and avoid copies.

```cpp
vector<int> v;
v.push_back(3);           // O(1) amortized
v.pop_back();             // O(1)
v.insert(v.begin()+i, x);// O(n)
v.erase(v.begin()+i);    // O(n)
```

---

### 142. 2D Arrays / Matrices (Grid)

Represented as `vector<vector<int>>`. Access element at row r, column c with `grid[r][c]`. Retrieve dimensions with `grid.size()` and `grid[0].size()`.

```cpp
int R = grid.size(), C = grid[0].size();
for (int r = 0; r < R; r++)
    for (int c = 0; c < C; c++)
        process(grid[r][c]);
```

---

*Generated from LaTeX source · 142 concepts across 11 categories · C++17*

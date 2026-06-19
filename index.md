---
layout: default
title: C++ DSA Concepts Guide
---

# C++ DSA Concepts Guide

**Pseudocode & Notes for Every Topic**

~100 concepts across 11 categories · C++17 syntax

Each code block is tagged with the specific problem it solves, so you can see the pattern in context.

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
- [Backtracking (Bonus)](#backtracking-bonus)
- [Additional Concepts](#additional-concepts)

---


## Arrays & Hashing

### 1. Arrays & Traversal

Contiguous memory with O(1) random access by index. A single pass tracks both the value and its index — the building block used in almost every array algorithm. For small bounded alphabets (e.g. a–z) a plain `int freq[26]` is faster and simpler than a hash map. `std::vector` is the dynamic, resizable version.

**Problem:** General-purpose pattern used across most array problems (e.g. *Contains Duplicate*, *Two Sum*).

```cpp
vector<int> v = {1, 2, 3};            // dynamic array
for (int i = 0; i < (int)v.size(); i++) {
    int val = v[i];                   // use both value and index
}
int freq[26] = {};                    // fast fixed alphabet
for (char c : s) freq[c - 'a']++;
```

---

### 2. Hash Sets

An unordered collection of unique elements with O(1) average insert, delete, and lookup. Use it to answer "have I seen this before?" in constant time. Backed by a hash table; worst case O(n) due to collisions but rare in practice.

> **📐 Math:** Expected collisions for $n$ items into a table of size $m$ (load factor $\alpha = n/m$) follow the birthday-problem approximation: $P(\text{collision}) \approx 1 - e^{-n^2/2m}$. This is why hash tables resize (double $m$) once $\alpha$ exceeds ~0.7 — it keeps expected probe length near $O(1)$.

**Problem:** *Contains Duplicate* — return true if any value appears more than once in `nums`.

```cpp
unordered_set<int> seen;
for (int x : nums) {
    if (seen.count(x)) return true; // duplicate found
    seen.insert(x);
}
return false;
```

---

### 3. Hash Maps

A key-to-value store with O(1) average insert and lookup. Essential for frequency counting, index caching, and grouping items by a common key. Use `unordered_map` for O(1) average or `map` for O(log n) with sorted keys.

**Problem:** *Two Sum* — find indices `i, j` such that `nums[i] + nums[j] == target`, using one pass and a value→index map.

```cpp
unordered_map<int, int> seen; // value -> index
for (int i = 0; i < (int)nums.size(); i++) {
    int need = target - nums[i];
    if (seen.count(need)) return {seen[need], i};
    seen[nums[i]] = i;
}
```

---

### 4. Hash Map as Grouping Key

When items share a common property, use that property as the map key and accumulate matching items into a list. Sorting a string's characters into a canonical form is the classic way to turn "is this an anagram of that" into "do these have the same key."

**Problem:** *Group Anagrams* — group words that are anagrams of each other.

```cpp
unordered_map<string, vector<string>> groups;
for (string& w : words) {
    string key = w;
    sort(key.begin(), key.end()); // "eat" -> "aet"
    groups[key].push_back(w);
}
```

---

### 5. Character Frequency Counting

Count how often each character appears. For ASCII lowercase letters a fixed `int[26]` array is faster than a hash map — index with `c - 'a'`. Two strings are anagrams iff their frequency arrays match exactly.

**Problem:** *Valid Anagram* — check whether `s` and `t` are anagrams of each other.

```cpp
int freq[26] = {};
for (char c : s) freq[c - 'a']++;
for (char c : t) freq[c - 'a']--;
for (int f : freq) if (f != 0) return false;
return s.size() == t.size();
```

---

### 6. Sorting

Rearranging elements into a defined order. Once sorted, many problems become tractable: binary search, two-pointer, duplicate detection, and interval merging all require sorted input. `std::sort` is O(n log n) and accepts a custom comparator lambda.

> **📐 Math:** Comparison sorts are bounded below by $\Omega(n \log n)$: there are $n!$ possible orderings, and each comparison gives at most 1 bit of information, so you need at least $\log_2(n!) \approx n \log_2 n - 1.44n$ comparisons (Stirling's approximation) to distinguish them all.

**Problem:** Sort `nums` ascending, or descending with a custom comparator — the foundation for two-pointer and interval problems.

```cpp
sort(v.begin(), v.end());             // ascending O(n log n)
sort(v.begin(), v.end(), [](int a, int b){
    return a > b;                     // descending
});
```

---

### 7. Basic Array Traversal (Brute Force)

The simplest strategy: compare every pair with two nested loops. O(n²) time, O(1) space. Rarely optimal but always correct — useful as a baseline or when n is very small.

> **📐 Math:** $n(n-1)/2$ pairs are compared in the worst case — the sum of $(n-1) + (n-2) + \ldots + 1$, i.e. an arithmetic series, which is exactly where the $n^2$ term comes from.

**Problem:** *Contains Duplicate*, brute-force version — compare every pair before reaching for a hash set.

```cpp
// O(n^2) brute force -- compare all pairs
for (int i = 0; i < n; i++)
    for (int j = i + 1; j < n; j++)
        if (nums[i] == nums[j]) return true;
return false;
```

---

### 8. String Manipulation

Building, slicing, and transforming strings: iterating character-by-character, extracting substrings with `substr`, reversing with `std::reverse`, filtering, and changing case with `toupper` / `tolower`.

**Problem:** *Valid Palindrome* — strip non-alphanumeric characters, lowercase everything, then compare to its reverse.

```cpp
string res;
for (char c : s)
    if (isalnum(c)) res += tolower(c);
reverse(res.begin(), res.end());
string sub = s.substr(start, len);
```

---

### 9. Heap / Priority Queue

A binary heap giving O(1) access to the min (min-heap) or max (max-heap) element, with O(log n) push/pop. Use `priority_queue` for top-k problems, scheduling, and greedy algorithms that always need the smallest/largest element next.

**Problem:** *Kth Largest Element in an Array* — push, pop, peek with a min-heap and max-heap.

```cpp
priority_queue<int, vector<int>, greater<int>> minH;
priority_queue<int> maxH;           // default max-heap
minH.push(x);
int top = minH.top(); minH.pop();
```

---

### 10. Bucket Sort

Instead of comparing elements, place each value into a bucket whose index equals the value. Reading buckets in order produces a sorted result in O(n). Ideal when the value range is bounded, e.g. frequencies 1 to n.

> **📐 Math:** Bucket sort is $O(n)$ only because the value range is bounded by $n$: with $n$ buckets holding $n$ total elements, total work across all buckets is $O(n)$ even though each bucket might be scanned individually. This breaks down to $O(n \log n)$ (comparison-sort territory) once bucket sizes aren't bounded by a constant.

**Problem:** *Top K Frequent Elements* — bucket elements by frequency count (1..n), then read off the top k from the highest-frequency bucket down.

```cpp
int n = nums.size();
vector<vector<int>> bucket(n + 1);
for (auto& [val, cnt] : freq) bucket[cnt].push_back(val);
vector<int> res;
for (int i = n; i >= 0 && (int)res.size() < k; i--)
    for (int v : bucket[i]) res.push_back(v);
```

---

### 11. Length-Prefix Encoding

When encoding a list of strings into one string, choose a separator that cannot appear in the data — or sidestep the problem entirely with length-prefixing: encode each string as its length, a separator, then the content (`3#eat4#love`). Decoding reads the length, jumps exactly that many characters, and repeats. No delimiter collision is possible.

**Problem:** *Encode and Decode Strings* — serialize a list of strings into one string and back, even if the strings contain arbitrary characters.

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

### 12. Prefix / Suffix Sum or Product

Precompute cumulative sums or products so any subarray query is O(1). For products-excluding-self, make two passes: left-to-right accumulating the left product, then right-to-left accumulating the right product. The same two-pass shape works for prefix sums.

> **📐 Math:** If $P[i] = \text{nums}[0] \cdot \text{nums}[1] \cdot \ldots \cdot \text{nums}[i-1]$ (left product) and $S[i] = \text{nums}[i+1] \cdot \ldots \cdot \text{nums}[n-1]$ (right product), then $\text{answer}[i] = P[i] \cdot S[i]$ — the product of everything except $\text{nums}[i]$. Computing $P$ and $S$ each take one $O(n)$ pass, and they can be folded into a single output array to get $O(1)$ extra space.

**Problem:** *Product of Array Except Self* — compute, for each index, the product of every other element without using division.

```cpp
int n = nums.size();
vector<int> out(n, 1);
int L = 1;
for (int i = 0; i < n; i++)     { out[i] = L; L *= nums[i]; }
int R = 1;
for (int i = n - 1; i >= 0; i--){ out[i] *= R; R *= nums[i]; }
```

---

### 13. Character Classification

Determine whether a character is alphanumeric, alphabetic, a digit, etc. using `isalpha`, `isdigit`, `isalnum`. Essential for palindrome checks and string parsing.

**Problem:** *Valid Palindrome* (classification step) — skip characters that aren't letters or digits before comparing.

```cpp
for (char c : s) {
    if (!isalnum(c)) continue;  // skip non-alphanumeric
    result += tolower(c);
}
```

---

### 14. Handling Duplicates (Sorted Array)

After sorting, identical values are adjacent. Skip them with `if (i > 0 && nums[i] == nums[i-1]) continue` to avoid producing duplicate results in two-sum / three-sum problems.

**Problem:** *3Sum* (dedup step) — after sorting, skip repeated values for `i` so the same triplet isn't reported twice.

```cpp
sort(nums.begin(), nums.end());
for (int i = 0; i < (int)nums.size(); i++) {
    if (i > 0 && nums[i] == nums[i - 1]) continue;
    // process nums[i] -- guaranteed first occurrence
}
```

---

### 15. Hash Map for Skip-Ahead Window

Store each character's most-recently-seen index. When a duplicate is encountered, the left pointer jumps directly past the earlier occurrence rather than inching forward one step at a time — an O(n) refinement over the naive shrink-one-at-a-time sliding window.

**Problem:** *Longest Substring Without Repeating Characters*, optimized version — jump `lo` straight past the duplicate instead of incrementing it in a loop.

```cpp
unordered_map<char, int> last;
int lo = 0;
for (int hi = 0; hi < (int)s.size(); hi++) {
    if (last.count(s[hi])) lo = max(lo, last[s[hi]] + 1);
    last[s[hi]] = hi;
}
```

---

### 16. Hash Set for Sequence Detection

A hash set isn't just for membership tests — checking `!seen.count(x - 1)` finds the *start* of a run, so you only walk forward from true sequence starts instead of re-walking every element.

**Problem:** *Longest Consecutive Sequence* — find the length of the longest run of consecutive integers in O(n), without sorting.

```cpp
unordered_set<int> seen(nums.begin(), nums.end());
for (int x : nums)
    if (!seen.count(x - 1)) // x is a sequence start
        while (seen.count(x)) x++;
```

---


## Two Pointers & Sliding Window

### 17. Two Pointers

Maintain two indices that move through the array — usually from each end, or both from the left at different speeds. Eliminates the inner loop of a brute-force O(n²) solution, reducing it to O(n). When the array isn't already sorted, sort first and the technique still applies: advance the left pointer when the sum is too small, retreat the right pointer when too large.

**Problem:** *Two Sum II (sorted input)* and *3Sum* — find pairs/triplets summing to a target using converging pointers instead of nested loops.

```cpp
// Two-pointer on a sorted array (pair sum)
int lo = 0, hi = (int)nums.size() - 1;
while (lo < hi) {
    int s = nums[lo] + nums[hi];
    if      (s == target) { /* found */ break; }
    else if (s <  target) lo++;
    else                  hi--;
}

// Extended to triplets (3Sum): fix i, two-pointer the rest
sort(nums.begin(), nums.end());
for (int i = 0; i < n; i++) {
    int l = i + 1, r = n - 1;
    while (l < r) {
        int s = nums[i] + nums[l] + nums[r];
        if      (s == 0) { /* record */ l++; r--; }
        else if (s <  0) l++;
        else             r--;
    }
}
```

---

### 18. Sliding Window

A variable- or fixed-size window defined by two pointers. Expand the right pointer to grow; shrink the left pointer when a constraint is violated. Achieves O(n) for problems that would otherwise be O(n²). For a *fixed*-size window, no shrinking logic is needed — just subtract the element leaving and add the one entering.

> **📐 Math:** Despite the nested-looking while loop, total pointer movement is bounded: `lo` and `hi` each move forward at most $n$ times across the whole run, never backward. So total work is $O(n) + O(n) = O(n)$, not $O(n^2)$ — this is the *amortized* argument that makes sliding window linear.

**Problem:** *Longest Substring Without Repeating Characters* (variable window) and *Maximum Sum Subarray of Size K* (fixed window).

```cpp
// Variable-size window: longest substring without repeats
unordered_set<char> win;
int lo = 0, best = 0;
for (int hi = 0; hi < (int)s.size(); hi++) {
    while (win.count(s[hi])) win.erase(s[lo++]);
    win.insert(s[hi]);
    best = max(best, hi - lo + 1);
}

// Fixed-size window of length k: max sum subarray
int sum = 0;
for (int i = 0; i < k; i++) sum += nums[i];
int best2 = sum;
for (int i = k; i < (int)nums.size(); i++) {
    sum += nums[i] - nums[i - k];
    best2 = max(best2, sum);
}
```

---

### 19. Sliding Window with Frequency Counting

Track how many times each element appears inside the current window. The maximum frequency determines whether the window can be made uniform with at most k replacements.

> **📐 Math:** If a window of length $L$ has max character frequency $f$, it can be made uniform with $L - f$ replacements (replace everything that isn't the majority character). The window is valid exactly when $L - f \le k$, i.e. $(hi - lo + 1) - \text{maxFreq} \le k$ — that single inequality is the entire correctness argument for the shrink condition.

**Problem:** *Longest Repeating Character Replacement* — find the longest substring that can become all-one-character with at most `k` swaps.

```cpp
unordered_map<char,int> freq;
int lo = 0, maxFreq = 0;
for (int hi = 0; hi < (int)s.size(); hi++) {
    maxFreq = max(maxFreq, ++freq[s[hi]]);
    if ((hi - lo + 1) - maxFreq > k) freq[s[lo++]]--;
}
```

---

### 20. Greedy Algorithms

At each step commit to the locally optimal choice and never reconsider it. Works when the problem has the *greedy-choice property*: local optima compose into a global optimum. Examples: buy-sell stock, jump game, interval scheduling.

> **📐 Math:** Greedy correctness requires proving the *exchange argument*: any optimal solution can be transformed, step by step, into the greedy solution without making it worse. For buy-low-sell-high, tracking running min $m$ and updating $\text{profit} = \max(\text{profit}, \text{price} - m)$ works because the best sell day for any fixed buy day is irrelevant — only the cheapest price-so-far matters, so a single pass suffices instead of checking all $O(n^2)$ buy/sell pairs.

**Problem:** *Best Time to Buy and Sell Stock* — maximize profit from a single buy and a later sell.

```cpp
int minBuy = INT_MAX, maxProfit = 0;
for (int p : prices) {
    minBuy    = min(minBuy, p);
    maxProfit = max(maxProfit, p - minBuy);
}
```

---


## Stack & Queue

### 21. Stack Data Structure

Last-In-First-Out (LIFO). Push elements when processing; pop when a matching or complementary element is found, e.g. bracket matching. `std::stack` wraps a `deque` by default.

**Problem:** *Valid Parentheses* — check whether brackets in a string are properly matched and nested.

```cpp
unordered_map<char,char> match;
match.emplace(')', '(');
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

### 22. Queue Data Structure

First-In-First-Out (FIFO). `std::queue`: `push` to back, `front` to peek, `pop` to remove. Essential for BFS. Snapshot `q.size()` before the inner loop to process one level at a time.

**Problem:** General FIFO usage pattern, as used in BFS (see *Trees & Tries* and *Graphs* sections).

```cpp
queue<int> q;
q.push(1); q.push(2);       // enqueue
int front = q.front(); q.pop(); // FIFO: front = 1
// In BFS: enqueue neighbors, dequeue to process
```

---


<a id="binary-search"></a>
### 23. Binary Search

Repeatedly halve the search space by comparing the middle element to the target. Requires a sorted (or monotone) input. Always compute `mid = left + (right - left) / 2` to avoid integer overflow. Time O(log n).

> **📐 Math:** Each iteration discards half the remaining search space, so after $t$ iterations the space shrinks from $n$ to $n/2^t$. Solving $n/2^t = 1$ gives $t = \log_2 n$ — the source of binary search's $O(\log n)$ bound.

**Problem:** *Binary Search* — find the index of `target` in a sorted array, or −1 if absent.

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

### 24. Binary Search on a Rotated Sorted Array

A rotated sorted array splits into two sorted halves. Exactly one of the two halves defined by `mid` is always fully sorted — use that to determine which half the target lies in. To find the minimum specifically, compare `nums[mid]` to `nums[hi]` instead.

> **📐 Math:** Comparing $\text{nums}[mid]$ to $\text{nums}[hi]$ (not $\text{nums}[lo]$) handles duplicates and avoids edge-case ambiguity: if $\text{nums}[mid] > \text{nums}[hi]$, the minimum must lie strictly to the right of $mid$ (since a sorted run can't 'wrap' over a larger value), so $lo = mid+1$ is always safe to discard $mid$ itself.

**Problem:** *Find Minimum in Rotated Sorted Array* and *Search in Rotated Sorted Array*.

```cpp
// Find minimum in rotated sorted array
int lo = 0, hi = (int)nums.size() - 1;
while (lo < hi) {
    int mid = lo + (hi - lo) / 2;
    if (nums[mid] > nums[hi]) lo = mid + 1; // min in right
    else                      hi = mid;     // min in left (incl mid)
}
// nums[lo] is the minimum

// Search for target in rotated sorted array
lo = 0; hi = (int)nums.size() - 1;
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


## Linked Lists

### 25. Linked List Fundamentals

A chain of nodes, each holding a value and a pointer to the next node. Traversal is O(n); random access does not exist. Always check for `nullptr` before dereferencing. Redirecting `next` pointers is the core operation — always save the next node before overwriting a pointer, or you'll lose the rest of the list.

**Problem:** General traversal/mutation pattern used across all linked-list problems.

```cpp
struct ListNode {
    int val; ListNode* next;
    ListNode(int x) : val(x), next(nullptr) {}
};
for (ListNode* c = head; c; c = c->next)
    process(c->val);

// Always save next before overwriting a pointer
ListNode* nxt = cur->next; // save
cur->next     = prev;      // redirect
prev          = cur;       // advance prev
cur           = nxt;       // advance cur
```

---

### 26. Dummy Node Pattern

Prepend a sentinel node so the head can be treated like any other node. Eliminates special-casing the head in insertions and deletions. Return `dummy.next` as the new head. The same trick powers *Remove Nth Node From End*: advance a leader pointer n steps ahead, then walk both pointers until the leader hits `nullptr` — the trailer is now just before the target.

> **📐 Math:** Advancing `fast` $n$ steps ahead first creates a fixed gap of $n$ between `fast` and `prev`. When `fast` reaches the end (position $L$, the list length), `prev` is at position $L - n$ — exactly one before the node to remove. This converts a two-pass problem (count length, then remove) into one pass.

**Problem:** *Remove Nth Node From End of List* — delete the nth node from the end in a single pass.

```cpp
ListNode dummy(0); dummy.next = head;
ListNode *prev = &dummy, *fast = head;
for (int i = 0; i < n; i++) fast = fast->next;
while (fast) { prev = prev->next; fast = fast->next; }
prev->next = prev->next->next;
return dummy.next;
```

---

### 27. Fast and Slow Pointers (Floyd's Algorithm)

Two pointers advancing at different speeds (1 vs 2 steps). When fast reaches the end, slow is at the midpoint. If there is a cycle, the pointers will eventually meet. To find the cycle's *entry point*, reset one pointer to head and advance both one step at a time — they will meet exactly at the start of the cycle.

> **📐 Math:** If a cycle exists with the fast pointer moving 2 steps/tick and slow 1 step/tick, the gap between them shrinks by exactly 1 each tick. Since the gap is bounded by the cycle length $L$, they must meet within at most $L$ ticks. Let $a$ be the distance from head to the cycle start and $c$ the cycle length. By the first meeting, slow has traveled $a+x$ and fast $a+x+nc$ for some $x \ge 0, n \ge 1$; since fast moves twice as fast, $2(a+x) = a+x+nc$, so $a = nc - x$. That's exactly why resetting one pointer to head and advancing both at speed 1 makes them meet at the cycle's entrance.

**Problem:** *Linked List Cycle* (detect) and *Linked List Cycle II* (find entry point).

```cpp
// Phase 1: detect a cycle
ListNode *slow = head, *fast = head;
while (fast && fast->next) {
    slow = slow->next; fast = fast->next->next;
    if (slow == fast) break; // cycle found (or fast hit nullptr: no cycle)
}
// Phase 2: find the entry point
slow = head;
while (slow != fast) { slow = slow->next; fast = fast->next; }
return slow; // cycle entry node
```

---

### 28. Linked List Reversal

Change each node's `next` pointer to its predecessor. Requires three variables: `prev`, `cur`, `nxt`. After the loop `prev` is the new head. Can also be done recursively, mirroring the list structure.

> **📐 Math:** Reversal is a bijection that maps node $i$'s `next` pointer backward: in the new list, what was `prev` becomes the successor of `cur`. After $n$ steps every pointer has flipped exactly once, so the total work is $O(n)$ with no extra space — it's just relabeling $n$ arrows, not rebuilding the list.

**Problem:** *Reverse Linked List* — reverse a singly linked list in place.

```cpp
// Iterative
ListNode* prev = nullptr, *cur = head;
while (cur) {
    ListNode* nxt = cur->next;
    cur->next = prev;
    prev = cur; cur = nxt;
}
return prev; // new head

// Recursive
ListNode* reverse(ListNode* head) {
    if (!head || !head->next) return head;
    ListNode* newHead = reverse(head->next);
    head->next->next = head;
    head->next = nullptr;
    return newHead;
}
```

---

### 29. Merging / Interleaving Linked Lists

Compare the heads of both lists, attach the smaller node to the result, and advance that pointer — used to merge two *sorted* lists. A different pattern, interleaving, alternates picking from each list regardless of value — used in *Reorder List* after finding the midpoint and reversing the second half.

> **📐 Math:** Each comparison advances exactly one of the two list pointers, and the loop ends when one list is exhausted. Since the pointers together can advance at most $n + m$ times total, the merge is $O(n+m)$, not $O(n \cdot m)$.

**Problem:** *Merge Two Sorted Lists* and *Reorder List*.

```cpp
// Merge two sorted lists
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

// Interleave two lists: l1->l2->l1->l2->... (Reorder List)
ListNode *p1 = head, *p2 = second;
while (p2) {
    ListNode *n1 = p1->next, *n2 = p2->next;
    p1->next = p2; p2->next = n1;
    p1 = n1; p2 = n2;
}
```

---

### 30. Merge K Sorted Lists (Heap and Divide-and-Conquer)

Two strategies for merging k sorted lists: (1) a min-heap of `(value, node)` pairs, always extracting the globally smallest node in O(log k); (2) divide-and-conquer, pairing up lists and merging recursively.

> **📐 Math:** With $k$ lists and total $N$ nodes, the heap approach costs $O(N \log k)$ — each of $N$ extractions costs $O(\log k)$ since the heap never holds more than $k$ nodes. The divide-and-conquer approach achieves the same bound via the recurrence $T(k) = 2T(k/2) + O(N)$, which the Master Theorem solves to $O(N \log k)$ — same total work, distributed across $\log_2 k$ merge rounds instead of one heap.

**Problem:** *Merge k Sorted Lists*.

```cpp
// Min-heap approach
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

// Divide-and-conquer approach (reuses Merge Two Sorted Lists)
ListNode* mergeK(vector<ListNode*>& L, int l, int r) {
    if (l == r) return L[l];
    int mid = l + (r - l) / 2;
    return merge(mergeK(L, l, mid), mergeK(L, mid+1, r));
}
```

---


## Trees & Tries

### 31. Binary Tree Structure & Traversal

Each node has at most two children (left and right). Every recursive tree function follows the same shape: (1) handle the `nullptr` base case, (2) process the current node, (3) recurse left, (4) recurse right. Three orderings name *where* step 2 happens: preorder (root first — good for serializing/cloning), inorder (root between children — sorted output for a BST), postorder (root last — use when a parent's result depends on its children, e.g. height or diameter).

> **📐 Math:** A balanced binary tree with $n$ nodes has height $h \approx \log_2 n$, since each level can hold up to $2^{\text{level}}$ nodes and the levels sum to $n = 2^0 + 2^1 + \ldots + 2^h$ — this is why balanced-tree operations are $O(\log n)$. Tree recursion that does $O(1)$ work per node and visits both children follows $T(n) = 2T(n/2) + O(1)$, which the Master Theorem solves to $O(n)$ total: every node is visited exactly once.

**Problem:** *Maximum Depth of Binary Tree* (postorder) and general traversal order (preorder/inorder/postorder), as used throughout tree problems.

```cpp
struct TreeNode {
    int val; TreeNode *left, *right;
    TreeNode(int x) : val(x), left(nullptr), right(nullptr) {}
};

int height(TreeNode* node) {  // postorder: children before parent
    if (!node) return 0;      // base case
    return 1 + max(height(node->left), height(node->right));
}

void pre (TreeNode* n) { if(!n) return; visit(n); pre(n->left);  pre(n->right);  }
void in  (TreeNode* n) { if(!n) return; in(n->left);  visit(n); in(n->right);   }
void post(TreeNode* n) { if(!n) return; post(n->left); post(n->right); visit(n); }
```

---

### 32. Breadth-First Search (BFS) on Trees

Visit all nodes at depth d before any node at depth d+1, using a queue. Snapshot `q.size()` at the start of each while-loop iteration to isolate exactly one level per inner loop.

**Problem:** *Binary Tree Level Order Traversal* — return node values grouped by depth.

```cpp
queue<TreeNode*> q;
if (root) q.push(root);
while (!q.empty()) {
    int sz = q.size();          // snapshot level size
    for (int i = 0; i < sz; i++) {
        auto* n = q.front(); q.pop();
        process(n->val);
        if (n->left)  q.push(n->left);
        if (n->right) q.push(n->right);
    }
}
```

---

### 33. Stack-based Iteration (Iterative DFS)

Convert recursive DFS into an explicit loop using `std::stack`, to avoid stack-overflow risk on very deep trees. Push the right child before the left so the left is popped (and processed) first, mirroring preorder recursion. The same explicit-stack trick supports iterative *inorder*: push left children until null, pop, process, then move right.

**Problem:** *Binary Tree Preorder Traversal* and *Binary Tree Inorder Traversal*, iterative versions.

```cpp
// Iterative preorder
stack<TreeNode*> st;
if (root) st.push(root);
while (!st.empty()) {
    auto* n = st.top(); st.pop();
    process(n->val);
    if (n->right) st.push(n->right); // push right first
    if (n->left)  st.push(n->left);
}

// Iterative inorder
TreeNode* cur = root;
while (cur || !st.empty()) {
    while (cur) { st.push(cur); cur = cur->left; }
    cur = st.top(); st.pop();
    process(cur->val);
    cur = cur->right;
}
```

---

### 34. Comparing Two Trees

Two trees are identical if both are null, or both are non-null with equal values and recursively identical left and right subtrees. One mismatch anywhere returns `false`. The same shape (with one tree's children swapped) checks whether a tree is a mirror of itself.

**Problem:** *Same Tree* — check whether two binary trees are structurally identical with the same node values.

```cpp
bool isSame(TreeNode* p, TreeNode* q) {
    if (!p && !q) return true;
    if (!p || !q || p->val != q->val) return false;
    return isSame(p->left,  q->left)
        && isSame(p->right, q->right);
}
```

---

### 35. Balanced Tree Check & Negative-Clamp Pattern

A tree is height-balanced if, at every node, the heights of the left and right subtrees differ by at most 1, and both subtrees are themselves balanced. More generally, when combining subtree contributions in tree DP, clamp negative contributions to zero with `max(0, subtreeResult)` — a negative contribution is always worse than not taking that branch at all (used in *Binary Tree Maximum Path Sum*).

```cpp
bool isBalanced(TreeNode* n) {
    if (!n) return true;
    int l = height(n->left), r = height(n->right);
    return abs(l - r) <= 1 && isBalanced(n->left)
                            && isBalanced(n->right);
}
```

**Problem:** *Balanced Binary Tree*.

---

### 36. Validate Binary Search Tree

All values in the left subtree must be strictly less than the node; all in the right subtree strictly greater — for *every* ancestor, not just the immediate parent. Pass a shrinking `(lo, hi)` range down each recursive call: going left tightens `hi` to the parent's value, going right tightens `lo`.

> **📐 Math:** BST validation is an inductive argument — if every node respects the $(lo, hi)$ bound passed to it, the whole subtree is a valid BST. Going left tightens $hi$ to the parent's value (everything in the left subtree must be less than the parent); going right tightens $lo$. This proves the BST property level by level instead of just checking the immediate parent.

**Problem:** *Validate Binary Search Tree*.

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

### 37. Kth Smallest via Inorder Traversal

Inorder traversal of a BST yields values in strictly increasing order, because of the BST invariant (left < node < right) applied recursively. Decrement a counter `k` during inorder traversal to find the kth smallest in O(h + k) — no need to traverse the whole tree or sort all n values.

> **📐 Math:** Inorder = sorted order is itself an inductive proof from the BST invariant. Decrementing $k$ as you go means you stop as soon as you've seen $k$ nodes, giving $O(h + k)$ instead of $O(n)$ for a full traversal plus sort.

**Problem:** *Kth Smallest Element in a BST*.

```cpp
int k, result;
void inorder(TreeNode* n) {
    if (!n) return;
    inorder(n->left);
    if (--k == 0) result = n->val;
    inorder(n->right);
}
```

---

### 38. Top-Down State Passing (Good Nodes)

Pass state down the recursion (e.g. the max value seen so far on the path from the root) so each node can make a local decision without needing a global variable. Contrast with the bottom-up pattern below, where state flows the other direction.

**Problem:** *Count Good Nodes in Binary Tree* — count nodes where no ancestor on the root-to-node path has a greater value.

```cpp
int goodNodes(TreeNode* n, int mx) {
    if (!n) return 0;
    int cnt = (n->val >= mx) ? 1 : 0;
    mx = max(mx, n->val);
    return cnt + goodNodes(n->left, mx) + goodNodes(n->right, mx);
}
```

---

### 39. Bottom-Up Local/Global Result (Diameter & Max Path Sum)

Recurse into children first, then compute the parent's result from the children's return values. Two results are often needed simultaneously: a *local* value the parent can extend upward (only one branch, since a path through the parent can only continue in one direction), and a *global* best that considers both branches meeting at the current node (the only place a "V-shaped" path can be counted).

> **📐 Math:** $\text{local}(n) = \text{val} + \max(l, r)$ extends only ONE branch upward. $\text{globalMax} = \max(\text{globalMax}, l + \text{val} + r)$ considers BOTH branches meeting at this node. Since depth/gain is computed once per node bottom-up, total work is $O(n)$ even though the optimal path could connect nodes anywhere in the tree.

**Problem:** *Diameter of Binary Tree* and *Binary Tree Maximum Path Sum*.

```cpp
// Diameter: longest path through any node (doesn't need node->val)
int diam = 0;
int depth(TreeNode* n) {
    if (!n) return 0;
    int l = depth(n->left), r = depth(n->right);
    diam = max(diam, l + r);
    return 1 + max(l, r);
}

// Max path sum: clamp negative branches to 0
int maxPath = INT_MIN;
int gain(TreeNode* n) {
    if (!n) return 0;
    int l = max(0, gain(n->left));
    int r = max(0, gain(n->right));
    maxPath = max(maxPath, l + n->val + r); // global: both branches
    return n->val + max(l, r);              // local: one branch up
}
```

---

### 40. Lowest Common Ancestor (BST)

Exploit BST ordering: if both targets are smaller than the current node, the LCA is in the left subtree; if both are larger, it's in the right subtree; otherwise the current node is the split point and therefore the LCA.

**Problem:** *Lowest Common Ancestor of a Binary Search Tree*.

```cpp
TreeNode* lca(TreeNode* n, TreeNode* p, TreeNode* q) {
    if (p->val < n->val && q->val < n->val) return lca(n->left, p, q);
    if (p->val > n->val && q->val > n->val) return lca(n->right, p, q);
    return n; // split point
}
```

---

### 41. Path Sum (Root-to-Leaf)

DFS down the tree, subtracting the current node's value from the remaining target at each step. At a leaf, check whether the remaining target has reached exactly zero.

**Problem:** *Path Sum* — does any root-to-leaf path sum to a given target?

```cpp
bool hasPath(TreeNode* n, int target) {
    if (!n) return false;
    if (!n->left && !n->right) return n->val == target;
    return hasPath(n->left,  target - n->val)
        || hasPath(n->right, target - n->val);
}
```

---

### 42. Serialize / Deserialize a Tree

Preorder traversal converts a tree to a string, marking null children with a sentinel (e.g. `"N"`). Deserializing replays the same preorder logic against a token stream, rebuilding `nullptr`s wherever the sentinel appears — the sentinel is what makes the structure (not just the values) recoverable.

**Problem:** *Serialize and Deserialize Binary Tree*.

```cpp
void serialize(TreeNode* n, string& out) {
    if (!n) { out += "N,"; return; }
    out += to_string(n->val) + ",";
    serialize(n->left,  out);
    serialize(n->right, out);
}
// Deserialize: read tokens in the same preorder; "N" => nullptr
```

---

### 43. N-ary Trees

N-ary trees generalize binary trees: each node holds a value and a `vector<Node*>` of children instead of fixed `left`/`right` pointers. DFS and BFS follow the exact same shape as binary trees, just looping over `children` instead of checking two fixed slots.

**Problem:** *N-ary Tree Preorder Traversal* / general N-ary traversal.

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

### 44. Trie (Prefix Tree)

A tree where each edge represents one character. All words sharing a prefix share the same path from the root. Supports O(m) insert and search where m is the word length — independent of how many words n are already stored, unlike scanning a word list (O(n·m)). Use a fixed `children[26]` array for O(1) access when the alphabet is small and known (a–z), or `unordered_map<char, Node*>` for a large or sparse alphabet. Wrap the root in a class to expose a clean `insert` / `search` interface.

> **📐 Math:** A trie storing $n$ words with average length $m$ has $O(n \cdot m)$ nodes in the worst case (no shared prefixes), but lookup/insert is always $O(m)$ — independent of $n$ — because each step follows exactly one character down the tree.

**Problem:** *Implement Trie (Prefix Tree)* and *Design Add and Search Words Data Structure* (the latter needs DFS to handle `.` wildcards).

```cpp
struct TrieNode { TrieNode* ch[26]{}; bool end = false; };

class Trie {
    TrieNode* root;
public:
    Trie() : root(new TrieNode()) {}
    void insert(const string& w) {
        TrieNode* cur = root;
        for (char c : w) {
            int i = c - 'a';
            if (!cur->ch[i]) cur->ch[i] = new TrieNode();
            cur = cur->ch[i];
        }
        cur->end = true;
    }
    // search(w): same walk, return cur && cur->end
    // wildcard search ('.'): DFS, trying all 26 children at that position
};
```

---

### 45. Character & String Utilities for Tree/Trie Problems

ASCII arithmetic used throughout trie and string-tree problems: `c - 'a'` maps a lowercase letter to an index 0–25, `toupper`/`tolower` convert case, and `isalpha`/`isdigit` test character type.

**Pattern:** general-purpose utility, not tied to one problem — used as a building block inside *Implement Trie* and similar string/trie problems.

```cpp
for (char c : s) {
    int idx  = c - 'a';      // 0-25 for lowercase
    bool alp = isalpha(c);
}
```

---


## Graphs

### 46. Graph Representation

Store a graph as an adjacency list: `vector<vector<int>> adj(n)`. For directed graphs add one direction; for undirected add both. Adjacency matrices cost O(V²) space — use only for dense graphs.

> **📐 Math:** An adjacency list uses $O(V + E)$ space ($V$ node entries + one entry per edge), versus $O(V^2)$ for an adjacency matrix. For sparse graphs ($E \ll V^2$), the list representation is dramatically smaller — this is why adjacency lists dominate in most graph problems.

**Pattern:** the standard setup step for almost every graph problem in this section (e.g. *Number of Islands*, *Course Schedule*), not a problem on its own.

```cpp
int n = 5;
vector<vector<int>> adj(n);
adj[u].push_back(v);                       // directed
adj[u].push_back(v); adj[v].push_back(u);  // undirected
```

---

### 47. Graph DFS / BFS Traversal

Graph DFS uses a visited array to avoid revisiting nodes and to detect cycles. Graph BFS guarantees the shortest path by hop count in unweighted graphs. Both run in O(V + E) since each node is visited once and each edge examined once.

> **📐 Math:** Each node is visited once (marked in `vis`) and each edge examined once across the whole traversal, giving $O(V + E)$ total — the fundamental complexity bound for any graph traversal that doesn't revisit nodes.

**Problem:** *Number of Islands* (DFS flood fill) and *Course Schedule*-style reachability (BFS).

```cpp
// Graph DFS
vector<bool> vis(n, false);
function<void(int)> dfs = [&](int u) {
    vis[u] = true;
    for (int v : adj[u]) if (!vis[v]) dfs(v);
};

// Graph BFS
queue<int> q; vis[src] = true; q.push(src);
while (!q.empty()) {
    int u = q.front(); q.pop();
    for (int v : adj[u])
        if (!vis[v]) { vis[v] = true; q.push(v); }
}
```

---

### 48. Multi-Source BFS

Seed the queue with *all* source cells at once, each at distance 0, rather than running single-source BFS repeatedly. This guarantees each cell's first-visit distance is its true minimum distance to the nearest source. The same seeding trick — flood-fill from every boundary cell — identifies which interior regions are reachable from the boundary versus fully enclosed.

> **📐 Math:** Multi-source BFS explores all cells at distance $d$ from ANY source before any cell at distance $d+1$, because every source starts in the queue at depth 0 simultaneously. This guarantees each cell's first-visit distance is its true minimum distance to the nearest source — same correctness argument as single-source BFS, just with multiple depth-0 starting points.

**Problem:** *Rotting Oranges* (multi-source distance) and *Surrounded Regions* (boundary flood-fill).

```cpp
// Multi-source BFS: distance from nearest of several sources
queue<pair<int,int>> q;
for (auto& s : sources) { q.push(s); dist[s] = 0; }
while (!q.empty()) {
    auto [r, c] = q.front(); q.pop();
    for (int d = 0; d < 4; d++) {
        int nr = r + dr[d], nc = c + dc[d];
        if (inBounds(nr, nc) && dist[nr][nc] == -1)
            { dist[nr][nc] = dist[r][c] + 1; q.push({nr, nc}); }
    }
}
```

---

### 49. Union-Find (Disjoint Set Union)

Tracks which elements belong to the same connected component. `find` with path compression returns the representative in nearly O(1) by collapsing every visited node directly to the root. `union` by rank merges two components, attaching the shorter tree under the taller one's root.

> **📐 Math:** Path compression makes `find()` collapse every visited node directly to the root, so repeated calls flatten the tree. Combined with union-by-rank, the amortized cost per operation is $O(\alpha(n))$ — the inverse Ackermann function, which grows so slowly it's effectively constant (under 5) for any $n$ you could ever construct.

**Problem:** *Number of Connected Components in an Undirected Graph* and *Redundant Connection*.

```cpp
int par[N], rnk[N];
int find(int x) {
    return par[x] == x ? x : par[x] = find(par[x]);
}
void unite(int a, int b) {
    a = find(a); b = find(b);
    if (a == b) return;
    if (rnk[a] < rnk[b]) swap(a, b);
    par[b] = a;
    if (rnk[a] == rnk[b]) rnk[a]++;
}
```

---

### 50. Topological Sort

A linear ordering of a DAG's nodes such that for every edge u → v, u appears before v. Two equivalent ways to produce it:

- **Kahn's algorithm (BFS):** compute in-degrees, enqueue all zero-in-degree nodes, repeatedly dequeue and decrement neighbors' in-degrees, enqueuing any that reach zero. If the output contains all n nodes, the graph has no cycle. (In a course-prerequisite framing, in-degree = number of remaining prerequisites.)
- **DFS post-order reversed:** a node is pushed onto a stack only after all its descendants are pushed, so reading the stack top-to-bottom satisfies the ordering.

> **📐 Math:** Kahn's algorithm is a proof by construction: a DAG with $n$ nodes always has at least one node with in-degree 0 (otherwise every node has a predecessor, forcing a cycle by pigeonhole). Repeatedly removing such nodes processes all $n$ nodes iff the graph is acyclic. The DFS variant relies on the same fact from the other direction: postorder pushes node $u$ only after every node reachable from $u$, so reversing the stack guarantees $u$ precedes $v$ for every edge $u \to v$.

**Problem:** *Course Schedule* (cycle check) and *Course Schedule II* (return the ordering).

```cpp
// Kahn's algorithm (BFS)
vector<int> indeg(n, 0);
for (auto& [u, v] : edges) indeg[v]++;
queue<int> q;
for (int i = 0; i < n; i++) if (!indeg[i]) q.push(i);
vector<int> order;
while (!q.empty()) {
    int u = q.front(); q.pop(); order.push_back(u);
    for (int v : adj[u]) if (--indeg[v] == 0) q.push(v);
}
bool noCycle = (int)order.size() == n;

// DFS post-order reversed
vector<bool> vis(n, false); stack<int> stk;
function<void(int)> dfs = [&](int u) {
    vis[u] = true;
    for (int v : adj[u]) if (!vis[v]) dfs(v);
    stk.push(u); // push after all descendants
};
// Read stk top-to-bottom for topological order
```

---

### 51. Cycle Detection (Directed Graph)

Color nodes white (unvisited), gray (in the current DFS stack), black (fully done). A back edge to a gray node means you've reached an ancestor on the current path — that closes a cycle. (For undirected graphs, instead check whether a visited neighbor is anything other than the immediate parent.)

> **📐 Math:** The three-color scheme encodes recursion-stack membership directly: a back edge to a gray node means you've reached an ancestor in the current DFS path, which by definition closes a cycle. This is a precise restatement of the graph-theory fact that a directed graph is acyclic iff DFS produces no back edges.

**Problem:** *Course Schedule* (alternate DFS-based cycle check).

```cpp
// 0=unvisited, 1=in-stack, 2=done
vector<int> st(n, 0);
bool hasCycle(int u) {
    st[u] = 1;
    for (int v : adj[u]) {
        if (st[v] == 1) return true;
        if (!st[v] && hasCycle(v)) return true;
    }
    st[u] = 2;
    return false;
}
```

---

### 52. Graph Construction from Pairwise Comparisons (Alien Dictionary)

To extract a character ordering from a sorted alien-language word list, compare each adjacent pair of words. The first position where they differ gives one ordering rule (that character comes before the other). Build a directed graph from these rules, then topologically sort it.

**Problem:** *Alien Dictionary*.

```cpp
for (int i = 0; i + 1 < (int)words.size(); i++) {
    auto& w1 = words[i]; auto& w2 = words[i + 1];
    for (int j = 0; j < (int)min(w1.size(), w2.size()); j++) {
        if (w1[j] != w2[j]) {
            adj[w1[j] - 'a'].push_back(w2[j] - 'a');
            break;
        }
    }
}
// Then run Topological Sort on the resulting 26-node graph
```

---


## Dynamic Programming

### 53. Dynamic Programming Fundamentals

Break a problem into overlapping subproblems, solve each exactly once, and cache the result. Two equivalent styles: **top-down memoization** (recursive function + cache, computed lazily) and **bottom-up tabulation** (iterative array, filled in dependency order). Requires the problem to have *optimal substructure* (an optimal solution is built from optimal solutions to subproblems) and *overlapping subproblems* (the same subproblem recurs many times — otherwise plain recursion is already efficient).

**Problem:** General DP shape, e.g. *Climbing Stairs* or *Fibonacci*-style recurrences.

```cpp
// Top-down (memoization)
unordered_map<State, ReturnType> memo;
ReturnType solve(State s) {
    if (isBase(s)) return baseValue(s);
    if (memo.count(s)) return memo[s];
    return memo[s] = combine(solve(smaller(s)));
}

// Bottom-up (tabulation)
vector<ReturnType> dp(n + 1);
dp[0] = baseValue;
for (int i = 1; i <= n; i++) dp[i] = combine(dp[i - 1]);
```

> **📐 Math:** Naive recursion without memoization recomputes overlapping subproblems exponentially often — e.g. fib$(n)$ makes $O(2^n)$ calls because fib$(n-2)$ is recomputed independently inside both fib$(n-1)$ and the direct fib$(n-2)$ branch. Caching collapses this to $O(n)$ since each of the $n$ distinct subproblems is solved exactly once. Naive Fibonacci's call count grows like $\varphi^n$ where $\varphi = (1+\sqrt{5})/2 \approx 1.618$ (the golden ratio) — that's the blowup memoization eliminates.

---

### 54. 1D DP: House Robber & Climbing Stairs

A 1-D array `dp[i]` stores the answer for a subproblem of size i, related to previous entries by a recurrence. *Climbing Stairs*: `dp[i] = dp[i-1] + dp[i-2]` (you reach step i via a final 1-step or a final 2-step). *House Robber*: `dp[i] = max(dp[i-1], dp[i-2] + nums[i])` (skip house i, or rob it and skip house i-1). Both recurrences depend on only the two previous values, so they collapse to two rolling variables — O(n) time, O(1) space.

> **📐 Math:** House Robber's recurrence encodes a binary choice at each house: skip it (carry forward $\text{dp}[i-1]$) or rob it ($\text{dp}[i-2]$ plus its value, since the adjacent house must then be skipped). Climbing Stairs is structurally identical to the Fibonacci recurrence — from step $i$ you could have taken a final 1-step (from $i-1$) or 2-step (from $i-2$), and these cases are mutually exclusive and exhaustive.

**Problem:** *Climbing Stairs* and *House Robber*.

```cpp
// Climbing stairs: ways to reach step n
vector<int> dp(n + 1);
dp[0] = 1; dp[1] = 1;
for (int i = 2; i <= n; i++) dp[i] = dp[i-1] + dp[i-2];
return dp[n];

// House Robber: max loot from first i houses, O(1) space
int rob(vector<int>& nums) {
    int prev2 = 0, prev1 = 0;
    for (int x : nums) {
        int cur = max(prev1, prev2 + x);
        prev2 = prev1; prev1 = cur;
    }
    return prev1;
}
```

---

### 55. House Robber II (Circular)

The circular variant cannot rob both the first and last house, since they're adjacent on the circle. Solve two linear sub-problems — exclude the last house, or exclude the first — and take the maximum. Each sub-problem is identical to the original linear House Robber.

> **📐 Math:** Splitting the circular case into linear$(0, n-2)$ and linear$(1, n-1)$ works because in any valid (non-adjacent) selection, house $0$ and house $n-1$ can never both be chosen. So the true optimum must exclude at least one of them, and checking both exclusions covers every possibility.

**Problem:** *House Robber II*.

```cpp
auto linear = [&](int l, int r) {
    int a = 0, b = 0;
    for (int i = l; i <= r; i++) { int c = max(b, a + nums[i]); a = b; b = c; }
    return b;
};
return max(linear(0, n-2), linear(1, n-1));
```

---

### 56. Coin Change (Unbounded Knapsack Shape)

The state is the remaining amount; the transition tries every coin denomination and takes the best result. Top-down: recurse on `amount - coin` for each coin, memoizing on the remaining amount. Bottom-up: fill `dp[amt]` from the smallest amount upward — `dp[a] = min` over all coins `c` of `dp[a-c] + 1`, which is really a shortest-path recurrence where each coin is a "cost 1" edge.

> **📐 Math:** Without memoization, coin change explores a branching tree of depth up to `amount` with up to `\text{len(coins)}` branches per node — $O(\text{coins}^\text{amount})$ worst case. Memoizing (or tabulating) on the remaining amount collapses this to $O(\text{amount} \cdot \text{coins})$, since there are only `amount` distinct subproblems. The bottom-up recurrence $\text{dp}[a] = \min(\text{dp}[a-c] + 1)$ is the same shortest-path idea: $\text{dp}[a]$ is the shortest path from 0 to $a$ where each coin is an edge of cost 1.

**Problem:** *Coin Change* — fewest coins to make a target amount.

```cpp
// Bottom-up
vector<int> dp(amount + 1, amount + 1);
dp[0] = 0;
for (int a = 1; a <= amount; a++)
    for (int c : coins)
        if (c <= a) dp[a] = min(dp[a], dp[a - c] + 1);
return dp[amount] > amount ? -1 : dp[amount];
```

---

### 57. Word Break (String Segmentation DP)

`dp[i]` is true if `s[0..i)` can be segmented into dictionary words. For each end position `i`, try every earlier split point `j`: if `dp[j]` is true and `s[j..i)` is a dictionary word, then `dp[i]` is true. A hash set gives O(1) dictionary lookups; a trie is an optional upgrade that makes prefix checks O(1) per character instead of O(1) per whole-word comparison.

**Problem:** *Word Break* — can a string be segmented into a sequence of dictionary words?

```cpp
unordered_set<string> dict(wordDict.begin(), wordDict.end());
int n = s.size();
vector<bool> dp(n + 1, false);
dp[0] = true;
for (int i = 1; i <= n; i++)
    for (int j = 0; j < i; j++)
        if (dp[j] && dict.count(s.substr(j, i - j)))
            { dp[i] = true; break; }
return dp[n];
```

---

### 58. Kadane's Algorithm (Maximum Subarray)

`dp[i]` = max subarray sum ending at index i = `max(nums[i], dp[i-1] + nums[i])` — at each index, either extend the previous subarray or start fresh. Only the previous state is needed, so the running version uses O(1) space instead of a full DP array.

> **📐 Math:** The recurrence $\text{cur} = \max(\text{nums}[i], \text{cur} + \text{nums}[i])$ makes a binary decision at each index — start a new subarray here, or extend the previous one. Because this only depends on the immediately preceding `cur`, the whole problem collapses from checking all $O(n^2)$ subarrays to a single $O(n)$ pass.

**Problem:** *Maximum Subarray*.

```cpp
int cur = nums[0], best = nums[0];
for (int i = 1; i < (int)nums.size(); i++) {
    cur  = max(nums[i], cur + nums[i]);
    best = max(best, cur);
}
return best;
```

---

### 59. Maximum Product Subarray

Unlike sums, a very negative product can become the maximum after multiplying by another negative number. Track both `curMax` and `curMin` at each step, swapping them whenever the current element is negative, then apply Kadane's-style recurrence to both.

> **📐 Math:** Since two negatives multiply to a positive, the maximum product ending at index $i$ might come from the *minimum* (most negative) product ending at $i-1$, if $\text{nums}[i]$ is negative. Tracking both `curMax` and `curMin` (swapping them when $\text{nums}[i] < 0$) covers both cases — a single running max isn't enough for products the way it is for sums.

**Problem:** *Maximum Product Subarray*.

```cpp
int lo = nums[0], hi = nums[0], res = nums[0];
for (int i = 1; i < (int)nums.size(); i++) {
    if (nums[i] < 0) swap(lo, hi);   // flip on negative
    hi = max(nums[i], hi * nums[i]);
    lo = min(nums[i], lo * nums[i]);
    res = max(res, hi);
}
return res;
```

---

### 60. Grid Path Counting

Counting monotone paths (only right or down moves) in an m×n grid equals the binomial coefficient `C(m+n-2, m-1)` — choosing which moves are "down" out of all moves. The DP formulation builds the same answer without factorials: `dp[i][j] = dp[i-1][j] + dp[i][j-1]`, since each cell is reachable only from above or from the left.

> **📐 Math:** $\text{dp}[i][j] = \text{dp}[i-1][j] + \text{dp}[i][j-1]$ is Pascal's triangle in disguise — it computes $C(m+n-2, m-1)$ by summing the two ways to arrive at each cell, without ever computing a factorial.

**Problem:** *Unique Paths*.

```cpp
vector<vector<int>> dp(m, vector<int>(n, 1));
for (int i = 1; i < m; i++)
    for (int j = 1; j < n; j++)
        dp[i][j] = dp[i-1][j] + dp[i][j-1];
return dp[m-1][n-1];
```

---

### 61. Space-Optimized DP (Rolling Array)

When a DP recurrence only references the immediately previous row, replace the 2-D table with a 1-D rolling array, reusing it in place. For grid DP, one row of size n suffices instead of an m×n table.

**Problem:** Space-optimized variant of grid/1D DP problems such as *Unique Paths* or *House Robber*.

```cpp
vector<int> dp(n + 1, 0);
for (int i = 0; i < m; i++)
    for (int j = 1; j <= n; j++)
        dp[j] = f(dp[j], dp[j-1]); // dp[j] (old row) and dp[j-1] (new row)
```

---

### 62. Palindrome DP (2D Table)

A 2-D table `dp[i][j]` parameterized by two indices — here, the start and end of a substring. `dp[i][j]` stores whether `s[i..j]` is a palindrome, built from the inside out: a substring is a palindrome if its outer characters match and the inner substring (already computed) is also a palindrome.

> **📐 Math:** The recurrence $\text{dp}[i][j] = (s[i] == s[j]) \land (j - i < 3 \lor \text{dp}[i+1][j-1])$ reduces an $O(n)$ palindrome check to $O(1)$ by reusing the already-computed answer for the inner substring — the $j-i < 3$ guard handles base cases of length 1–2 where there's no valid 'inner' substring to check.

**Problem:** *Longest Palindromic Substring* (table-building step) and *Palindromic Substrings*.

```cpp
int n = s.size();
vector<vector<bool>> dp(n, vector<bool>(n, false));
for (int i = 0; i < n; i++) dp[i][i] = true;
for (int i = n - 2; i >= 0; i--)
    for (int j = i + 1; j < n; j++)
        dp[i][j] = (s[i] == s[j]) && (j - i < 3 || dp[i+1][j-1]);
```

---

### 63. Manacher's Algorithm (Linear-Time Palindromes)

An O(n) algorithm for finding all palindromic substrings, improving on the O(n²) expand-around-center approach. It reuses previously computed palindrome radii: if a palindrome centered at `c` extends to radius `r`, and index `i` is inside that palindrome, then `i`'s radius is at least `min(r - i, radius of i's mirror)` — because the structure is mirrored around `c`.

> **📐 Math:** Manacher's algorithm exploits palindrome symmetry: if a palindrome centered at $c$ extends to radius $r$, and $i$ is inside that palindrome, then $p[i]$ is at least $\min(r - i, p[\text{mirror of } i])$. This avoids redundant character comparisons, bringing the whole algorithm down to $O(n)$ versus $O(n^2)$ for the naive expand-around-center approach.

**Problem:** *Longest Palindromic Substring*, optimal O(n) solution.

```cpp
string t = "#";
for (char c : s) { t += c; t += '#'; }
int n = t.size(); vector<int> p(n, 0);
int c = 0, r = 0;
for (int i = 0; i < n; i++) {
    if (i < r) p[i] = min(r - i, p[2*c - i]);
    while (i+p[i]+1 < n && i-p[i]-1 >= 0
        && t[i+p[i]+1] == t[i-p[i]-1]) p[i]++;
    if (i + p[i] > r) { c = i; r = i + p[i]; }
}
```

---


## Intervals & Greedy

### 64. Interval Fundamentals & Merging

Intervals are `[start, end]` pairs. Always sort by start time first — this single step is what makes every other interval pattern (merge, insert, overlap-count, scheduling) tractable. Two sorted intervals overlap when `cur.start <= last.end`. To merge: scan left to right, extending the last interval's end with `max` when the current one overlaps it, otherwise appending a new interval.

**Problem:** *Merge Intervals*.

```cpp
sort(v.begin(), v.end());            // sort by start
vector<vector<int>> res = {v[0]};
for (auto& cur : v) {
    auto& last = res.back();
    if (cur[0] <= last[1]) last[1] = max(last[1], cur[1]); // overlap: extend
    else res.push_back(cur);                                // no overlap: new
}
```

---

### 65. Overlap Detection

Two intervals `[a,b]` and `[c,d]` overlap when `a < d && c < b` (half-open convention). After sorting by start, you only ever need to compare each interval to its immediate predecessor — overlaps with anything further back are already captured transitively.

**Problem:** *Meeting Rooms* — can a person attend all meetings (i.e., are there any overlaps)?

```cpp
sort(v.begin(), v.end());
for (int i = 1; i < (int)v.size(); i++)
    if (v[i][0] < v[i-1][1]) { /* overlap found */ }
```

---

### 66. Sweep Line Algorithm

Model interval events as points on a timeline: +1 at each interval's start, -1 at each end. Sort all events and scan left to right with a running counter. The peak value of that counter is the maximum number of simultaneously active intervals.

> **📐 Math:** Encoding each interval as a $+1$ event at its start and a $-1$ event at its end converts 'how many intervals overlap at time $t$' into a running sum problem: sorting all $2n$ events and scanning left to right, the running counter at any point equals exactly the number of active intervals there — the peak of that running sum is the maximum overlap.

**Problem:** *Meeting Rooms II* — minimum number of meeting rooms required.

```cpp
vector<pair<int,int>> ev;
for (auto& iv : v) { ev.push_back({iv[0], 1}); ev.push_back({iv[1], -1}); }
sort(ev.begin(), ev.end());
int cur = 0, peak = 0;
for (auto& [t, d] : ev) { cur += d; peak = max(peak, cur); }
return peak;
```

---

### 67. Greedy Interval Scheduling

To maximize the number of non-overlapping intervals you can keep, always sort by **end time** and greedily pick the interval with the earliest end — this leaves the most room for future intervals. The number you must *remove* is the total count minus the number you can keep.

**Problem:** *Non-overlapping Intervals* — minimum number of intervals to remove so the rest don't overlap.

```cpp
sort(v.begin(), v.end(), [](auto& a, auto& b){ return a[1] < b[1]; });
int cnt = 0, last = INT_MIN;
for (auto& iv : v) if (iv[0] >= last) { last = iv[1]; cnt++; }
return (int)v.size() - cnt; // removals needed
```

---

### 68. Binary Search on Interval End Times

When you need the most recent non-overlapping interval for each interval (e.g. to feed into interval DP), binary search the sorted array of end times instead of scanning linearly. `upper_bound` finds the last interval ending before the current one starts.

> **📐 Math:** Binary searching for the last interval ending before the current start turns an $O(n)$ linear scan per interval into $O(\log n)$, so over $n$ intervals total time drops from $O(n^2)$ to $O(n \log n)$.

**Problem:** Optimization step for DP-based interval scheduling (e.g. *Job Scheduling* variants).

```cpp
auto it = upper_bound(ends.begin(), ends.end(), ivs[i][0] - 1);
int idx = (int)(it - ends.begin()) - 1; // last compatible interval
```

---


## Matrices

### 69. Matrix Rotation (Transpose + Reverse)

For an in-place 90-degree clockwise rotation: first transpose the matrix (swap `m[i][j]` with `m[j][i]` for all `j > i`), then reverse each row. Counter-clockwise rotation reverses the composition order: reverse rows first, then transpose.

> **📐 Math:** A $90°$ clockwise rotation maps element $(i, j)$ to $(j, n-1-i)$. Transpose alone maps $(i,j) \to (j,i)$; following with a horizontal reverse of each row maps $(j,i) \to (j, n-1-i)$ — composing those two simpler $O(n^2)$ operations reproduces the rotation formula without extra storage.

**Problem:** *Rotate Image*.

```cpp
// 90-degree clockwise: transpose then reverse rows
int n = matrix.size();
for (int i = 0; i < n; i++)
    for (int j = i + 1; j < n; j++)
        swap(matrix[i][j], matrix[j][i]);
for (auto& row : matrix) reverse(row.begin(), row.end());
```

---

### 70. Layer-by-Layer Ring Rotation (In-Place, O(1) Space)

An alternative to transpose+reverse: rotate the matrix one concentric ring at a time using a 4-way element swap, without allocating a copy. Outer loop walks layers from the outside in; inner loop performs the 4-way cyclic swap for each position in that layer.

> **📐 Math:** Layer $k$ of an $n \times n$ matrix forms a ring with $4(n - 1 - 2k)$ elements rotated as 4-way swaps — each element cycles through exactly 4 positions in one pass, so the whole matrix (summed over all $O(n/2)$ layers) is rotated in $O(n^2)$ time and $O(1)$ extra space.

**Problem:** *Rotate Image*, alternative O(1)-space approach.

```cpp
int lo = 0, hi = n - 1;
while (lo < hi) {
    for (int i = 0; i < hi - lo; i++) {
        int tmp = m[lo][lo+i];
        m[lo][lo+i]   = m[hi-i][lo];
        m[hi-i][lo]   = m[hi][hi-i];
        m[hi][hi-i]   = m[lo+i][hi];
        m[lo+i][hi]   = tmp;
    }
    lo++; hi--;
}
```

---

### 71. Spiral Traversal (Shrinking Boundaries)

Process a matrix from the outermost ring inward by tracking four boundary variables (`top`, `bottom`, `left`, `right`) and shrinking them after each side is processed: top row left→right, right column top→bottom, bottom row right→left (if a row remains), left column bottom→top (if a column remains).

> **📐 Math:** Spiral traversal visits exactly $R \cdot C$ cells once each, since the shrinking boundary box guarantees no cell is revisited and the box's area strictly decreases after each side is processed — termination follows because the box area is a strictly decreasing, bounded-below sequence.

**Problem:** *Spiral Matrix*.

```cpp
int t = 0, b = R - 1, l = 0, r = C - 1;
vector<int> res;
while (t <= b && l <= r) {
    for (int c = l; c <= r; c++) res.push_back(m[t][c]); t++;
    for (int c = t; c <= b; c++) res.push_back(m[c][r]); r--;
    if (t <= b) { for (int c = r; c >= l; c--) res.push_back(m[b][c]); b--; }
    if (l <= r) { for (int c = b; c >= t; c--) res.push_back(m[c][l]); l++; }
}
```

---

### 72. Direction Vectors for Grid Neighbors

Encode the four cardinal moves as parallel arrays `dr[] = {0,0,1,-1}` and `dc[] = {1,-1,0,0}`. Loop `d = 0..3`, compute `nr = r+dr[d], nc = c+dc[d]`, and check bounds before visiting — this is the standard neighbor-iteration idiom for grid BFS/DFS.

**Problem:** General grid-neighbor pattern, used throughout grid BFS/DFS problems (e.g. *Number of Islands*, *Rotting Oranges*).

```cpp
int dr[] = {0, 0, 1, -1}, dc[] = {1, -1, 0, 0};
for (int d = 0; d < 4; d++) {
    int nr = r + dr[d], nc = c + dc[d];
    if (nr >= 0 && nr < R && nc >= 0 && nc < C) visit(nr, nc);
}
```

---

### 73. Set Matrix Zeroes (In-Place Marking)

Instead of allocating a separate boolean matrix to remember which rows/columns need zeroing, make two passes: the first scans for zero cells and records their row/column indices (in sets, or by repurposing the matrix's own first row/column as markers); the second pass applies the zeroing.

**Problem:** *Set Matrix Zeroes*.

```cpp
// Two passes: mark then update
unordered_set<int> rowSet, colSet;
for (int r = 0; r < R; r++)
    for (int c = 0; c < C; c++)
        if (m[r][c] == 0) { rowSet.insert(r); colSet.insert(c); }
for (int r : rowSet) fill(m[r].begin(), m[r].end(), 0);
for (int c : colSet) for (int r = 0; r < R; r++) m[r][c] = 0;
```

---

### 74. Sign-as-Flag Marking (O(1) Space Membership)

When values are bounded to a known range (e.g. `[1, n]`), use the *sign* of existing array entries as a membership flag instead of a separate hash set. Negate `nums[|x|-1]` to record that value `|x|` has been seen; a second pass finds the first still-positive index, whose value+1 was never present.

> **📐 Math:** Marking $\text{nums}[|x|-1]$ negative is a clever $O(1)$-space membership trick: since values are bounded to $[1, n]$, each value maps to a unique valid index, so 'is value $v$ present' becomes 'is index $v-1$ negative' — turning a presence query into an $O(1)$ sign check instead of a hash set lookup.

**Problem:** *First Missing Positive*.

```cpp
for (int x : nums) { int i = abs(x) - 1; if (i >= 0 && i < n) nums[i] = -abs(nums[i]); }
for (int i = 0; i < n; i++)
    if (nums[i] > 0) return i + 1; // i+1 never appeared
return n + 1;
```

---


## Bit Manipulation

### 75. Binary Representation & Two's Complement

An integer is stored as a sequence of bits; bit k (0-indexed from the right) has value 2^k. Negative numbers use two's complement: invert all bits and add 1, so that addition/subtraction circuits work uniformly for positive and negative values. An n-bit signed integer's range is `[-2^(n-1), 2^(n-1) - 1]` — for 32-bit ints, `[-2147483648, 2147483647]`.

> **📐 Math:** The range asymmetry exists because zero takes one of the $2^n$ possible bit patterns from the positive side. Two's complement makes `x + (-x) = 0` work with ordinary binary addition (with overflow discarded) — that uniformity is why hardware doesn't need separate add/subtract circuits for signed numbers.

```cpp
// Print 32-bit binary
for (int k = 31; k >= 0; k--) cout << ((x >> k) & 1);
// Or: bitset<32>(x)

// Two's complement of x: ~x + 1
int neg = ~x + 1;
```

**Pattern:** background concept underlying every bit-manipulation problem below, not a single problem itself.

---

### 76. Core Bitwise Operators

`x & y` is 1 only where both inputs are 1 (test a bit, test even/odd). `x | y` is 1 where either is 1 (set a bit). `x ^ y` is 1 where exactly one is 1 (toggle a bit; cancels duplicates). `~x` flips every bit. Shifts: `x << k` multiplies by 2^k; `x >> k` divides by 2^k. Combine a shifted `1` (`1 << k`) as a mask to test, set, clear, or toggle bit k.

> **📐 Math:** Left-shifting by $k$ is equivalent to multiplying by $2^k$ (each shift doubles the value, $k$ times); right-shifting by $k$ is equivalent to integer division by $2^k$. Bit $k$ of $x$ can be tested by $(x \gg k) \land 1$: shifting moves that bit to position 0, and ANDing with 1 isolates it.

```cpp
bool odd   = x & 1;            // LSB check
int  mask  = 1 << k;           // select bit k
int  set_  = x | mask;         // set bit k
int  clr   = x & ~mask;        // clear bit k
int  tog   = x ^ mask;         // toggle bit k
int  bitK  = (x >> k) & 1;     // extract bit k
int  div4  = x >> 2;
int  mul8  = x << 3;
```

**Pattern:** the operator toolkit reused across every bit-manipulation problem (e.g. *Single Number*, *Counting Bits*), not a problem itself.

---

### 77. Lowest-Set-Bit Tricks

`x & (x-1)` clears the lowest set bit, because subtracting 1 flips every trailing zero to 1 and the lowest set bit to 0, so ANDing with the original re-zeros exactly that bit. Looping this (Brian Kernighan's algorithm) counts set bits in O(popcount) iterations rather than checking all 32 positions. `x & (-x)` isolates the lowest set bit instead of clearing it. `x > 0 && !(x & (x-1))` tests whether x is a power of two — true exactly when x has only one set bit.

> **📐 Math:** $x \land (x-1)$ clears the lowest set bit because subtracting 1 flips every trailing zero to 1 and the lowest set bit to 0; ANDing with the original $x$ re-zeros exactly that bit and leaves everything above it untouched. The Brian Kernighan loop therefore runs exactly $\text{popcount}(n)$ times — faster than checking all 32 bit positions when $n$ is sparse.

**Problem:** *Number of 1 Bits* and *Power of Two*.

```cpp
// Count set bits (Brian Kernighan)
int cnt = 0;
for (int t = x; t; t &= t - 1) cnt++;

bool isPow2 = x > 0 && !(x & (x - 1));
int  lsb    = x & (-x);          // isolate lowest set bit
```

---

### 78. DP on Bit Count

To count set bits for every integer from 0 to n efficiently, use `dp[i] = dp[i >> 1] + (i & 1)`: right-shifting `i` by 1 drops its lowest bit, and `(i & 1)` is exactly that dropped bit, so popcount(i) equals popcount(i without its last bit) plus that last bit. This fills all n+1 answers in O(n) total instead of computing each one independently with `__builtin_popcount`.

> **📐 Math:** $\text{dp}[i] = \text{dp}[i \gg 1] + (i \land 1)$ works because right-shifting $i$ by 1 drops its lowest bit, and $(i \land 1)$ is exactly that dropped bit — so the popcount of $i$ equals the popcount of $i$ without its last bit, plus that last bit. This recurrence fills all $n+1$ answers in $O(n)$ total instead of $O(n \log n)$ from counting bits independently for each number.

**Problem:** *Counting Bits*.

```cpp
vector<int> dp(n + 1, 0);
for (int i = 1; i <= n; i++) dp[i] = dp[i >> 1] + (i & 1);
return dp;
```

---

### 79. XOR for Pairing and Missing Values

XOR forms a group under `a ⊕ a = 0` and `a ⊕ 0 = a`, and is associative/commutative — so XORing a whole array cancels every value that appears in pairs, leaving only the unpaired one, regardless of order. The same identity finds a *missing* number: XOR all values `0..n` together with all array elements; every present number cancels with its index, leaving the missing one.

> **📐 Math:** XOR forms a group under the identities $a \oplus a = 0$ and $a \oplus 0 = a$. XORing the whole array is associative and commutative, so all paired (duplicate) values cancel to 0 regardless of order, leaving only the unpaired value — no extra space or sorting needed.

**Problem:** *Single Number* and *Missing Number*.

```cpp
// Single Number: find the one value that doesn't have a pair
int res = 0;
for (int x : nums) res ^= x;

// Missing Number: XOR every index 0..n with every array value
int missing = n;
for (int i = 0; i < n; i++) missing ^= i ^ nums[i];
```

---

### 80. Sum Formula as a Cross-Check

The sum of integers 0 to n is `n(n+1)/2` (Gauss's formula). Subtracting the actual array sum from this expected sum gives an O(n) alternative to XOR for finding a single missing value — useful context, though it can overflow for large n where XOR doesn't.

> **📐 Math:** Gauss's identity $0 + 1 + \ldots + n = n(n+1)/2$ comes from pairing the first and last terms $(0+n)$, second and second-to-last $(1+(n-1))$, etc. — each of the $n/2$ pairs sums to $n$, giving $n \cdot n/2 = n(n+1)/2$ total. This makes "expected sum minus actual sum" an $O(n)$ way to find one missing value, as a complement to the XOR approach above.

**Pattern:** alternative technique for *Missing Number*, shown alongside the XOR approach above for comparison.

```cpp
long expected = (long)n * (n + 1) / 2;
long actual = 0;
for (int x : nums) actual += x;
return (int)(expected - actual);
```

---


## Backtracking (Bonus)

### 81. Backtracking

Explore all candidate solutions by making a choice, recursing, then *undoing* the choice (backtracking) before trying the next one. The "undo" step is what distinguishes backtracking from plain DFS — it lets the same mutable state (e.g. one `path` vector) be reused across all branches instead of copying it.

**Problem:** *Subsets*, *Permutations*, *Combination Sum* — the general backtracking shape underlying all of them.

```cpp
void backtrack(vector<int>& path, /* remaining choices */) {
    if (isComplete(path)) { results.push_back(path); return; }
    for (auto& choice : choices) {
        path.push_back(choice);     // make choice
        backtrack(path, /* updated remaining choices */);
        path.pop_back();            // undo choice (backtrack)
    }
}
```

---

### 82. Grid Backtracking (Word Search)

Combine backtracking with grid traversal and direction vectors: at each cell, try matching the next required character, recurse into all 4 neighbors, then un-mark the cell as visited before returning — so other paths can reuse it.

**Problem:** *Word Search* — does a word exist as a path of adjacent cells in a grid?

```cpp
bool dfs(vector<vector<char>>& board, string& word, int r, int c, int i) {
    if (i == (int)word.size()) return true;
    if (r < 0 || r >= R || c < 0 || c >= C || board[r][c] != word[i]) return false;
    char tmp = board[r][c];
    board[r][c] = '#';               // mark visited
    bool found = dfs(board, word, r+1, c, i+1) || dfs(board, word, r-1, c, i+1)
              || dfs(board, word, r, c+1, i+1) || dfs(board, word, r, c-1, i+1);
    board[r][c] = tmp;               // undo (backtrack)
    return found;
}
```

---


## Additional Concepts

### 83. Two-Heap Median Finder (Running Data Stream)

To find the median of a growing stream of numbers, split the data across two heaps: a max-heap for the lower half, a min-heap for the upper half, kept balanced to within size 1 of each other. Each insertion pushes into one heap then rebalances by moving the top element across if needed — O(log n) per insertion. The median is then always available at a heap top: the top of the larger heap (odd total count), or the average of both tops (even total count). This is the general pattern for streaming-data designs: maintain an invariant on every insert so queries stay O(1) or O(log n), rather than recomputing from scratch each time.

> **📐 Math:** Keeping the two heaps balanced to within size 1 of each other guarantees the median is always at a heap top: with $n$ total elements, if $n$ is even the median is the average of both tops (the two 'middle' elements), and if $n$ is odd it's the top of the larger heap (the single true middle element) — each insertion costs $O(\log n)$ to maintain this invariant.

**Problem:** *Find Median from Data Stream*.

```cpp
priority_queue<int> lo;                                  // max-heap, lower half
priority_queue<int, vector<int>, greater<int>> hi;        // min-heap, upper half

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

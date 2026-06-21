---
layout: default
title: DSA Concepts Guide - 83 Essential DSA Concepts
description: Master 83 essential DSA concepts with pseudocode — arrays, trees, graphs, DP, and more for interview prep.
image: /assets/og-image.png
twitter:
  card: summary_large_image
---

# DSA Concepts Guide

**Pseudocode & Notes for Every Topic**

~100 concepts across 11 categories · C++, Python & more

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

Contiguous memory with O(1) random access by index. A single pass tracks both the value and its index — the building block used in almost every array algorithm. For small bounded alphabets (e.g. a–z) a plain `int freq[26]` is faster and simpler than a hash map. `std::vector` is the dynamic, resizable version in C++; in Python, lists serve the same purpose.

**Problem:** General-purpose pattern used across most array problems (e.g. *Contains Duplicate*, *Two Sum*).

```cpp
vector<int> v = {1, 2, 3};            // dynamic array
for (int i = 0; i < (int)v.size(); i++) {
    int val = v[i];                   // use both value and index
}
int freq[26] = {};                    // fast fixed alphabet
for (char c : s) freq[c - 'a']++;
```

```python
v = [1, 2, 3]                        # dynamic array (list)
for i, val in enumerate(v):          # value and index together
    pass
freq = [0] * 26                      # fast fixed alphabet
for c in s: freq[ord(c) - ord('a')] += 1
```

---

### 2. Hash Sets

An unordered collection of unique elements with O(1) average insert, delete, and lookup. In C++, use `unordered_set` — in Python, use `set()`. Use it to answer "have I seen this before?" in constant time. Backed by a hash table; worst case O(n) due to collisions but rare in practice.

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
```python
seen = set()
for x in nums:
    if x in seen: return True  # duplicate found
    seen.add(x)
return False
```

---

### 3. Hash Maps

A key-to-value store with O(1) average insert and lookup. In C++, use `unordered_map` for O(1) or `map` for O(log n) sorted keys. In Python, use `dict()` for O(1) or `sorted()` on keys for sorted order. Essential for frequency counting, index caching, and grouping items by a common key.

**Problem:** *Two Sum* — find indices `i, j` such that `nums[i] + nums[j] == target`, using one pass and a value→index map.

```cpp
unordered_map<int, int> seen; // value -> index
for (int i = 0; i < (int)nums.size(); i++) {
    int need = target - nums[i];
    if (seen.count(need)) return {seen[need], i};
    seen[nums[i]] = i;
}
```
```python
seen = {}  # value -> index
for i, num in enumerate(nums):
    need = target - num
    if need in seen: return [seen[need], i]
    seen[num] = i
```

---

### 4. Hash Map as Grouping Key

When items share a common property, use that property as the map key and accumulate matching items into a list. In C++, sort a string copy with `std::sort` to create the canonical key and use `unordered_map<string, vector<string>>`. In Python, `''.join(sorted(w))` does the same, and `collections.defaultdict(list)` handles the grouping automatically.

**Problem:** *Group Anagrams* — group words that are anagrams of each other.

```cpp
unordered_map<string, vector<string>> groups;
for (string& w : words) {
    string key = w;
    sort(key.begin(), key.end()); // "eat" -> "aet"
    groups[key].push_back(w);
}
```
```python
from collections import defaultdict
groups = defaultdict(list)
for w in words:
    key = ''.join(sorted(w))  # "eat" -> "aet"
    groups[key].append(w)
```

---

### 5. Character Frequency Counting

Count how often each character appears. For ASCII lowercase letters a fixed `int[26]` array is fastest in C++ — index with `c - 'a'`. In Python, `collections.Counter` does this in one call, or a list of 26 zeros gives the same performance. Two strings are anagrams iff their frequency arrays (or Counters) match exactly.

**Problem:** *Valid Anagram* — check whether `s` and `t` are anagrams of each other.

```cpp
int freq[26] = {};
for (char c : s) freq[c - 'a']++;
for (char c : t) freq[c - 'a']--;
for (int f : freq) if (f != 0) return false;
return s.size() == t.size();
```
```python
from collections import Counter
freq_s = Counter(s)
freq_t = Counter(t)
return freq_s == freq_t
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
```python
v.sort()                    # ascending O(n log n)
v.sort(reverse=True)        # descending
# Custom key: v.sort(key=lambda x: -x)
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
```python
# O(n^2) brute force -- compare all pairs
for i in range(n):
    for j in range(i + 1, n):
        if nums[i] == nums[j]: return True
return False
```



---

### 8. String Manipulation

Building, slicing, and transforming strings: iterating character-by-character, extracting substrings with `substr` (C++) or slicing `s[start:end]` (Python), reversing with `std::reverse` / `reversed()`, filtering, and changing case with `tolower/toupper` or `.lower()/.upper()`.

**Problem:** *Valid Palindrome* — strip non-alphanumeric characters, lowercase everything, then compare to its reverse.

```cpp
string res;
for (char c : s)
    if (isalnum(c)) res += tolower(c);
reverse(res.begin(), res.end());
string sub = s.substr(start, len);
```
```python
res = [c.lower() for c in s if c.isalnum()]
res.reverse()
sub = s[start:start+len]  # slicing
```

> **💡 Python Tip:** Python strings are immutable — list comprehensions with `''.join()` are more efficient than repeated concatenation. Use `c.isalnum()` and `c.lower()` for built-in character classification.

---

### 9. Heap / Priority Queue

A binary heap giving O(1) access to the min (min-heap) or max (max-heap) element, with O(log n) push/pop. In C++, use `priority_queue<int, vector<int>, greater<int>>` for min-heap and `priority_queue<int>` for max-heap. In Python, use `heapq` (min-heap by default; negate values for max-heap behavior). Use for top-k problems, scheduling, and greedy algorithms that always need the smallest/largest element next.

**Problem:** *Kth Largest Element in an Array* — push, pop, peek with a min-heap and max-heap.

```cpp
priority_queue<int, vector<int>, greater<int>> minH;
priority_queue<int> maxH;           // default max-heap
minH.push(x);
int top = minH.top(); minH.pop();
```
```python
import heapq
minH = []
heapq.heappush(minH, x)
top = heapq.heappop(minH)

# Max-heap: negate values
maxH = []
heapq.heappush(maxH, -x)
top = -heapq.heappop(maxH)
```



---

### 10. Bucket Sort

Instead of comparing elements, place each value into a bucket whose index equals the value. Reading buckets in order produces a sorted result in O(n). Ideal when the value range is bounded, e.g. frequencies 1 to n. In C++, use `vector<vector<int>>` for buckets; in Python, use a list of lists ` [[] for _ in range(n+1)]`.

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
```python
from collections import Counter

counts = Counter(nums)
buckets = [[] for _ in range(len(nums) + 1)]
for val, cnt in counts.items():
    buckets[cnt].append(val)

res = []
for i in range(len(nums), 0, -1):
    for v in buckets[i]:
        res.append(v)
        if len(res) == k:
            return res
```

> **💡 Python Tip:** `collections.Counter.most_common(k)` does this exact pattern in one call — `Counter(nums).most_common(k)`.

---

### 11. Length-Prefix Encoding

When encoding a list of strings into one string, choose a separator that cannot appear in the data — or sidestep the problem entirely with length-prefixing: encode each string as its length, a separator, then the content (`3#eat4#love`). Decoding reads the length, jumps exactly that many characters, and repeats. No delimiter collision is possible. In C++, use `to_string()` and string concatenation; in Python, use `str()` and `str.join()`.

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
```python
def encode(strs):
    return ''.join(str(len(s)) + '#' + s for s in strs)

def decode(s):
    res, i = [], 0
    while i < len(s):
        j = s.find('#', i)
        length = int(s[i:j])
        i = j + 1 + length
        res.append(s[j + 1:i])
        i = i
    return res
```

---

### 12. Prefix / Suffix Sum or Product

Precompute cumulative sums or products so any subarray query is O(1). For products-excluding-self, make two passes: left-to-right accumulating the left product, then right-to-left accumulating the right product. The same two-pass shape works for prefix sums. In C++, use `vector<int>` and index loops; in Python, use list comprehensions with enumerate or simple `range()` loops.

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
```python
n = len(nums)
out = [1] * n
L = 1
for i in range(n):
    out[i] = L
    L *= nums[i]
R = 1
for i in range(n - 1, -1, -1):
    out[i] *= R
    R *= nums[i]
```

---

### 13. Character Classification

Determine whether a character is alphanumeric, alphabetic, a digit, etc. using `isalnum`, `isdigit`, `isalpha` in C++ or string methods `.isalnum()`, `.isdigit()`, `.isalpha()` in Python. Essential for palindrome checks and string parsing.

**Problem:** *Valid Palindrome* (classification step) — skip characters that aren't letters or digits before comparing.

```cpp
for (char c : s) {
    if (!isalnum(c)) continue;  // skip non-alphanumeric
    result += tolower(c);
}
```
```python
result = ''.join(c.lower() for c in s if c.isalnum())
```

> **💡 Python Tip:** String methods `.isalnum()`, `.isalpha()`, `.isdigit()`, `.lower()`, `.upper()` are all built-in — no need for `<cctype>` headers.

---

### 14. Handling Duplicates (Sorted Array)

After sorting, identical values are adjacent. Skip them with `if (i > 0 && nums[i] == nums[i-1]) continue` in C++ or `if i > 0 and nums[i] == nums[i - 1]: continue` in Python, to avoid producing duplicate results in two-sum / three-sum problems.

**Problem:** *3Sum* (dedup step) — after sorting, skip repeated values for `i` so the same triplet isn't reported twice.

```cpp
sort(nums.begin(), nums.end());
for (int i = 0; i < (int)nums.size(); i++) {
    if (i > 0 && nums[i] == nums[i - 1]) continue;
    // process nums[i] -- guaranteed first occurrence
}
```
```python
nums.sort()
for i in range(len(nums)):
    if i > 0 and nums[i] == nums[i - 1]:
        continue
    # process nums[i] -- guaranteed first occurrence
```

---

### 15. Hash Map for Skip-Ahead Window

Store each character's most-recently-seen index in a hash map (C++ `unordered_map<char,int>` or Python `dict()`). When a duplicate is encountered, the left pointer jumps directly past the earlier occurrence rather than inching forward one step at a time — an O(n) refinement over the naive shrink-one-at-a-time sliding window.

**Problem:** *Longest Substring Without Repeating Characters*, optimized version — jump `lo` straight past the duplicate instead of incrementing it in a loop.

```cpp
unordered_map<char, int> last;
int lo = 0;
for (int hi = 0; hi < (int)s.size(); hi++) {
    if (last.count(s[hi])) lo = max(lo, last[s[hi]] + 1);
    last[s[hi]] = hi;
}
```
```python
last = {}
lo = 0
for hi, c in enumerate(s):
    if c in last:
        lo = max(lo, last[c] + 1)
    last[c] = hi
```

---

### 16. Hash Set for Sequence Detection

A hash set isn't just for membership tests — checking `!seen.count(x - 1)` (C++) or `x - 1 not in seen` (Python) finds the *start* of a run, so you only walk forward from true sequence starts instead of re-walking every element.

**Problem:** *Longest Consecutive Sequence* — find the length of the longest run of consecutive integers in O(n), without sorting.

```cpp
unordered_set<int> seen(nums.begin(), nums.end());
for (int x : nums)
    if (!seen.count(x - 1)) // x is a sequence start
        while (seen.count(x)) x++;
```
```python
seen = set(nums)
max_len = 0
for x in nums:
    if x - 1 not in seen:  # x is a sequence start
        length = 1
        while x + length in seen:
            length += 1
        max_len = max(max_len, length)
```

---


## Two Pointers & Sliding Window

### 17. Two Pointers

Maintain two indices that move through the array — usually from each end (`lo`, `hi`) or both from the left at different speeds. In C++, use `int lo = 0, hi = (int)nums.size() - 1;` with a while loop; in Python, use `lo, hi = 0, len(nums) - 1` with `while lo < hi:`. Eliminates the inner loop of a brute-force O(n²) solution, reducing it to O(n). When the array isn't already sorted, sort first and the technique still applies: advance the left pointer when the sum is too small, retreat the right pointer when too large.

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
```python
# Two-pointer on a sorted array (pair sum)
lo, hi = 0, len(nums) - 1
while lo < hi:
    s = nums[lo] + nums[hi]
    if s == target: break
    elif s < target: lo += 1
    else: hi -= 1

# Extended to triplets (3Sum): fix i, two-pointer the rest
nums.sort()
for i in range(n):
    l, r = i + 1, n - 1
    while l < r:
        s = nums[i] + nums[l] + nums[r]
        if s == 0: l += 1; r -= 1
        elif s < 0: l += 1
        else: r -= 1
```

---

### 18. Sliding Window

A variable- or fixed-size window defined by two pointers (`lo` and `hi`). In C++, use `unordered_set<char>` or `unordered_map<char,int>` for window state; in Python, use `set()` or `collections.Counter()` respectively. Expand the right pointer to grow; shrink the left pointer when a constraint is violated. Achieves O(n) for problems that would otherwise be O(n²). For a *fixed*-size window, no shrinking logic is needed — just subtract the element leaving and add the one entering.

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
```python
# Variable-size window: longest substring without repeats
win = set()
lo = best = 0
for hi, c in enumerate(s):
    while c in win: win.remove(s[lo]); lo += 1
    win.add(c)
    best = max(best, hi - lo + 1)

# Fixed-size window of length k: max sum subarray
window_sum = sum(nums[:k])
best2 = window_sum
for i in range(k, len(nums)):
    window_sum += nums[i] - nums[i - k]
    best2 = max(best2, window_sum)
```

---

### 19. Sliding Window with Frequency Counting

Track how many times each element appears inside the current window using a frequency map. In C++, use `unordered_map<char,int>`; in Python, use `collections.Counter()` or a plain `dict()` with manual tracking. The maximum frequency determines whether the window can be made uniform with at most k replacements.

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
```python
from collections import Counter
freq = Counter()
lo = max_freq = 0
for hi, c in enumerate(s):
    freq[c] += 1
    max_freq = max(max_freq, freq[c])
    if (hi - lo + 1) - max_freq > k: freq[s[lo]] -= 1; lo += 1
```

---

### 20. Greedy Algorithms

At each step commit to the locally optimal choice and never reconsider it. Works when the problem has the *greedy-choice property*: local optima compose into a global optimum. Examples: buy-sell stock, jump game, interval scheduling. In C++, use `min()`/`max()` with `INT_MAX`; in Python, use `min()`/`max()` builtins or initialize with `float('inf')`.

> **📐 Math:** Greedy correctness requires proving the *exchange argument*: any optimal solution can be transformed, step by step, into the greedy solution without making it worse. For buy-low-sell-high, tracking running min $m$ and updating $\text{profit} = \max(\text{profit}, \text{price} - m)$ works because the best sell day for any fixed buy day is irrelevant — only the cheapest price-so-far matters, so a single pass suffices instead of checking all $O(n^2)$ buy/sell pairs.

**Problem:** *Best Time to Buy and Sell Stock* — maximize profit from a single buy and a later sell.

```cpp
int minBuy = INT_MAX, maxProfit = 0;
for (int p : prices) {
    minBuy    = min(minBuy, p);
    maxProfit = max(maxProfit, p - minBuy);
}
```
```python
min_buy = float('inf')
max_profit = 0
for p in prices:
    min_buy = min(min_buy, p)
    max_profit = max(max_profit, p - min_buy)
```

---


## Stack & Queue

### 21. Stack Data Structure

Last-In-First-Out (LIFO). In C++, use `stack<char>` from `<stack>` which wraps a `deque` by default; in Python, use a plain `list` with `.append()` (push) and `.pop()` (pop). Push elements when processing; pop when a matching or complementary element is found, e.g. bracket matching.

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
```python
match = {')': '(', ']': '[', '}': '{'}
st = []
for c in s:
    if c in match:
        if not st or st.pop() != match[c]: break
    else: st.append(c)
return len(st) == 0
```

---

### 22. Queue Data Structure

First-In-First-Out (FIFO). In C++, use `std::queue` with `push` to back, `front` to peek, `pop` to remove. In Python, use `collections.deque` for O(1) popleft. Essential for BFS. Snapshot `q.size()` before the inner loop to process one level at a time.

**Problem:** General FIFO usage pattern, as used in BFS (see *Trees & Tries* and *Graphs* sections).

```cpp
queue<int> q;
q.push(1); q.push(2);       // enqueue
int front = q.front(); q.pop(); // FIFO: front = 1
// In BFS: enqueue neighbors, dequeue to process
```
```python
from collections import deque
q = deque()
q.append(1); q.append(2)       # enqueue
front = q[0]; q.popleft()      # FIFO: front = 1
```

---

## Binary Search

### 23. Binary Search

Repeatedly halve the search space by comparing the middle element to the target. Requires a sorted (or monotone) input. Always compute `mid = left + (right - left) / 2` to avoid integer overflow — in Python, `mid = (lo + hi) // 2` works directly. Time O(log n). In C++, use `int lo = 0, hi = (int)nums.size() - 1;`; in Python, use `lo, hi = 0, len(nums) - 1`.

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
```python
lo, hi = 0, len(nums) - 1
while lo <= hi:
    mid = (lo + hi) // 2
    if nums[mid] == target: return mid
    elif nums[mid] < target: lo = mid + 1
    else: hi = mid - 1
return -1
```

---

### 24. Binary Search on a Rotated Sorted Array

A rotated sorted array splits into two sorted halves. Exactly one of the two halves defined by `mid` is always fully sorted — use that to determine which half the target lies in. In C++, use `unordered_map` for lookups; in Python, use `dict()` for the same. To find the minimum specifically, compare `nums[mid]` to `nums[hi]` instead.

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
```python
# Find minimum in rotated sorted array
lo, hi = 0, len(nums) - 1
while lo < hi:
    mid = (lo + hi) // 2
    if nums[mid] > nums[hi]: lo = mid + 1
    else: hi = mid

# Search for target in rotated sorted array
lo, hi = 0, len(nums) - 1
while lo <= hi:
    mid = (lo + hi) // 2
    if nums[mid] == target: return mid
    if nums[lo] <= nums[mid]:  # left half sorted
        if nums[lo] <= target < nums[mid]: hi = mid - 1
        else: lo = mid + 1
    else:                       # right half sorted
        if nums[mid] < target <= nums[hi]: lo = mid + 1
        else: hi = mid - 1
return -1
```

---


## Linked Lists

### 25. Linked List Fundamentals

A chain of nodes, each holding a value and a pointer to the next node. Traversal is O(n); random access does not exist. Always check for `nullptr` before dereferencing. In C++, define a `struct ListNode` with `int val` and `ListNode* next`; in Python, use a `class ListNode` with `val` and `self.next`. Redirecting `next` pointers is the core operation — always save the next node before overwriting a pointer, or you'll lose the rest of the list.

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
```python
class ListNode:
    def __init__(self, x):
        self.val = x
        self.next = None

# Traversal
cur = head
while cur:
    process(cur.val)
    cur = cur.next

# Save next before overwriting
nxt = cur.next
cur.next = prev
prev = cur
cur = nxt
```

---

### 26. Dummy Node Pattern

Prepend a sentinel node so the head can be treated like any other node. In C++, use `ListNode dummy(0); dummy.next = head;`; in Python, use `dummy = ListNode(0); dummy.next = head;`. Eliminates special-casing the head in insertions and deletions. Return `dummy.next` as the new head. The same trick powers *Remove Nth Node From End*: advance a leader pointer n steps ahead, then walk both pointers until the leader hits `nullptr` — the trailer is now just before the target.

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
```python
dummy = ListNode(0)
dummy.next = head
prev, fast = dummy, head
for _ in range(n): fast = fast.next
while fast:
    prev = prev.next
    fast = fast.next
prev.next = prev.next.next
return dummy.next
```

---

### 27. Fast and Slow Pointers (Floyd's Algorithm)

Two pointers advancing at different speeds (1 vs 2 steps). In C++, use `ListNode* slow = head, *fast = head;`; in Python, use `slow = fast = head`. When fast reaches the end, slow is at the midpoint. If there is a cycle, the pointers will eventually meet. To find the cycle's *entry point*, reset one pointer to head and advance both one step at a time — they will meet exactly at the start of the cycle.

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
```python
# Phase 1: detect a cycle
slow = fast = head
while fast and fast.next:
    slow = slow.next
    fast = fast.next.next
    if slow == fast: break

# Phase 2: find the entry point
slow = head
while slow != fast:
    slow = slow.next
    fast = fast.next
return slow
```

---

### 28. Linked List Reversal

Change each node's `next` pointer to its predecessor. Requires three variables: `prev`, `cur`, `nxt`. In C++, initialize `ListNode* prev = nullptr, *cur = head;`; in Python, `prev, cur = None, head`. After the loop `prev` is the new head. Can also be done recursively, mirroring the list structure.

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
```python
# Iterative
cur, prev = head, None
while cur:
    nxt = cur.next
    cur.next = prev
    prev = cur
    cur = nxt
return prev  # new head

# Recursive
def reverse(head):
    if not head or not head.next: return head
    new_head = reverse(head.next)
    head.next.next = head
    head.next = None
    return new_head
```

---

### 29. Merging / Interleaving Linked Lists

Compare the heads of both lists, attach the smaller node to the result, and advance that pointer — used to merge two *sorted* lists. In C++, use a dummy node `ListNode d(0); ListNode* c = &d;`; in Python, `d = ListNode(0); c = d`. A different pattern, interleaving, alternates picking from each list regardless of value — used in *Reorder List* after finding the midpoint and reversing the second half.

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
```python
# Merge two sorted lists
def merge(l1, l2):
    d = ListNode(0)
    c = d
    while l1 and l2:
        if l1.val <= l2.val:
            c.next = l1; l1 = l1.next
        else:
            c.next = l2; l2 = l2.next
        c = c.next
    c.next = l1 or l2
    return d.next

# Interleave two lists: l1->l2->l1->l2->... (Reorder List)
p1, p2 = head, second
while p2:
    n1, n2 = p1.next, p2.next
    p1.next = p2; p2.next = n1
    p1, p2 = n1, n2
```

---

### 30. Merge K Sorted Lists (Heap and Divide-and-Conquer)

Two strategies for merging k sorted lists: (1) a min-heap of `(value, node)` pairs, always extracting the globally smallest node in O(log k). In C++, use `priority_queue<pair<int,ListNode*>, vector<...>, greater<>>`; in Python, use `heapq` with `(node.val, node)` tuples. (2) divide-and-conquer, pairing up lists and merging recursively.

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
```python
import heapq

# Min-heap approach
pq = []
for l in lists:
    if l: heapq.heappush(pq, (l.val, l))
d = ListNode(0)
cur = d
while pq:
    _, node = heapq.heappop(pq)
    cur.next = node; cur = cur.next
    if node.next: heapq.heappush(pq, (node.next.val, node.next))
return d.next

# Divide-and-conquer approach (reuses merge from Concept 29)
def mergeK(lists, l, r):
    if l == r: return lists[l]
    mid = (l + r) // 2
    return merge(mergeK(lists, l, mid), mergeK(lists, mid + 1, r))
```

---


## Trees & Tries

### 31. Binary Tree Structure & Traversal

Each node has at most two children (left and right). In C++, define a `struct TreeNode` with `left`/`right` pointers; in Python, define a class with `self.left` and `self.right` attributes. Every recursive tree function follows the same shape: (1) handle the `nullptr`/`None` base case, (2) process the current node, (3) recurse left, (4) recurse right. Three orderings name *where* step 2 happens: preorder (root first — good for serializing/cloning), inorder (root between children — sorted output for a BST), postorder (root last — use when a parent's result depends on its children, e.g. height or diameter).

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

```python
class TreeNode:
    def __init__(self, x):
        self.val = x
        self.left = self.right = None

def height(node):  # postorder: children before parent
    if not node: return 0  # base case
    return 1 + max(height(node.left), height(node.right))

def preorder(n):
    if not n: return
    visit(n.val)
    preorder(n.left)
    preorder(n.right)

def inorder(n):
    if not n: return
    inorder(n.left)
    visit(n.val)
    inorder(n.right)

def postorder(n):
    if not n: return
    postorder(n.left)
    postorder(n.right)
    visit(n.val)
```

---

### 32. Breadth-First Search (BFS) on Trees

Visit all nodes at depth d before any node at depth d+1, using a queue. In C++, use `queue<TreeNode*>` with `q.size()` to snapshot level size; in Python, use `collections.deque` with `len(q)`. Snapshot the queue size at the start of each while-loop iteration to isolate exactly one level per inner loop.

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

```python
from collections import deque

q = deque()
if root: q.append(root)
while q:
    sz = len(q)            # snapshot level size
    for _ in range(sz):
        n = q.popleft()
        process(n.val)
        if n.left:  q.append(n.left)
        if n.right: q.append(n.right)
```

---

### 33. Stack-based Iteration (Iterative DFS)

Convert recursive DFS into an explicit loop using `std::stack` in C++ or a plain `list` in Python, to avoid stack-overflow risk on very deep trees. Push the right child before the left so the left is popped (and processed) first, mirroring preorder recursion. In Python, `list.append()` is push and `list.pop()` is pop. The same explicit-stack trick supports iterative *inorder*: push left children until null, pop, process, then move right.

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

```python
# Iterative preorder
st = []
if root: st.append(root)
while st:
    n = st.pop()
    process(n.val)
    if n.right: st.append(n.right)  # push right first
    if n.left:  st.append(n.left)

# Iterative inorder
cur = root
st = []
while cur or st:
    while cur:
        st.append(cur)
        cur = cur.left
    cur = st.pop()
    process(cur.val)
    cur = cur.right
```

---

### 34. Comparing Two Trees

Two trees are identical if both are null (`nullptr` / `None`), or both are non-null with equal values and recursively identical left and right subtrees. One mismatch anywhere returns `False`. The same shape (with one tree's children swapped) checks whether a tree is a mirror of itself.

**Problem:** *Same Tree* — check whether two binary trees are structurally identical with the same node values.

```cpp
bool isSame(TreeNode* p, TreeNode* q) {
    if (!p && !q) return true;
    if (!p || !q || p->val != q->val) return false;
    return isSame(p->left,  q->left)
        && isSame(p->right, q->right);
}
```

```python
def is_same(p, q):
    if not p and not q: return True
    if not p or not q or p.val != q.val: return False
    return is_same(p.left, q.left) and is_same(p.right, q.right)
```

---

### 35. Balanced Tree Check & Negative-Clamp Pattern

A tree is height-balanced if, at every node, the heights of the left and right subtrees differ by at most 1, and both subtrees are themselves balanced. More generally, when combining subtree contributions in tree DP, clamp negative contributions to zero with `max(0, subtreeResult)` in C++ or `max(0, subtree_result)` in Python — a negative contribution is always worse than not taking that branch at all (used in *Binary Tree Maximum Path Sum*).

```cpp
bool isBalanced(TreeNode* n) {
    if (!n) return true;
    int l = height(n->left), r = height(n->right);
    return abs(l - r) <= 1 && isBalanced(n->left)
                            && isBalanced(n->right);
}
```

```python
# Balanced check with a height helper that returns [is_balanced, height]
class Solution:
    def isBalanced(self, root):
        def check(node):
            if not node: return [True, 0]
            left_ok, left_h = check(node.left)
            right_ok, right_h = check(node.right)
            balanced = left_ok and right_ok and abs(left_h - right_h) <= 1
            return [balanced, 1 + max(left_h, right_h)]
        return check(root)[0]
```

**Problem:** *Balanced Binary Tree*.

---

### 36. Validate Binary Search Tree

All values in the left subtree must be strictly less than the node; all in the right subtree strictly greater — for *every* ancestor, not just the immediate parent. Pass a shrinking `(lo, hi)` range down each recursive call: going left tightens `hi` to the parent's value, going right tightens `lo`. Use `long long` in C++ or `float('inf')` in Python to avoid overflow on boundary values.

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
```python
class TreeNode:
    def __init__(self, x):
        self.val = x
        self.left = self.right = None

def validate_bst(root):
    def check(node, lo=float('-inf'), hi=float('inf')):
        if not node: return True
        if not (lo < node.val < hi): return False
        return check(node.left, lo, node.val) and check(node.right, node.val, hi)
    return check(root)
```

---

### 37. Kth Smallest via Inorder Traversal

Inorder traversal of a BST yields values in strictly increasing order, because of the BST invariant (left < node < right) applied recursively. Decrement a counter `k` during inorder traversal to find the kth smallest in O(h + k) — no need to traverse the whole tree or sort all n values. In C++, use a global/member `k` and `result`; in Python, use a list `[k]` or `nonlocal` to mutate across recursion.

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

```python
# Use a list or nonlocal for mutable counter across recursion
class Solution:
    def kthSmallest(self, root, k):
        self.result = None
        self._k = k
        def inorder(n):
            if not n: return
            inorder(n.left)
            self._k -= 1
            if self._k == 0:
                self.result = n.val
                return
            inorder(n.right)
        inorder(root)
        return self.result
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

```python
class TreeNode:
    def __init__(self, x):
        self.val = x
        self.left = self.right = None

def count_good_nodes(root, mx=float('-inf')):
    if not root: return 0
    cnt = 1 if root.val >= mx else 0
    mx = max(mx, root.val)
    return cnt + count_good_nodes(root.left, mx) + count_good_nodes(root.right, mx)
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

```python
class TreeNode:
    def __init__(self, x):
        self.val = x
        self.left = self.right = None

# Diameter
diam = 0
def depth(n):
    global diam
    if not n: return 0
    l, r = depth(n.left), depth(n.right)
    diam = max(diam, l + r)
    return 1 + max(l, r)

# Max path sum
max_path = float('-inf')
def gain(n):
    global max_path
    if not n: return 0
    l = max(0, gain(n.left))
    r = max(0, gain(n.right))
    max_path = max(max_path, l + n.val + r)
    return n.val + max(l, r)
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

```python
class TreeNode:
    def __init__(self, x):
        self.val = x
        self.left = self.right = None

def lca(root, p, q):
    if not root: return None
    if p.val < root.val and q.val < root.val: return lca(root.left, p, q)
    if p.val > root.val and q.val > root.val: return lca(root.right, p, q)
    return root
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

```python
class TreeNode:
    def __init__(self, x):
        self.val = x
        self.left = self.right = None

def has_path_sum(root, target_sum):
    if not root: return False
    if not root.left and not root.right: return root.val == target_sum
    target_sum -= root.val
    return has_path_sum(root.left, target_sum) or has_path_sum(root.right, target_sum)
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

```python
class TreeNode:
    def __init__(self, x):
        self.val = x
        self.left = self.right = None

def serialize(root):
    if not root: return 'N'
    return str(root.val) + ',' + serialize(root.left) + ',' + serialize(root.right)

def deserialize(data):
    tokens = iter(data.split(','))
    def build():
        val = next(tokens)
        if val == 'N': return None
        node = TreeNode(int(val))
        node.left = build()
        node.right = build()
        return node
    return build()
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

```python
class Node:
    def __init__(self, val, children=None):
        self.val = val
        self.children = children or []

def dfs(n):
    if not n: return
    for c in n.children:
        dfs(c)
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

```python
class TrieNode:
    def __init__(self):
        self.children = {}
        self.end = False

class Trie:
    def __init__(self):
        self.root = TrieNode()

    def insert(self, word):
        cur = self.root
        for c in word:
            if c not in cur.children:
                cur.children[c] = TrieNode()
            cur = cur.children[c]
        cur.end = True

    def search(self, word):
        cur = self.root
        for c in word:
            if c not in cur.children: return False
            cur = cur.children[c]
        return cur.end

    # wildcard search ('.'): DFS, trying all children at that position
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

```python
for c in s:
    idx = ord(c) - ord('a')      # 0-25 for lowercase
    if c.isalpha():
        pass  # alphabetic check
    if c.isdigit():
        pass  # digit check
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

```python
# Adjacency list using dict of lists
adj = {i: [] for i in range(n)}

# Directed edge
adj[u].append(v)

# Undirected edges
adj[u].append(v)
adj[v].append(u)
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

```python
from collections import deque

# Graph DFS
vis = [False] * n
def dfs(u):
    vis[u] = True
    for v in adj[u]:
        if not vis[v]:
            dfs(v)

# Graph BFS
q = deque([src])
vis[src] = True
while q:
    u = q.popleft()
    for v in adj[u]:
        if not vis[v]:
            vis[v] = True
            q.append(v)
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

```python
from collections import deque

# Multi-source BFS
dist = [[-1]*C for _ in range(R)]
q = deque()
for r, c in sources:
    q.append((r, c))
    dist[r][c] = 0

while q:
    r, c = q.popleft()
    for dr, dc in [(0,1),(0,-1),(1,0),(-1,0)]:
        nr, nc = r+dr, c+dc
        if 0 <= nr < R and 0 <= nc < C and dist[nr][nc] == -1:
            dist[nr][nc] = dist[r][c] + 1
            q.append((nr, nc))
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

```python
parent = list(range(N))
rank = [0] * N

def find(x):
    if parent[x] != x:
        parent[x] = find(parent[x])  # path compression
    return parent[x]

def unite(a, b):
    a, b = find(a), find(b)
    if a == b: return
    if rank[a] < rank[b]: a, b = b, a
    parent[b] = a
    if rank[a] == rank[b]: rank[a] += 1
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

```python
from collections import deque

# Kahn's algorithm (BFS)
indeg = [0] * n
for u, v in edges:
    indeg[v] += 1

q = deque([i for i in range(n) if indeg[i] == 0])
order = []
while q:
    u = q.popleft()
    order.append(u)
    for v in adj[u]:
        indeg[v] -= 1
        if indeg[v] == 0:
            q.append(v)

no_cycle = len(order) == n

# DFS post-order reversed
vis = [False] * n
stk = []
def dfs(u):
    vis[u] = True
    for v in adj[u]:
        if not vis[v]:
            dfs(v)
    stk.append(u)
# Read stk top-to-bottom for topological order
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

```python
# 0=unvisited, 1=in-stack, 2=done
st = [0] * n

def has_cycle(u):
    st[u] = 1
    for v in adj[u]:
        if st[v] == 1: return True
        if st[v] == 0 and has_cycle(v): return True
    st[u] = 2
    return False
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

```python
for i in range(len(words) - 1):
    w1, w2 = words[i], words[i + 1]
    for j in range(min(len(w1), len(w2))):
        if w1[j] != w2[j]:
            adj[ord(w1[j]) - ord('a')].append(ord(w2[j]) - ord('a'))
            break
# Then run Topological Sort on the resulting 26-node graph
```


---


## Dynamic Programming

### 53. Dynamic Programming Fundamentals

Break a problem into overlapping subproblems, solve each exactly once, and cache the result. Two equivalent styles: **top-down memoization** (recursive function + cache, computed lazily) and **bottom-up tabulation** (iterative array, filled in dependency order). Requires the problem to have *optimal substructure* (an optimal solution is built from optimal solutions to subproblems) and *overlapping subproblems* (the same subproblem recurs many times — otherwise plain recursion is already efficient).

**Problem:** General DP shape, e.g. *Climbing Stairs* or *Fibonacci*-style recurrences.
> **📐 Math:** Naive recursion without memoization recomputes overlapping subproblems exponentially often — e.g. fib$(n)$ makes $O(2^n)$ calls because fib$(n-2)$ is recomputed independently inside both fib$(n-1)$ and the direct fib$(n-2)$ branch. Caching collapses this to $O(n)$ since each of the $n$ distinct subproblems is solved exactly once. Naive Fibonacci's call count grows like $\varphi^n$ where $\varphi = (1+\sqrt{5})/2 \approx 1.618$ (the golden ratio) — that's the blowup memoization eliminates.

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

```python
# Top-down (memoization)
memo = {}
def solve(s):
    if is_base(s): return base_value(s)
    if s in memo: return memo[s]
    memo[s] = combine(solve(smaller(s)))
    return memo[s]

# Bottom-up (tabulation)
dp = [0] * (n + 1)
dp[0] = base_value
for i in range(1, n + 1):
    dp[i] = combine(dp[i - 1])
```
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

```python
# Climbing stairs
dp = [0] * (n + 1)
dp[0] = dp[1] = 1
for i in range(2, n + 1):
    dp[i] = dp[i - 1] + dp[i - 2]
return dp[n]

# House Robber: O(1) space
def rob(nums):
    prev2, prev1 = 0, 0
    for x in nums:
        cur = max(prev1, prev2 + x)
        prev2, prev1 = prev1, cur
    return prev1
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

```python
def rob(nums):
    def linear(l, r):
        a, b = 0, 0
        for i in range(l, r + 1):
            a, b = b, max(b, a + nums[i])
        return b
    if len(nums) == 1: return nums[0]
    return max(linear(0, len(nums) - 2), linear(1, len(nums) - 1))
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

```python
def coin_change(coins, amount):
    dp = [amount + 1] * (amount + 1)
    dp[0] = 0
    for a in range(1, amount + 1):
        for c in coins:
            if c <= a:
                dp[a] = min(dp[a], dp[a - c] + 1)
    return dp[amount] if dp[amount] <= amount else -1
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

```python
def word_break(s, wordDict):
    word_set = set(wordDict)
    n = len(s)
    dp = [False] * (n + 1)
    dp[0] = True
    for i in range(1, n + 1):
        for j in range(i):
            if dp[j] and s[j:i] in word_set:
                dp[i] = True
                break
    return dp[n]
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

```python
def max_subarray(nums):
    cur = best = nums[0]
    for i in range(1, len(nums)):
        cur = max(nums[i], cur + nums[i])
        best = max(best, cur)
    return best
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

```python
def max_product(nums):
    lo = hi = res = nums[0]
    for i in range(1, len(nums)):
        if nums[i] < 0: lo, hi = hi, lo
        hi = max(nums[i], hi * nums[i])
        lo = min(nums[i], lo * nums[i])
        res = max(res, hi)
    return res
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

```python
def unique_paths(m, n):
    dp = [[1] * n for _ in range(m)]
    for i in range(1, m):
        for j in range(1, n):
            dp[i][j] = dp[i-1][j] + dp[i][j-1]
    return dp[m-1][n-1]
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

```python
# 1-D rolling array for grid DP
dp = [0] * (n + 1)
for i in range(m):
    for j in range(1, n + 1):
        dp[j] = f(dp[j], dp[j - 1])  # dp[j] from old row, dp[j-1] from new row
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

```python
def longest_palindromic_substring(s):
    n = len(s)
    if n < 2: return s
    dp = [[False] * n for _ in range(n)]
    for i in range(n):
        dp[i][i] = True
    start, max_len = 0, 1
    for i in range(n - 2, -1, -1):
        for j in range(i + 1, n):
            dp[i][j] = (s[i] == s[j]) and (j - i < 3 or dp[i+1][j-1])
            if dp[i][j] and j - i + 1 > max_len:
                start, max_len = i, j - i + 1
    return s[start:start + max_len]
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

```python
def manacher(s):
    t = '#' + '#'.join(s) + '#'
    n = len(t)
    p = [0] * n
    c = r = 0
    for i in range(n):
        if i < r:
            p[i] = min(r - i, p[2*c - i])
        while i + p[i] + 1 < n and i - p[i] - 1 >= 0 and t[i + p[i] + 1] == t[i - p[i] - 1]:
            p[i] += 1
        if i + p[i] > r:
            c, r = i, i + p[i]
    return p
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

```python
def merge(intervals):
    if not intervals: return []
    intervals.sort()
    res = [intervals[0][:]]
    for cur in intervals[1:]:
        last = res[-1]
        if cur[0] <= last[1]:
            last[1] = max(last[1], cur[1])
        else:
            res.append(cur[:])
    return res
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

```python
def has_overlap(intervals):
    intervals.sort()
    for i in range(1, len(intervals)):
        if intervals[i][0] < intervals[i-1][1]:
            return True
    return False
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

```python
def min_meeting_rooms(intervals):
    events = []
    for s, e in intervals:
        events.append((s, 1))
        events.append((e, -1))
    events.sort()
    cur = peak = 0
    for t, d in events:
        cur += d
        peak = max(peak, cur)
    return peak
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

```python
def erase_overlap_intervals(intervals):
    if not intervals: return 0
    intervals.sort(key=lambda x: x[1])
    cnt = 0
    last = float('-inf')
    for iv in intervals:
        if iv[0] >= last:
            last = iv[1]
            cnt += 1
    return len(intervals) - cnt
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

```python
import bisect

# Find last interval ending before current start
ends = [iv[1] for iv in ivs]
idx = bisect.bisect_right(ends, ivs[i][0] - 1) - 1
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

```python
def rotate(matrix):
    n = len(matrix)
    for i in range(n):
        for j in range(i + 1, n):
            matrix[i][j], matrix[j][i] = matrix[j][i], matrix[i][j]
    for row in matrix:
        row.reverse()
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

```python
def rotate_inplace(matrix):
    n = len(matrix)
    lo, hi = 0, n - 1
    while lo < hi:
        for i in range(hi - lo):
            tmp = matrix[lo][lo + i]
            matrix[lo][lo + i] = matrix[hi - i][lo]
            matrix[hi - i][lo] = matrix[hi][hi - i]
            matrix[hi][hi - i] = matrix[lo + i][hi]
            matrix[lo + i][hi] = tmp
        lo += 1
        hi -= 1
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

```python
def spiral_order(matrix):
    if not matrix: return []
    t, b, l, r = 0, len(matrix) - 1, 0, len(matrix[0]) - 1
    res = []
    while t <= b and l <= r:
        for c in range(l, r + 1): res.append(matrix[t][c])
        t += 1
        for c in range(t, b + 1): res.append(matrix[c][r])
        r -= 1
        if t <= b:
            for c in range(r, l - 1, -1): res.append(matrix[b][c])
            b -= 1
        if l <= r:
            for c in range(b, t - 1, -1): res.append(matrix[c][l])
            l += 1
    return res
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

```python
dr = [0, 0, 1, -1]
dc = [1, -1, 0, 0]
for d in range(4):
    nr, nc = r + dr[d], c + dc[d]
    if 0 <= nr < R and 0 <= nc < C:
        visit(nr, nc)
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

```python
def set_zeroes(matrix):
    R, C = len(matrix), len(matrix[0])
    row_set = set()
    col_set = set()
    for r in range(R):
        for c in range(C):
            if matrix[r][c] == 0:
                row_set.add(r)
                col_set.add(c)
    for r in row_set:
        for c in range(C): matrix[r][c] = 0
    for c in col_set:
        for r in range(R): matrix[r][c] = 0
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

```python
def first_missing_positive(nums):
    n = len(nums)
    for x in nums:
        i = abs(x) - 1
        if 0 <= i < n: nums[i] = -abs(nums[i])
    for i in range(n):
        if nums[i] > 0: return i + 1
    return n + 1
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

```python
# Print 32-bit binary
for k in range(31, -1, -1):
    print((x >> k) & 1, end='')
print()

# Two's complement of x: ~x + 1 (in Python, use -x)
neg = -x  # Python handles two's complement naturally
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

```python
odd = x & 1            # LSB check
mask = 1 << k          # select bit k
set_ = x | mask        # set bit k
clr = x & ~mask        # clear bit k
tog = x ^ mask         # toggle bit k
bit_k = (x >> k) & 1   # extract bit k
div4 = x >> 2
mul8 = x << 3
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

```python
# Count set bits (Brian Kernighan)
cnt = 0
t = x
while t:
    t &= t - 1
    cnt += 1

is_pow2 = x > 0 and not (x & (x - 1))
lsb = x & (-x)
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

```python
def count_bits(n):
    dp = [0] * (n + 1)
    for i in range(1, n + 1):
        dp[i] = dp[i >> 1] + (i & 1)
    return dp
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

```python
# Single Number
res = 0
for x in nums: res ^= x

# Missing Number
missing = len(nums)
for i, x in enumerate(nums): missing ^= i ^ x
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

```python
# Alternative: sum formula for missing number
n = len(nums)
expected = n * (n + 1) // 2
actual = sum(nums)
return expected - actual
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

```python
def backtrack(path, remaining_choices):
    if is_complete(path):
        results.append(path[:])
        return
    for choice in remaining_choices:
        path.append(choice)
        backtrack(path, updated_choices)
        path.pop()
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

```python
def word_search(board, word):
    R, C = len(board), len(board[0])
    def dfs(r, c, i):
        if i == len(word): return True
        if r < 0 or r >= R or c < 0 or c >= C or board[r][c] != word[i]:
            return False
        tmp = board[r][c]
        board[r][c] = '#'
        found = (dfs(r+1, c, i+1) or dfs(r-1, c, i+1) or
                 dfs(r, c+1, i+1) or dfs(r, c-1, i+1))
        board[r][c] = tmp
        return found

    for r in range(R):
        for c in range(C):
            if dfs(r, c, 0):
                return True
    return False
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

```python
import heapq

class MedianFinder:
    def __init__(self):
        self.lo = []    # max-heap (negate values)
        self.hi = []    # min-heap

    def add_num(self, n):
        heapq.heappush(self.lo, -n)
        heapq.heappush(self.hi, -self.lo[0])
        heapq.heappop(self.lo)
        if len(self.lo) < len(self.hi):
            heapq.heappush(self.lo, -heapq.heappop(self.hi))

    def find_median(self):
        if len(self.lo) > len(self.hi):
            return -self.lo[0]
        return (-self.lo[0] + self.hi[0]) / 2.0
```


---

// Auto-convert consecutive C++/Python code blocks under each h3 into tabs.
// The tab container replaces the code blocks in-place, keeping paragraphs intact.
document.addEventListener('DOMContentLoaded', () => {
  document.querySelectorAll('h3').forEach(h3 => {
    // Collect all code-block containers that come after this h3 (before next h2/h3)
    const blocks = [];
    let next = h3.nextElementSibling;

    while (next && next.tagName !== 'H2' && next.tagName !== 'H3') {
      // Kramdown wraps code blocks in: <div class="language-xxx highlighter-rouge">
      if (next.matches('.highlighter-rouge')) {
        // Extract language from the class like "language-cpp"
        let lang = 'text';
        const match = next.className.match(/language-([a-z]+)/i);
        if (match) lang = match[1].toLowerCase();
        blocks.push({ wrapper: next, lang });
      }
      next = next.nextElementSibling;
    }

    // Only activate if we found exactly 2 blocks with different languages
    if (blocks.length !== 2) return;
    if (blocks[0].lang === blocks[1].lang) return;

    const labels = {
      cpp: 'C++', python: 'Python', javascript: 'JS', java: 'Java',
      rust: 'Rust', go: 'Go', typescript: 'TS', c: 'C',
    };
    const a = blocks[0], b = blocks[1];
    const labelA = labels[a.lang] || a.lang.toUpperCase();
    const labelB = labels[b.lang] || b.lang.toUpperCase();

    // Create tab bar
    const tabsBar = document.createElement('div');
    tabsBar.className = 'code-tabs-bar';
    tabsBar.dataset.active = '0';
    tabsBar.innerHTML = `
      <button class="code-tab active" data-idx="0">${labelA}</button>
      <button class="code-tab" data-idx="1">${labelB}</button>
    `;

    // Create pane placeholders
    const paneA = document.createElement('div');
    paneA.className = 'code-pane active';
    const paneB = document.createElement('div');
    paneB.className = 'code-pane';

    // Build the complete wrapper with panes and tab bar
    const wrapper = document.createElement('div');
    wrapper.className = 'code-tabs';
    wrapper.appendChild(tabsBar);
    wrapper.appendChild(paneA);
    wrapper.appendChild(paneB);

    // Replace the two code block divs with the single wrapper
    // replaceWith removes all source nodes and inserts the target in their place
    a.wrapper.replaceWith(wrapper);
    b.wrapper.remove();

    // Now move the actual code block wrappers into their panes
    // (they're now children of wrapper, so we move them into the panes)
    paneA.appendChild(a.wrapper);
    paneB.appendChild(b.wrapper);

    // Tab click handler
    tabsBar.addEventListener('click', e => {
      const btn = e.target.closest('.code-tab');
      if (!btn) return;
      const idx = btn.dataset.idx;
      if (tabsBar.dataset.active === idx) return;
      tabsBar.dataset.active = idx;

      tabsBar.querySelectorAll('.code-tab').forEach(t => t.classList.remove('active'));
      btn.classList.add('active');
      paneA.classList.toggle('active', idx === '0');
      paneB.classList.toggle('active', idx === '1');
    });
  });
});

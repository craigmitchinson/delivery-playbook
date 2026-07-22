// Bionic-reading transform.
//
// Bolds the leading letters of each word (the count grows with word length) so
// the eye fixates on word starts, an aid some neurodiverse readers find keeps
// them on track. The text in this deck lives as plain strings across many
// components, so rather than thread a prop through all of them we transform the
// live DOM of a slide, exactly once, and hand back a cleanup that restores the
// original text nodes untouched.
//
// React-safety: we keep a reference to each ORIGINAL text node we remove and put
// that same node back on cleanup. Slide text never changes in place (it only
// appears/disappears via mount/unmount), and the wrapper runs the cleanup in its
// layout-effect teardown, which React fires before it removes the slide's DOM,
// so React only ever unmounts nodes it still owns. No detached-node removeChild.

// How many leading letters to embolden for a word of length n.
function boldLen(n: number): number {
  if (n <= 1) return 1
  if (n <= 3) return 1
  return Math.min(n - 1, Math.ceil(n * 0.4))
}

const SKIP_FONT = /JetBrains|Consolas|monospace/i

export function applyBionic(root: HTMLElement): () => void {
  // Don't double-apply.
  if (root.querySelector('[data-bionic]')) return () => {}

  const walker = document.createTreeWalker(root, NodeFilter.SHOW_TEXT, {
    acceptNode(node: Node) {
      const value = node.nodeValue
      if (!value || !/[A-Za-z]/.test(value)) return NodeFilter.FILTER_REJECT
      const parent = (node as Text).parentElement
      if (!parent) return NodeFilter.FILTER_REJECT
      if (parent.closest('[data-bionic-skip]')) return NodeFilter.FILTER_REJECT
      const ff = getComputedStyle(parent).fontFamily || ''
      if (SKIP_FONT.test(ff)) return NodeFilter.FILTER_REJECT
      return NodeFilter.FILTER_ACCEPT
    },
  })

  // Collect first; never mutate during the walk.
  const targets: Text[] = []
  while (walker.nextNode()) targets.push(walker.currentNode as Text)

  const undo: Array<{ parent: Node; span: HTMLSpanElement; original: Text }> = []

  for (const t of targets) {
    const text = t.nodeValue ?? ''
    const parent = t.parentNode
    if (!parent) continue

    const span = document.createElement('span')
    span.setAttribute('data-bionic', '')
    const re = /[A-Za-z]+/g
    let last = 0
    let m: RegExpExecArray | null
    while ((m = re.exec(text))) {
      if (m.index > last) span.appendChild(document.createTextNode(text.slice(last, m.index)))
      const word = m[0]
      const k = boldLen(word.length)
      const b = document.createElement('b')
      b.style.fontWeight = '700'
      b.textContent = word.slice(0, k)
      span.appendChild(b)
      if (k < word.length) span.appendChild(document.createTextNode(word.slice(k)))
      last = m.index + word.length
    }
    if (last < text.length) span.appendChild(document.createTextNode(text.slice(last)))

    parent.replaceChild(span, t)
    undo.push({ parent, span, original: t })
  }

  return () => {
    for (const u of undo) {
      if (u.span.parentNode === u.parent) u.parent.replaceChild(u.original, u.span)
    }
  }
}

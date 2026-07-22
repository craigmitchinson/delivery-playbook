import { ENGAGEMENT_SECTIONS } from './data/playbook'

// Builds the pinned post as something you can paste straight into a Teams
// message. Two representations are produced: rich HTML, which Teams renders with
// headings, bold labels and bullet lists on paste, and a plain-text fallback for
// anywhere that does not accept HTML. Only the post itself is included; the
// on-screen margin notes and the standing-rules panel are guidance and are left
// out. The [bracketed] placeholders are kept verbatim so they are filled in once
// the post is in Teams.

/** The title line, taken from the channel naming convention. */
const POST_TITLE = '[Solution name], Automation delivery'

/** "1 · What we are delivering" becomes "1. What we are delivering". */
const cleanHeading = (heading: string) => heading.replace(' · ', '. ')

/** Splits "Label: value" into its label and the rest, for emphasis. A colon is
 *  only treated as a label separator when it sits near the start of the line. */
function splitLabel(line: string): { label?: string; rest: string } {
  const at = line.indexOf(': ')
  if (at > 0 && at <= 24) {
    return { label: line.slice(0, at + 1), rest: line.slice(at + 2) }
  }
  return { rest: line }
}

const escapeHtml = (s: string) =>
  s.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;')

/** The pinned post as plain text. */
export function buildPostText(): string {
  const blocks = ENGAGEMENT_SECTIONS.map((s) => {
    const lines = s.lines.map((line) => `- ${line}`).join('\n')
    return `${cleanHeading(s.heading)}\n${lines}`
  })
  return `${POST_TITLE}\n\n${blocks.join('\n\n')}\n`
}

/** The pinned post as rich HTML, for a Teams paste. */
export function buildPostHtml(): string {
  const blocks = ENGAGEMENT_SECTIONS.map((s) => {
    const items = s.lines
      .map((line) => {
        const { label, rest } = splitLabel(line)
        const body = label
          ? `<strong>${escapeHtml(label)}</strong> ${escapeHtml(rest)}`
          : escapeHtml(line)
        return `<li>${body}</li>`
      })
      .join('')
    return `<p><strong>${escapeHtml(cleanHeading(s.heading))}</strong></p><ul>${items}</ul>`
  })
  return `<h3>${escapeHtml(POST_TITLE)}</h3>${blocks.join('')}`
}

/**
 * Writes the post to the clipboard as HTML plus a plain-text fallback. Returns
 * true on success. Requires a user gesture (a click), which the copy button
 * provides.
 */
export async function copyPostToClipboard(): Promise<boolean> {
  const html = buildPostHtml()
  const text = buildPostText()
  try {
    if (navigator.clipboard && 'write' in navigator.clipboard && typeof ClipboardItem !== 'undefined') {
      await navigator.clipboard.write([
        new ClipboardItem({
          'text/html': new Blob([html], { type: 'text/html' }),
          'text/plain': new Blob([text], { type: 'text/plain' }),
        }),
      ])
      return true
    }
    await navigator.clipboard.writeText(text)
    return true
  } catch {
    try {
      await navigator.clipboard.writeText(text)
      return true
    } catch {
      return false
    }
  }
}

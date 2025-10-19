# Timeline Management Guide

This guide explains how to add new timeline entries to your personal website using the new Markdown-based system.

## Adding a New Timeline Entry

### 1. Create a new markdown file

Create a new file in the `_timeline/` directory with a descriptive filename:

```
_timeline/YYYY-MM.md
```

### 2. File format

Each timeline entry should follow this format:

```markdown
---
period: "YYYY-MM"
title: "Month Year"
---

Your content goes here. You can use regular Markdown formatting.

- Bullet points work
- **Bold text** works
- [Links](http://example.com) work
- And all other Markdown features

You can write multiple paragraphs and use any Markdown syntax.
```

### 3. Front matter explanation

- `period`: The period identifier (YYYY-MM format, must be unique)
- `title`: The display title for this timeline entry

### 4. Example

Here's an example file `_timeline/2025-12.md`:

```markdown
---
period: "2025-12"
title: "December 2025"
---

Finished my major project and learned new technologies.

- Completed personal website redesign
- Learned advanced Jekyll features
- Started contributing to open source projects

This was a productive month focused on web development and expanding my skills in modern frameworks.
```

### 5. Automatic Integration

Once you create the file and restart Jekyll:

1. The timeline sidebar will automatically include your new entry
2. The content will be rendered from your Markdown
3. The JavaScript will handle all interactions automatically
4. No code changes needed!

### 6. Automatic Ordering

Timeline entries are automatically ordered by date in descending order (newest first). The system will:

- Sort all timeline entries by the `period` field automatically
- Display the most recent date first
- Show the most recent entry by default when the page loads
- No manual ordering required!

### 7. Tips

- Use consistent date formatting (YYYY-MM)
- Keep filenames simple and matching the date
- Use descriptive titles
- The most recent entry will be shown by default
- You can use any valid Markdown in the content area

### 8. Navigation Features

The timeline supports:
- **Click**: Click any date on the left sidebar to jump to that period
- **Scroll wheel**: Hover over the left sidebar and use your mouse wheel to scroll through timeline items

### 9. Markdown Support

You can use all standard Markdown features in your timeline entries:
- Headers (`##`, `###`)
- **Bold** and *italic* text
- Links `[text](url)`
- Code blocks and `inline code`
- Lists (numbered and bulleted)
- Blockquotes
- Images
# OpenCode Skill Setup - Complete

## ✅ What Was Done

Successfully created and installed OpenCode skill for browser automation following the official OpenCode documentation format.

### Skill Location
- **Global:** `~/.opencode/skills/browser-automation/SKILL.md`
- **Project:** `~/git/browser-automation/.opencode/skills/browser-automation/SKILL.md`

### Skill Format
Following OpenCode official spec from https://opencode.ai/docs/skills/:

```yaml
---
name: browser-automation
description: Open websites in Firefox, take screenshots, extract data with persistent sessions
license: ISC
compatibility: opencode
metadata:
  author: gratheon
  version: 1.0.0
---
```

### Old vs New Format

**❌ OLD (Incorrect):**
- Location: `~/.opencode/skill/browser-automation.md` (wrong path)
- No YAML frontmatter
- Not discoverable by OpenCode

**✅ NEW (Correct):**
- Location: `~/.opencode/skills/browser-automation/SKILL.md` (correct path)
- YAML frontmatter with name and description
- Discoverable by OpenCode tool

### How OpenCode Discovers Skills

1. OpenCode searches these locations:
   - `~/.config/opencode/skills/<name>/SKILL.md` (global)
   - `.opencode/skills/<name>/SKILL.md` (project)
   - `~/.claude/skills/<name>/SKILL.md` (Claude-compatible)

2. Skills appear in the `skill` tool description:
   ```xml
   <available_skills>
     <skill>
       <name>browser-automation</name>
       <description>Open websites in Firefox, take screenshots, extract data with persistent sessions</description>
     </skill>
   </available_skills>
   ```

3. AI loads skill when needed:
   ```javascript
   skill({ name: "browser-automation" })
   ```

## How AI Should Use This

### When to Load the Skill
AI assistants should load the `browser-automation` skill when the user asks to:
- Take a screenshot of a website
- Open a website
- Extract data from a web page
- Check if a website is accessible
- Scrape content from websites

### Example Usage

**User asks:** "Can you take a screenshot of https://example.com?"

**AI should:**
1. Recognize this needs browser automation
2. Load the skill: `skill({ name: "browser-automation" })`
3. Follow instructions in the skill
4. Execute the command from the skill documentation

## Verification

To verify the skill is properly installed:

```bash
# Check global skill
ls -la ~/.opencode/skills/browser-automation/SKILL.md

# Check project skill
ls -la ~/git/browser-automation/.opencode/skills/browser-automation/SKILL.md

# Verify frontmatter
head -10 ~/.opencode/skills/browser-automation/SKILL.md
```

Expected output should show YAML frontmatter with `name: browser-automation`.

## Key Rules from Skill

1. **Always use timeout + &** - Prevents AI from hanging
2. **Wait 3-5 seconds** before screenshots
3. **Sessions are automatic** - User is already logged in
4. **Save to /tmp/** - Easy access
5. **Browser visible on VNC** - Port 5901

## Example Commands (from skill)

### Quick Screenshot
```bash
cd ~/git/browser-automation && timeout 20 node -e "const BrowserHelper = require('./browser-helper'); (async () => { const b = new BrowserHelper({ slowMo: 300 }); await b.launch(); await b.goto('URL_HERE'); await new Promise(r => setTimeout(r, 5000)); await b.screenshot('/tmp/screenshot.png'); await b.close(); })();" &
```

### Open Website
```bash
cd ~/git/browser-automation
timeout 15 node quick-launch.js https://example.com &
```

### CLI Tool
```bash
browser open https://example.com
browser screenshot /tmp/output.png
browser status
```

## Benefits

1. **Auto-discovery** - OpenCode automatically finds the skill
2. **Consistent usage** - AI always follows same patterns
3. **No repetition** - Instructions stored once, used many times
4. **Easy updates** - Update skill file, all AIs get new instructions

## Repository

All changes committed to: git@github.com:tot-ra/browser-automation.git

Files committed:
- `.opencode/skills/browser-automation/SKILL.md` - Project skill
- Updated README.md with OpenCode integration section

---

**Status:** ✅ Complete  
**Format:** OpenCode official spec  
**Tested:** Skill file format verified  
**Documented:** README updated with skill info

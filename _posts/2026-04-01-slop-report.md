---
title: Experiment 29
tags: claude pr github vibe-coding slop code-review
---
A tiny GitHub Action that turns every Python PR into a data-backed review — coverage, blast radius, performance, and maintainability, posted right in the comments.

# Stop Merging on Vibes: Meet Slop Report

## What is Slop Report?

[Slop Report](https://github.com/marketplace/actions/slop-report) is a drop-in GitHub Action for Python projects that runs alongside your existing CI and posts a single, readable quality summary as a comment on every pull request. It never blocks a merge — it just surfaces the signal you'd otherwise have to dig through logs, dashboards, and `radon` output to find.

Here's what reviewers actually see on the PR:

| Metric | Score | Status | Details |
| --- | --- | --- | --- |
| Change Risk | 72% covered | ⚠️ | 28% of changed lines lack test coverage |
| Blast Radius | 12 modules | 🛑 | High impact: auth, api, models affected |
| Performance | No regressions | ✅ | No tests exceeded 20% slowdown threshold |
| MI Regression | -10 pts | 🛑 | Worst: auth.py (80 → 70) |
| New File Quality | 0.94× | ⚠️ | New files avg MI 68 vs main avg 72 |

Five numbers, three status icons, one place to look. That's the entire pitch.

Under the hood it's using tools you already know — `coverage`, `pytest --durations=0`, Python's `ast` module, and `radon mi` — but wired together so the comparison between the PR branch and the base branch happens for you, automatically, every time.

Setup is one file:

```yaml
# .github/workflows/slop-report.yml
name: Slop Report
on:
  pull_request:
    types: [opened, synchronize, reopened]
permissions:
  pull-requests: write
  contents: read
jobs:
  slop-report:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4
        with:
          fetch-depth: 0   # required — diffs against the base branch
      - uses: dlfelps/slop-report@v1
        with:
          github-token: ${{ secrets.GITHUB_TOKEN }}
```

Commit that, open a PR, and the first comment shows up on the next push.

---

## Why You Actually Want This

Most teams already have "quality tooling." They just don't have it *where the decision is being made.* Here's what that looks like in practice, and what Slop Report does about it.

### "LGTM 🚀" on a PR that dropped coverage by 15 points

You have a coverage report. It's in Codecov, or an artifact zipped up somewhere, or a badge that shows the repo-wide average — which barely moves when 40 new lines slip through untested. The reviewer opens the PR, sees a green check, and ships it.

**Slop Report's Change Risk metric** ignores the repo-wide average entirely and looks only at the lines you actually changed in this PR. "72% covered" means 72% of *your diff* is hit by a test. If it's 40%, the comment says 40% — right next to the code. You can't miss it, and you don't have to click anywhere.

### The one-line change that broke four services

Someone tweaks a helper in `utils/auth.py`. Looks harmless. Two sprints later you're doing a post-mortem on why the billing service started 500ing.

**Blast Radius** builds an import graph of the whole repo with `ast` and tells you, at PR time, how many modules depend on the file you just touched. A "High impact: auth, api, models affected" tag on a one-line diff is the kind of prompt that makes a reviewer say *"hold on, let me actually read this"* — which is exactly the point.

### The performance regression that only shows up under load

Someone adds a nested loop, a pickle, a sync call inside an async path. It passes tests. It gets merged. Three weeks later a customer notices.

**Performance** checks out the base branch, runs the test suite with `pytest --durations=0`, then does the same on the PR branch, and diffs per-test timings. The worst offender gets named in the comment. "test_parse_invoice slowed 47%" is a very different conversation from "we'll look into it in the next sprint."

### Death by a thousand small messes

No single PR "makes the code worse." But six months later every file is 400 lines of tangled conditionals and nobody knows how it got there.

**MI Regression** runs `radon mi` on each modified file on both branches and reports the worst maintainability drop. **New File Quality** does the same for files you're adding — comparing their average Maintainability Index against the existing baseline. A 0.94× ratio means *on average, the new code you're adding is less maintainable than what's already in the repo.* Catching that in review is dramatically cheaper than catching it in a refactor quarter.

### None of this blocks a merge

This is the design decision that makes Slop Report actually get used: it never fails a workflow. It's a comment, not a gate. Teams who've been burned by brittle quality gates can install it in five minutes without worrying that a flaky metric is going to hold up a release on Friday afternoon. Over time, the numbers themselves become the norm — "your PR has a 🛑 on blast radius" becomes a thing reviewers actually mention, because it's visible.

---

## Bonus: Fork It and Add Your Own Metric

Slop Report is intentionally small and hackable. The repo at [github.com/dlfelps/slop-report](https://github.com/dlfelps/slop-report) is ~99% Python with a clean top-level layout:

```
slop-report/
├── action.yml          # declares inputs and the Docker entrypoint
├── Dockerfile          # the action's runtime
├── entrypoint.py       # orchestrates all the metrics, posts the comment
├── requirements.txt
├── src/                # one module per metric
└── tests/
```

Want to add, say, a **Docstring Coverage** metric that flags PRs adding public functions without docstrings? Here's the recipe.

### 1. Fork and clone

Hit **Fork** on the repo page, then:

```bash
git clone https://github.com/<you>/slop-report
cd slop-report
git checkout -b add-docstring-metric
```

### 2. Write the metric as its own module

Drop a new file into `src/` — say `src/docstring_coverage.py` — that exposes one function returning a structured result. Mirror the shape the existing metrics use (score, status, details) so it slots into the report cleanly:

```python
# src/docstring_coverage.py
import ast
from pathlib import Path

def run(changed_files: list[str]) -> dict:
    total, documented = 0, 0
    offenders = []
    for path in changed_files:
        if not path.endswith(".py"):
            continue
        tree = ast.parse(Path(path).read_text())
        for node in ast.walk(tree):
            if isinstance(node, (ast.FunctionDef, ast.AsyncFunctionDef)):
                if node.name.startswith("_"):
                    continue  # skip private
                total += 1
                if ast.get_docstring(node):
                    documented += 1
                else:
                    offenders.append(f"{path}::{node.name}")
    if total == 0:
        return {"score": "N/A", "status": "✅", "details": "No new public functions"}
    pct = round(100 * documented / total)
    status = "✅" if pct >= 90 else "⚠️" if pct >= 70 else "🛑"
    return {
        "score": f"{pct}% documented",
        "status": status,
        "details": f"Missing: {', '.join(offenders[:3])}" if offenders else "All documented",
    }
```

### 3. Wire it into `entrypoint.py`

Open `entrypoint.py` and find where the existing metrics (change risk, blast radius, etc.) are invoked and appended to the report. Add yours alongside them, guarded by an input flag so users can toggle it:

```python
if os.environ.get("INPUT_ENABLE_DOCSTRINGS", "true").lower() == "true":
    from src.docstring_coverage import run as run_docstrings
    rows.append(("Docstring Coverage", run_docstrings(changed_files)))
```

### 4. Declare the new input in `action.yml`

GitHub passes action inputs in as `INPUT_<NAME>` environment variables. Add yours:

```yaml
inputs:
  enable-docstrings:
    description: "Run docstring coverage analysis"
    required: false
    default: "true"
```

### 5. Add a test and run locally

Drop a fixture under `tests/` with a couple of sample Python files — one fully documented, one missing a docstring — and assert the expected score. Run `pytest` locally, then build the Docker image the same way the action does:

```bash
docker build -t slop-report-local .
docker run --rm -v "$PWD:/workspace" -w /workspace slop-report-local
```

### 6. Test it end-to-end on a real PR

Push your branch to your fork, then in a scratch repo reference *your* fork in the workflow:

```yaml
- uses: <you>/slop-report@add-docstring-metric
```

Open a PR on the scratch repo and watch your new row show up in the comment.

### 7. Send it upstream

If it's generally useful, open a PR back to `dlfelps/slop-report`. The repo is young (v1 shipped in April 2026), so thoughtful contributions are welcome.

---

## Give it five minutes

Slop Report isn't trying to replace your linter, your CI, or your coverage service. It's trying to make the data you already have *visible at the one moment it matters most* — when a human is deciding whether to click "Merge."

Grab it from the [GitHub Marketplace](https://github.com/marketplace/actions/slop-report), drop the eight-line workflow into your repo, and open your next PR. Worst case, you ignore the comment. Best case, you catch the bug before your users do.
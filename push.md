# Push Command Workflow and Rules

Whenever you type `push` (and nothing else), the following workflow will be executed:

1. **Update `README.md` and `updates.md`**
   - Log all new features, changes, and known issues since the last push.

2. **Update `CHANGELOG.md`**
   - Append a summary of all changes since the last version/tag, following standard changelog format.

3. **Pre-push checks:**
   - Run linting and/or tests (if present) for both frontend and backend.
   - If any check fails, the error will be reported and the push will be stopped.

4. **Stage all new/changed files:**
   - `git add .`

5. **Check the status:**
   - `git status`
   - Summarize what's about to be committed.

6. **Generate a descriptive commit message**
   - Based on the changes since the last commit.

7. **Commit the changes:**
   - `git commit -m "Your generated commit message"`

8. **Automatically update the version tag:**
   - Analyze the number and type of changes:
     - **Major** (breaking changes): bump `vX.0.0`
     - **Minor** (new features): bump `vX.Y.0`
     - **Patch** (fixes, small tweaks): bump `vX.Y.Z`
   - Create and push the new tag:
     - `git tag vX.Y.Z`
     - `git push origin vX.Y.Z`

9. **Push to GitHub:**
   - `git push`

10. **(Optional) Remind you to create a GitHub Release**
    - If this is a major or minor version, a reminder will be given to draft a release on GitHub for visibility.

---

## Copy-Paste Rule for New Conversations

Copy and paste the following at the start of any new conversation to set the rules:

```
Rule for Assistant:
Whenever I type `push` (and nothing else), you must:
1. Update `README.md` and `updates.md` with all new features, changes, and known issues since the last push.
2. Update `CHANGELOG.md` with a summary of all changes since the last version/tag, following standard changelog format.
3. Run pre-push checks: lint and test both frontend and backend (if present). If any check fails, report the error and stop the push.
4. Stage all new/changed files (`git add .`).
5. Show me the `git status` and summarize what will be committed.
6. Generate a descriptive commit message based on the changes.
7. Commit the changes.
8. Automatically update the version tag (major, minor, or patch) based on the scale of changes, and push the tag to GitHub.
9. Push all changes to GitHub.
10. If this is a major or minor version, remind me to draft a GitHub Release.

Always follow this workflow exactly when I type `push`.
If I type `update`, append the latest change/problem to `updates.md` and `CHANGELOG.md`.
``` 
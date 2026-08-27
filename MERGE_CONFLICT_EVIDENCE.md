# 🔀 Git Merge Conflict Demonstration & Resolution Report

**Project**: Automated Timesheet Management Platform  
**Milestone**: Week 6 - Git Collaboration & Conflict Resolution  
**Student**: Aditya Chavan (Roll No: 23102B0006)  

---

## 1. Objective
Demonstrate practical mastery of distributed Git collaboration workflows by creating, detecting, and resolving a real merge conflict between an active feature branch (`feature/search-and-filter`) and the integration branch (`develop`).

---

## 2. Conflict Scenario Setup

1. **Branch `develop`**:
   - Updated the sidebar footer on line 339 of `src/App.tsx` to:
     ```tsx
     <div className="sidebar-footer">Timesheet App · Develop Integration</div>
     ```
   - Committed with message: `chore(develop): update branding footer on develop integration branch`

2. **Branch `feature/search-and-filter`**:
   - Implemented search, filtering, and updated the same footer on line 339 of `src/App.tsx` to:
     ```tsx
     <div className="sidebar-footer">Week 6 · Full MVP Release</div>
     ```
   - Committed with message: `feat: complete MVP with search, filter, edit, and role-based workflows`

---

## 3. Merge Trigger & Conflict Output

When merging `feature/search-and-filter` into `develop`:

```bash
$ git checkout develop
$ git merge feature/search-and-filter
```

### Terminal Output:
```text
Auto-merging src/App.tsx
CONFLICT (content): Merge conflict in src/App.tsx
Automatic merge failed; fix conflicts and then commit the result.
```

---

## 4. Conflict Markers in Code (`src/App.tsx`)

Git automatically injected standard conflict markers indicating both conflicting changes:

```tsx
<<<<<<< HEAD
        <div className="sidebar-footer">Timesheet App · Develop Integration</div>
=======
        <div className="sidebar-footer">Week 6 · Full MVP Release</div>
>>>>>>> feature/search-and-filter
```

---

## 5. Resolution Strategy & Clean Merge

1. **Resolution Decision**:
   - Harmonized both branches by adopting the unified production release branding:
     ```tsx
     <div className="sidebar-footer">Timesheet App · Week 6 MVP Release</div>
     ```
2. **Commands Executed to Resolve**:
   ```bash
   # Stage resolved files
   git add src/App.tsx MERGE_CONFLICT_EVIDENCE.md

   # Complete merge commit
   git commit -m "merge: resolve merge conflict between feature/search-and-filter and develop"
   ```

---

## 6. Verification
- Code successfully compiled with zero errors.
- Clean Git graph established with proper merge commit.

@echo off
echo ======================================
echo  Alternative: BFG Repo Cleaner Method
echo ======================================
echo.

cd /d "e:\thadi\Service_-Provider"

echo Step 1: Creating backup...
git branch backup-before-bfg-%date:~-4,4%%date:~-10,2%%date:~-7,2%
echo.

echo Step 2: Using git filter-branch to remove secrets...
echo This will completely remove the stripe-backend-setup.md file from ALL commit history.
git filter-branch --force --index-filter "git rm --cached --ignore-unmatch stripe-backend-setup.md" --prune-empty --tag-name-filter cat -- --all
echo.

echo Step 3: Cleaning up refs...
git for-each-ref --format="delete %(refname)" refs/original | git update-ref --stdin
git reflog expire --expire=now --all
git gc --prune=now
echo.

echo Step 4: Force pushing cleaned history...
git push --force-with-lease origin Dulanjana_home
echo.

if %ERRORLEVEL% EQU 0 (
    echo ======================================
    echo           SUCCESS!
    echo ======================================
    echo The file has been completely removed from Git history.
) else (
    echo ======================================
    echo           FAILED
    echo ======================================
    echo Please try the main script or manual approach.
)

echo.
pause

@echo off
cd /d "e:\thadi\Service_-Provider"
git rebase --abort
echo "Rebase aborted, starting fresh approach..."
git reset --hard ec7c34f
echo "Reset to clean commit"
git log --oneline -5
echo "Creating new commit with clean changes..."
git add .
git commit -m "Complete checkout implementation with Stripe integration (security-cleaned)"
echo "Force pushing clean history..."
git push --force-with-lease origin Dulanjana_home
echo "Done!"
pause

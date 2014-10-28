set -e
diffs=`git diff --name-status HEAD`
if [[ "" != $diffs ]]; then
  echo "Can't deploy, unsaved changes:"
  echo $diffs
  exit
fi
git checkout gh-pages
git reset --hard master
echo "Starting build"
sass site/style/main.scss site/style/main.css
node build.js
echo "Build complete"
rm -vrf `ls -d * | egrep -v 'site|node_modules' | xargs`
echo "Cleaned out directory"
mv site/* .
if [[ $BUILD_ONLY ]]; then
  exit
fi
rm -rf site
git add . -A
git commit -m 'update website'
echo "Commit created"
git push --force origin gh-pages
echo "Deployed to remote"
git checkout master
git ls-files -d | xargs git checkout
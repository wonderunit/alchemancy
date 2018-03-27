# alchemancy
Alchemancy Mark III - Wonder Unit's drawing system

### Development

Start a test server at `localhost:8000`. This watches for changes and serves compiled JavaScript from memory. If files exist in `dist/` they will be served statically, so run an `npm run clean` first to clear them.

    npm start

Run a watcher. This watches for changes and writes compiled JavaScript to `dist/`.

    npm run watch

Write compiled JavaScript to `dist/`

    npm run build

Publish to `gh-pages`

    git status # make sure everything is checked in
    git pull # grab the latest master

    git co gh-pages
    git rebase master

    npm run clean
    npm run build
    git add -f dist/sketch-pane.js
    git commit -m "add dist"
    git push origin gh-pages
    npm run clean # cleanup

    git co master # done!

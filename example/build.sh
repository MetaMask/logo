set -e

echo "building $1..."
mkdir -p "docs/$1/"
browserify "example/$1.js" -o "docs/$1/bundle.js"
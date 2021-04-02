set -e

echo "building $1..."
mkdir -p "doc/$1/"
browserify "example/$1.js" -o "doc/$1/bundle.js"
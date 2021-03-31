set -e

echo "building $1..."
mkdir -p "doc/$1/"
browserify "example/$1.js" -o "doc/$1/bundle.js"
cp "example/index.html" "doc/$1/index.html"
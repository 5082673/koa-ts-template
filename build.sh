rimraf ./dist
tsc
cp ./package.json ./dist
cd ./dist && yarn install --production
ncc build main.js -o dir
cd ../
mv ./dist/dir ./dir
rm -r dist
mv dir dist
node ./build/index.js
#cp ./package.json ./dist
#zip -r ../dist/dist.zip ../dist/* -r

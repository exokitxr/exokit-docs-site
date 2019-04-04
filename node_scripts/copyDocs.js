var copy = require('recursive-copy');
var fs = require('fs');
var rmdir = require('rmdir');

var specPath = process.argv[2];

// Copy master.
source = 'node_modules/exokit/docs';
dest = 'src/docs';
// Clear the destination in case files were moved or deleted.
rmdir(dest, function (err) {
  if (err) { console.error(err); }
  console.log('Deleted', dest);
  copy(source, dest, {overwrite: true}, function (error, results) {
    if (error) {
      console.error('Copy failed: ' + error);
    } else {
      console.info(`Copied ${results.length} documentation pages to ${dest}`);
    }
  });
});

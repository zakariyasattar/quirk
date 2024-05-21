const path = require('path');

module.exports = {
  entry: '/index.js', // Entry point of your application
  output: {
    path: path.resolve(__dirname, 'dist'), // Output directory
    filename: 'bundle.js' // Name of the bundled file
  }
};

config.node = {
  fs: 'empty',
}
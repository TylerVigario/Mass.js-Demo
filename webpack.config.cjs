const path = require('path');

module.exports = {
  entry: {
    main: ['./src/app.mjs'],
  },
  output: {
    filename: '[name].js',
    path: path.resolve(__dirname, 'dist'),
    ecmaVersion: 5,
  },
  module: {
    rules: [
      {
        test: /\.m?js$/,
        exclude: /(node_modules|bower_components)/,
        use: {
          loader: 'babel-loader',
          options: {
            presets: [
              [
                '@babel/preset-env',
                {
                  'corejs': '3.6',
                  'useBuiltIns': 'usage',
                },
              ],
            ],
          },
        },
      },
    ],
  },
  experiments: {
    mjs: true,
  },
};

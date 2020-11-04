module.exports = {
  entry: {
    main: ['./src/app.mjs'],
  },
  module: {
    rules: [
      {
        test: /\.m?js$/,
        exclude: /(node_modules|bower_components)/,
        resolve: {
          fullySpecified: false,
        },
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
  }
};

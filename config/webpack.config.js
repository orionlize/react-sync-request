const path = require('path');

module.exports={
  mode:'production',
  entry:'./src/index.tsx',
  module:{
    rules:[
      {
        test:/\.tsx?$/,
        use:'ts-loader',
        exclude:/node_modules/
      }
    ]
  },
  output:{
    filename:'index.js',
    path:path.resolve(__dirname, '..' ,'lib'),
    library: {
      type: 'commonjs2'
    }
  },
  externals: {
    'react': 'react',
    'react-dom': 'react-dom'
  }
}
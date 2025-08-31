export default function (api) {
  api.cache(true);

  return {
    plugins: [['inline-import', { extensions: ['.sql'] }]],
    presets: [
      '@nkzw/babel-preset-fbtee',
      ['babel-preset-expo', { jsxImportSource: 'nativewind' }],
      'nativewind/babel',
    ],
  };
}

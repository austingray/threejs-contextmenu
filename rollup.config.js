export default {
  input: 'src/tkit.js',
  output: [
    {
      format: 'umd',
      name: 'TKIT',
      file: 'build/tkit.js',
      indent: '\t',
    },
    {
      format: 'es',
      file: 'build/tkit.module.js',
      indent: '\t',
    },
  ],
};

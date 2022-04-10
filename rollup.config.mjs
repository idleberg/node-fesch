import { terser } from "rollup-plugin-terser";
import commonjs from '@rollup/plugin-commonjs';
import filesize from 'rollup-plugin-filesize';
import resolve from '@rollup/plugin-node-resolve';
import typescript from '@rollup/plugin-typescript';

const isProduction = process.env.NODE_ENV === 'production';

const plugins = [
  commonjs(),
  isProduction && filesize(),
  resolve(),
  isProduction && terser(),
  typescript(),
];

export default [
  {
    input: './src/fesch.ts',
    output: {
      compact: isProduction,
      sourcemap: true,
      file: './lib/fesch.mjs',
      format: 'esm'
    },
    plugins: plugins
  }
];

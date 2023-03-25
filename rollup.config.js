import typescript from "@rollup/plugin-typescript";
import dts from "rollup-plugin-dts";

export default {
  input: "src/index.ts",
  output: [
    {
      file: "dist/index.js",
      format: "cjs",
      sourcemap: true,
    },
    {
      file: "dist/index.d.ts",
      format: "es",

      plugins: [dts()],
    },
  ],
  plugins: [
    typescript({
      tsconfig: "./tsconfig.json",
    }),
  ],
  external: ["@react-native-async-storage/async-storage"],
};

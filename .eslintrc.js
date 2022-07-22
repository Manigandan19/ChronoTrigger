module.exports = {
  root: true,
  extends: ["airbnb-typescript/base"],
  plugins: ["import", "prettier"],
  parserOptions: {
    project: "./tsconfig.eslint.json",
  },
  rules: {
    "import/no-extraneous-dependencies": [
      "error",
      {
        devDependencies: true,
        optionalDependencies: true,
        peerDependencies: true,
      },
    ],
  },
};

export const coloredText = {
  green(text) {
    return `\`\`\`\`ansi
    [2;32m${text}[0m
    \`\`\``;
  },
  blue(text) {
    return `\`\`\`\`ansi
    [0;2m[0;34m${text}[0m[0m
    \`\`\``;
  },
};

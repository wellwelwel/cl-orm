export const backtick = (name: string): string => {
  if (name.includes('`')) return name;

  if (name.includes('.'))
    return name
      .split('.')
      .map((part) => `\`${part}\``)
      .join('.');

  return `\`${name}\``;
};

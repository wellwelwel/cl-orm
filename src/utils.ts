export const quoteIdentifier = (name: string): string => {
  if (name.includes('.')) {
    return name
      .split('.')
      .map((part) => `\`${part}\``)
      .join('.');
  }

  return `\`${name}\``;
};

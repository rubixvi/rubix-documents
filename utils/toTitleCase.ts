export function toTitleCase(input: string): string {
  const words = input.split('-')
  const capitalize = words.map((word) => word.charAt(0).toUpperCase() + word.slice(1))
  return capitalize.join(' ')
}

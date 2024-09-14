export function highlight(snippet: string, searchTerm: string) {
  const regex = new RegExp(`(${searchTerm})`, "gi");
  return snippet.replace(regex, "<span class='highlight'>$1</span>");
}
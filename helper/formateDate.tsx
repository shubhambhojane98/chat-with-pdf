export function formatDateString(dateString: string): string {
  const date = new Date(dateString);

  // Subtract one day from the current date
  date.setDate(date.getDate() - 1);

  const day = String(date.getUTCDate()).padStart(2, "0");
  const month = String(date.getUTCMonth() + 1).padStart(2, "0"); // Months are 0-based
  const year = date.getUTCFullYear();

  return `${day}/${month}/${year}`;
}

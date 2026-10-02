export function cn(...classes: (string | false | null | undefined)[]) {
  return classes.filter(Boolean).join(" ");
}

/** Two-digit archive number: 1 → "01". */
export function pad(n: number) {
  return String(n).padStart(2, "0");
}

const numerals: [number, string][] = [
  [10, "X"],
  [9, "IX"],
  [5, "V"],
  [4, "IV"],
  [1, "I"],
];

export function roman(n: number) {
  let out = "";
  for (const [value, symbol] of numerals) {
    while (n >= value) {
      out += symbol;
      n -= value;
    }
  }
  return out;
}

export function displayYear(year: string) {
  return year.trim() || "n.d.";
}

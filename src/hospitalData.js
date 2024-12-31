export const hospitalData = {
  codes: [
    { id: 1, name: "Code Red", color: "#FF0000", priority: "high" },
    { id: 2, name: "Code Pink", color: "#FFC0CB", priority: "medium" },
    { id: 3, name: "Code White", color: "#ffffff", priority: "medium" },
    { id: 4, name: "Code Black", color: "#000000", priority: "medium" },
    { id: 5, name: "Code Orange", color: "#FFA500", priority: "medium" },
    { id: 6, name: "Code Yellow", color: "#FFFF00", priority: "medium" },
    { id: 7, name: "Code Gray", color: "#808080", priority: "medium" },
    { id: 8, name: "Code Brown", color: "#964B00", priority: "medium" },
    { id: 9, name: "Code Silver", color: "#C0C0C0", priority: "medium" },
    { id: 10, name: "Code Blue", color: "#00008B", priority: "medium" },
    { id: 11, name: "Code RRT", color: "#f8f8f8", priority: "medium" },
  ],
  floors: Array.from({ length: 10 }, (_, i) => ({
    id: i + 1,
    name: `Floor ${i + 1}`,
  })),
  rooms: Array.from({ length: 20 }, (_, i) => ({
    id: (i + 1).toString().padStart(3, "0"),
    name: `Room ${(i + 1).toString().padStart(3, "0")}`,
  })),
};
export function getContrastColor(hexColor) {
  const r = parseInt(hexColor.substr(1, 2), 16);
  const g = parseInt(hexColor.substr(3, 2), 16);
  const b = parseInt(hexColor.substr(5, 2), 16);
  const yiq = (r * 299 + g * 587 + b * 114) / 1000;
  return yiq >= 128 ? "black" : "white";
}

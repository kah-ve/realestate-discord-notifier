function parsePrice(value) {
  return value.replace("$", "").replace(",", "");
}

export { parsePrice };

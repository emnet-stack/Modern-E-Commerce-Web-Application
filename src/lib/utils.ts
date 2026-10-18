export function formatPrice(value: number): string {
  return new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: "USD",
  }).format(value);
}

/**
 * The public API often returns broken image data, such as strings like
 * '["https://..."]' or empty values. This cleans them and keeps only valid URLs.
 */
export function cleanImageUrls(images: unknown): string[] {
  if (!Array.isArray(images)) return [];
  return images
    .map((img) =>
      typeof img === "string" ? img.replace(/[\[\]"'\\]/g, "").trim() : "",
    )
    .filter((img) => /^https?:\/\//i.test(img));
}

export function getErrorMessage(error: unknown): string {
  if (error instanceof Error) return error.message;
  return "Something went wrong. Please try again.";
}
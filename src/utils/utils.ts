// utils.ts
export function normalizeCategory(cat: string): string {
  return cat.trim().toLowerCase().replace(/\s+/g, '_');
}

const categoryMap: Record<string, string> = {
  "kitchen": "кухни",
  "nursery": "детские",
  "bedroom": "спальни",
  "couch": "диваны",
  "cupboard": "шкафы-купе",
  "drawingroom":"гостинные",
  "hallway":"прихожие"
};

export function mapCategorySlugToDataCategory(slug: string): string {
  return categoryMap[slug] || slug;
}

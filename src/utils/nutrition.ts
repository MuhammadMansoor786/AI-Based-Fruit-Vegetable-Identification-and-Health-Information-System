import type {
  NutritionPer100g,
  GlycemicCategory,
  PotassiumTier,
  ProduceItem,
  ProduceCategory
} from '../types/produce.ts';

// Standard Daily Reference Values (FDA / USDA FoodData Central 2000 kcal diet reference)
export const DAILY_REFERENCE_VALUES = {
  calories: 2000,
  carbsG: 275,
  sugarsG: 50,
  fiberG: 28,
  proteinG: 50,
  fatG: 78,
  vitaminC_mg: 90,
  vitaminA_mcg: 900,
  vitaminK_mcg: 120,
  potassium_mg: 4700,
  calcium_mg: 1300,
  iron_mg: 18,
  magnesium_mg: 420,
  folate_mcg: 400,
};

/**
 * Calculates the percentage of Daily Value (% DV) for a given nutrient per 100g
 */
export function calculateDailyValuePercent(
  amount: number,
  nutrientKey: keyof typeof DAILY_REFERENCE_VALUES
): number {
  const reference = DAILY_REFERENCE_VALUES[nutrientKey];
  if (!reference || reference <= 0) return 0;
  return Math.min(Math.round((amount / reference) * 100), 500);
}

/**
 * Classifies Glycemic Index into Low (<=55), Medium (56-69), High (>=70)
 */
export function classifyGlycemicIndex(gi: number): GlycemicCategory {
  if (gi <= 55) return 'Low';
  if (gi <= 69) return 'Medium';
  return 'High';
}

/**
 * Classifies potassium level per 100g serving for renal dietary considerations
 * Low: < 200mg, Moderate: 200 - 350mg, High: > 350mg
 */
export function classifyPotassiumLevel(potassiumMg: number): PotassiumTier {
  if (potassiumMg < 200) return 'Low Potassium';
  if (potassiumMg <= 350) return 'Moderate Potassium';
  return 'High Potassium';
}

/**
 * Evaluates suitability for diabetic patients
 */
export function evaluateDiabetesSuitability(gi: number, carbsG: number, fiberG: number): {
  category: GlycemicCategory;
  suitability: 'Safe' | 'Moderate' | 'Caution';
  advice: string;
} {
  const category = classifyGlycemicIndex(gi);
  const netCarbs = Math.max(0, carbsG - fiberG);

  if (category === 'Low' && netCarbs <= 10) {
    return {
      category,
      suitability: 'Safe',
      advice: 'Low glycemic impact with high fiber; suitable in standard diabetic meal plans with stable blood glucose response.',
    };
  }

  if (category === 'Low' || (category === 'Medium' && netCarbs < 15)) {
    return {
      category,
      suitability: 'Moderate',
      advice: 'Moderate carbohydrate content; consume in portion-controlled servings paired with protein or healthy fats.',
    };
  }

  return {
    category,
    suitability: 'Caution',
    advice: 'High glycemic impact or concentrated sugars; monitor post-prandial blood sugar and limit single-sitting portion size.',
  };
}

/**
 * Produce filtering criteria
 */
export interface FilterCriteria {
  query?: string;
  category?: ProduceCategory | 'all';
  season?: string | 'all';
  glycemicTier?: GlycemicCategory | 'all';
  potassiumTier?: PotassiumTier | 'all';
  highFiberOnly?: boolean;
  highVitaminCOnly?: boolean;
}

/**
 * Pure function to filter produce items based on multiple criteria
 */
export function filterProduceItems(items: ProduceItem[], criteria: FilterCriteria): ProduceItem[] {
  return items.filter((item) => {
    // Search query matching English name, scientific name, Urdu name, or variety
    if (criteria.query && criteria.query.trim().length > 0) {
      const q = criteria.query.toLowerCase().trim();
      const matchesName = item.name.toLowerCase().includes(q);
      const matchesScientific = item.scientificName.toLowerCase().includes(q);
      const matchesUrdu = item.urduName.toLowerCase().includes(q);
      const matchesFamily = item.family.toLowerCase().includes(q);
      const matchesVariety = item.varieties.some((v) => v.toLowerCase().includes(q));
      const matchesOrigin = item.origin.toLowerCase().includes(q);

      if (!matchesName && !matchesScientific && !matchesUrdu && !matchesFamily && !matchesVariety && !matchesOrigin) {
        return false;
      }
    }

    // Category filter
    if (criteria.category && criteria.category !== 'all') {
      if (item.category !== criteria.category) return false;
    }

    // Growing Season filter
    if (criteria.season && criteria.season !== 'all') {
      const hasSeason =
        item.growingSeason.includes(criteria.season as any) ||
        item.growingSeason.includes('Year-round');
      if (!hasSeason) return false;
    }

    // Glycemic Index filter
    if (criteria.glycemicTier && criteria.glycemicTier !== 'all') {
      if (item.precautions.diabetes.category !== criteria.glycemicTier) return false;
    }

    // Potassium Tier filter
    if (criteria.potassiumTier && criteria.potassiumTier !== 'all') {
      if (item.precautions.kidneyDisease.potassiumTier !== criteria.potassiumTier) return false;
    }

    // High Fiber (> 3g per 100g is generally considered high fiber in fruits/veg)
    if (criteria.highFiberOnly) {
      if (item.nutritionPer100g.fiberG < 3.0) return false;
    }

    // High Vitamin C (> 30mg per 100g is >33% DV)
    if (criteria.highVitaminCOnly) {
      if (item.nutritionPer100g.vitaminC_mg < 30) return false;
    }

    return true;
  });
}

/**
 * Compare two nutrition records and return differences
 */
export function compareNutrition(itemA: ProduceItem, itemB: ProduceItem) {
  const nA = itemA.nutritionPer100g;
  const nB = itemB.nutritionPer100g;

  return {
    calorieDiff: nA.calories - nB.calories,
    fiberDiff: nA.fiberG - nB.fiberG,
    sugarDiff: nA.sugarsG - nB.sugarsG,
    proteinDiff: nA.proteinG - nB.proteinG,
    vitaminCDiff: nA.vitaminC_mg - nB.vitaminC_mg,
    potassiumDiff: nA.potassium_mg - nB.potassium_mg,
    higherFiber: nA.fiberG > nB.fiberG ? itemA.name : itemB.name,
    lowerCalories: nA.calories < nB.calories ? itemA.name : itemB.name,
    lowerSugar: nA.sugarsG < nB.sugarsG ? itemA.name : itemB.name,
    higherVitaminC: nA.vitaminC_mg > nB.vitaminC_mg ? itemA.name : itemB.name,
  };
}

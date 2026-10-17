import test from 'node:test';
import assert from 'node:assert/strict';
import {
  calculateDailyValuePercent,
  classifyGlycemicIndex,
  classifyPotassiumLevel,
  evaluateDiabetesSuitability,
  filterProduceItems,
  compareNutrition,
} from './nutrition.ts';
import type { ProduceItem } from '../types/produce.ts';

const mockItemA: ProduceItem = {
  id: 'apple-test',
  name: 'Apple',
  scientificName: 'Malus domestica',
  urduName: 'سیب (Saib)',
  category: 'fruit',
  subCategory: 'Pome',
  family: 'Rosaceae',
  imageUrl: 'https://images.unsplash.com/photo-1560806887-1e4cd0b6cbd6',
  origin: 'Central Asia',
  cultivationRegions: ['China', 'United States', 'Poland', 'Turkey'],
  growingSeason: ['Autumn', 'Summer'],
  climate: 'Temperate',
  varieties: ['Fuji', 'Gala', 'Granny Smith'],
  description: 'Crunchy sweet fruit high in pectin fiber.',
  nutritionPer100g: {
    calories: 52,
    waterPercent: 85.6,
    carbsG: 13.8,
    sugarsG: 10.4,
    fiberG: 2.4,
    proteinG: 0.3,
    fatG: 0.2,
    vitaminC_mg: 4.6,
    vitaminA_mcg: 3,
    vitaminK_mcg: 2.2,
    potassium_mg: 107,
    calcium_mg: 6,
    iron_mg: 0.1,
    magnesium_mg: 5,
    folate_mcg: 3,
  },
  healthBenefits: [
    { title: 'Heart Health', description: 'Soluble fiber lowers LDL cholesterol.', targetedSystem: 'Cardiovascular' }
  ],
  precautions: {
    diabetes: {
      glycemicIndex: 36,
      category: 'Low',
      suitability: 'Safe',
      advice: 'Safe for most diabetics in standard portions.'
    },
    kidneyDisease: {
      potassiumTier: 'Low Potassium',
      oxalateLevel: 'Low',
      advice: 'Kidney friendly fruit.'
    },
    hypertension: {
      advice: 'Supports blood pressure health.'
    },
    allergiesAndInteractions: ['Oral allergy syndrome with birch pollen'],
    contraindications: []
  },
  recommendedServing: '1 medium fruit (approx 150g)',
  culinaryUses: ['Fresh eating', 'Baking', 'Cider'],
  storageTips: 'Store in crisper drawer up to 4 weeks.',
  sources: [
    { name: 'USDA FoodData Central #171688', organization: 'USDA', url: 'https://fdc.nal.usda.gov' }
  ]
};

const mockItemB: ProduceItem = {
  id: 'karela-test',
  name: 'Bitter Gourd',
  scientificName: 'Momordica charantia',
  urduName: 'کریلہ (Karela)',
  category: 'vegetable',
  subCategory: 'Cucurbit',
  family: 'Cucurbitaceae',
  imageUrl: 'https://images.unsplash.com/photo-1598170845058-32b9d6a5da37',
  origin: 'South Asia',
  cultivationRegions: ['Pakistan', 'India', 'China', 'Philippines'],
  growingSeason: ['Summer', 'Spring'],
  climate: 'Tropical & Subtropical',
  varieties: ['Indian Green', 'Chinese White', 'Spiny'],
  description: 'Distinctive bitter gourd known for charantin and metabolic benefits.',
  nutritionPer100g: {
    calories: 17,
    waterPercent: 94.0,
    carbsG: 3.7,
    sugarsG: 1.0,
    fiberG: 2.8,
    proteinG: 1.0,
    fatG: 0.2,
    vitaminC_mg: 84.0,
    vitaminA_mcg: 24,
    vitaminK_mcg: 4.8,
    potassium_mg: 296,
    calcium_mg: 19,
    iron_mg: 0.4,
    magnesium_mg: 17,
    folate_mcg: 72,
  },
  healthBenefits: [
    { title: 'Blood Sugar Regulation', description: 'Contains polypeptide-p mimicking insulin.', targetedSystem: 'Metabolic' }
  ],
  precautions: {
    diabetes: {
      glycemicIndex: 15,
      category: 'Low',
      suitability: 'Safe',
      advice: 'Highly beneficial, but watch for hypoglycemia if on insulin.'
    },
    kidneyDisease: {
      potassiumTier: 'Moderate Potassium',
      oxalateLevel: 'Moderate',
      advice: 'Safe in standard dietary portions.'
    },
    hypertension: {
      advice: 'Aids in blood pressure management.'
    },
    allergiesAndInteractions: ['Hypoglycemia medication enhancement'],
    contraindications: ['Favism (G6PD deficiency)']
  },
  recommendedServing: '100g cooked',
  culinaryUses: ['Stir fry', 'Curry', 'Stuffed Karela'],
  storageTips: 'Wrap in paper towel, refrigerate up to 5 days.',
  sources: [
    { name: 'USDA FoodData Central #168393', organization: 'USDA', url: 'https://fdc.nal.usda.gov' }
  ]
};

test('calculateDailyValuePercent returns accurate percentage', () => {
  // Vitamin C reference is 90mg. 84mg in Karela should be ~93%
  const vitCPercent = calculateDailyValuePercent(84, 'vitaminC_mg');
  assert.equal(vitCPercent, 93);

  // Fiber reference is 28g. 2.8g in Karela should be 10%
  const fiberPercent = calculateDailyValuePercent(2.8, 'fiberG');
  assert.equal(fiberPercent, 10);
});

test('classifyGlycemicIndex correctly classifies boundaries', () => {
  assert.equal(classifyGlycemicIndex(15), 'Low');
  assert.equal(classifyGlycemicIndex(55), 'Low');
  assert.equal(classifyGlycemicIndex(56), 'Medium');
  assert.equal(classifyGlycemicIndex(69), 'Medium');
  assert.equal(classifyGlycemicIndex(70), 'High');
  assert.equal(classifyGlycemicIndex(85), 'High');
});

test('classifyPotassiumLevel correctly categorizes renal tiers', () => {
  assert.equal(classifyPotassiumLevel(107), 'Low Potassium');
  assert.equal(classifyPotassiumLevel(296), 'Moderate Potassium');
  assert.equal(classifyPotassiumLevel(450), 'High Potassium');
});

test('evaluateDiabetesSuitability categorizes low carb and low GI properly', () => {
  const evaluation = evaluateDiabetesSuitability(15, 3.7, 2.8);
  assert.equal(evaluation.category, 'Low');
  assert.equal(evaluation.suitability, 'Safe');
});

test('filterProduceItems filters by query and categories accurately', () => {
  const items = [mockItemA, mockItemB];

  // Search by Urdu query
  const resUrdu = filterProduceItems(items, { query: 'کریلہ' });
  assert.equal(resUrdu.length, 1);
  assert.equal(resUrdu[0].id, 'karela-test');

  // Search by Scientific name
  const resSci = filterProduceItems(items, { query: 'Malus' });
  assert.equal(resSci.length, 1);
  assert.equal(resSci[0].id, 'apple-test');

  // Filter by category
  const resVeg = filterProduceItems(items, { category: 'vegetable' });
  assert.equal(resVeg.length, 1);
  assert.equal(resVeg[0].name, 'Bitter Gourd');

  // Filter by season
  const resSummer = filterProduceItems(items, { season: 'Summer' });
  assert.equal(resSummer.length, 2);

  const resAutumn = filterProduceItems(items, { season: 'Autumn' });
  assert.equal(resAutumn.length, 1);
  assert.equal(resAutumn[0].name, 'Apple');
});

test('compareNutrition accurately identifies nutrient differentials', () => {
  const comp = compareNutrition(mockItemA, mockItemB);
  assert.equal(comp.higherVitaminC, 'Bitter Gourd');
  assert.equal(comp.lowerCalories, 'Bitter Gourd');
  assert.equal(comp.lowerSugar, 'Bitter Gourd');
  assert.equal(comp.higherFiber, 'Bitter Gourd');
});

export type ProduceCategory = 'fruit' | 'vegetable' | 'herb';

export type GlycemicCategory = 'Low' | 'Medium' | 'High';

export type PotassiumTier = 'Low Potassium' | 'Moderate Potassium' | 'High Potassium';

export interface NutritionPer100g {
  calories: number;
  waterPercent: number;
  carbsG: number;
  sugarsG: number;
  fiberG: number;
  proteinG: number;
  fatG: number;
  vitaminC_mg: number;
  vitaminA_mcg: number;
  vitaminK_mcg: number;
  potassium_mg: number;
  calcium_mg: number;
  iron_mg: number;
  magnesium_mg: number;
  folate_mcg: number;
}

export interface HealthBenefitItem {
  title: string;
  description: string;
  targetedSystem: 'Cardiovascular' | 'Digestive' | 'Immune' | 'Metabolic' | 'Skin & Vision' | 'Anti-Inflammatory';
}

export interface HealthPrecautions {
  diabetes: {
    glycemicIndex: number;
    category: GlycemicCategory;
    suitability: 'Safe' | 'Moderate' | 'Caution';
    advice: string;
  };
  kidneyDisease: {
    potassiumTier: PotassiumTier;
    oxalateLevel: 'Low' | 'Moderate' | 'High';
    advice: string;
  };
  hypertension: {
    advice: string;
  };
  allergiesAndInteractions: string[];
  contraindications: string[];
}

export interface ProduceSource {
  name: string;
  organization: string;
  url?: string;
}

export interface ProduceItem {
  id: string;
  name: string;
  scientificName: string;
  urduName: string;
  localNames?: {
    hindi?: string;
    spanish?: string;
    arabic?: string;
    french?: string;
  };
  category: ProduceCategory;
  subCategory: string;
  family: string;
  imageUrl: string;
  origin: string;
  cultivationRegions: string[];
  growingSeason: ('Spring' | 'Summer' | 'Autumn' | 'Winter' | 'Year-round')[];
  climate: string;
  varieties: string[];
  description: string;
  nutritionPer100g: NutritionPer100g;
  healthBenefits: HealthBenefitItem[];
  precautions: HealthPrecautions;
  recommendedServing: string;
  culinaryUses: string[];
  storageTips: string;
  sources: ProduceSource[];
  isVerified?: boolean;
}

export interface RecognitionCandidate {
  name: string;
  confidence: number;
  note: string;
}

export interface SimilarProduce {
  name: string;
  distinction: string;
}

export interface RecognitionResult {
  isProduce: boolean;
  confidence: number; // 0 to 100
  item: ProduceItem;
  alternativeMatches: RecognitionCandidate[];
  similarProduce: SimilarProduce[];
  unclearWarning?: string | null;
  recognizedAt: string;
  queryImage?: string;
}

export interface ScanHistoryEntry {
  id: string;
  timestamp: string;
  produceName: string;
  scientificName: string;
  urduName: string;
  category: ProduceCategory;
  confidence: number;
  imageUrl: string;
  itemData: ProduceItem;
  userFeedback?: 'accurate' | 'inaccurate' | 'partial';
  userNotes?: string;
}

export interface FeedbackReport {
  id: string;
  timestamp: string;
  scanId?: string;
  produceName: string;
  reportedCorrection?: string;
  userComment: string;
  feedbackType: 'accurate' | 'inaccurate' | 'general';
}

export interface UserProfile {
  id: string;
  name: string;
  email: string;
  role: 'user' | 'admin';
  favorites: string[]; // ProduceItem IDs
  dietaryPreferences: {
    diabeticFriendlyOnly: boolean;
    lowPotassiumMode: boolean;
    highFiberFocus: boolean;
  };
}

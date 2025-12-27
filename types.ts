
export interface ProductDetail {
  productName: string;
  tagline: string;
  description: string;
  targetAudience: string;
  keyBenefits: {
    title: string;
    description: string;
  }[];
  specifications: {
    label: string;
    value: string;
  }[];
  marketingCopy: string;
  brandColors: {
    primary: string;
    secondary: string;
    accent: string;
  };
  generatedImageUrl?: string;
  lifestyleImageUrl?: string;
}

export interface AppState {
  isAnalyzing: boolean;
  isGeneratingImages: boolean;
  referenceImage: string | null;
  productData: ProductDetail | null;
  error: string | null;
}

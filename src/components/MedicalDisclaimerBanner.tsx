import React, { useState } from 'react';
import { ShieldAlert, Info, X } from 'lucide-react';

export const MedicalDisclaimerBanner: React.FC = () => {
  const [dismissed, setDismissed] = useState(false);

  if (dismissed) return null;

  return (
    <div className="bg-amber-50/95 border-b border-amber-200 px-4 py-2.5 text-xs text-amber-900 transition-all">
      <div className="max-w-7xl mx-auto flex items-center justify-between gap-3">
        <div className="flex items-center gap-2 flex-1">
          <ShieldAlert className="w-4 h-4 text-amber-600 shrink-0" />
          <p className="leading-relaxed">
            <span className="font-semibold">Medical & Nutritional Disclaimer:</span> Health benefits and precautions are sourced from verified nutritional databases (USDA FoodData Central, FAO/INFOODS). Information is strictly educational and does not constitute medical prescription or guaranteed treatment for clinical conditions. Always consult a licensed healthcare professional.
          </p>
        </div>
        <button
          onClick={() => setDismissed(true)}
          className="text-amber-700 hover:text-amber-950 p-1 rounded-md transition-colors"
          aria-label="Dismiss disclaimer banner"
        >
          <X className="w-3.5 h-3.5" />
        </button>
      </div>
    </div>
  );
};

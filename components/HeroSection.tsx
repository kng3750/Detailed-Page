
import React from 'react';
import { ProductDetail } from '../types';

interface HeroSectionProps {
  data: ProductDetail;
}

export const HeroSection: React.FC<HeroSectionProps> = ({ data }) => {
  return (
    <div className="w-full bg-white flex flex-col items-center">
      <div className="w-full max-w-5xl px-8 py-24 flex flex-col md:flex-row items-center gap-16">
        <div className="flex-1 text-left space-y-6">
          <span 
            className="px-4 py-1 rounded-full text-xs font-bold tracking-widest uppercase"
            style={{ backgroundColor: `${data.brandColors.primary}15`, color: data.brandColors.primary }}
          >
            New Collection
          </span>
          <h1 className="text-5xl md:text-6xl font-black text-gray-900 leading-tight">
            {data.productName}
          </h1>
          <p className="text-xl text-gray-500 font-light leading-relaxed">
            {data.tagline}
          </p>
          <div className="pt-4">
            <button 
              className="px-8 py-4 rounded-full text-white font-bold shadow-xl transition-transform hover:scale-105"
              style={{ backgroundColor: data.brandColors.primary }}
            >
              지금 바로 만나보기
            </button>
          </div>
        </div>
        <div className="flex-1 w-full aspect-square relative group">
          <div 
            className="absolute -inset-4 rounded-[3rem] blur-2xl opacity-20 transition-opacity group-hover:opacity-30"
            style={{ backgroundColor: data.brandColors.primary }}
          ></div>
          <div className="relative w-full h-full overflow-hidden rounded-[2.5rem] shadow-2xl border border-gray-100 bg-gray-50">
            <img 
              src={data.generatedImageUrl || 'https://picsum.photos/800/800'} 
              alt={data.productName} 
              className="w-full h-full object-cover"
            />
          </div>
        </div>
      </div>
    </div>
  );
};


import React from 'react';
import { ProductDetail } from '../types';

interface SpecSectionProps {
  data: ProductDetail;
}

export const SpecSection: React.FC<SpecSectionProps> = ({ data }) => {
  return (
    <div className="w-full bg-white py-24 flex flex-col items-center">
      <div className="max-w-4xl px-8 w-full">
        <div className="mb-12">
          <h2 className="text-2xl font-bold text-gray-900 mb-8 border-l-4 border-blue-600 pl-4">제품 상세 정보</h2>
          <div className="border-t border-gray-200">
            {data.specifications.map((spec, idx) => (
              <div key={idx} className="flex border-b border-gray-200 py-6">
                <div className="w-1/3 text-gray-500 font-medium">{spec.label}</div>
                <div className="w-2/3 text-gray-900 font-bold">{spec.value}</div>
              </div>
            ))}
          </div>
        </div>

        <div className="bg-gray-900 rounded-3xl p-12 text-white">
          <h3 className="text-2xl font-bold mb-6">구매 가이드</h3>
          <p className="text-gray-400 mb-8 leading-relaxed text-lg">
            {data.marketingCopy}
          </p>
          <div className="flex flex-wrap gap-4">
            <span className="bg-white/10 px-4 py-2 rounded-full text-sm font-medium">#프리미엄</span>
            <span className="bg-white/10 px-4 py-2 rounded-full text-sm font-medium">#선물추천</span>
            <span className="bg-white/10 px-4 py-2 rounded-full text-sm font-medium">#{data.productName}</span>
          </div>
        </div>
      </div>
    </div>
  );
};

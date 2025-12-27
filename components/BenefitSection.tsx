
import React from 'react';
import { ProductDetail } from '../types';

interface BenefitSectionProps {
  data: ProductDetail;
}

export const BenefitSection: React.FC<BenefitSectionProps> = ({ data }) => {
  return (
    <div className="w-full bg-gray-50 py-24 flex flex-col items-center">
      <div className="max-w-6xl px-8 w-full">
        <div className="text-center mb-16">
          <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">왜 {data.productName} 인가요?</h2>
          <div className="w-20 h-1 bg-blue-600 mx-auto"></div>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-12">
          {data.keyBenefits.map((benefit, idx) => (
            <div key={idx} className="bg-white p-10 rounded-3xl shadow-lg border border-gray-100 hover:transform hover:-translate-y-2 transition-all duration-300">
              <div className="w-16 h-16 bg-blue-50 rounded-2xl flex items-center justify-center mb-8">
                <i className={`fas ${['fa-gem', 'fa-bolt', 'fa-shield-halved'][idx]} text-2xl text-blue-600`}></i>
              </div>
              <h3 className="text-2xl font-bold mb-4 text-gray-800">{benefit.title}</h3>
              <p className="text-gray-600 leading-relaxed text-lg">{benefit.description}</p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

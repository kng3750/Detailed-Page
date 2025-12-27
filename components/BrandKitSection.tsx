
import React from 'react';
import { ProductDetail } from '../types';

interface Props {
  data: ProductDetail;
}

export const BrandKitSection: React.FC<Props> = ({ data }) => {
  return (
    <div className="w-full py-16 bg-white border-t border-gray-100 flex flex-col items-center no-print">
      <div className="max-w-4xl w-full px-8">
        <h3 className="text-sm font-bold text-gray-400 uppercase tracking-widest mb-8 text-center">Visual Brand Identity</h3>
        <div className="flex justify-between items-center gap-8 bg-gray-50 p-8 rounded-[2rem]">
          <div className="flex-1 space-y-4">
            <p className="text-xs font-bold text-gray-500">Color Palette</p>
            <div className="flex gap-4">
              {/* Added type assertion to Object.entries to fix the 'unknown' type error for color.toUpperCase() */}
              {(Object.entries(data.brandColors) as Array<[string, string]>).map(([name, color]) => (
                <div key={name} className="flex flex-col items-center gap-2">
                  <div 
                    className="w-12 h-12 rounded-2xl shadow-sm border border-white"
                    style={{ backgroundColor: color }}
                  ></div>
                  <span className="text-[10px] font-mono text-gray-400">{color.toUpperCase()}</span>
                </div>
              ))}
            </div>
          </div>
          <div className="h-12 w-px bg-gray-200"></div>
          <div className="flex-1 space-y-4">
            <p className="text-xs font-bold text-gray-500">Typography</p>
            <div className="space-y-1">
              <p className="text-2xl font-black text-gray-900">Noto Sans KR</p>
              <p className="text-xs text-gray-400">Heading & Body System</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

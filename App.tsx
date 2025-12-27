
import React, { useState, useRef } from 'react';
import { geminiService } from './services/geminiService';
import { AppState, ProductDetail } from './types';
import { HeroSection } from './components/HeroSection';
import { BenefitSection } from './components/BenefitSection';
import { SpecSection } from './components/SpecSection';
import { BrandKitSection } from './components/BrandKitSection';

const App: React.FC = () => {
  const [state, setState] = useState<AppState>({
    isAnalyzing: false,
    isGeneratingImages: false,
    referenceImage: null,
    productData: null,
    error: null,
  });

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setState(prev => ({ 
          ...prev, 
          referenceImage: reader.result as string,
          error: null,
          productData: null // Reset data on new upload
        }));
      };
      reader.readAsDataURL(file);
    }
  };

  const generateDesign = async () => {
    if (!state.referenceImage) return;

    setState(prev => ({ ...prev, isAnalyzing: true, error: null }));

    try {
      // 1. Analyze & Copywriting
      const productInfo = await geminiService.analyzeAndCopywrite(state.referenceImage);
      
      // Update state to show image generation is in progress
      setState(prev => ({ 
        ...prev, 
        isAnalyzing: false, 
        isGeneratingImages: true 
      }));

      // 2. Generate Images in parallel for efficiency
      const [mainImg, lifeImg] = await Promise.all([
        geminiService.generateImage(
          state.referenceImage, 
          `High-end professional studio product photography of ${productInfo.productName}. Minimalist clean white background, premium soft commercial lighting, 8k resolution, center composition.`
        ),
        geminiService.generateImage(
          state.referenceImage,
          `A beautiful lifestyle aesthetic shot of ${productInfo.productName} in a high-end modern interior or natural setting. Cinematic depth of field, warm atmospheric lighting, professional editorial magazine style.`
        )
      ]);

      // 3. Set final data only when everything is ready
      setState(prev => ({ 
        ...prev, 
        isGeneratingImages: false,
        productData: { 
          ...productInfo, 
          generatedImageUrl: mainImg,
          lifestyleImageUrl: lifeImg
        }
      }));
    } catch (err: any) {
      console.error(err);
      setState(prev => ({ 
        ...prev, 
        isAnalyzing: false, 
        isGeneratingImages: false, 
        error: err.message || "AI 디자인 생성 중 오류가 발생했습니다. 다시 시도해 주세요." 
      }));
    }
  };

  const handleDownload = () => {
    window.print();
  };

  return (
    <div className="min-h-screen bg-[#f1f5f9] flex flex-col font-sans">
      <header className="no-print bg-white/90 backdrop-blur-md border-b border-gray-200 px-8 py-4 sticky top-0 z-50 flex justify-between items-center shadow-sm">
        <div className="flex items-center gap-3">
          <div className="bg-gradient-to-br from-indigo-600 to-blue-500 text-white p-2.5 rounded-2xl shadow-lg shadow-blue-500/20">
            <i className="fas fa-palette"></i>
          </div>
          <h1 className="text-xl font-black tracking-tight text-gray-900">GEMINI <span className="text-blue-600 font-medium">DESIGN</span></h1>
        </div>
        
        <div className="flex gap-3">
          {state.productData && (
            <button 
              onClick={handleDownload}
              className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-2.5 rounded-2xl font-bold transition-all flex items-center gap-2 shadow-xl shadow-blue-600/20"
            >
              <i className="fas fa-file-pdf"></i> PDF로 저장
            </button>
          )}
          <button 
            onClick={() => setState({ 
              isAnalyzing: false, 
              isGeneratingImages: false, 
              referenceImage: null, 
              productData: null, 
              error: null 
            })}
            className="bg-gray-100 hover:bg-gray-200 text-gray-900 px-6 py-2.5 rounded-2xl font-bold transition-all"
          >
            {state.productData ? "새 프로젝트" : "이미지 업로드"}
          </button>
        </div>
      </header>

      <main className="flex-1">
        {!state.productData && !state.isAnalyzing && !state.isGeneratingImages ? (
          <div className="max-w-4xl mx-auto py-24 px-6 fade-in">
            <div className="text-center mb-16 space-y-4">
              <h2 className="text-5xl md:text-6xl font-black text-gray-900 tracking-tight leading-tight">
                이미지 하나로 완성하는<br/><span className="bg-clip-text text-transparent bg-gradient-to-r from-blue-600 to-indigo-600">브랜드 디자인 솔루션</span>
              </h2>
              <p className="text-xl text-gray-500 max-w-2xl mx-auto font-light leading-relaxed">
                레퍼런스 이미지를 업로드하세요. AI가 제품의 본질을 파악하여<br/> 
                카피라이팅, 컬러 팔레트, 고해상도 디자인 에셋을 한 번에 생성합니다.
              </p>
            </div>

            <div className="bg-white rounded-[3rem] p-10 shadow-2xl shadow-blue-500/5 border border-gray-100 relative overflow-hidden">
              <div className="absolute top-0 right-0 p-8 opacity-5">
                <i className="fas fa-wand-magic-sparkles text-[120px] text-blue-600"></i>
              </div>
              
              <div className="flex flex-col items-center gap-10 relative z-10">
                {!state.referenceImage ? (
                  <label className="group flex flex-col items-center justify-center w-full h-96 border-4 border-dashed border-gray-100 rounded-[2.5rem] cursor-pointer hover:border-blue-400 hover:bg-blue-50/50 transition-all duration-500">
                    <div className="w-24 h-24 bg-gray-50 rounded-3xl flex items-center justify-center mb-6 group-hover:scale-110 transition-transform shadow-sm">
                      <i className="fas fa-image text-3xl text-gray-300 group-hover:text-blue-500"></i>
                    </div>
                    <p className="text-2xl font-bold text-gray-800">레퍼런스 이미지 업로드</p>
                    <p className="mt-2 text-gray-400">JPG, PNG 파일 (최대 10MB)</p>
                    <input type="file" className="hidden" onChange={handleImageUpload} accept="image/*" />
                  </label>
                ) : (
                  <div className="relative w-full max-w-sm aspect-square rounded-[2.5rem] overflow-hidden group shadow-2xl">
                    <img src={state.referenceImage} className="w-full h-full object-cover" alt="Ref" />
                    <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center backdrop-blur-sm">
                      <button onClick={() => setState(prev => ({ ...prev, referenceImage: null }))} className="bg-white text-gray-900 px-8 py-3 rounded-full font-bold">변경하기</button>
                    </div>
                  </div>
                )}

                <button 
                  disabled={!state.referenceImage || state.isAnalyzing}
                  onClick={generateDesign}
                  className={`w-full py-6 rounded-3xl text-2xl font-black transition-all flex items-center justify-center gap-4 ${
                    state.referenceImage && !state.isAnalyzing
                    ? 'bg-blue-600 text-white shadow-2xl shadow-blue-600/30 hover:-translate-y-1'
                    : 'bg-gray-100 text-gray-400'
                  }`}
                >
                  디자인 및 상세페이지 생성
                </button>
              </div>
            </div>
            
            {state.error && <div className="mt-8 bg-red-50 text-red-600 p-6 rounded-3xl border border-red-100 flex items-center gap-4 fade-in"><i className="fas fa-exclamation-circle text-xl"></i> {state.error}</div>}
          </div>
        ) : (
          <div className="flex flex-col items-center bg-white">
             {(state.isAnalyzing || state.isGeneratingImages) && (
              <div className="fixed inset-0 bg-white/95 backdrop-blur-2xl z-[100] flex flex-col items-center justify-center">
                <div className="w-20 h-20 border-8 border-blue-100 border-t-blue-600 rounded-full animate-spin mb-8"></div>
                <h3 className="text-3xl font-black text-gray-900 mb-2">
                  {state.isAnalyzing ? "제품 가치를 분석하고 있습니다" : "고해상도 디자인 에셋 렌더링 중"}
                </h3>
                <p className="text-gray-500 text-lg">AI가 맞춤형 이미지를 생성하고 있습니다 (약 15-20초 소요)</p>
              </div>
            )}

            {state.productData && (
              <div id="render-target" className="w-full fade-in">
                <HeroSection data={state.productData} />
                
                <div className="w-full bg-[#fcfcfc] py-32 flex flex-col items-center">
                  <div className="max-w-6xl w-full px-8 grid grid-cols-1 md:grid-cols-2 gap-20 items-center">
                    <div className="space-y-8">
                      <h2 className="text-4xl font-black text-gray-900 leading-tight">
                        일상의 가치를 더하는<br/>디테일의 완성.
                      </h2>
                      <p className="text-xl text-gray-500 leading-relaxed font-light">
                        {state.productData.description}
                      </p>
                    </div>
                    <div className="aspect-[4/5] rounded-[3rem] overflow-hidden shadow-2xl border border-white">
                      {state.productData.lifestyleImageUrl ? (
                        <img 
                          src={state.productData.lifestyleImageUrl} 
                          className="w-full h-full object-cover transition-transform hover:scale-105 duration-1000" 
                          alt="Lifestyle" 
                        />
                      ) : (
                        <div className="w-full h-full bg-gray-100 animate-pulse flex items-center justify-center">
                          <i className="fas fa-image text-4xl text-gray-200"></i>
                        </div>
                      )}
                    </div>
                  </div>
                </div>

                <BenefitSection data={state.productData} />
                <SpecSection data={state.productData} />
                <BrandKitSection data={state.productData} />

                <footer className="w-full bg-gray-50 py-16 text-center border-t border-gray-100 no-print">
                  <div className="flex items-center justify-center gap-2 mb-4">
                    <div className="w-8 h-8 bg-gray-200 rounded-lg flex items-center justify-center">
                      <i className="fas fa-check text-xs text-gray-400"></i>
                    </div>
                    <span className="text-sm font-bold text-gray-400 uppercase tracking-widest">Premium Quality Guaranteed</span>
                  </div>
                  <p className="text-gray-300 text-xs">© 2024 Gemini AI Design Studio. All visual assets generated for preview.</p>
                </footer>
              </div>
            )}
          </div>
        )}
      </main>
    </div>
  );
};

export default App;

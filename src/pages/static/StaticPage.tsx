import { Sparkles } from 'lucide-react';

export default function StaticPage({ title, children }: { title: string, children: React.ReactNode }) {
  return (
    <div className="min-h-screen bg-stone-50 pt-24 pb-12">
      <div className="max-w-4xl mx-auto px-6 lg:px-8">
        <div className="text-center mb-12">
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-dayli-red-light text-dayli-red-dark text-sm font-bold mb-6">
            <Sparkles size={16} /> DAYLI NUTRITION
          </div>
          <h1 className="text-4xl md:text-5xl font-black tracking-tighter text-stone-900 mb-6 uppercase">
            {title}
          </h1>
          <div className="w-24 h-1 bg-dayli-red-dark mx-auto"></div>
        </div>
        
        <div className="bg-white p-8 md:p-12 rounded-3xl shadow-sm border border-stone-100 prose prose-stone max-w-none prose-headings:font-black prose-a:text-dayli-red-dark">
          {children}
        </div>
      </div>
    </div>
  );
}

export default function LoginSkeleton() {
    return (
      <div className="min-h-screen bg-slate-100 flex items-center justify-center p-6">
        <div className="w-full max-w-[420px] bg-white rounded-[2.5rem] shadow-[0_20px_50px_rgba(0,0,0,0.1)] p-10 border border-white animate-pulse">
          
          {/* Header Skeleton */}
          <div className="flex flex-col items-center mb-8">
            <div className="w-16 h-16 bg-slate-200 rounded-2xl mb-4"></div>
            <div className="h-6 w-32 bg-slate-200 rounded-md mb-2"></div>
            <div className="h-4 w-48 bg-slate-100 rounded-md"></div>
          </div>
  
          {/* Input Skeletons */}
          <div className="space-y-6">
            <div className="space-y-2">
              <div className="h-4 w-24 bg-slate-200 rounded"></div>
              <div className="h-12 w-full bg-slate-100 rounded-xl"></div>
            </div>
            
            <div className="space-y-2">
              <div className="h-4 w-24 bg-slate-200 rounded"></div>
              <div className="h-12 w-full bg-slate-100 rounded-xl"></div>
              <div className="h-3 w-20 bg-slate-100 rounded self-end ml-auto"></div>
            </div>
  
            {/* Button Skeleton */}
            <div className="h-14 w-full bg-slate-200 rounded-xl mt-4"></div>
          </div>
  
          {/* Footer Skeleton */}
          <div className="mt-8 pt-6 border-t border-gray-50 flex justify-center">
            <div className="h-4 w-40 bg-slate-100 rounded"></div>
          </div>
        </div>
      </div>
    );
  }
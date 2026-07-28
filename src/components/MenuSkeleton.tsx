import React from 'react';

export const MenuCardSkeleton: React.FC = () => (
  <div className="bg-white rounded-3xl p-6 shadow-md border-2 border-lotteria-yellow/10 animate-pulse">
    <div className="w-full h-48 sm:h-52 bg-lotteria-bg/70 rounded-2xl mb-6" />
    <div className="h-6 bg-lotteria-bg/70 rounded-full w-3/4 mb-3" />
    <div className="h-4 bg-lotteria-bg/50 rounded-full w-full mb-2" />
    <div className="h-4 bg-lotteria-bg/50 rounded-full w-2/3" />
  </div>
);

export const MenuCardSkeletonGrid: React.FC<{ count?: number }> = ({ count = 8 }) => (
  <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6 sm:gap-8">
    {Array.from({ length: count }).map((_, i) => (
      <MenuCardSkeleton key={i} />
    ))}
  </div>
);

export const MenuRowSkeleton: React.FC = () => (
  <div className="bg-white rounded-3xl p-5 sm:p-6 shadow-sm border border-lotteria-yellow/10 flex gap-4 sm:gap-6 items-center animate-pulse">
    <div className="w-20 h-20 sm:w-32 sm:h-32 flex-shrink-0 bg-lotteria-bg/70 rounded-2xl" />
    <div className="flex-grow min-w-0">
      <div className="h-5 sm:h-6 bg-lotteria-bg/70 rounded-full w-2/3 mb-3" />
      <div className="h-3.5 bg-lotteria-bg/50 rounded-full w-full mb-2" />
      <div className="h-3.5 bg-lotteria-bg/50 rounded-full w-1/2" />
    </div>
  </div>
);

export const MenuRowSkeletonGrid: React.FC<{ count?: number }> = ({ count = 4 }) => (
  <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 sm:gap-8">
    {Array.from({ length: count }).map((_, i) => (
      <MenuRowSkeleton key={i} />
    ))}
  </div>
);

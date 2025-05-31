import React from 'react';
interface SkeletonLoaderProps {
    viewMode: 'grid' | 'list';
    count?: number;
}
export declare const ArtifactorySkeletonLoader: React.FC<SkeletonLoaderProps>;
export declare const StatsSkeletonLoader: React.FC;
export declare const SearchFiltersSkeleton: React.FC;
export {};

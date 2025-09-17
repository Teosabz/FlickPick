import { useEffect, useRef, useCallback } from 'react';
import { MovieCard, Movie } from './MovieCard';
import { LoadingSkeleton } from './LoadingSkeleton';

interface InfiniteMovieGridProps {
  movies: Movie[];
  favorites: Set<number>;
  onToggleFavorite: (movie: Movie) => void;
  onViewDetails: (movie: Movie) => void;
  onLoadMore: () => void;
  hasMore: boolean;
  loading: boolean;
  title?: string;
}

export function InfiniteMovieGrid({ 
  movies, 
  favorites, 
  onToggleFavorite, 
  onViewDetails, 
  onLoadMore,
  hasMore,
  loading,
  title 
}: InfiniteMovieGridProps) {
  const observerRef = useRef<IntersectionObserver | null>(null);
  const loadMoreRef = useRef<HTMLDivElement | null>(null);

  const handleObserver = useCallback((entries: IntersectionObserverEntry[]) => {
    const target = entries[0];
    if (target.isIntersecting && hasMore && !loading) {
      onLoadMore();
    }
  }, [hasMore, loading, onLoadMore]);

  useEffect(() => {
    if (observerRef.current) observerRef.current.disconnect();
    
    observerRef.current = new IntersectionObserver(handleObserver, {
      threshold: 0.1,
      rootMargin: '200px'
    });
    
    if (loadMoreRef.current) {
      observerRef.current.observe(loadMoreRef.current);
    }

    return () => {
      if (observerRef.current) {
        observerRef.current.disconnect();
      }
    };
  }, [handleObserver]);

  if (movies.length === 0 && !loading) {
    return (
      <div className="text-center py-12">
        <div className="w-24 h-24 mx-auto mb-4 rounded-full bg-gradient-to-r from-purple-400 to-pink-400 flex items-center justify-center">
          <span className="text-white text-2xl">🎬</span>
        </div>
        <p className="text-muted-foreground">No movies found.</p>
      </div>
    );
  }

  return (
    <section className="space-y-6">
      {title && (
        <div className="text-center space-y-2">
          <h2 className="text-3xl font-bold bg-gradient-to-r from-purple-400 via-pink-400 to-purple-400 bg-clip-text text-transparent">
            {title}
          </h2>
          <div className="w-24 h-1 bg-gradient-to-r from-purple-400 to-pink-400 mx-auto rounded-full"></div>
        </div>
      )}
      
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-6">
        {movies.map((movie) => (
          <MovieCard
            key={movie.id}
            movie={movie}
            isFavorite={favorites.has(movie.id)}
            onToggleFavorite={onToggleFavorite}
            onViewDetails={onViewDetails}
          />
        ))}
      </div>
      
      {/* Loading indicator for infinite scroll */}
      <div ref={loadMoreRef} className="w-full">
        {loading && <LoadingSkeleton />}
      </div>
      
      {/* End of results indicator */}
      {!hasMore && movies.length > 0 && (
        <div className="text-center py-8">
          <div className="inline-flex items-center px-4 py-2 rounded-full bg-gradient-to-r from-purple-500/20 to-pink-500/20 border border-purple-500/30">
            <span className="text-sm text-muted-foreground">🎭 You've reached the end of our movie collection</span>
          </div>
        </div>
      )}
    </section>
  );
}
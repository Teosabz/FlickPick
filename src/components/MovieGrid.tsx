import { MovieCard, Movie } from './MovieCard';

interface MovieGridProps {
  movies: Movie[];
  favorites: Set<number>;
  onToggleFavorite: (movie: Movie) => void;
  onViewDetails: (movie: Movie) => void;
  title?: string;
}

export function MovieGrid({ movies, favorites, onToggleFavorite, onViewDetails, title }: MovieGridProps) {
  if (movies.length === 0) {
    return (
      <div className="text-center py-12">
        <p className="text-muted-foreground">No movies found.</p>
      </div>
    );
  }

  return (
    <section className="space-y-6">
      {title && (
        <h2 className="text-2xl font-bold text-foreground">{title}</h2>
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
    </section>
  );
}
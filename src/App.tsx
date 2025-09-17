import { useState, useEffect, useCallback } from 'react';
import { Header } from './components/Header';
import { InfiniteMovieGrid } from './components/InfiniteMovieGrid';
import { MovieModal } from './components/MovieModal';
import { LoadingSkeleton } from './components/LoadingSkeleton';
import { Movie } from './components/MovieCard';
import { toast } from 'sonner@2.0.3';

export default function App() {
  const [allMovies, setAllMovies] = useState<Movie[]>([]);
  const [searchResults, setSearchResults] = useState<Movie[]>([]);
  const [favorites, setFavorites] = useState<Set<number>>(new Set());
  const [selectedMovie, setSelectedMovie] = useState<Movie | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const [searchLoading, setSearchLoading] = useState(false);
  const [currentView, setCurrentView] = useState<'home' | 'search' | 'favorites'>('home');
  const [searchQuery, setSearchQuery] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const [hasMore, setHasMore] = useState(true);
  const [movieCategories] = useState(['popular', 'top_rated', 'now_playing', 'upcoming']);
  const [currentCategoryIndex, setCurrentCategoryIndex] = useState(0);

  const TMDB_API_KEY = 'eyJhbGciOiJIUzI1NiJ9.eyJhdWQiOiJmNmU5YjdkOWViNjZkMTNjNWU0OWUxMzNiMDVmZmUxYiIsIm5iZiI6MTc1NzQ5MjU2Ni42NzEsInN1YiI6IjY4YzEzNTU2NGFjZmUxNGU4ZTFiZDg1MCIsInNjb3BlcyI6WyJhcGlfcmVhZCJdLCJ2ZXJzaW9uIjoxfQ.YP9mrZM_j14Z-5VXn7EJPC1p2g2s2shs8QU-fN_a-JM';

  useEffect(() => {
    loadFavoritesFromStorage();
    loadMoreMovies();
  }, []);

  const loadFavoritesFromStorage = () => {
    try {
      const storedFavorites = localStorage.getItem('flickpick-favorites');
      if (storedFavorites) {
        setFavorites(new Set(JSON.parse(storedFavorites)));
      }
    } catch (error) {
      console.error('Error loading favorites from storage:', error);
    }
  };

  const saveFavoritesToStorage = (newFavorites: Set<number>) => {
    try {
      localStorage.setItem('flickpick-favorites', JSON.stringify([...newFavorites]));
    } catch (error) {
      console.error('Error saving favorites to storage:', error);
    }
  };

  const fetchMoviesByCategory = async (category: string, page: number): Promise<Movie[]> => {
    try {
      const response = await fetch(
        `https://api.themoviedb.org/3/movie/${category}?language=en-US&page=${page}`,
        {
          headers: {
            'Authorization': `Bearer ${TMDB_API_KEY}`,
            'Content-Type': 'application/json'
          }
        }
      );
      
      if (!response.ok) {
        throw new Error(`Failed to fetch ${category} movies`);
      }
      
      const data = await response.json();
      return data.results || [];
    } catch (error) {
      console.error(`Error fetching ${category} movies:`, error);
      return [];
    }
  };

  const loadMoreMovies = useCallback(async () => {
    if (loading || !hasMore) return;
    
    setLoading(true);
    
    try {
      // Rotate through different categories to mix movie types
      const category = movieCategories[currentCategoryIndex];
      const movies = await fetchMoviesByCategory(category, currentPage);
      
      if (movies.length === 0) {
        // Move to next category if current one has no more movies
        const nextCategoryIndex = (currentCategoryIndex + 1) % movieCategories.length;
        setCurrentCategoryIndex(nextCategoryIndex);
        
        if (nextCategoryIndex === 0) {
          // If we've gone through all categories, check if we should continue
          if (currentPage > 10) {
            setHasMore(false);
            setLoading(false);
            return;
          }
        }
      } else {
        // Sort movies by release date (newest first) and mix with existing movies
        const sortedMovies = movies.sort((a, b) => 
          new Date(b.release_date || '').getTime() - new Date(a.release_date || '').getTime()
        );
        
        setAllMovies(prev => {
          // Remove duplicates and add new movies
          const existingIds = new Set(prev.map(m => m.id));
          const newMovies = sortedMovies.filter(movie => !existingIds.has(movie.id));
          const combined = [...prev, ...newMovies];
          
          // Sort the entire list by release date to maintain newest-to-oldest order
          return combined.sort((a, b) => 
            new Date(b.release_date || '').getTime() - new Date(a.release_date || '').getTime()
          );
        });
        
        // Move to next category for variety
        setCurrentCategoryIndex(prev => (prev + 1) % movieCategories.length);
        setCurrentPage(prev => prev + 1);
      }
    } catch (error) {
      console.error('Error loading more movies:', error);
      toast.error('Failed to load more movies.');
    }
    
    setLoading(false);
  }, [loading, hasMore, currentPage, currentCategoryIndex, movieCategories, TMDB_API_KEY]);

  const searchMovies = async (query: string) => {
    if (!query.trim()) return;
    
    setSearchLoading(true);
    setCurrentView('search');
    setSearchQuery(query);
    
    try {
      const response = await fetch(
        `https://api.themoviedb.org/3/search/movie?query=${encodeURIComponent(query)}&language=en-US&page=1`,
        {
          headers: {
            'Authorization': `Bearer ${TMDB_API_KEY}`,
            'Content-Type': 'application/json'
          }
        }
      );
      
      if (!response.ok) {
        throw new Error('Failed to search movies');
      }
      
      const data = await response.json();
      // Sort search results by release date (newest first)
      const sortedResults = (data.results || []).sort((a: Movie, b: Movie) => 
        new Date(b.release_date || '').getTime() - new Date(a.release_date || '').getTime()
      );
      setSearchResults(sortedResults);
    } catch (error) {
      console.error('Error searching movies:', error);
      toast.error('Failed to search movies. Please try again.');
      setSearchResults([]);
    }
    setSearchLoading(false);
  };

  const toggleFavorite = (movie: Movie) => {
    const newFavorites = new Set(favorites);
    
    if (favorites.has(movie.id)) {
      newFavorites.delete(movie.id);
      toast.success(`Removed "${movie.title}" from favorites`);
    } else {
      newFavorites.add(movie.id);
      toast.success(`Added "${movie.title}" to favorites`);
    }
    
    setFavorites(newFavorites);
    saveFavoritesToStorage(newFavorites);
  };

  const openMovieModal = (movie: Movie) => {
    setSelectedMovie(movie);
    setIsModalOpen(true);
  };

  const closeMovieModal = () => {
    setIsModalOpen(false);
    setSelectedMovie(null);
  };

  const showFavorites = () => {
    setCurrentView('favorites');
  };

  const showHome = () => {
    setCurrentView('home');
  };

  const getFavoriteMovies = () => {
    const combinedMovies = [...allMovies, ...searchResults];
    const favoriteMovies = combinedMovies.filter(movie => favorites.has(movie.id));
    // Remove duplicates and sort by release date
    const uniqueFavorites = favoriteMovies.filter((movie, index, self) => 
      index === self.findIndex(m => m.id === movie.id)
    );
    return uniqueFavorites.sort((a, b) => 
      new Date(b.release_date || '').getTime() - new Date(a.release_date || '').getTime()
    );
  };

  const renderCurrentView = () => {
    if (currentView === 'favorites') {
      const favoriteMovies = getFavoriteMovies();
      return (
        <InfiniteMovieGrid
          movies={favoriteMovies}
          favorites={favorites}
          onToggleFavorite={toggleFavorite}
          onViewDetails={openMovieModal}
          onLoadMore={() => {}} // No loading more for favorites
          hasMore={false}
          loading={false}
          title="Your Favorites"
        />
      );
    }

    if (currentView === 'search') {
      return (
        <InfiniteMovieGrid
          movies={searchResults}
          favorites={favorites}
          onToggleFavorite={toggleFavorite}
          onViewDetails={openMovieModal}
          onLoadMore={() => {}} // No infinite scroll for search results for now
          hasMore={false}
          loading={searchLoading}
          title={searchQuery ? `Search Results for "${searchQuery}"` : 'Search Results'}
        />
      );
    }

    // Default home view with infinite scroll
    return (
      <InfiniteMovieGrid
        movies={allMovies}
        favorites={favorites}
        onToggleFavorite={toggleFavorite}
        onViewDetails={openMovieModal}
        onLoadMore={loadMoreMovies}
        hasMore={hasMore}
        loading={loading}
        title="Discover Movies"
      />
    );
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900">
      <Header
        onSearch={searchMovies}
        onShowFavorites={showFavorites}
        onShowHome={showHome}
        favoritesCount={favorites.size}
        currentView={currentView}
      />
      
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Hero section for home view */}
        {currentView === 'home' && allMovies.length === 0 && !loading && (
          <div className="text-center py-20 mb-8">
            <div className="max-w-3xl mx-auto">
              <h1 className="text-4xl md:text-6xl font-bold mb-6 bg-gradient-to-r from-purple-400 via-pink-400 to-purple-400 bg-clip-text text-transparent">
                Discover Your Next
                <br />
                Favorite Movie
              </h1>
              <p className="text-xl text-purple-200 mb-8">
                Explore thousands of movies from all genres, sorted from newest to oldest
              </p>
              <div className="flex justify-center">
                <div className="animate-bounce">
                  <div className="w-6 h-10 border-2 border-purple-400 rounded-full flex justify-center">
                    <div className="w-1 h-3 bg-purple-400 rounded-full mt-2 animate-pulse"></div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}

        {renderCurrentView()}
      </main>

      <MovieModal
        movie={selectedMovie}
        isOpen={isModalOpen}
        onClose={closeMovieModal}
        isFavorite={selectedMovie ? favorites.has(selectedMovie.id) : false}
        onToggleFavorite={toggleFavorite}
      />
    </div>
  );
}
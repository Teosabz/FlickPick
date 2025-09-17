import { useEffect, useState } from 'react';
import { X, Star, Calendar, Clock, Heart, Play } from 'lucide-react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from './ui/dialog';
import { Button } from './ui/button';
import { Badge } from './ui/badge';
import { ScrollArea } from './ui/scroll-area';
import { ImageWithFallback } from './figma/ImageWithFallback';
import { Movie } from './MovieCard';

interface MovieDetails extends Movie {
  runtime?: number;
  genres?: { id: number; name: string }[];
  production_countries?: { name: string }[];
  spoken_languages?: { english_name: string }[];
  credits?: {
    cast: Array<{
      id: number;
      name: string;
      character: string;
      profile_path: string | null;
    }>;
  };
}

interface MovieModalProps {
  movie: Movie | null;
  isOpen: boolean;
  onClose: () => void;
  isFavorite: boolean;
  onToggleFavorite: (movie: Movie) => void;
}

export function MovieModal({ movie, isOpen, onClose, isFavorite, onToggleFavorite }: MovieModalProps) {
  const [movieDetails, setMovieDetails] = useState<MovieDetails | null>(null);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (movie && isOpen) {
      fetchMovieDetails(movie.id);
    }
  }, [movie, isOpen]);

  const fetchMovieDetails = async (movieId: number) => {
    setLoading(true);
    try {
      const response = await fetch(
        `https://api.themoviedb.org/3/movie/${movieId}?api_key=YOUR_TMDB_API_KEY&append_to_response=credits`,
        {
          headers: {
            'Authorization': 'Bearer eyJhbGciOiJIUzI1NiJ9.eyJhdWQiOiJmNmU5YjdkOWViNjZkMTNjNWU0OWUxMzNiMDVmZmUxYiIsIm5iZiI6MTc1NzQ5MjU2Ni42NzEsInN1YiI6IjY4YzEzNTU2NGFjZmUxNGU4ZTFiZDg1MCIsInNjb3BlcyI6WyJhcGlfcmVhZCJdLCJ2ZXJzaW9uIjoxfQ.YP9mrZM_j14Z-5VXn7EJPC1p2g2s2shs8QU-fN_a-JM'
          }
        }
      );
      const data = await response.json();
      setMovieDetails(data);
    } catch (error) {
      console.error('Error fetching movie details:', error);
      setMovieDetails(movie as MovieDetails);
    }
    setLoading(false);
  };

  if (!movie) return null;

  const details = movieDetails || movie;
  const backdropUrl = details.backdrop_path
    ? `https://image.tmdb.org/t/p/w1280${details.backdrop_path}`
    : null;
  const posterUrl = details.poster_path
    ? `https://image.tmdb.org/t/p/w500${details.poster_path}`
    : '/api/placeholder/300/450';

  const releaseYear = details.release_date ? new Date(details.release_date).getFullYear() : 'TBA';
  const rating = details.vote_average ? (details.vote_average / 10 * 5).toFixed(1) : 'N/A';
  const runtime = details.runtime ? `${Math.floor(details.runtime / 60)}h ${details.runtime % 60}m` : null;

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-4xl max-h-[90vh] p-0 overflow-hidden">
        <div className="relative">
          {backdropUrl && (
            <div className="relative h-64 md:h-80">
              <ImageWithFallback
                src={backdropUrl}
                alt={details.title}
                className="w-full h-full object-cover"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/40 to-transparent" />
            </div>
          )}
          
          <Button
            variant="ghost"
            size="sm"
            onClick={onClose}
            className="absolute top-4 right-4 bg-black/50 hover:bg-black/70 text-white rounded-full w-8 h-8 p-0"
          >
            <X className="w-4 h-4" />
          </Button>
        </div>

        <ScrollArea className="max-h-[60vh]">
          <div className="p-6 space-y-6">
            <div className="flex flex-col md:flex-row gap-6">
              <div className="flex-shrink-0">
                <ImageWithFallback
                  src={posterUrl}
                  alt={details.title}
                  className="w-48 h-72 object-cover rounded-lg mx-auto md:mx-0"
                />
              </div>
              
              <div className="flex-1 space-y-4">
                <DialogHeader>
                  <DialogTitle className="text-2xl md:text-3xl">{details.title}</DialogTitle>
                </DialogHeader>
                
                <div className="flex flex-wrap gap-4 items-center text-sm text-muted-foreground">
                  {details.vote_average > 0 && (
                    <div className="flex items-center gap-1">
                      <Star className="w-4 h-4 fill-yellow-400 text-yellow-400" />
                      <span>{rating}/5</span>
                    </div>
                  )}
                  
                  <div className="flex items-center gap-1">
                    <Calendar className="w-4 h-4" />
                    <span>{releaseYear}</span>
                  </div>
                  
                  {runtime && (
                    <div className="flex items-center gap-1">
                      <Clock className="w-4 h-4" />
                      <span>{runtime}</span>
                    </div>
                  )}
                </div>
                
                {details.genres && details.genres.length > 0 && (
                  <div className="flex flex-wrap gap-2">
                    {details.genres.map((genre) => (
                      <Badge key={genre.id} variant="secondary">
                        {genre.name}
                      </Badge>
                    ))}
                  </div>
                )}
                
                <div className="flex gap-2">
                  <Button
                    onClick={() => onToggleFavorite(movie)}
                    variant={isFavorite ? "default" : "outline"}
                    className="flex items-center gap-2"
                  >
                    <Heart className={`w-4 h-4 ${isFavorite ? 'fill-current' : ''}`} />
                    {isFavorite ? 'Remove from Favorites' : 'Add to Favorites'}
                  </Button>
                  
                  <Button variant="outline" className="flex items-center gap-2">
                    <Play className="w-4 h-4" />
                    Watch Trailer
                  </Button>
                </div>
              </div>
            </div>
            
            {details.overview && (
              <div className="space-y-2">
                <h3>Overview</h3>
                <p className="text-muted-foreground leading-relaxed">
                  {details.overview}
                </p>
              </div>
            )}
            
            {details.credits?.cast && details.credits.cast.length > 0 && (
              <div className="space-y-4">
                <h3>Cast</h3>
                <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
                  {details.credits.cast.slice(0, 8).map((actor) => (
                    <div key={actor.id} className="text-center space-y-2">
                      <ImageWithFallback
                        src={actor.profile_path 
                          ? `https://image.tmdb.org/t/p/w185${actor.profile_path}`
                          : '/api/placeholder/100/150'
                        }
                        alt={actor.name}
                        className="w-16 h-24 object-cover rounded-lg mx-auto"
                      />
                      <div>
                        <p className="font-medium text-sm">{actor.name}</p>
                        <p className="text-xs text-muted-foreground">{actor.character}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        </ScrollArea>
      </DialogContent>
    </Dialog>
  );
}
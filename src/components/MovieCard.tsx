import { Heart, Star, Calendar } from 'lucide-react';
import { Card, CardContent } from './ui/card';
import { Button } from './ui/button';
import { Badge } from './ui/badge';
import { ImageWithFallback } from './figma/ImageWithFallback';

export interface Movie {
  id: number;
  title: string;
  poster_path: string | null;
  overview: string;
  release_date: string;
  vote_average: number;
  genre_ids?: number[];
  backdrop_path?: string | null;
  runtime?: number;
  genres?: { id: number; name: string }[];
}

interface MovieCardProps {
  movie: Movie;
  isFavorite?: boolean;
  onToggleFavorite: (movie: Movie) => void;
  onViewDetails: (movie: Movie) => void;
}

export function MovieCard({ movie, isFavorite = false, onToggleFavorite, onViewDetails }: MovieCardProps) {
  const posterUrl = movie.poster_path
    ? `https://image.tmdb.org/t/p/w500${movie.poster_path}`
    : '/api/placeholder/300/450';

  const releaseYear = movie.release_date ? new Date(movie.release_date).getFullYear() : 'TBA';
  const rating = movie.vote_average ? (movie.vote_average / 10 * 5).toFixed(1) : 'N/A';

  return (
    <Card className="group cursor-pointer transition-all duration-300 hover:shadow-2xl hover:shadow-purple-500/20 hover:scale-105 bg-white/10 backdrop-blur-sm border-white/20 overflow-hidden">
      <CardContent className="p-0">
        <div className="relative overflow-hidden aspect-[2/3]">
          <ImageWithFallback
            src={posterUrl}
            alt={movie.title}
            className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
            onClick={() => onViewDetails(movie)}
          />
          
          {/* Gradient overlay on hover */}
          <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
          
          <div className="absolute top-3 right-3">
            <Button
              size="sm"
              variant={isFavorite ? "default" : "secondary"}
              className={`w-9 h-9 p-0 rounded-full backdrop-blur-sm transition-all duration-200 ${
                isFavorite 
                  ? 'bg-gradient-to-r from-pink-500 to-purple-500 hover:from-pink-600 hover:to-purple-600 shadow-lg' 
                  : 'bg-black/50 hover:bg-black/70 border-white/20'
              }`}
              onClick={(e) => {
                e.stopPropagation();
                onToggleFavorite(movie);
              }}
            >
              <Heart className={`w-4 h-4 transition-all ${isFavorite ? 'fill-white text-white scale-110' : 'text-white'}`} />
            </Button>
          </div>
          
          {movie.vote_average > 0 && (
            <div className="absolute top-3 left-3">
              <Badge className="bg-black/60 backdrop-blur-sm text-white border-yellow-400/30">
                <Star className="w-3 h-3 mr-1 fill-yellow-400 text-yellow-400" />
                {rating}
              </Badge>
            </div>
          )}
        </div>
        
        <div className="p-4 space-y-3 bg-gradient-to-b from-white/5 to-white/10">
          <h3 className="font-semibold line-clamp-2 min-h-[3rem] text-white group-hover:text-purple-200 transition-colors" title={movie.title}>
            {movie.title}
          </h3>
          
          <div className="flex items-center gap-2 text-sm text-purple-300">
            <Calendar className="w-4 h-4" />
            <span>{releaseYear}</span>
          </div>
          
          <p className="text-sm text-gray-300 line-clamp-3 leading-relaxed">
            {movie.overview || 'No description available.'}
          </p>
          
          <Button
            variant="outline"
            size="sm"
            className="w-full mt-3 bg-white/10 border-white/20 text-white hover:bg-white/20 hover:border-purple-400/50 transition-all duration-200"
            onClick={() => onViewDetails(movie)}
          >
            View Details
          </Button>
        </div>
      </CardContent>
    </Card>
  );
}
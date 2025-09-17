import { useState } from 'react';
import { Search, Film, Heart, Home, Sparkles, User } from 'lucide-react';
import { Button } from './ui/button';
import { Input } from './ui/input';

interface HeaderProps {
  onSearch: (query: string) => void;
  onShowFavorites: () => void;
  onShowHome: () => void;
  favoritesCount: number;
  currentView: string;
}

export function Header({ onSearch, onShowFavorites, onShowHome, favoritesCount, currentView }: HeaderProps) {
  const [searchQuery, setSearchQuery] = useState('');

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      onSearch(searchQuery);
    }
  };

  return (
    <header className="sticky top-0 z-50 w-full border-b bg-gradient-to-r from-slate-900 via-purple-900 to-slate-900 backdrop-blur supports-[backdrop-filter]:bg-gradient-to-r supports-[backdrop-filter]:from-slate-900/60 supports-[backdrop-filter]:via-purple-900/60 supports-[backdrop-filter]:to-slate-900/60">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <div className="flex items-center gap-3 cursor-pointer" onClick={onShowHome}>
            <div className="relative">
              <Film className="w-8 h-8 text-white" />
              <div className="absolute -top-1 -right-1 w-3 h-3 bg-gradient-to-r from-purple-400 to-pink-400 rounded-full animate-pulse"></div>
            </div>
            <div className="flex flex-col">
              <h1 className="text-xl font-bold bg-gradient-to-r from-purple-400 via-pink-400 to-purple-400 bg-clip-text text-transparent">
                FlickPick
              </h1>
              <span className="text-xs text-purple-300 -mt-1">Discover Cinema</span>
            </div>
          </div>
          
          {/* Navigation */}
          <nav className="hidden md:flex items-center space-x-1">
            <Button
              variant="ghost"
              onClick={onShowHome}
              className={`text-white hover:bg-white/10 transition-all duration-200 ${
                currentView === 'home' ? 'bg-white/20 text-purple-200' : ''
              }`}
            >
              <Home className="w-4 h-4 mr-2" />
              Discover
            </Button>
            
            <Button
              variant="ghost"
              onClick={onShowFavorites}
              className={`text-white hover:bg-white/10 transition-all duration-200 relative ${
                currentView === 'favorites' ? 'bg-white/20 text-purple-200' : ''
              }`}
            >
              <Heart className="w-4 h-4 mr-2" />
              Favorites
              {favoritesCount > 0 && (
                <span className="absolute -top-1 -right-1 bg-gradient-to-r from-pink-500 to-purple-500 text-white text-xs rounded-full h-5 w-5 flex items-center justify-center animate-pulse">
                  {favoritesCount}
                </span>
              )}
            </Button>
          </nav>
          
          {/* Search */}
          <form onSubmit={handleSearch} className="flex-1 max-w-md mx-4">
            <div className="relative group">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-purple-300 w-4 h-4 group-focus-within:text-purple-200 transition-colors" />
              <Input
                type="text"
                placeholder="Search for movies..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-10 bg-white/10 border-white/20 text-white placeholder:text-purple-300 focus:bg-white/20 focus:border-purple-400 transition-all duration-200 rounded-full"
              />
            </div>
          </form>
          
          {/* Mobile Menu */}
          <div className="flex md:hidden items-center space-x-2">
            <Button
              variant="ghost"
              size="sm"
              onClick={onShowHome}
              className={`text-white hover:bg-white/10 p-2 ${
                currentView === 'home' ? 'bg-white/20' : ''
              }`}
            >
              <Home className="w-4 h-4" />
            </Button>
            
            <Button
              variant="ghost"
              size="sm"
              onClick={onShowFavorites}
              className={`text-white hover:bg-white/10 p-2 relative ${
                currentView === 'favorites' ? 'bg-white/20' : ''
              }`}
            >
              <Heart className="w-4 h-4" />
              {favoritesCount > 0 && (
                <span className="absolute -top-1 -right-1 bg-gradient-to-r from-pink-500 to-purple-500 text-white text-xs rounded-full h-4 w-4 flex items-center justify-center">
                  {favoritesCount > 9 ? '9+' : favoritesCount}
                </span>
              )}
            </Button>
          </div>
        </div>
      </div>
      
      {/* Gradient border */}
      <div className="h-px bg-gradient-to-r from-transparent via-purple-500 to-transparent"></div>
    </header>
  );
}
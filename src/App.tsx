import { useCallback, useEffect, useState } from 'react';
import { SideBar } from './components/SideBar';
import { Content, Movie } from './components/Content';

import { api } from './services/api';

import './styles/global.scss';

import './styles/sidebar.scss';
import './styles/content.scss';

interface GenreResponseProps {
  id: number;
  name: 'action' | 'comedy' | 'documentary' | 'drama' | 'horror' | 'family';
  title: string;
}

export function App() {
  const [selectedGenreId, setSelectedGenreId] = useState(1);
  const [selectedGenre, setSelectedGenre] = useState<GenreResponseProps>({} as GenreResponseProps);
  const [genres, setGenres] = useState<GenreResponseProps[]>([]);
  const [movies, setMovies] = useState<Movie[]>([]);

  const handleClickButton = useCallback((id: number) =>  {
    setSelectedGenreId(id);
  }, [])

  useEffect(() => {
    Promise.all([
      api.get<GenreResponseProps>(`genres/${selectedGenreId}`),
      api.get<Movie[]>(`movies/?Genre_id=${selectedGenreId}`)])
      .then(([ genresResponse, movieResponse]) => {
        setSelectedGenre(genresResponse.data);
        setMovies(movieResponse.data);
      })
  }, [selectedGenreId]);
  
  useEffect(() => {
    api.get<GenreResponseProps[]>('genres').then(response => {
      setGenres(response.data);
    })
  }, []);

  return (
    <div style={{ display: 'flex', flexDirection: 'row' }}>
      <SideBar genres={genres} selectedGenreId={selectedGenreId} handleClickButton={handleClickButton}/>
      <Content movies={movies} selectedGenre={selectedGenre}/>
    </div>
  )
}
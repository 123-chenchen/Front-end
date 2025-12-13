import { Box, Button, CircularProgress, Typography } from '@mui/material';
import { useParams } from 'react-router-dom';
import { useTheme } from '@mui/material/styles';
import styles from './styles';
import { useGetActorQuery, useGetMoviesByActorIdQuery } from '../../services/TMDB';
import { MovieList } from '../index';

function Actors() {
  const theme = useTheme();
  const sx = styles(theme);
  const { id } = useParams();
  const { data, isFetching, error } = useGetActorQuery(id);
  const { data: movies } = useGetMoviesByActorIdQuery({ id, page: 1 });

  if (isFetching) {
    return (
      <Box><CircularProgress/></Box>
    );
  }

  if (error) {
    return (
      <Box display="flex" justifyContent="center">
         <Typography variant="h6">Something went wrong - Go back.</Typography>
      </Box>
    );
  }

  return (
    <>
      <Box sx={sx.layout}> 
        <img
          style={sx.image}
          src={`https://image.tmdb.org/t/p/w780/${data?.profile_path}`}
          alt={data.name}
        />
        <Box flex="1" >
          <Typography variant="h3" sx={{ fontWeight: "bold" }}>{data?.name}</Typography>
          <Typography variant="body1" sx={{ color: theme.palette.text.disabled }} gutterBottom>Born: {new Date(data?.birthday).toDateString()} ({new Date().getFullYear() - new Date(data?.birthday).getFullYear()} years old)</Typography>
          <Typography variant="body2" gutterBottom>{data?.biography || 'Sorry, no biography yet...'}</Typography>            
          <Button variant="contained" sx={sx.button} href={`https://www.imdb.com/name/${data?.imdb_id}`}>IMDB</Button>
        </Box>
      </Box>
      
        <Box sx={{ display: 'flex', gap: 1.5, my: 4}}>
          <Box sx={sx.line} />
          <Typography variant="h4">Movies</Typography>
        </Box>
          {movies && <MovieList movies={movies} />}
    
    </>
  );
}

export default Actors;

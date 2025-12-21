import { Divider,ListItem, ListItemIcon, ListItemText, ListSubheader, Typography,} from '@mui/material';
import { useTheme } from '@mui/material/styles';
import { useDispatch } from 'react-redux';
import { Link } from 'react-router-dom';

import genreIcons from '../../assets/genres';
import blueLogo from '../../assets/logo/bluelogo.png';
import redLogo from '../../assets/logo/redlogo.png';
import { selectGenreOrCategory } from '../../features/currentGenreOrCategory';
import { useGetGenresQuery } from '../../services/moviesApi';
import styles from './styles';

const categories = [
  { label: 'Popular', value: 'popular' },
  { label: 'Top Rated', value: 'top_rated' },
  { label: 'Upcoming', value: 'upcoming' },
];

function Sidebar() {
  const theme = useTheme();
  const sx = styles(theme);
  const dispatch = useDispatch();

  // backend returns: { genres: [{ id, name }] }
  const {
    data,
    isLoading,
    isError,
  } = useGetGenresQuery();

  const genres = Array.isArray(data?.genres)
    ? data.genres
    : Array.isArray(data)
      ? data
      : [];

  const logo = theme.palette.mode === 'light' ? blueLogo : redLogo;

  const handlePick = (value) => {
    dispatch(selectGenreOrCategory(value));
  };

  return (
    <>
      <Link to="/">
        <img style={sx.image} src={logo} alt="logo" />
      </Link>

      <Divider />

      {/* Categories */}
      <ListSubheader>Categories</ListSubheader>
      {categories.map(({ label, value }) => (
        <Link key={value} style={sx.links} to="/">
          <ListItem button onClick={() => handlePick(value)}>
            <ListItemIcon>
              <img
                src={genreIcons[label.toLowerCase()]}
                style={sx.genreImages}
                alt={label}
              />
            </ListItemIcon>
            <ListItemText primary={label} />
          </ListItem>
        </Link>
      ))}

      <Divider />

      {/* Genres */}
      <ListSubheader>Genres</ListSubheader>

      {isLoading && (
        <Typography sx={{ px: 2, py: 1 }} variant="body2">
          Loading genres...
        </Typography>
      )}

      {isError && (
        <Typography sx={{ px: 2, py: 1 }} variant="body2">
          Failed to load genres.
        </Typography>
      )}

      {!isLoading && !isError && genres.length === 0 && (
        <Typography sx={{ px: 2, py: 1 }} variant="body2">
          No genres found.
        </Typography>
      )}

      {genres.map((g) => {
        const name = g?.name ?? '';
        const id = g?.id;

        const iconKey = name.toLowerCase().replace(/\s+/g, '_');
        const iconSrc = genreIcons[iconKey] ?? genreIcons[name.toLowerCase()] ?? genreIcons.action;

        return (
          <Link key={id ?? name} style={sx.links} to="/">
            <ListItem button onClick={() => handlePick(id)}>
              <ListItemIcon>
                <img
                  src={iconSrc}
                  style={sx.genreImages}
                  alt={name}
                />
              </ListItemIcon>
              <ListItemText primary={name} />
            </ListItem>
          </Link>
        );
      })}
    </>
  );
}

export default Sidebar;
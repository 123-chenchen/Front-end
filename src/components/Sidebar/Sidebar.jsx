import { Divider, ListItem, ListItemIcon, ListItemText, ListSubheader } from '@mui/material';
import { useTheme } from '@mui/material/styles';
import { useDispatch } from 'react-redux';
import { Link } from 'react-router-dom';

import genreIcons from '../../assets/genres';
import blueLogo from '../../assets/logo/3.png';
import redLogo from '../../assets/logo/4.png';
import { selectGenreOrCategory } from '../../features/currentGenreOrCategory';
import { useGetGenresQuery } from '../../services/TMDB';
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
  const { data } = useGetGenresQuery();

  const logo = theme.palette.mode === 'light' ? blueLogo : redLogo;

  return (
    <>
      {/* Logo */}
      <Link to="/">
        <img style={sx.image} src={logo} alt="" />
      </Link>

      <Divider />

      {/* Categories */}
      <ListSubheader>Categories</ListSubheader>
      {categories.map(({ label, value }) => (
        <Link key={value} style={sx.links} to="/">
          <ListItem button onClick={() => dispatch(selectGenreOrCategory(value))}>
            <ListItemIcon>
              <img src={genreIcons[label.toLowerCase()]} style={sx.genreImages} alt={label} />
            </ListItemIcon>
            <ListItemText primary={label} />
          </ListItem>
        </Link>
      ))}

      <Divider />

      {/* Genres */}
      <ListSubheader>Genres</ListSubheader>
      {data?.genres?.map(({ name, id }) => (
        <Link key={name} style={sx.links} to="/">
          <ListItem button onClick={() => dispatch(selectGenreOrCategory(id))}>
            <ListItemIcon>
              <img src={genreIcons[name.toLowerCase()]} style={sx.genreImages} alt={name} />
            </ListItemIcon>
            <ListItemText primary={name} />
          </ListItem>
        </Link>
      ))}
    </>
  );
}

export default Sidebar;

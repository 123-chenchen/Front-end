import React, { useEffect } from 'react';
import {
  Divider,
  List,
  ListItem,
  ListItemText,
  ListSubheader,
  ListItemIcon,
  Box,
  CircularProgress,
} from '@mui/material';
import { Link } from 'react-router-dom';
import { useTheme } from '@mui/material/styles';
import { useDispatch, useSelector } from 'react-redux';

import styles from './styles';
import { useGetGenresQuery } from '../../services/TMDB';
import { selectGenreOrCategory } from '../../features/currentGenreOrCategory';
import genreIcons from '../../assets/genres';

// ⚠️ SỬA ĐƯỜNG DẪN LOGO THÀNH assets
// Giả sử file nằm ở: src/assets/logo/Filmpire.jpg
import redLogo from '../../assets/logo/Filmpire.jpg';
import blueLogo from '../../assets/logo/Filmpire.jpg';
// Nếu sau này bạn có 2 file khác nhau, chỉ cần đổi tên file và đường dẫn là được

const categories = [
  { label: 'Popular', value: 'popular' },
  { label: 'Top Rated', value: 'top_rated' },
  { label: 'Upcoming', value: 'upcoming' },
];

function Sidebar({ setMobileOpen }) {
  const theme = useTheme();
  const sx = styles(theme);
  const dispatch = useDispatch();
  const { data, isFetching } = useGetGenresQuery();
  const { genreIdOrCategoryName } = useSelector(
    (state) => state.currentGenreOrCategory,
  );

  useEffect(() => {
    // Đóng sidebar mobile khi đổi category / genre
    setMobileOpen(false);
  }, [genreIdOrCategoryName, setMobileOpen]);

  const logo = theme.palette.mode === 'light' ? redLogo : blueLogo;

  return (
    <>
      {/* Logo */}
      <Link to="/" style={sx.imageLink}>
        <img
          style={sx.image}
          src={logo}
          alt="Filmpire Logo"
        />
      </Link>

      <Divider />

      {/* Categories */}
      <List>
        <ListSubheader>Categories</ListSubheader>
        {categories.map(({ label, value }) => (
          <Link key={value} style={sx.links} to="/">
            <ListItem
              button
              onClick={() => dispatch(selectGenreOrCategory(value))}
            >
              <ListItemIcon>
                <img
                  src={genreIcons[label.toLowerCase()]}
                  style={sx.genreImages}
                  height={30}
                  alt={label}
                />
              </ListItemIcon>
              <ListItemText primary={label} />
            </ListItem>
          </Link>
        ))}
      </List>

      <Divider />

      {/* Genres */}
      <List>
        <ListSubheader>Genres</ListSubheader>
        {isFetching ? (
          <Box display="flex" justifyContent="center">
            <CircularProgress size="4rem" />
          </Box>
        ) : (
          data?.genres?.map(({ name, id }) => (
            <Link key={name} style={sx.links} to="/">
              <ListItem
                button
                onClick={() => dispatch(selectGenreOrCategory(id))}
              >
                <ListItemIcon>
                  <img
                    src={genreIcons[name.toLowerCase()]}
                    style={sx.genreImages}
                    height={30}
                    alt={name}
                  />
                </ListItemIcon>
                <ListItemText primary={name} />
              </ListItem>
            </Link>
          ))
        )}
      </List>
    </>
  );
}

export default Sidebar;

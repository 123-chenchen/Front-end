import React from 'react';
import { Helmet } from 'react-helmet';

export const MovieSEO = ({ title, description, image, movieId }) => (
  <Helmet>
    <title>{title} - Recomovie</title>
    <meta name="description" content={description} />
    <meta property="og:title" content={title} />
    <meta property="og:description" content={description} />
    <meta property="og:image" content={image} />
    <meta property="og:url" content={`${window.location.origin}/movie/${movieId}`} />
    <meta property="og:type" content="website" />
    <meta name="twitter:card" content="summary_large_image" />
    <meta name="twitter:title" content={title} />
    <meta name="twitter:description" content={description} />
    <meta name="twitter:image" content={image} />
    <link rel="canonical" href={`${window.location.origin}/movie/${movieId}`} />
  </Helmet>
);

export const ActorSEO = ({ name, description, image, actorId }) => (
  <Helmet>
    <title>{name} - Recomovie</title>
    <meta name="description" content={description} />
    <meta property="og:title" content={name} />
    <meta property="og:description" content={description} />
    <meta property="og:image" content={image} />
    <meta property="og:url" content={`${window.location.origin}/actors/${actorId}`} />
    <meta property="og:type" content="profile" />
    <meta name="twitter:card" content="summary_large_image" />
    <meta name="twitter:title" content={name} />
    <meta name="twitter:description" content={description} />
    <meta name="twitter:image" content={image} />
    <link rel="canonical" href={`${window.location.origin}/actors/${actorId}`} />
  </Helmet>
);

export const GenreSEO = ({ genre, page = 1 }) => (
  <Helmet>
    <title>{genre} Movies - Recomovie</title>
    <meta name="description" content={`Browse ${genre} movies on Recomovie. Discover ratings, reviews, and recommendations.`} />
    <meta property="og:title" content={`${genre} Movies - Recomovie`} />
    <meta property="og:description" content={`Browse ${genre} movies on Recomovie.`} />
    <meta property="og:url" content={`${window.location.origin}/genres/${genre}?page=${page}`} />
    <meta property="og:type" content="website" />
    <meta name="twitter:card" content="summary" />
    <link rel="canonical" href={`${window.location.origin}/genres/${genre}?page=${page}`} />
  </Helmet>
);

export const DefaultSEO = () => (
  <Helmet>
    <title>Recomovie - Movie Recommendations & Reviews</title>
    <meta name="description" content="Discover movies, read reviews, and get personalized movie recommendations on Recomovie." />
    <meta property="og:title" content="Recomovie - Movie Recommendations & Reviews" />
    <meta property="og:description" content="Discover movies, read reviews, and get personalized movie recommendations." />
    <meta property="og:url" content={window.location.origin} />
    <meta property="og:type" content="website" />
    <meta name="twitter:card" content="summary" />
    <link rel="canonical" href={window.location.origin} />
  </Helmet>
);

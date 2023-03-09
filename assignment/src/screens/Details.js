import React, { useState } from 'react';
import {
  ScrollView,
  View,
  Text,
  Image,
  StyleSheet,
  Pressable,
  Modal,
} from 'react-native';
import { v4 as uuidv4 } from 'uuid';
import {
  useFetchMovieByIdQuery,
  useFetchMovieImagesQuery,
  useFetchRelatedMoviesQuery,
} from '../services/movies';

const Details = ({ route, navigation }) => {
  const { movieId } = route.params;
  const { data: movie, isLoading } = useFetchMovieByIdQuery(movieId);
  const { data: movieImages, isLoading: isMovieImagesLoading } =
    useFetchMovieImagesQuery(movieId);
  const { data: relatedMovies, isLoading: isRelatedMovieLoading } =
    useFetchRelatedMoviesQuery(movieId);
  const [showModal, setShowModal] = useState(false);

  const goToDetails = id => {
    navigation.push('Details', { movieId: id });
  };

  const handleShowMovieImages = () => {
    console.log(1);
    console.log(movieImages?.posters);
    if (movieImages && movieImages?.posters?.length > 0) {
      setShowModal(true);
    }
  };

  const renderShowMovieImages = () => {
    return (
      <Modal
        visible={showModal}
        transparent
        onRequestClose={() => setShowModal(false)}
        animationType="slide"
        hardwareAccelerated>
        <View style={styles.modal}>
          <View style={styles.modalImages}>
            {movieImages?.posters?.map(poster => (
              <View key={uuidv4()}>
                <Image
                  style={styles.image}
                  source={{
                    uri: `https://image.tmdb.org/t/p/w500${poster?.file_path}`,
                  }}
                  resizeMode="stretch"
                />
                <Text>{poster.title}</Text>
              </View>
            ))}
          </View>
          <Pressable onPress={() => setShowModal(false)}>
            <Text>Close</Text>
          </Pressable>
        </View>
      </Modal>
    );
  };

  const renderRelatedMovieList = () => {
    if (!relatedMovies || relatedMovies?.results?.length === 0) {
      return <Text>No related movies found.</Text>;
    }

    return relatedMovies?.results?.map(relatedMovie => (
      <View key={relatedMovie.id} style={styles.movieContainer}>
        <Pressable onPress={() => goToDetails(relatedMovie.id)}>
          <Image
            style={styles.image}
            source={{
              uri: `https://image.tmdb.org/t/p/w500${relatedMovie?.poster_path}`,
            }}
            resizeMode="stretch"
          />
          <Text>{relatedMovie.title}</Text>
        </Pressable>
      </View>
    ));
  };

  if (isLoading || isRelatedMovieLoading || isMovieImagesLoading) {
    return <Text>...Loading</Text>;
  }

  return (
    <ScrollView>
      {renderShowMovieImages()}
      <View>
        <Text>{movie.tagline}</Text>
        <Pressable onPress={() => handleShowMovieImages()}>
          <Image
            style={styles.image}
            source={{
              uri: `https://image.tmdb.org/t/p/w500${movie?.poster_path}`,
            }}
            resizeMode="stretch"
          />
        </Pressable>
      </View>
      <View>
        <View>
          <Text>{movie.title}</Text>
        </View>
      </View>
      <View>
        <View>
          <Text>Rating</Text>
          <Text>{movie.rating}</Text>
        </View>
        <View>
          <Text>Overview</Text>
          <Text>{movie.overview}</Text>
        </View>
      </View>
      <Text>Related Movies:</Text>
      <View>{renderRelatedMovieList()}</View>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  modal: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#cbd5e1',
  },
  modalImages: {
    flexDirection: 'row',
  },
  image: {
    width: 100,
    height: 100,
  },
});

export default Details;

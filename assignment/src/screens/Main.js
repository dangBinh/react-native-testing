/* eslint-disable prettier/prettier */
import React, { useEffect, useState } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import {
  View,
  Text,
  TextInput,
  StyleSheet,
  ScrollView,
  Pressable,
  Keyboard,
  Image,
  RefreshControl,
} from 'react-native';
import Animated, { FadeIn, FadeOut } from 'react-native-reanimated';

import {
  setSearchQuery,
  addSearchQuery,
  removeSearchQuery,
} from '../store/movies';
import { useSearchMovieQuery } from '../services/movies';

const Main = ({ navigation }) => {
  const dispatch = useDispatch();
  const [movies, setMovies] = useState([]);
  const [currentTerm, setCurrentTerm] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const [currentQueryString, setCurrentQueryString] = useState('');
  const [refreshing, setRefreshing] = useState(false);
  const query = useSelector(state => state?.movies?.query);
  const searches = useSelector(state => state?.movies?.searches);
  const { data, isLoading, refetch } = useSearchMovieQuery(currentQueryString);

  const handleOnPress = () => {
    Keyboard.dismiss();
    if (query !== '') {
      setCurrentTerm(query);
      dispatch(setSearchQuery(''));
      dispatch(addSearchQuery(query));
      setCurrentQueryString(`page=1&query=${query}`);
      refetch();
    }
  };

  const removeSearch = index => {
    dispatch(removeSearchQuery(index));
  };

  const renderLastFiveSearches = () => {
    if (!searches || searches?.length === 0) {
      return null;
    }

    return searches.map((item, index) => (
      <Animated.View
        key={item.id}
        entering={FadeIn.duration(400)}
        exiting={FadeOut.duration(400)}>
        <Text>{item?.keyword}</Text>
        <Text onPress={() => removeSearch(index)}> x</Text>
      </Animated.View>
    ));
  };

  const goToDetails = (id) => {
    navigation.navigate('Details', id);
  };

  const renderMovieList = () => {
    if (isLoading) {
      return (
        <View>
          <Text>Loading...</Text>
        </View>
      );
    }

    if (!movies || movies.length === 0) {
      return (
        <View>
          <Text>No movies found</Text>
        </View>
      );
    }

    return movies?.map(movie => (
      <View key={movie.id}>
        <Pressable onPress={() => goToDetails({ movieId: movie.id })}>
          <View style={styles.movie}>
            <View>
              <Image
                style={styles.image}
                source={{
                  uri: `https://image.tmdb.org/t/p/w500${movie?.poster_path}`,
                }}
                resizeMode="stretch"
              />
            </View>
            <View>
              <Text>{movie?.title}</Text>
              <Text>Release Date: {movie?.release_date}</Text>
              <Text>{movie?.overview}</Text>
            </View>
          </View>
        </Pressable>
      </View>
    ));
  };

  const loadMore = nativeEvent => {
    if (!refreshing && onEndReached(nativeEvent)) {
      const nextPage = currentPage + 1;
      if (nextPage <= data?.total_pages) {
        setCurrentQueryString(`page=${nextPage}&query=${currentTerm}`);
        refetch();
      }
    }
  };

  const onEndReached = ({ layoutMeasurement, contentOffset, contentSize }) => {
    const paddingToBottom = 20;
    return (
      contentOffset.y >= 0 &&
      layoutMeasurement.height + contentOffset.y >=
      contentSize.height - paddingToBottom
    );
  };

  const onRefresh = () => {
    setRefreshing(true);
    setMovies([]);
    setCurrentQueryString(`page=1&query=${currentTerm}`);
    refetch();
    setRefreshing(false);
  };

  useEffect(() => {
    if (data && data?.results?.length > 0) {
      setMovies(current => current.concat(data?.results));
      setCurrentPage(data?.page ?? 1);
    }
  }, [data]);

  return (
    <ScrollView
      onScroll={({ nativeEvent }) => loadMore(nativeEvent)}
      refreshControl={
        <RefreshControl
          refreshing={refreshing}
          onRefresh={onRefresh}
          colors={['#0f172a']}
        />
      }
      scrollEventThrottle={16}
      keyboardShouldPersistTaps={'handled'}
      style={styles.body}>
      <View>
        <TextInput
          style={styles.input}
          placeholder="Enter movie name"
          onChangeText={value => dispatch(setSearchQuery(value))}
          value={query}
        />
        <Pressable
          onPress={handleOnPress}
          hitSlop={{ top: 10, bottom: 10, right: 10, left: 10 }}>
          <Text>Search</Text>
        </Pressable>
      </View>
      <View>{renderLastFiveSearches(searches)}</View>
      <View>{renderMovieList()}</View>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  input: {
    width: 250,
    height: 40,
    borderWidth: 1,
    borderColor: '#0f172a',
    borderRadius: 5,
    textAlign: 'center',
    fontSize: 14,
    marginBottom: 10,
  },
  body: {},
  movie: {
    flex: 1,
  },
  image: {
    width: 100,
    height: 100,
  },
});

export default Main;

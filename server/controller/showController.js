import http from '../utils/http.js';
import Movie from '../models/Movie.js';
import Show from '../models/Show.js';

export const getNowPlayingMovies = async (req, res) => {
  try {
    const { data } = await http.get('/3/movie/now_playing');
    console.log(data);
    return res.json({ success: true, result: data });
  } catch (e) {
    console.log(e.message);
    return res.json({ success: false, result: e.message });
  }
};

export const addShow = async (req, res) => {
  try {
    const { movieId, showsInput, showPrice } = req.body;
    let movie = await Movie.findById(movieId);
    if (!movie) {
      const [movieDetailResponse, movieCreditResponse] = await Promise.all([
        await http.get(`/3/movie/${movieId}`),
        await http.get(`/3/movie/${movieId}/credits`),
      ]);

      const movieApiData = movieDetailResponse.data;
      const movieCreditsData = movieCreditResponse.data;

      const movieDetail = {
        _id: movieId,
        title: movieApiData.title,
        overview: movieApiData.overview,
        poster_path: movieApiData.poster_path,
        backdrop_path: movieApiData.backdrop_path,
        genres: movieApiData.genres,
        casts: movieCreditsData.cast,
        release_date: movieApiData.release_date,
        original_language: movieApiData.original_language,
        tagline: movieApiData.tagline || '',
        vote_average: movieApiData.vote_average,
        runtime: movieApiData.runtime,
      };
      await Movie.create(movieDetail);
    }

    const showToCreate = [];
    showsInput.forEach((show) => {
      const showDate = show.date;
      show.time.forEach((time) => {
        const dateTimeString = `${showDate}T${time}`;
        showToCreate.push({
          movie: movieId,
          showDateTime: new Date(dateTimeString),
          showPrice,
          occupiedSeats: {}, // Initialize with empty object
        });
      });
    });

    if (showToCreate.length > 0) {
      await Show.insertMany(showToCreate);
    }

    return res.json({ success: true, message: 'Show Added successfully.' });
  } catch (e) {
    console.log(e.message);
    return res.json({ success: false, result: e.message });
  }
};

export const getShows = async (req, res) => {
  try {
    const shows = await Show.find({ showDateTime: { $gte: new Date() } })
      .populate('movie')
      .sort({ showDateTime: 1 });

    const uniqueShows = new Set(shows.map((show) => show.movie));
    return res.json({ success: true, result: Array.from(uniqueShows) });
  } catch (e) {
    console.log(e.message);
    return res.json({ success: false, result: e.message });
  }
};

export const getShow = async (req, res) => {
  try {
    const { movieId } = req.params;
    const shows = await Show.find({
      movie: movieId,
      showDateTime: { $gte: new Date() },
    });

    const movie = await Movie.findById(movieId);
    const dateTime = {};

    shows.forEach((show) => {
      const date = show.showDateTime.toISOString().split('T')[0];
      if (!dateTime[date]) {
        dateTime[date] = [];
      }

      dateTime[date].push({ time: show.showDateTime, showId: show._id });
    });

    res.json({ success: true, result: movie, dateTime });
  } catch (e) {
    console.log(e.message);
    return res.json({ success: false, result: e.message });
  }
};

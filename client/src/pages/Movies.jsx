import React from 'react';
import MovieCard from '../components/MovieCard.jsx';
import BlurCircle from '../components/BlurCricle.jsx';
import { useAppContext } from '../context/AppContext.jsx';
import Loading from '../components/Loading.jsx';

const Movies = () => {
  const { shows } = useAppContext();
  return shows ? (
    <div className='relative my-40 px-6 mb-60 md:px-16 lg:px-40 xl:px-40 overflow-hidden min-h-[80vh]'>
      <BlurCircle
        top='150px'
        left='0px'
      />
      <BlurCircle
        bottom='50px'
        right='50px'
      />
      <h1 className='text-gray-300 text-lg font-medium my-4'>Now showing</h1>
      <div className='flex flex-wrap gap-8 max-sm:justify-center'>
        {shows.map((movie, index) => (
          <MovieCard
            key={index}
            movie={movie}
          />
        ))}
      </div>
    </div>
  )
    : (
      <Loading />
    )
};

export default Movies;

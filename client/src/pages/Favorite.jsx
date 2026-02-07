import React from 'react';
import { dummyShowsData } from '../assets/assets';
import MovieCard from '../components/MovieCard.jsx';
import BlurCircle from '../components/BlurCricle.jsx';

const Favorite = () => {
  return (
    <div className='relative my-40 px-6 mb-60 md:px-16 lg:px-40 xl:px-44 overflow-hidden min-h-[80vh]'>
      <BlurCircle
        top='150px'
        left='0px'
      />
      <BlurCircle
        bottom='50px'
        right='50px'
      />
      <h1 className='text-gray-300 text-lg font-medium my-4'>Your favorite movies</h1>
      <div className='flex flex-wrap gap-8 max-sm:justify-center'>
        {dummyShowsData.map((movie) => (
          <MovieCard
            key={movie.id}
            movie={movie}
          />
        ))}
      </div>
    </div>
  );
};

export default Favorite;

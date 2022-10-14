import React from 'react';
import spinner2 from './assets/spinner2.gif';

function Spinner() {
  return (
    <div className="w-100 mt-20">
      <img
        width={180}
        className="text-center mx-auto"
        src={spinner2}
        alt="Loading..."
      />
    </div>
  );
}

export default Spinner;

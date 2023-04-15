import React, { useEffect, useState } from 'react';

const GeneratedImage = ({ src }) => {
  const [imageUrl, setImageUrl] = useState(src);
  const placeholderImageUrl = 'https://picsum.photos/800/800';

  useEffect(() => {
    setImageUrl(src);
  }, [src]);

  return (
    <img
      src={imageUrl || placeholderImageUrl}
      alt="Generated content"
      className="w-full h-auto mt-4 rounded-md shadow-md"
      key={imageUrl} // Add this line to force re-render the image
    />
  );
};

export default GeneratedImage;

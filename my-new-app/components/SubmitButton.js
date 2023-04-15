import React from 'react';

const SubmitButton = ({ prompt, onSubmit }) => {
  return (
    <button
      onClick={() => onSubmit(prompt)}
      className="bg-blue-500 text-white px-4 py-2 rounded-md mt-4"
    >
      Generate Image
    </button>
  );
};

export default SubmitButton;

import React from 'react';

const Popup = ({ message, onClose }) => {
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50">
      <div className="rounded-lg bg-white p-6 shadow-lg">
        <h2 className="mb-4 text-xl font-semibold">Notification</h2>
        <p className="mb-4">{message}</p>
        <button
          onClick={onClose}
          className="mt-4 rounded bg-primary px-4 py-2 text-white hover:bg-primary-dark"
        >
          Close
        </button>
      </div>
    </div>
  );
};

export default Popup;

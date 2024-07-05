function Modal2({ children, onClose }: { children: React.ReactNode, onClose: () => void }) {
  return (
    <div className="fixed inset-0 z-50 overflow-y-auto flex items-center justify-center">
      <div className="absolute inset-0 bg-gray-500 bg-opacity-75" onClick={onClose}></div>
      <div className="relative bg-white rounded-lg p-4 md:p-8 max-w-xl w-full max-h-screen h-full overflow-y-auto">
        <button
          className="absolute top-0 right-0 text-gray-500 hover:text-red-500 p-2"
          onClick={onClose}
        >
          <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
          </svg>
        </button>
        <div className="mt-2">
          {children}
        </div>
      </div>
    </div>
  );
}

export default Modal2;

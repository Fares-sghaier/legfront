const ProgressBar = ({ progress }) => {
  return (
    <div className="w-full h-2 bg-gray-200 rounded overflow-hidden">
      <div
        className="h-full bg-primary"
        style={{ width: `${progress}%` }}
      ></div>
    </div>
  );
};
export default ProgressBar;

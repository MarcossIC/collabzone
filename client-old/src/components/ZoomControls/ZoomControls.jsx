const ZoomControls = ({ zoomIn, zoomOut }) => {
  return (
    <div className="flex h-[182px] w-[60px] flex-col items-center justify-around rounded-4xl border border-black bg-white shadow-drop">
      <button
        onClick={zoomIn}
        className="rounded-full p-1 hover:bg-primary-200 active:border active:border-primary-400 active:bg-primary-300">
        <img src="/svg/icon-zoom/search-zoom-in.svg" alt="Zoom In" className="h-6" />
      </button>
      <button
        onClick={zoomOut}
        className="rounded-full p-1 hover:bg-primary-200 active:border active:border-primary-400 active:bg-primary-300">
        <img
          src="/svg/icon-zoom/search-zoom-out.svg"
          alt="Zoom Out"
          className="h-6"
        />
      </button>
    </div>
  );
};

export default ZoomControls;

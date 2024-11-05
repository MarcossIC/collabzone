export const EmptyTab = ({ text, img }) => {
  return (
    <div className="mt-12 flex w-full flex-col items-center justify-center gap-y-4 opacity-60">
      <span className="text-nowrap text-center font-medium">{text}</span>
      <img
        src={img}
        decoding="async"
        loading="lazy"
        itemProp="image"
        width={68}
        height={68}
        className="aspect-square object-cover object-center brightness-0 contrast-0"
      />
    </div>
  );
};

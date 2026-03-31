// src/components/Skeleton.jsx
const Skeleton = ({ count = 1 }) => {
  return (
    <>
      {Array.from({ length: count }).map((_, i) => (
        <div key={i} className="animate-pulse">
          <div className="aspect-video bg-gray-300 rounded-xl"></div>
          <div className="flex gap-3 mt-3">
            <div className="w-9 h-9 bg-gray-300 rounded-full flex-shrink-0"></div>
            <div className="flex-1">
              <div className="h-4 bg-gray-300 rounded w-[85%] mb-2"></div>
              <div className="h-3 bg-gray-300 rounded w-[60%] mb-2"></div>
              <div className="h-3 bg-gray-300 rounded w-[40%]"></div>
            </div>
          </div>
        </div>
      ))}
    </>
  );
};

export default Skeleton;

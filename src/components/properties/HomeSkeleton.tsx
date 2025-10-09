const HomeSkeleton = () => {
  // mimic 6 loading cards
  const skeletonItems = Array(6).fill(0);

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-10 mt-10 animate-pulse">
      {skeletonItems.map((_, index) => (
        <div
          key={index}
          className="bg-white rounded-2xl shadow-md overflow-hidden"
        >
          {/* Image Placeholder */}
          <div className="h-48 bg-gray-200 w-full"></div>

          {/* Content */}
          <div className="p-4 space-y-3">
            <div className="h-5 bg-gray-200 rounded w-3/4"></div>
            <div className="h-4 bg-gray-200 rounded w-1/2"></div>
            <div className="h-4 bg-gray-200 rounded w-full"></div>

            {/* Bottom Section */}
            <div className="flex justify-between items-center pt-2">
              <div className="h-4 bg-gray-200 rounded w-1/3"></div>
              <div className="h-4 bg-gray-200 rounded w-10"></div>
            </div>
          </div>
        </div>
      ))}
    </div>
  );
};

export default HomeSkeleton;

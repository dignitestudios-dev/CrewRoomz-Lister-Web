export default function PropertyHeaderSkeleton() {
  return (
    <div className="animate-pulse space-y-6">
      {/* Header */}
      {/* <div className="flex justify-between items-center mb-6">
        <div className="flex gap-3 items-center">
          <div className="w-5 h-5 rounded-md bg-gray-300"></div>
          <div className="h-7 w-40 bg-gray-300 rounded-md"></div>
        </div>
        <div className="flex gap-4">
          <div className="h-9 w-24 bg-gray-300 rounded-3xl"></div>
          <div className="h-9 w-24 bg-gray-300 rounded-3xl"></div>
        </div>
      </div> */}

      {/* Main Layout */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 bg-white p-6 rounded-2xl">
        {/* Image Gallery */}
        <div className="md:col-span-2">
          <div className="h-64 w-full bg-gray-300 rounded-xl"></div>
          <div className="flex gap-3 mt-3">
            <div className="h-20 w-28 bg-gray-300 rounded-md"></div>
            <div className="h-20 w-28 bg-gray-300 rounded-md"></div>
            <div className="h-20 w-28 bg-gray-300 rounded-md"></div>
          </div>
        </div>

        {/* Property Details Section */}
        <div className="bg-white p-6 w-full rounded-xl ">
          <div className="flex justify-between items-center">
            <div className="h-7 w-36 bg-gray-300 rounded-md"></div>
            <div className="h-7 w-20 bg-gray-300 rounded-md"></div>
          </div>

          <div className="h-5 w-48 bg-gray-300 rounded-md mt-3"></div>
          <div className="h-5 w-32 bg-gray-300 rounded-md mt-2"></div>

          <div className="mt-5 space-y-3">
            <div className="h-5 w-full bg-gray-300 rounded-md"></div>
            <div className="h-5 w-3/4 bg-gray-300 rounded-md"></div>
            <div className="h-5 w-1/2 bg-gray-300 rounded-md"></div>
          </div>

          <div className="mt-6">
            <div className="h-6 w-40 bg-gray-300 rounded-md mb-2"></div>
            <div className="space-y-2">
              <div className="h-4 w-full bg-gray-300 rounded-md"></div>
              <div className="h-4 w-2/3 bg-gray-300 rounded-md"></div>
            </div>
          </div>
        </div>

        {/* Sidebar (Tenant/Landlord Info) */}
        <div className="bg-[#F3F8FF] w-full rounded-2xl p-6 space-y-4">
          {/* Landlord Card */}
          <div className="bg-gray-300 h-32 w-full rounded-2xl"></div>
          <div className="h-5 w-3/4 bg-gray-300 rounded-md"></div>
          <div className="h-5 w-2/3 bg-gray-300 rounded-md"></div>

          {/* Documents */}
          <div className="space-y-3 mt-4">
            <div className="h-10 w-full bg-gray-300 rounded-xl"></div>
            <div className="h-10 w-full bg-gray-300 rounded-xl"></div>
            <div className="h-10 w-full bg-gray-300 rounded-xl"></div>
          </div>

          {/* Lease Actions */}
          <div className="space-y-2 mt-4">
            <div className="h-10 w-full bg-gray-300 rounded-full"></div>
            <div className="h-10 w-full bg-gray-300 rounded-full"></div>
          </div>
        </div>
      </div>
    </div>
  );
}

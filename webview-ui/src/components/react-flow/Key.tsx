const Key = () => {
  return (
    <dl className=" space-y-4 px-10 py-4 absolute top-10 right-10 bg-gray-100 opacity-80 rounded-lg py-x-10 w-72 z-30 shadow-md">
      <div className="flex items-center justify-between">
        <dt className="text-gray-600">Event Bus</dt>
        <dt className="text-gray-600">
          <span className="block w-4 bg-gray-600 h-4 rounded-full"></span>
        </dt>
      </div>
      <div className="flex items-center justify-between">
        <dt className="text-gray-600">EventBridge Rules</dt>
        <dt className="text-gray-600">
          <span className="block w-4 bg-pink-400 h-4 rounded-full"></span>
        </dt>
      </div>
      <div className="flex items-center justify-between">
        <dt className="text-gray-600">EventBridge Targets</dt>
        <dt className="text-gray-600">
          <span className="block w-4 bg-orange-500 h-4 rounded-full"></span>
        </dt>
      </div>
      <div className="flex items-center justify-between">
        <dt className="text-gray-600">Input Transforms</dt>
        <dt className="text-gray-600">
          <span className="block w-4 bg-blue-500 h-4 rounded-full"></span>
        </dt>
      </div>
      <div className="flex items-center justify-between">
        <dt className="text-gray-600">EventBridge Archives</dt>
        <dt className="text-gray-600">
          <span className="block w-4 bg-green-500 h-4 rounded-full"></span>
        </dt>
      </div>
    </dl>
  );
};

export default Key;

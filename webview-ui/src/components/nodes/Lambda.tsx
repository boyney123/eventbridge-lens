import { useCallback } from "react";
import { Handle, Position, ReactFlowProvider } from "reactflow";

const stats = [
  { name: "CodeSize", stat: "316kb" },
  { name: "Runtime", stat: "nodejs16.x" },
  { name: "MemorySize", stat: "128mb" },
];

const LambdaIcon = () => {
  return (
    <svg
      className="w-8 rounded-sm"
      viewBox="0 0 40 40"
      version="1.1"
      xmlns="http://www.w3.org/2000/svg">
      <title>Icon-Architecture/32/Arch_AWS-Lambda_32</title>
      <desc>Created with Sketch.</desc>
      <defs>
        <linearGradient x1="0%" y1="100%" x2="100%" y2="0%" id="linearGradient-1">
          <stop stop-color="#C8511B" offset="0%"></stop>
          <stop stop-color="#FF9900" offset="100%"></stop>
        </linearGradient>
      </defs>
      <g
        id="Icon-Architecture/32/Arch_AWS-Lambda_32"
        stroke="none"
        stroke-width="1"
        fill="none"
        fill-rule="evenodd">
        <g id="Icon-Architecture-BG/32/Compute" fill="url(#linearGradient-1)">
          <rect id="Rectangle" x="0" y="0" width="40" height="40"></rect>
        </g>
        <path
          d="M14.3863762,33 L8.26957323,33 L15.032628,18.574 L18.0969223,25.014 L14.3863762,33 Z M15.4706649,17.202 C15.3891468,17.03 15.2172714,16.92 15.0286994,16.92 L15.0267351,16.92 C14.8391453,16.921 14.6672698,17.032 14.5857517,17.205 L7.04778408,33.285 C6.9751053,33.439 6.9859089,33.622 7.0762663,33.767 C7.16564155,33.912 7.32278485,34 7.49073175,34 L14.6967342,34 C14.8872704,34 15.0601281,33.889 15.1416462,33.714 L19.085943,25.225 C19.1497824,25.088 19.1488003,24.929 19.0839787,24.793 L15.4706649,17.202 Z M32.0178544,33 L26.1357842,33 L16.6669183,12.289 C16.5863824,12.113 16.4125426,12 16.2220063,12 L12.3700312,12 L12.3749419,7 L19.9237132,7 L29.3483826,27.71 C29.4289185,27.887 29.6037404,28 29.7942767,28 L32.0178544,28 L32.0178544,33 Z M32.5089272,27 L30.1085633,27 L20.6829118,6.29 C20.6023758,6.113 20.4275539,6 20.2370176,6 L11.8838691,6 C11.6127969,6 11.3927963,6.224 11.3927963,6.5 L11.3869034,12.5 C11.3869034,12.632 11.4389572,12.759 11.5312788,12.854 C11.6236005,12.947 11.7473509,13 11.8779762,13 L15.909684,13 L25.3775678,33.711 C25.4581038,33.887 25.6319435,34 25.8234619,34 L32.5089272,34 C32.7809815,34 33,33.776 33,33.5 L33,27.5 C33,27.224 32.7809815,27 32.5089272,27 L32.5089272,27 Z"
          id="AWS-Lambda_Icon_32_Squid"
          fill="#FFFFFF"></path>
      </g>
    </svg>
  );
};

export function Lambda() {
  const onChange = useCallback((evt: any) => {
    console.log(evt.target.value);
  }, []);

  return (
    <div className="border border-yellow-500 shadow-sm rounded-sm max-w-sm bg-gradient-to-r from-orange-50 to-orange-100">
      <ReactFlowProvider>
        <div className="flex">
          <div className="flex items-center border-l border-yellow-500 bg-orange-400 w-10 ">
            <span className="block transform -rotate-90 mt-7 uppercase text-white w-full font-bold tracking-widest text-sm">
              Trigger
            </span>
          </div>
          <div>
            <div className="flex border-b border-gray-200 text-gray-700 items-center py-2 px-2">
              <LambdaIcon />
              <div className="px-2 ">
                <h4 className="text-md font-bold">
                  cloudwatch-demo-DeleteOldSnippets-6uWANy2rMq2s
                </h4>
              </div>
            </div>

            <div className="px-2 py-4 text-sm border-b border-gray-200 ">
              <dl className="grid grid-cols-1 gap-5 sm:grid-cols-3">
                {stats.map((item) => (
                  <div key={item.name} className="overflow-hidden rounded-lg  px-2 py-2  ">
                    <dt className="truncate font-medium text-gray-500 text-xs">{item.name}</dt>
                    <dd className="mt-1 text-sm font-semibold tracking-tight text-gray-900">
                      {item.stat}
                    </dd>
                  </div>
                ))}
              </dl>
              {/* <p>
            Lorem, ipsum dolor sit amet consectetur adipisicing elit. Cum error et blanditiis deleniti, ipsa eligendi repudiandae expedita corporis. Quod atque modi molestias eos consequatur quidem ad
            harum voluptatum totam officia?
          </p> */}
            </div>

            {/* <div className="overflow-hidden bg-white shadow sm:rounded-lg">
          <div className="border-t border-gray-200 px-4 py-5 sm:p-0">
            <dl className="sm:divide-y sm:divide-gray-200">
              <div className="py-4 sm:grid sm:grid-cols-3 sm:gap-4 sm:py-5 sm:px-6">
                <dt className="text-sm font-medium text-gray-500">Full name</dt>
                <dd className="mt-1 text-sm text-gray-900 sm:col-span-2 sm:mt-0">Margot Foster</dd>
              </div>
              <div className="py-4 sm:grid sm:grid-cols-3 sm:gap-4 sm:py-5 sm:px-6">
                <dt className="text-sm font-medium text-gray-500">Application for</dt>
                <dd className="mt-1 text-sm text-gray-900 sm:col-span-2 sm:mt-0">Backend Developer</dd>
              </div>
              <div className="py-4 sm:grid sm:grid-cols-3 sm:gap-4 sm:py-5 sm:px-6">
                <dt className="text-sm font-medium text-gray-500">Email address</dt>
                <dd className="mt-1 text-sm text-gray-900 sm:col-span-2 sm:mt-0">margotfoster@example.com</dd>
              </div>
              <div className="py-4 sm:grid sm:grid-cols-3 sm:gap-4 sm:py-5 sm:px-6">
                <dt className="text-sm font-medium text-gray-500">Salary expectation</dt>
                <dd className="mt-1 text-sm text-gray-900 sm:col-span-2 sm:mt-0">$120,000</dd>
              </div>
            </dl>
          </div>
        </div> */}
            <div className="px-2 py-4 text-sm flex justify-between">
              <button
                type="button"
                className="inline-flex items-center rounded border border-gray-300 bg-white px-2.5 py-1.5 text-xs font-medium text-gray-700 shadow-sm hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2">
                Settings
              </button>
              <button
                type="button"
                className="inline-flex items-center rounded border border-gray-300 bg-white px-2.5 py-1.5 text-xs font-medium text-gray-700 shadow-sm hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2">
                View in Console
              </button>
            </div>
          </div>
        </div>
        <Handle type="target" position={Position.Right} />
        <Handle type="source" position={Position.Left} />
      </ReactFlowProvider>
    </div>
  );
}

// export default = () => <div>Hello</div>
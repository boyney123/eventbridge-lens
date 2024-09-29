import { Menu, Transition } from "@headlessui/react";
import { EllipsisVerticalIcon } from "@heroicons/react/24/outline";
import React, { Fragment } from "react";

interface Props {
  header: string;
  subheader?: string;
  Icon: any;
  menuOptions: {
    icon: any;
    label: string;
    onClick: any;
  }[];
}

function classNames(...classes: any) {
  return classes.filter(Boolean).join(" ");
}

const NodeHeader = ({ header, subheader, Icon, menuOptions }: Props) => {
  return (
    <div className="border-b border-gray-300 p-2 flex justify-between items-start">
      <div>
        <div className="flex justify-start space-x-2 items-center">
          {Icon && (
            <span className="opacity-100">
              <Icon />
            </span>
          )}
          <span className="text-lg leading-tight text-gray-800 ">{header}</span>
          {/* <span className="text-xs block mt-2 text-gray-600">Service: {data.Service}</span> */}
        </div>
        <span className="block  text-xs  text-gray-600 mt-2 ">{subheader}</span>
      </div>

      <div className="flex">
        <div className="flex flex-shrink-0 justify-end pl-2">
          <Menu as="div" className="relative inline-block text-left">
            <div className="h-full flex justify-center">
              <Menu.Button className="flex items-center rounded-full p-2 text-gray-400 hover:text-gray-600">
                <span className="sr-only">Open options</span>
                <EllipsisVerticalIcon className="h-5 w-5" aria-hidden="true" />
              </Menu.Button>
            </div>

            <Transition
              as={Fragment}
              enter="transition ease-out duration-100"
              enterFrom="transform opacity-0 scale-95"
              enterTo="transform opacity-100 scale-100"
              leave="transition ease-in duration-75"
              leaveFrom="transform opacity-100 scale-100"
              leaveTo="transform opacity-0 scale-95">
              <Menu.Items className="absolute right-0 z-10 mt-2 w-56 origin-top-right rounded-md bg-white shadow-lg ring-1 ring-black ring-opacity-5 focus:outline-none">
                <div className="py-1">
                  {menuOptions.map((option) => {
                    return (
                      <Menu.Item key={option.label}>
                        <button
                          onClick={option.onClick}
                          className="text-gray-700 flex px-4 py-2 text-sm">
                          <option.icon className="mr-3 h-5 w-5 text-gray-400" aria-hidden="true" />
                          <span>{option.label}</span>
                        </button>
                      </Menu.Item>
                    );
                  })}
                  {/* <Menu.Item>
                      {({ active }) => (
                        <button
                          onClick={() => openResourceInAWSConsole()}
                          className={classNames(
                            active ? "bg-gray-100 text-gray-900" : "text-gray-700",
                            "flex px-4 py-2 text-sm"
                          )}>
                          <CloudIcon className="mr-3 h-5 w-5 text-gray-400" aria-hidden="true" />
                          <span>Open in AWS Console</span>
                        </button>
                      )}
                    </Menu.Item> */}
                </div>
              </Menu.Items>
            </Transition>
          </Menu>
        </div>
      </div>
      {/* <div><Icon/></div> */}
    </div>
  );
};

export default NodeHeader;

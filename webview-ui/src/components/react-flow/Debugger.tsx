import React from "react";
import { useExtension, useViewData } from "../../hooks/ExtensionProvider";
import { Prism as PrismSyntaxHighlighter } from "react-syntax-highlighter";
import codeStyle from "react-syntax-highlighter/dist/cjs/styles/prism/one-light";

const Debugger = () => {
  const data = useViewData() as any;

  const { postMessage } = useExtension();

  const copy = async () => {
    alert('as')
    await postMessage("vscode:copy-to-clipboard", JSON.stringify(data, null, 4));
  };

  return (
    <div className="absolute bottom-10 left-20 z-50">
      <button onClick={() => copy()} className="bg-gray-400 px-2 py-2 text-white rounded-md z-10">Copy view data</button>
    </div>
  );
};

export default Debugger;

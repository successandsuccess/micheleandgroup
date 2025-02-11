import { faCopy, faLocationDot } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { CopyToClipboard } from "react-copy-to-clipboard";

export const Location = ({ text }: { text: string }) => {
  return (
    <div className="flex flex-row gap-3 rounded-lg border-1 p-2">
      <FontAwesomeIcon icon={faLocationDot} className="mt-1"/>
      <p className="grow md:text-[16px] text-[12px]">{text}</p>
      <CopyToClipboard text={text} onCopy={() => console.log('test')}>
        <button><FontAwesomeIcon icon={faCopy} /></button>
      </CopyToClipboard>
    </div>
  );
};

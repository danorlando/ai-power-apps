import { RenameIcon, CheckMark } from "@/common/icons";

type TRenameButtonProps = {
  renaming: boolean;
  renameHandler: (e: any) => void;
  onRename: (e: any) => void;
  twcss?: string;
  onMouseOver?: (e: React.MouseEvent) => void;
  onMouseOut?: (e: React.MouseEvent) => void;
};

export default function RenameButton({
  renaming,
  renameHandler,
  onRename,
  twcss,
  onMouseOver,
  onMouseOut,
}: TRenameButtonProps) {
  const handler = renaming ? onRename : renameHandler;
  const classProp = { className: "p-1 hover:text-white" };
  if (twcss) {
    classProp.className = twcss;
  }
  return (
    <button
      {...classProp}
      onClick={handler}
      onMouseOver={onMouseOver}
      onMouseOut={onMouseOut}
    >
      {renaming ? <CheckMark /> : <RenameIcon />}
    </button>
  );
}

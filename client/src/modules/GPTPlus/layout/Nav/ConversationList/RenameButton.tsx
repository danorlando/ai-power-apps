import { RenameIcon, CheckMark } from '@/common/icons';

type TRenameButtonProps = {
  renaming: boolean;
  renameHandler: (e: any) => void;
  onRename: (e: any) => void;
  twcss?: string;
};

export default function RenameButton({ renaming, renameHandler, onRename, twcss }: TRenameButtonProps) {
  const handler = renaming ? onRename : renameHandler;
  const classProp = { className: "p-1 hover:text-white" };
  if (twcss) {
    classProp.className = twcss;
  }
  return (
    <button {...classProp} onClick={handler}>
      {renaming ? <CheckMark /> : <RenameIcon />}
    </button>
  );
}

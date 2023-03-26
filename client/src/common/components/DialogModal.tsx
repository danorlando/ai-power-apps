import {
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle
} from './DialogPrimitive';

type TModalDialogProps = {
  title: string;
  description: string;
  main?: React.ReactNode;
  buttons?: React.ReactNode;
  selection: {
    selectHandler: (e: React.MouseEvent) => void;
    selectClasses?: string;
    selectText: string;
  };
};

export default function DialogModal({ title, description, main, buttons, selection }: TModalDialogProps) {
  const { selectHandler, selectClasses, selectText } = selection;

  const defaultSelect = "bg-gray-900 text-white transition-colors hover:bg-gray-700 focus:outline-none focus:ring-2 focus:ring-gray-400 focus:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50 dark:bg-gray-100 dark:text-gray-900 dark:hover:bg-gray-200 dark:focus:ring-gray-400 dark:focus:ring-offset-gray-900"
  return (
    <DialogContent className="shadow-2xl dark:bg-gray-800">
      <DialogHeader>
        <DialogTitle className="text-gray-800 dark:text-white">{title}</DialogTitle>
        <DialogDescription className="text-gray-600 dark:text-gray-300">
          {description}
        </DialogDescription>
      </DialogHeader>
      {main ? main : null}
      <DialogFooter>
        <DialogClose className="dark:hover:gray-400 border-gray-700">Cancel</DialogClose>
        { buttons ? buttons : null}
        <DialogClose
          onClick={selectHandler}
          className={`${selectClasses || defaultSelect} inline-flex h-10 items-center justify-center rounded-md border-none py-2 px-4 text-sm font-semibold`}
        >
          {selectText}
        </DialogClose>
      </DialogFooter>
    </DialogContent>
  );
}

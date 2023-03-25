import { useState, useRef } from 'react';
import { DropdownMenuRadioItem, DialogTrigger } from '@common/components';
import { useCompletionState, useModelState } from '@modules/GPTPlus/contexts';
import { Circle } from 'lucide-react';
import RenameButton from '../common/RenameButton';
import {TrashIcon} from '@common/icons';
import { getAvatar } from './Avatar';
import { useUpdateCustomGptMutation, useDeleteCustomGptMutation } from '@data-provider';

type TModelOptionProps = {
  modelName: string;
  value: string;
  model: string;
  onSelect: (e: any) => void;
  id: string;
  chatGptLabel: string;
  promptPrefix: string;
};

export default function ModelOption({ modelName, value, model, onSelect, id, chatGptLabel, promptPrefix }: TModelOptionProps) {

  const { customModel } = useCompletionState();
  const { initial } = useModelState();
  const [isHovering, setIsHovering] = useState(false);
  const [renaming, setRenaming] = useState(false);
  const [currentName, setCurrentName] = useState(modelName);
  const [modelInput, setModelInput] = useState(modelName);
  const inputRef = useRef(null);

  const updateCustomGptMutation = useUpdateCustomGptMutation();

  const deleteCustomGpt = useDeleteCustomGptMutation();

  const icon = getAvatar({ size: 20, sender: modelName, isCreatedByUser: false, model, chatGptLabel, promptPrefix, error: false, className: "mr-2" });

  if (value === 'chatgptCustom') {
    return (
      <DialogTrigger className="w-full">
        <DropdownMenuRadioItem
          value={value}
          className="dark:font-semibold dark:text-gray-100 dark:hover:bg-gray-800"
        >
          {icon}
          {modelName}
          <sup>$</sup>
        </DropdownMenuRadioItem>
      </DialogTrigger>
    );
  } 

  if (initial[value])
    return (
      <DropdownMenuRadioItem
        value={value}
        className="dark:font-semibold dark:text-gray-100 dark:hover:bg-gray-800"
      >
        {icon}
        {modelName}
        {value === 'chatgpt' && <sup>$</sup>}
      </DropdownMenuRadioItem>
    );

  
  const handleMouseOver = () => {
    setIsHovering(true);
  };

  const handleMouseOut = () => {
    setIsHovering(false);
  };

  const renameHandler = (e: React.SyntheticEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setRenaming(true);
    setTimeout(() => {
      inputRef.current.focus();
    }, 25);
  };

  const onRename = (e: React.SyntheticEvent) => {
    e.preventDefault();
    setRenaming(false);
    if (modelInput === modelName) {
      return;
    }
    updateCustomGptMutation.mutate({
      prevLabel: currentName,
      chatGptLabel: modelInput,
      value: modelInput.toLowerCase()
    });
    setCurrentName(modelInput);
  };

  const onDelete = async (e: React.MouseEvent) => {
    e.preventDefault();
    deleteCustomGpt.mutate({ id: id });
    onSelect('chatgpt');
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      onRename(e);
    }
  };

  const buttonClass = {
    className:
      'invisible group-hover:visible z-50 rounded-md m-0 text-gray-400 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200'
  };

  const itemClass = {
    className:
      'relative flex group cursor-default select-none items-center rounded-sm py-1.5 pl-8 pr-2 text-sm font-medium outline-none hover:bg-slate-100 data-[disabled]:pointer-events-none data-[disabled]:opacity-50 dark:hover:bg-slate-700 dark:font-semibold dark:text-gray-100 dark:hover:bg-gray-800'
  };

  return (
    <span
      className={itemClass.className}
      onClick={(e) => {
        if (isHovering) {
          return;
        }
        onSelect(value);
      }}
    >
      {customModel === value && (
        <span className="absolute left-2 flex h-3.5 w-3.5 items-center justify-center">
          <Circle className="h-2 w-2 fill-current" />
        </span>
      )}

      {icon}

      {renaming === true ? (
        <input
          ref={inputRef}
          key={id}
          type="text"
          className="pointer-events-auto z-50 m-0 mr-2 w-3/4 border border-blue-500 bg-transparent p-0 text-sm leading-tight outline-none"
          value={modelInput}
          onClick={(e) => e.stopPropagation()}
          onChange={(e) => setModelInput(e.target.value)}
          // onBlur={onRename}
          onKeyDown={handleKeyDown}
        />
      ) : (
        <div className=" overflow-hidden">{modelInput}</div>
      )}

      {value === 'chatgpt' && <sup>$</sup>}
      <RenameButton
        twcss={`ml-auto mr-2 ${buttonClass.className}`}
        onRename={onRename}
        renaming={renaming}
        onMouseOver={handleMouseOver}
        onMouseOut={handleMouseOut}
        renameHandler={renameHandler}
      />
      <button
        {...buttonClass}
        onMouseOver={handleMouseOver}
        onMouseOut={handleMouseOut}
        onClick={onDelete}
      >
        <TrashIcon />
      </button>
    </span>
  );
}

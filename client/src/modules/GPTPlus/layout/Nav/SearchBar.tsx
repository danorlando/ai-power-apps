import { useCallback } from 'react';
import { debounce } from 'lodash';
import { Search } from 'lucide-react';
import { useSetInputValue, useSetSearchQuery, useSearchState } from '@modules/GPTPlus/contexts';

type TSearchBarProps = {
  fetch: (q: string, page: number) => void;
  clearSearch: () => void;
  onSuccess?: () => void;
};

export default function SearchBar({ fetch, clearSearch, onSuccess }: TSearchBarProps) {

  const { inputValue } = useSearchState();
  const setQuery = useSetSearchQuery();
  const setInputValue = useSetInputValue();

  const debouncedChangeHandler = useCallback(
    debounce((q) => {
      setQuery(q);
      if (q.length > 0) {
        fetch(q, 1);
      }
    }, 750),
    [setQuery, fetch]
  );

  const handleKeyUp = (e: React.KeyboardEvent<HTMLInputElement>) => {
    const { value } = e.target;
    if (e.keyCode === 8 && value === '') { 
      // Value after clearing input: ""
      console.log(`Value after clearing input: "${value}"`);
      setQuery('');
      clearSearch();
     }
  };

  const changeHandler = (e: React.ChangeEvent<HTMLInputElement>) => {
    let q = e.target.value;
    setInputValue(q);
    q = q.trim();

    if (q === '') {
      setQuery('');
      clearSearch();
    } else {
      debouncedChangeHandler(q);
    }
  };

  return (
    <div className="flex cursor-pointer items-center gap-3 rounded-md py-3 px-3 text-sm text-white transition-colors duration-200 hover:bg-gray-500/10">
      <Search className="h-4 w-4" />
      <input
        type="text"
        className="m-0 mr-0 w-full border-none bg-transparent p-0 text-sm leading-tight outline-none"
        value={inputValue}
        onChange={changeHandler}
        placeholder="Search messages"
        onKeyUp={handleKeyUp}
      />
    </div>
  );
}

import ClearConversations from './ClearConversations';
import LogoutButton from './LogoutButton';
import DarkModeButton from './DarkModeButton';
import {useSearchState} from '@modules/GPTPlus/contexts';
import SearchBar from './SearchBar';

type TSidebarMenuProps = {
  fetch: (q: string, page: number) => void;
  onSearchSuccess: () => void;
  clearSearch: () => void;
};
export default function SidebarMenu({ fetch, onSearchSuccess, clearSearch }: TSidebarMenuProps) {
  const { isSearchEnabled } = useSearchState();

  return (
    <>
      { !!isSearchEnabled && <SearchBar fetch={fetch} onSuccess={onSearchSuccess} clearSearch={clearSearch}/>}
      <DarkModeButton />
      <ClearConversations />
      <LogoutButton />
    </>
  );
}

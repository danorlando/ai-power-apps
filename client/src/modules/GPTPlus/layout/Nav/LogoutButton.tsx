import { useState, useContext } from 'react';
import LogOutIcon from '@common/icons/LogOutIcon';
import {useProfileState} from '@modules/GPTPlus/contexts';


export default function Logout() {
  const { user } = useProfileState();
  
  const clickHandler = () => {
    window.location.href = "/auth/logout";
  };

  return (
    <a
      className="flex cursor-pointer items-center gap-3 rounded-md py-3 px-3 text-sm text-white transition-colors duration-200 hover:bg-gray-500/10"
      onClick={clickHandler}
    >
      <LogOutIcon />
      {user?.display || user?.username || 'USER'}
      <small>Log out</small>
    </a>
  );
}

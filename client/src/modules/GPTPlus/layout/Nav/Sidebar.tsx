import { useState, useEffect, useRef, useCallback } from "react";
import _ from "lodash";
import styles from "./styles.module.css";
import { Dropdown, DropdownChangeEvent } from "primereact/dropdown";
import classNames from "classnames";
import {
  useConversationState,
  useSetConversations,
  useSetNewConversation,
  useRefreshConversation,
  useSetMessages,
  useSetDisabled,
  useSearchState,
} from "@modules/GPTPlus/contexts";
import { NewChatButton } from ".";
import SidebarMenu from "./SidebarMenu";
import { ConversationList } from "./ConversationList";
import { searchFetcher, useGetConversationsQuery } from "@data-provider";
import { Spinner } from '@common/icons'

export type TSidebarProps = {
  visible: boolean;
  setSidebarVisible: (visible: boolean) => void;
};

function Sidebar({ visible, setSidebarVisible }: TSidebarProps) {
  const [isHovering, setIsHovering] = useState(false);
  const [isFetching, setIsFetching] = useState(false);
  const [pages, setPages] = useState(1);
  const [pageNumber, setPage] = useState(1);
  const { conversationId, convos, refreshConvoHint } = useConversationState();
  const { isSearching, searchQuery} = useSearchState();
  const setConvos = useSetConversations();
  const setNewConversation = useSetNewConversation();
  const setMessages = useSetMessages();
  const setDisabled = useSetDisabled();
  const refreshConversation = useRefreshConversation();
  const getConversationsQuery = useGetConversationsQuery(pageNumber.toString());

  
  const toggleSidebar = () => {
    setSidebarVisible(!visible);
  };

  const onSearchSuccess = (data: any, expectedPage: any) => {
    const res = data;
    setConvos({ convos: res.conversations, searchFetch: true });
    if (expectedPage) {
      setPage(expectedPage);
    }
    setPage(res.pageNumber);
    setPages(res.pages);
    setIsFetching(false);
    if (res.messages?.length > 0) {
      setMessages(res.messages);
      setDisabled(true);
    }
  };

  const fetch = useCallback(_.partialRight(searchFetcher.bind(null, () => setIsFetching(true)), onSearchSuccess), []);


  const clearSearch = () => {
    setPage(1);
    refreshConversation();
    if (!conversationId) {
     setNewConversation();
      setMessages([]);
    }
    setDisabled(false);
  };

  const { data, isLoading } = getConversationsQuery;

  useEffect(() => {
  if (getConversationsQuery.isSuccess) {
    if (isSearching) {
      return;
    }
    if (getConversationsQuery.data) {
      // @ts-ignore
      const { conversations, pages } = data;
      if (pageNumber > pages) {
        setPage(pages);
      } else {
        setConvos({ convos: conversations, searchFetch: false});
        setPages(pages);
      }
    }
   
  }
}, [data, isSearching, pageNumber]);

  const containerRef = useRef(null);
  const scrollPositionRef = useRef(null);

  const moveToTop = () => {
    const container = containerRef.current;
    if (container) {
      scrollPositionRef.current = container.scrollTop;
    }
  };

  const nextPage = async () => {
    moveToTop();

    // if (!isSearching) {
    //   setPage((prev) => prev + 1);
    //   await mutate();
    // } else {
    //   await fetch(searchQuery, +pageNumber + 1);
    // }
  };

  const previousPage = async () => {
    moveToTop();

    // if (!isSearching) {
    //   setPage((prev) => prev - 1);
    //   await mutate();
    // } else {
    //   await fetch(searchQuery, +pageNumber - 1);
    // }
  };


  useEffect(() => {
    const container = containerRef.current;

    if (container && scrollPositionRef.current !== null) {
      const { scrollHeight, clientHeight } = container;
      const maxScrollTop = scrollHeight - clientHeight;

      container.scrollTop = Math.min(maxScrollTop, scrollPositionRef.current);
    }
  }, [data]);

  useEffect(() => {
    setSidebarVisible(false);
  }, [conversationId]);

  const toggleNavVisible = () => {
    setSidebarVisible((prev) => {
      return !prev;
    });
  };


  const containerClasses =
    pageNumber === 1
      ? "flex flex-col gap-2 text-gray-100 text-sm h-full justify-center items-center"
      : "flex flex-col gap-2 text-gray-100 text-sm";

  return (
    <>
      {/* <div
        className={
          "nav dark bg-gray-900 md:fixed md:inset-y-0 md:flex md:w-[260px] md:flex-col" +
          (visible ? " active" : "")
        }
      > */}
      <aside className={classNames(styles.sidebar, visible && styles.active)}>
        <div className="flex h-full min-h-0 flex-col ">
          <div className="scrollbar-trigger flex h-full w-full flex-1 items-start border-white/20">
            <nav className="flex h-full flex-1 flex-col space-y-1 p-2">
              <NewChatButton />
              <div
                className={`flex-1 flex-col overflow-y-auto ${
                  isHovering ? "" : "scrollbar-transparent"
                } border-b border-white/20`}
                onMouseEnter={() => setIsHovering(true)}
                onMouseLeave={() => setIsHovering(false)}
                ref={containerRef}
              >
                <div className={containerClasses}>
                  {isLoading && pageNumber === 1 ? (
                    <Spinner />
                  ) : (
                    <ConversationList
                      conversations={convos}
                      conversationId={conversationId}
                      nextPage={nextPage}
                      previousPage={previousPage}
                      moveToTop={moveToTop}
                      pageNumber={pageNumber}
                      pages={pages}
                    />
                  )}
                </div>
              </div>
              <SidebarMenu fetch={fetch} onSearchSuccess={onSearchSuccess}
                clearSearch={clearSearch} />
            </nav>
          </div>
        </div>
        <button
          type="button"
          className="nav-close-button -ml-0.5 -mt-0.5 inline-flex h-10 w-10 items-center justify-center rounded-md text-white hover:text-gray-900 hover:text-white focus:outline-none focus:ring-white"
          onClick={toggleSidebar}
          aria-label="Close sidebar"
        >
          <svg
            stroke="currentColor"
            fill="none"
            strokeWidth="1.5"
            viewBox="0 0 24 24"
            strokeLinecap="round"
            strokeLinejoin="round"
            className="h-6 w-6"
            height="1em"
            width="1em"
            xmlns="http://www.w3.org/2000/svg"
          >
            <line x1="3" y1="6" x2="15" y2="18" />
            <line x1="3" y1="18" x2="15" y2="6" />
          </svg>
        </button>
      </aside>
      <div
        className={"nav-mask" + (visible ? " active" : "")}
        onClick={toggleSidebar}
      ></div>
    </>
    // <aside className={styles.sidebarAside}>
    //   <PrimeSidebar
    //     dismissable={false}
    //     className={classNames(styles.sidebar, "w-72")}
    //     visible={visible}
    //     position="left"
    //     onHide={() => setVisible(false)}
    //   >
    //     <h1>Test</h1>
    //   </PrimeSidebar>
    // </aside>
    // <aside  className={
    //   'nav dark bg-gray-900 md:fixed md:inset-y-0 md:flex md:w-[260px] md:flex-col' +
    //   (visible ? ' active' : '')
    // }>
    //   <div className="flex flex-col h-full min-h-0">
    //     <div className="scrollbar-trigger flex h-full w-full flex-1 align-items-start border-white/20">
    //       <nav className="flex flex-1 flex-col h-full gap-1 p-2">
    //         NAVIGATION
    //       </nav>
    //     </div>
    //   </div>
    // </aside>
  );
}

export default Sidebar;

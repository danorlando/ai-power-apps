import { useState, useRef } from "react";
import { Sidebar as PrimeSidebar } from "primereact/sidebar";
import styles from "./styles.module.css";
import { Dropdown, DropdownChangeEvent } from "primereact/dropdown";
import classNames from "classnames";
import { useConversationState } from "@modules/GPTPlus/contexts/ConversationContext";
import { NewChatButton } from ".";

export type TSidebarProps = {
  visible: boolean;
  setSidebarVisible: (visible: boolean) => void;
};

function Sidebar({ visible, setSidebarVisible }: TSidebarProps) {
  const [isHovering, setIsHovering] = useState(false);
  const [pages, setPages] = useState(1);
  const [pageNumber, setPage] = useState(1);
  const { conversationId, convos, refreshConvoHint } = useConversationState();

  const toggleSidebar = () => {
    setSidebarVisible(!visible);
  };

  const containerRef = useRef(null);
  const scrollPositionRef = useRef(null);

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
                  TEST
                  {/* {isLoading && pageNumber === 1 ? (
                    <Spinner />
                  ) : (
                    <Conversations
                      conversations={convos}
                      conversationId={conversationId}
                      nextPage={nextPage}
                      previousPage={previousPage}
                      moveToTop={moveToTop}
                      pageNumber={pageNumber}
                      pages={pages}
                    />
                  )} */}
                </div>
              </div>
              {/* <NavLinks /> */}
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

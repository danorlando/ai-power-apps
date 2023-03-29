import { useState, useEffect, forwardRef } from 'react';
import { Tabs, TabsList, TabsTrigger } from '@common/components';
import { useSetConversation, useCompletionState, useConversationState, useMessageState } from '@modules/GPTPlus/contexts';

function BingStyles(props: any, ref: any) {
  const [value, setValue] = useState('fast');
  const { model } = useCompletionState();
  const { conversationId } = useConversationState();
  const { messages } = useMessageState();
  const setConversation = useSetConversation();

  const isBing = model === 'bingai' || model === 'sydney';
  useEffect(() => {
    if (model === 'bingai' && !conversationId || model === 'sydney') {
      setConversation({ toneStyle: value });
    }
  }, [conversationId, model, value]);

  const show = isBing && ((!conversationId || messages?.length === 0) || props.show);
  const defaultClasses = 'p-2 rounded-md font-normal bg-white/[.60] dark:bg-gray-700 text-black';
  const defaultSelected = defaultClasses + 'font-medium data-[state=active]:text-white';

  const selectedClass = (val: any) => val + '-tab ' + defaultSelected;

  const changeHandler = (value: any) => {
    setValue(value);
    setConversation({ toneStyle: value });
  };
  return (
    <Tabs
      defaultValue={value}
      className={`shadow-md mb-1 bing-styles ${show ? 'show' : ''}`}
      onValueChange={changeHandler}
      ref={ref}
    >
      <TabsList className="bg-white/[.60] dark:bg-gray-700">
        <TabsTrigger
          value="creative"
          className={`${value === 'creative' ? selectedClass(value) : defaultClasses}`}
        >
          {'Creative'}
        </TabsTrigger>
        <TabsTrigger
          value="fast"
          className={`${value === 'fast' ? selectedClass(value) : defaultClasses}`}
        >
          {'Fast'}
        </TabsTrigger>
        <TabsTrigger
          value="balanced"
          className={`${value === 'balanced' ? selectedClass(value) : defaultClasses}`}
        >
          {'Balanced'}
        </TabsTrigger>
        <TabsTrigger
          value="precise"
          className={`${value === 'precise' ? selectedClass(value) : defaultClasses}`}
        >
          {'Precise'}
        </TabsTrigger>
      </TabsList>
    </Tabs>
  );
}

export default forwardRef(BingStyles);

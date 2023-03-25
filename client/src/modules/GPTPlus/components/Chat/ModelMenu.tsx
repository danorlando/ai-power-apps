import { useState, useEffect } from "react";
import {
  useSetSubmission,
  useSetModel,
  useSetDisabled,
  useSetCustomGpt,
  useSetCustomModel,
  useSetNewConversation,
  useSetModels,
  useSetInitialModels,
  useSetMessages,
  useSetText,
  useCompletionState,
  useModelState,
} from "@modules/GPTPlus/contexts";
import CustomizeModelDialog from "./CustomizeModelDialog";
import ModelOption from "./ModelOption";
import { Button, DropdownMenu,
  DropdownMenuContent,
  DropdownMenuLabel,
  DropdownMenuRadioGroup,
  DropdownMenuSeparator,
  DropdownMenuTrigger, Dialog } from "@common/components";
import { useGetCustomGptsQuery, useGetModelsQuery, TCustomPrompt } from "@data-provider";
import { getAvatar } from './Avatar';

export default function ModelMenu() {
  const [modelSave, setModelSave] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);
  const { model, customModel, promptPrefix, chatGptLabel } = useCompletionState();
  const { models, modelMap, initial } = useModelState();

  const getCustomGptsQuery = useGetCustomGptsQuery();
  const getModelsQuery = useGetModelsQuery();

  const setModels = useSetModels();
  const setInitial = useSetInitialModels();
  const setSubmission = useSetSubmission();
  const setModel = useSetModel();
  const setDisabled = useSetDisabled();
  const setCustomGpt = useSetCustomGpt();
  const setCustomModel = useSetCustomModel();
  const setNewConvo = useSetNewConversation();
  const setMessages = useSetMessages();
  const setText = useSetText();

  useEffect(() => {
    if( getCustomGptsQuery.data ) {
      setModels(getCustomGptsQuery.data.map((modelItem: TCustomPrompt) => ({
        ...modelItem,
        name: modelItem.chatGptLabel,
        model: "chatgptCustom",
      })));
    }
  }, [getCustomGptsQuery.data]);

  useEffect(() => {
    try {
      const lastSelected = JSON.parse(localStorage.getItem("model"));

      if (lastSelected === "chatgptCustom") {
        return;
        // @ts-ignore
      } else if (initial[lastSelected]) {
        setModel(lastSelected);
      }
    } catch (err) {
      console.log(err);
    }
  }, []);

  useEffect(() => {
    if (getModelsQuery.data) {
      const data = getModelsQuery.data;
      const initial = {
        chatgpt: data?.hasOpenAI,
        chatgptCustom: data?.hasOpenAI,
        bingai: data?.hasBing,
        sydney: data?.hasBing,
        chatgptBrowser: data?.hasChatGpt,
      };
      setInitial(initial);
      // TODO, auto reset default model
      if (data?.hasOpenAI) {
        setModel("chatgpt");
        setDisabled(false);
        setCustomModel(null);
        setCustomGpt({ chatGptLabel: null, promptPrefix: null });
      } else if (data?.hasBing) {
        setModel("bingai");
        setDisabled(false);
        setCustomModel(null);
        setCustomGpt({ chatGptLabel: null, promptPrefix: null });
      } else if (data?.hasChatGpt) {
        setModel("chatgptBrowser");
        setDisabled(false);
        setCustomModel(null);
        setCustomGpt({ chatGptLabel: null, promptPrefix: null });
      } else {
        setDisabled(true);
      }
    }
  }, [getModelsQuery.data]);

  useEffect(() => {
    localStorage.setItem("model", JSON.stringify(model));
  }, [model]);

  const filteredModels = models.filter(({ model, _id }) => initial[model]);

  const onChangeSelectedModel = (value: string) => {
    if (!value) {
      return;
    } else if (value === model) {
      return;
    } else if (value === "chatgptCustom") {
      // return;
      // @ts-ignore
    } else if (initial[value]) {
      setModel(value);
      setDisabled(false);
      setCustomModel(null);
      setCustomGpt({ chatGptLabel: null, promptPrefix: null });
      // @ts-ignore
    } else if (!initial[value]) {
      const chatGptLabel = modelMap[value]?.chatGptLabel;
      const promptPrefix = modelMap[value]?.promptPrefix;
      setCustomGpt({ chatGptLabel, promptPrefix });
      setModel("chatgptCustom");
      setCustomModel(value);
      setMenuOpen(false);
    } else if (!modelMap[value]) {
      setCustomModel(null);
    }

    // Set new conversation
    setText("");
    setMessages([]);
    setNewConvo();
    setSubmission({});
  };

  const onOpenChange = (open) => {
    if (!open) {
      setModelSave(false);
    }
  };

  const handleSaveState = (value) => {
    if (!modelSave) {
      return;
    }

    setCustomModel(value);
    setModelSave(false);
  };

  const defaultColorProps = [
    "text-gray-500",
    "hover:bg-gray-100",
    "hover:bg-opacity-20",
    "disabled:hover:bg-transparent",
    "dark:data-[state=open]:bg-gray-800",
    "dark:hover:bg-opacity-20",
    "dark:hover:bg-gray-900",
    "dark:hover:text-gray-400",
    "dark:disabled:hover:bg-transparent",
  ];

  const chatgptColorProps = [
    "text-green-700",
    "data-[state=open]:bg-green-100",
    "dark:text-emerald-300",
    "hover:bg-green-100",
    "disabled:hover:bg-transparent",
    "dark:data-[state=open]:bg-green-900",
    "dark:hover:bg-opacity-50",
    "dark:hover:bg-green-900",
    "dark:hover:text-gray-100",
    "dark:disabled:hover:bg-transparent",
  ];

  const isBing = model === "bingai" || model === "sydney";
  const colorProps =
    model === "chatgpt" ? chatgptColorProps : defaultColorProps;
  const icon = getAvatar({
    size: 32,
    sender: chatGptLabel || model,
    isCreatedByUser: false,
    model,
    chatGptLabel,
    promptPrefix,
    error: false,
    isButton: true,
  });

  return (
    <Dialog onOpenChange={onOpenChange}>
      <DropdownMenu open={menuOpen} onOpenChange={setMenuOpen}>
        <DropdownMenuTrigger asChild>
          <Button
            variant="outline"
            // style={{backgroundColor: 'rgb(16, 163, 127)'}}
            className={`absolute top-[0.25px] mb-0 ml-1 items-center rounded-md border-0 p-1 outline-none md:ml-0 ${colorProps.join(
              " "
            )} focus:ring-0 focus:ring-offset-0 disabled:top-[0.25px] dark:data-[state=open]:bg-opacity-50 md:top-1 md:left-1 md:pl-1 md:disabled:top-1`}
          >
            {icon}
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent
          className="w-56 dark:bg-gray-700"
          onCloseAutoFocus={(event: any) => event.preventDefault()}
        >
          <DropdownMenuLabel className="dark:text-gray-300">
            Select a Model
          </DropdownMenuLabel>
          <DropdownMenuSeparator />
          <DropdownMenuRadioGroup
            value={customModel ? customModel : model}
            onValueChange={onChangeSelectedModel}
            className="overflow-y-auto"
          >
            {filteredModels.length ? (
              filteredModels.map((modelItem) => (
                <ModelOption
                  key={modelItem._id}
                  id={modelItem._id}
                  modelName={modelItem.name}
                  value={modelItem.value}
                  model={modelItem.model || "chatgptCustom"}
                  onSelect={onChangeSelectedModel}
                  chatGptLabel={modelItem.chatGptLabel || ''}
                  promptPrefix={modelItem.promptPrefix || ''}
                />
              ))
            ) : (
              <DropdownMenuLabel className="dark:text-gray-300">
                No model available.
              </DropdownMenuLabel>
            )}
          </DropdownMenuRadioGroup>
        </DropdownMenuContent>
      </DropdownMenu>
      <CustomizeModelDialog
        setModelSave={setModelSave}
        handleSaveState={handleSaveState}
      />
    </Dialog>
  );
}

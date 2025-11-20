import SingleChat from "./single-chat";

const ChatPage = async (props: { params: Promise<{ id: string }> }) => {
  const params = await props.params;
  const { id } = params;

  return <SingleChat chatId={id} />;
};

export default ChatPage;

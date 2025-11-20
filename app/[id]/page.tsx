const Chat = async (props: { params: Promise<{ id: string }> }) => {
  const params = await props.params;
  const { id } = params;
  return <div>Chat</div>;
};

export default Chat;

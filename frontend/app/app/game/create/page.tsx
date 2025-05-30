import CreateGameForm from "@/components/createGameComponents/create-game";

const createGamePage = () => {
  return (
    <div className="min-h-[100vh] bg-[url('/search-friends-background.png')] bg-top bg-no-repeat p-5 pt-10">
      <CreateGameForm />
    </div>
  );
};

export default createGamePage;

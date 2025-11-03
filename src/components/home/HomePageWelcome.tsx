
interface HomePageWelcomeProps {
  show: boolean;
}

export const HomePageWelcome = ({ show }: HomePageWelcomeProps) => {
  if (!show) return null;

  return (
    <div className="max-w-2xl space-y-4 animate-fade-in-up">
      <h1 className="text-4xl font-bold tracking-tight">Welcome to Pocket Pastor</h1>
    </div>
  );
};

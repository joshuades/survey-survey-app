import FadeInWrapper from "./fade-in-wrapper";

interface MainHeadlineProps {
  children: React.ReactNode;
}

const MainHeadline: React.FC<MainHeadlineProps> = ({ children }) => {
  return (
    <FadeInWrapper>
      <h1 className="w-max text-[calc(2rem_+_5vw)] font-extrabold">{children}</h1>
    </FadeInWrapper>
  );
};

export default MainHeadline;

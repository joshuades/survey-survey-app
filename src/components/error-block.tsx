import { FC } from "react";

interface ErrorBlockProps {
  title: string;
  message?: string;
  children: React.ReactNode;
}

const ErrorBlock: FC<ErrorBlockProps> = ({ title, message, children }) => {
  return (
    <div className="text-center">
      <h2 className="mb-4 text-4xl font-extrabold">{title}</h2>
      <p className="mb-[45px]">{message}</p>
      <div className="max-w[450px] flex flex-wrap justify-center gap-5">{children}</div>
    </div>
  );
};

export default ErrorBlock;

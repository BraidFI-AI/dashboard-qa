import { MouseEventHandler } from "react";
import MyText from "./Text/Text";
import MyBlueButton from "./Button/MyBlueButton";

interface ErrorPageProps {
  error: string;
  recoveryButtonTitle: string;
  recoveryButtonOnClick: MouseEventHandler<HTMLButtonElement>;
}

const ErrorPage: React.FC<ErrorPageProps> = ({
  error,
  recoveryButtonTitle,
  recoveryButtonOnClick,
}) => {
  return (
    <div>
      <MyText>{error}</MyText>
      <div className="w-fit pt-6">
        <MyBlueButton onClick={recoveryButtonOnClick}>
          {recoveryButtonTitle}
        </MyBlueButton>
      </div>
    </div>
  );
};

export default ErrorPage;

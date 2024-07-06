import MyText from "../../Text/Text";

const InvalidUserView = () => {
  return (
    <div className="w-full h-full items-center justify-center">
      <MyText variant="title" size="sm">
        Invalid User. Please login again.
      </MyText>
    </div>
  );
};

export default InvalidUserView;

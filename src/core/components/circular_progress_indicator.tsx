import CircularProgress from "@mui/material/CircularProgress";

const MyCircularProgressIndicator = () => {
  return (
    <div className="flex flex-col items-center justify-center pt-10">
      <CircularProgress></CircularProgress>
      <div>Loading...</div>
    </div>
  );
};

export default MyCircularProgressIndicator;

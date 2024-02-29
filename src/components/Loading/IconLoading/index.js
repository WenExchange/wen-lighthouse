import { CircularProgress } from "@mui/material";

function IconLoading({ size = "20px", color = "#4aff36" }) {
  return (
    <div className=" absolute flex justify-center items-center left-0 top-0 w-full h-full">
      <CircularProgress sx={{ color }} color="inherit" size={size} />
    </div>
  );
}

export default IconLoading;

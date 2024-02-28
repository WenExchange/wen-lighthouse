import { CircularProgress } from "@mui/joy";

function DanyLoading({
  size = "20px",
  color = "#4aff36",
  thickness = "3px",
  zIndex = "z-10"
}) {
  return (
    <div
      className={` absolute flex justify-center items-center left-0 top-0 w-full h-full ${zIndex}`}
    >
      <CircularProgress
        sx={{
          "--CircularProgress-size": size,
          "--CircularProgress-progressThickness": thickness,
          "--CircularProgress-trackThickness": thickness,
          "--CircularProgress-progressColor": color
        }}
        determinate={false}
      />
    </div>
  );
}

export default DanyLoading;

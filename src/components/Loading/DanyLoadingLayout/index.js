import DanyLoading from "../DanyLoading";

function DanyLoadingLayout({
  zIndex = "z-10",
  size = "20px",
  thickness = "3px"
}) {
  return (
    <div
      className={`absolute bg-[#11111180] flex justify-center items-center left-0 top-0 w-full h-full ${zIndex}`}
    >
      <DanyLoading size={size} thickness={thickness} />
    </div>
  );
}

export default DanyLoadingLayout;

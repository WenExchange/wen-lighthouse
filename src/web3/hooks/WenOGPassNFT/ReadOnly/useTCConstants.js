import useTCBalanceOf from "./useTCBalanceOf";
import useTCTokenOfOwner from "./useTCTokenOfOwner";
import useTCOwnerOf from "./useTCOwnerOf";
import useIsApprovedForAll from "./useIsApprovedForAll";

export default function useTCConstants() {
  return {
    ...useTCBalanceOf(),
    ...useTCTokenOfOwner(),
    ...useTCOwnerOf(),
    ...useIsApprovedForAll()
  };
}

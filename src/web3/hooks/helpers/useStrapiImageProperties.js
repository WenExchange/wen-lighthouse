import React from "react";
import { URL } from "../../../services/constants";

export default function useStrapiImageProperties(imageData) {
  const id = React.useMemo(() => imageData?.id, [imageData]);

  const url = React.useMemo(() => {
    return `${URL.CLOUDFRONT}/${imageData?.hash + imageData?.ext}`;
  }, [imageData]);

  return {
    id,
    url
  };
}

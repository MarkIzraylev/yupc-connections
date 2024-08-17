import * as React from "react";
import SvgIcon from "@mui/icons-material/Menu";

function PeopleSvg() {
    return (
        <svg width="24" height="24" viewBox="0 0 100 100" fill="none" xmlns="http://www.w3.org/2000/svg" xmlnsXlink="http://www.w3.org/1999/xlink">
            <rect width="100" height="100" fill="url(#pattern0_22_1935)"/>
            <defs>
            <pattern id="pattern0_22_1935" patternContentUnits="objectBoundingBox" width="1" height="1">
            <use xlinkHref="#image0_22_1935" transform="scale(0.01)"/>
            </pattern>
            <image id="image0_22_1935" width="100" height="100" xlinkHref="data:image/png;base64,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"/>
            </defs>
        </svg>
    )
}

export default function PeopleIcon(props) {
  return (
    <SvgIcon
        {...props}
        component={PeopleSvg}
   /*
    mine were something like:
      version="1.0"
      xmlns="http://www.w3.org/2000/svg"
      width="3000.000000pt"
      height="1068.000000pt"
      viewBox="0 0 3000.000000 1068.000000"
      preserveAspectRatio="xMidYMid meet">
    */
    />
  );
}

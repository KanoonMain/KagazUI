import SvgIcon from "@mui/material/SvgIcon";

export default function SitemarkIcon() {
  return (
    <SvgIcon sx={{ width: 180, height: 60 }} viewBox="0 0 300 100">
      <svg
        xmlns="http://www.w3.org/2000/svg"
        viewBox="0 0 300 100"
        width="300"
        height="100"
      >
        {/* Pen Nib Shape */}
        <path d="M30 10 L50 10 L60 40 L45 90 L30 40 Z" fill="#275DA1" />
        {/* Human Icon inside Pen Nib */}
        <circle cx="45" cy="32" r="4" fill="white" />
        <rect x="42" y="38" width="6" height="15" fill="white" />
        <path d="M42 53 L45 58 L48 53" fill="white" />

        {/* "KaGAZ" Text */}
        <text
          x="80"
          y="40"
          fontFamily="Arial, sans-serif"
          fontSize="28"
          fill="#275DA1"
        >
          Ka
        </text>
        <text
          x="115"
          y="40"
          fontFamily="Arial, sans-serif"
          fontSize="28"
          fill="#00AEEF"
        >
          GAZ
        </text>

        {/* Tagline Text */}
        <text
          x="80"
          y="65"
          fontFamily="Arial, sans-serif"
          fontSize="12"
          fill="#275DA1"
        >
          Legal Drafts on the Go
        </text>
      </svg>
    </SvgIcon>
  );
}

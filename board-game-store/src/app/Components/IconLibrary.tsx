export type IconType = "Account" | "Home" | "Search" | "Filter" | "Library" | "Reset" | "ShoppingCart";

interface IconProps {
    type: IconType;
    size?: string;
    color?: string;
    className?: string;
}

export const Icon: React.FC<IconProps> = ({ type, size = "1em", color = "currentColor", className="" }) => {
  const SvgComponent = iconMap[type];
  return <SvgComponent className={className} size={size} color={color} />;
};

const iconMap: Record<string, React.FC<{size?: string; color?: string, className?: string}>> = {
  Account: ({ size = "1em", color = "currentColor", className="" }) => (
    <svg className={className} fill={color} width={size} viewBox="0 0 15 15" xmlns="http://www.w3.org/2000/svg">
      <path d="M7.5.875a3.625 3.625 0 0 0-1.006 7.109c-1.194.145-2.218.567-2.99 1.328-.982.967-1.479 2.408-1.479 4.288a.475.475 0 1 0 .95 0c0-1.72.453-2.88 1.196-3.612.744-.733 1.856-1.113 3.329-1.113s2.585.38 3.33 1.113c.742.733 1.195 1.892 1.195 3.612a.475.475 0 1 0 .95 0c0-1.88-.497-3.32-1.48-4.288-.77-.76-1.795-1.183-2.989-1.328A3.627 3.627 0 0 0 7.5.875M4.825 4.5a2.675 2.675 0 1 1 5.35 0 2.675 2.675 0 0 1-5.35 0"/>
    </svg>
  ),
  Home: ({ size = "1em", color = "currentColor", className="" }) => (
    <svg className={className} fill={color} width={size} xmlns="http://www.w3.org/2000/svg" viewBox="0 0 50 50">
        <path d="M41.752 18.925 25.506 6.344a1.255 1.255 0 0 0 -1.55 0.013L8.23 18.937a1.25 1.25 0 0 0 -0.469 0.978v22.75a1.252 1.252 0 0 0 1.252 1.252h9.348a1.253 1.253 0 0 0 1.252 -1.252V28.735h10.77V42.665a1.252 1.252 0 0 0 1.252 1.252h9.35a1.253 1.253 0 0 0 1.252 -1.252v-22.75a1.25 1.25 0 0 0 -0.486 -0.99"/>
    </svg>
  ),
  Search: ({ size = "1em", color = "currentColor", className="" }) => (
    <svg className={className} fill={color} width={size} viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
      <path d="M21.71 20.29 18 16.61A9 9 0 1 0 16.61 18l3.68 3.68a1 1 0 0 0 1.42 0 1 1 0 0 0 0-1.39M11 18a7 7 0 1 1 7-7 7 7 0 0 1-7 7"/>
    </svg>
  ),
  Filter: ({ size = "1em", color = "currentColor", className="" }) => (
    <svg className={className} fill={color} width={size} viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
      <path d="M9 5a1 1 0 1 0 0 2 1 1 0 0 0 0-2M6.17 5a3.001 3.001 0 0 1 5.66 0H19a1 1 0 1 1 0 2h-7.17a3.001 3.001 0 0 1-5.66 0H5a1 1 0 0 1 0-2zM15 11a1 1 0 1 0 0 2 1 1 0 0 0 0-2m-2.83 0a3.001 3.001 0 0 1 5.66 0H19a1 1 0 1 1 0 2h-1.17a3.001 3.001 0 0 1-5.66 0H5a1 1 0 1 1 0-2zM9 17a1 1 0 1 0 0 2 1 1 0 0 0 0-2m-2.83 0a3.001 3.001 0 0 1 5.66 0H19a1 1 0 1 1 0 2h-7.17a3.001 3.001 0 0 1-5.66 0H5a1 1 0 1 1 0-2z"/>
    </svg>
  ),
  Library: ({ size = "1em", color = "currentColor", className="" }) => (
    <svg className={className} stroke={color} width={size} xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="m16 6 4 14M12 6v14M8 8v12M4 4v16"/>
    </svg>
  ),
  Reset: ({ size = "1em", color = "currentColor", className="" }) => (
    <svg className={className} width={size} viewBox="0 0 21 21" xmlns="http://www.w3.org/2000/svg">
      <g fill="none" fillRule="evenodd" stroke={color} strokeLinecap="round" strokeLinejoin="round" transform="matrix(0 1 1 0 2.5 2.5)" strokeWidth="2">
        <path d="m3.98652376 1.07807068c-2.38377179 1.38514556-3.98652376 3.96636605-3.98652376 6.92192932 0 4.418278 3.581722 8 8 8s8-3.581722 8-8-3.581722-8-8-8"/>
        <path d="m4 1v4h-4" transform="matrix(1 0 0 -1 0 6)"/>
      </g>
    </svg>
  ),
  ShoppingCart: ({ size = "1em", color = "currentColor", className="" }) => (
    <svg className={className} fill={color} width={size} viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
      <path d="M7 18c-1.104 0-2 .896-2 2s.896 2 2 2 2-.896 2-2-.896-2-2-2m10 0c-1.104 0-2 .896-2 2s.896 2 2 2 2-.896 2-2-.896-2-2-2M7.16 14.26l.84-2h7.72l1.68 4H6.32l.84-2.01M20.488 6.344A1.003 1.003 0 0 0 19.5 5H5.21l-.94-2H1v2h2l3.6 7.59-1.35 2.44C4.52 15.37 5.48 17 7 17h12v-2H7.42c-.14 0-.25-.11-.25-.25l.03-.12L8.1 13h7.45c.75 0 1.41-.41 1.75-1.03l3.58-6.63c.08-.14.12-.3.12-.46 0-.55-.45-1-1-1z"/>
    </svg>
  ),
};
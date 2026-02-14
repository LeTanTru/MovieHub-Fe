const PlaylistIcon = ({ className }: { className?: string }) => {
  return (
    <svg
      height='512'
      viewBox='0 0 32 32'
      width='512'
      xmlns='http://www.w3.org/2000/svg'
      className={className}
    >
      <g fill='currentColor'>
        <path
          fill='currentColor'
          d='m27 10h-22a3 3 0 0 0 -3 3v14a3 3 0 0 0 3 3h22a3 3 0 0 0 3-3v-14a3 3 0 0 0 -3-3zm1 17a1 1 0 0 1 -1 1h-22a1 1 0 0 1 -1-1v-14a1 1 0 0 1 1-1h22a1 1 0 0 1 1 1zm-7.55-7.89-8-4a1 1 0 0 0 -1.45.89v8a1 1 0 0 0 .47.85 1 1 0 0 0 .53.15 1 1 0 0 0 .45-.11l8-4a1 1 0 0 0 0-1.78zm-7.45 3.27v-4.76l4.76 2.38zm-6-19.38a1 1 0 0 1 1-1h16a1 1 0 0 1 0 2h-16a1 1 0 0 1 -1-1zm-3 4a1 1 0 0 1 1-1h22a1 1 0 0 1 0 2h-22a1 1 0 0 1 -1-1z'
        ></path>
      </g>
    </svg>
  );
};

PlaylistIcon.displayName = 'PlaylistIcon';

export default PlaylistIcon;

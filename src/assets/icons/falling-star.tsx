const FallingStarIcon = ({ className }: { className?: string }) => {
  return (
    <svg
      xmlns='http://www.w3.org/2000/svg'
      viewBox='0 0 24 24'
      id='Star'
      className={className}
    >
      <path
        fill='none'
        stroke='#ffffff'
        strokeLinecap='round'
        strokeLinejoin='round'
        d='m16.5 11 4.5 2.5-1.5-5 4-3.5-5-.5-2-4-2 4-5 .5 4 3.5-1.5 5z'
        className='colorStroke303c42 svgStroke'
      />
      <path
        fill='none'
        stroke='#ffffff'
        strokeLinecap='round'
        strokeLinejoin='round'
        d='M11.5 7C.25 11.13.5 19.5.5 19.5l5-2s-.12 3.94 2 6c0 0 .7-7.44 5-10.5'
        className='colorStroke303c42 svgStroke'
      />
    </svg>
  );
};

export default FallingStarIcon;

export default function ListHeading({ title }: { title: string }) {
  return (
    <div className='max-1120:mb-5 max-990:mb-4 mb-6'>
      <h3 className='max-1600:text-2xl max-640:text-xl max-420:text-base text-[28px] leading-[1.4] font-semibold text-white text-shadow-[0_2px_1px_rgba(0,0,0,0.3)]'>
        {title}
      </h3>
    </div>
  );
}

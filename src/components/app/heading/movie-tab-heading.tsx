export default function MovieTabHeading({ title }: { title: string }) {
  return (
    <h3 className='max-1120:mb-4 max-640:text-lg max-480:text-base max-640:mb-3 mb-6 text-xl font-semibold'>
      {title}
    </h3>
  );
}

import './vertical-bar-loading.css';

export default function VerticalBarLoading() {
  return (
    <div className='bar-list'>
      <div className='mx-auto flex h-12 w-12 items-center justify-between overflow-hidden rounded-full bg-transparent'>
        <div className='bar-item bar-item-1 h-12 w-2 bg-gray-500' />
        <div className='bar-item bar-item-2 h-12 w-2 bg-gray-500' />
        <div className='bar-item bar-item-3 h-12 w-2 bg-gray-500' />
      </div>
    </div>
  );
}

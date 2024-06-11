const Button = ({onClick, children}: {onClick: () => void, children: React.ReactNode}) => {
  return (
    <button className='px-12 py-4 text-2xl bg-blue-500 hover:bg-blue-700 text-white font-bold rounded' onClick={onClick}>
      {children}
    </button>
  )
}

export default Button
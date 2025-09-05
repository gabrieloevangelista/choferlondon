import Image from 'next/image'

export function Logo() {
  return (
    <Image
      src="/LogoMain.png"
      alt="Chofer em Londres"
      width={70}
      height={70}
      className="object-contain"
    />
  )
}
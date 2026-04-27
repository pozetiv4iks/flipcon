import Image from "next/image";

/** Марк логотипа из `public/images/logo.png` (короткий путь `/images/logo.png`). */
export function AuthPageLogo() {
  return (
    <div className="mb-8 flex h-12 w-12 items-center justify-center overflow-hidden rounded-xl bg-white p-1.5 shadow-lg shadow-black/30">
      <Image
        src="/images/logo.png"
        alt="flipcon"
        width={40}
        height={40}
        className="h-full w-full object-contain"
        priority
      />
    </div>
  );
}

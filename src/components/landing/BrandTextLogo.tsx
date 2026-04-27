import Image from "next/image";

/** Словесный логотип: `public/images/text-logo.png` → путь `/images/text-logo.png` */
export function BrandTextLogo({
  className = "",
  priority = false,
}: {
  className?: string;
  priority?: boolean;
}) {
  return (
    <Image
      src="/images/text-logo.png"
      alt="flipcon"
      width={200}
      height={36}
      priority={priority}
      className={`h-7 w-auto object-contain object-left sm:h-8 ${className}`.trim()}
    />
  );
}

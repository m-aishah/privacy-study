import Image from "next/image";

export function Logo({ size = 72 }: { size?: number }) {
  return (
    <Image
      src="/images/unbc_logo.svg"
      alt="UNBC logo"
      width={size * 3}
      height={size}
      style={{ height: size, width: "auto" }}
      priority
    />
  );
}

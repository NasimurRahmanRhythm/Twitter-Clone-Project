import Image from "next/image";
export function Avator({ size = "48" }) {
  return (
    <Image
      alt="avatar"
      style={{ borderRadius: "50%", objectFit: "cover" }}
      height={size}
      width={size}
    />
  );
}

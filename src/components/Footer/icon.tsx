export const FooterIcon = ({ src, href, color }: { src: string; href: string, color?: string }) => {
  return (
    <a
      href={href}
      className={`transition rounded-full opacity-100 hover:opacity-60 ${color? '' : 'instagram-gradient'} p-2 w-[30px] h-[30px]`}
      style={color? {backgroundColor: color} : {}}
    >
      <img src={src} className="w-[14px] h-[14px]" />
    </a>
  );
};

type TLinkEmbedProps = {
  href: string;
  title: string;
  className: string;
  children: any;
};

export default function LinkEmbed(link: TLinkEmbedProps) {
  return (
    <a
      href={link.href}
      title={link.title}
      className={link.className}
      target="_blank"
      rel="noopener noreferrer"
    >
      {link.children}
    </a>
  );
}

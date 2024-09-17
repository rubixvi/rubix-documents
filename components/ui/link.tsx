import Link from 'next/link';

interface Routed {
    href?: string;
    children: React.ReactNode;
}

const RoutedLink: React.FC<Routed> = ({ href = "#", children }) => {
  const isInternal = href.startsWith('/') || href.startsWith('#');

  if (isInternal) {
    return (
      <Link href={href} passHref>
        {children}
      </Link>
    );
  }

  return (
    <a href={href} target="_blank" rel="noopener noreferrer">
      {children}
    </a>
  );
};

export default RoutedLink;
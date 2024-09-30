import { Sidebar } from "@/components/navigation/sidebar";

export default function Documents({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <div className="flex items-start gap-14">
      <Sidebar />
      <div className="flex-1 md:flex-[6]">{children}</div>{" "}
    </div>
  );
}

import Link from "next/link";
export default function ToolShell({title,description,children}:{title:string;description:string;children:React.ReactNode}) {
 return <main className="container tool-page"><div className="breadcrumb"><Link href="/">Home</Link> / <span>{title}</span></div><div className="tool-heading"><h1>{title}</h1><p>{description}</p></div><section className="tool-panel">{children}</section></main>;
}

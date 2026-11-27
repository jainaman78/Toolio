"use client";
export default function DownloadButton({href,filename,label="Download"}:{href:string;filename:string;label?:string}) {
 return <a className="button" href={href} download={filename}>{label}</a>;
}

import folder from "@/assets/folder.png";
import html from "@/assets/html.png";
import css from "@/assets/css.png";
import react from "@/assets/react.png";
import typescript from "@/assets/typescript.png";
import binary from "@/assets/binary.png";
import content from "@/assets/content.png";
import git from "@/assets/git.png";
import image from "@/assets/image.png";
import nodejs from "@/assets/nodejs.png";
import rust from "@/assets/rust.png";
import json from "@/assets/json.png";
import javascript from "@/assets/javascript.png";

interface Icon {
  [key: string]: string;
}

const icons: Icon = {
  folder: folder,
  bin: binary,
  tsx: react,
  css: css,
  svg: image,
  png: image,
  icns: image,
  ico: image,
  gif: image,
  jpeg: image,
  jpg: image,
  tiff: image,
  bmp: image,
  ts: typescript,
  js: javascript,
  json: nodejs,
  md: content,
  lock: content,
  gitignore: git,
  html: html,
  rs: rust,
};

interface FileIconProps {
  name: string;
}

export default function FileIcon({ name }: FileIconProps) {
  if (name == "folder")
    return <img width={16} height={16} src={folder} alt="folder" />;

  const extension = name?.split(".").pop()?.toLowerCase() || "bin";
  const icon = icons[extension] || icons["bin"];
  return <img width={16} height={16} src={icon} alt={extension} />;
}

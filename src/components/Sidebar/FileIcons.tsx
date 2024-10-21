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

export default function FileIcon(name: string) {
  const extension = name.split(".").pop()?.toLowerCase() || "bin";
  const icon = icons[extension];
  return <img src={icon} alt={extension} />;
}

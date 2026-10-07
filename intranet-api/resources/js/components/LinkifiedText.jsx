import React from "react";

const URL_PATTERN = /(https?:\/\/[^\s<]+|www\.[^\s<]+)/gi;

/**
 * Parses text and converts URL strings (http://, https://, www.) into clickable anchor elements.
 */
export function renderTextWithLinks(text) {
  if (!text || typeof text !== "string") return text;

  const parts = text.split(URL_PATTERN);

  return parts.map((part, index) => {
    if (!part) return null;

    if (/^(https?:\/\/|www\.)/i.test(part)) {
      let cleanUrl = part;
      let trailing = "";

      // Trim punctuation at the end that belongs to the sentence
      while (cleanUrl.length > 0 && /[.,:;!?]$/.test(cleanUrl)) {
        trailing = cleanUrl.slice(-1) + trailing;
        cleanUrl = cleanUrl.slice(0, -1);
      }

      // Handle unbalanced closing parenthesis (e.g. "(https://axioma.cl)")
      if (
        cleanUrl.endsWith(")") &&
        (cleanUrl.match(/\(/g) || []).length < (cleanUrl.match(/\)/g) || []).length
      ) {
        trailing = ")" + trailing;
        cleanUrl = cleanUrl.slice(0, -1);
      }

      const href = cleanUrl.startsWith("http://") || cleanUrl.startsWith("https://")
        ? cleanUrl
        : `https://${cleanUrl}`;

      return (
        <React.Fragment key={index}>
          <a
            href={href}
            target="_blank"
            rel="noopener noreferrer"
            onClick={(e) => e.stopPropagation()}
            className="text-[#6a1936] hover:text-[#4a1025] underline font-medium break-all hover:opacity-80 transition-opacity"
            style={{ wordBreak: "break-word" }}
          >
            {cleanUrl}
          </a>
          {trailing}
        </React.Fragment>
      );
    }

    return part;
  });
}

export default function LinkifiedText({ text, className = "", style = {} }) {
  if (!text) return null;

  return (
    <span className={className} style={style}>
      {renderTextWithLinks(text)}
    </span>
  );
}

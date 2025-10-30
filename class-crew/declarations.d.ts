declare namespace JSX {
  interface IntrinsicElements {
    "l-dot-spinner": React.DetailedHTMLProps<
      React.HTMLAttributes<HTMLElement>,
      HTMLElement
    > & {
      size?: string;
      speed?: string;
      color?: string;
    };
  }
}

import clsx from "clsx";

type HeadingProps = React.DetailedHTMLProps<
  React.HTMLAttributes<HTMLHeadingElement>,
  HTMLHeadingElement
>;

function Heading(props: HeadingProps & { as: React.ElementType }) {
  return <props.as {...props} className={clsx(props.className, "font-mono")} />;
}

export function H1(props: HeadingProps) {
  return (
    <Heading
      as={"h1"}
      {...props}
      className="bold text-4xl leading-loose text-neutral-900"
    />
  );
}

export function H2(props: HeadingProps) {
  return (
    <Heading
      as={"h2"}
      {...props}
      className="text-3xl leading-relaxed text-neutral-800"
    />
  );
}

export function H3(props: HeadingProps) {
  return (
    <Heading
      as={"h3"}
      {...props}
      className="text-2xl leading-relaxed text-neutral-800"
    />
  );
}

export function H4(props: HeadingProps) {
  return <Heading as={"h4"} {...props} className="text-xl text-neutral-700" />;
}

export function H5(props: HeadingProps) {
  return <Heading as={"h5"} {...props} className="text-xl text-neutral-700" />;
}

export function H6(props: HeadingProps) {
  return <Heading as={"h6"} {...props} className="text-lg text-neutral-700" />;
}

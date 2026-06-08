import { ui } from "@/lib/lms-ui";

export function PageHeader({ title, description }: { title: string; description?: string }) {
  return (
    <header>
      <h1 className={ui.pageTitle}>{title}</h1>
      {description ? <p className={ui.pageSubtitle}>{description}</p> : null}
    </header>
  );
}

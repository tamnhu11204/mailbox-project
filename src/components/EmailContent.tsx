import type { Email } from "../types";

interface EmailContentProps {
  emails: Email[];
  selectedEmailId: string | null;
}

export const EmailContent = ({ emails, selectedEmailId }: EmailContentProps) => {
  const email = emails.find((e) => e.id === selectedEmailId);

  if (!email) {
    return <div className="p-4 dark:text-dark-text">Select an email to view its content.</div>;
  }

  return (
    <div className="p-4 bg">
      <h2 className="text-xl font-bold dark:text-dark-text">{email.subject}</h2>
      <p className="text-sm sub-text">From: {email.sender}</p>
      <p className="text-sm sub-text">To: {email.recipient}</p>
      <p className="text-sm sub-text">Date: {email.date}</p>
      <hr className="my-2 dark:border-dark-border" />
      <p className="dark:text-dark-text">{email.content}</p>
    </div>
  );
};
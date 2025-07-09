import { Folder, FolderOpen } from 'lucide-react';
import React from 'react';
import type { Mailbox } from '../types';

interface MailboxTreeProps {
  mailboxes: Mailbox[];
  onSelectMailbox: (id: string) => void;
  selectedMailboxId: string | null;
}

const MailboxItem = React.memo(
  ({ mailbox, level = 0, onSelectMailbox, selectedMailboxId }: { mailbox: Mailbox; level?: number; onSelectMailbox: (id: string) => void; selectedMailboxId: string | null }) => {
    const isSelected = selectedMailboxId === mailbox.id;

    const handleSelect = () => {
      if (mailbox.id) {
        onSelectMailbox(mailbox.id);
      } else {
        console.warn('Mailbox ID is undefined:', mailbox);
      }
    };

    return (
      <div>
        <div
          className={`flex items-center p-2 cursor-pointer hover:bg-gray-100 dark:hover:bg-gray-700 ${
            isSelected ? 'bg-gray-200 dark:bg-gray-600 font-bold' : ''
          }`}
          style={{ paddingLeft: `${level * 1.5}rem` }}
          onClick={handleSelect}
        >
          {mailbox.children ? (
            <FolderOpen className="mr-2 text-gray-600 dark:text-gray-300" />
          ) : (
            <Folder className="mr-2 text-gray-600 dark:text-gray-300" />
          )}
          {mailbox.name}
        </div>
        {mailbox.children && (
          <div className="ml-4">
            {mailbox.children.map((child) => (
              <MailboxItem
                key={child.id || `child-${level}-${mailbox.name}`}
                mailbox={child}
                level={level + 1}
                onSelectMailbox={onSelectMailbox}
                selectedMailboxId={selectedMailboxId}
              />
            ))}
          </div>
        )}
      </div>
    );
  }
);

export const MailboxTree = ({ mailboxes, onSelectMailbox, selectedMailboxId }: MailboxTreeProps) => {
  return (
    <div className="p-4 bg-gray-100 dark:bg-dark-sidebar h-full">
      {mailboxes.map((mailbox) => (
        <MailboxItem
          key={mailbox.id || `mailbox-${mailbox.name}`}
          mailbox={mailbox}
          onSelectMailbox={onSelectMailbox}
          selectedMailboxId={selectedMailboxId}
        />
      ))}
    </div>
  );
};
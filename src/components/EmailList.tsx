import { useState } from 'react';
import { Trash2, RotateCcw } from 'lucide-react';
import { toast } from 'react-toastify';
import React from 'react';
import type { Email } from '../types';

interface EmailListProps {
  emails: Email[];
  selectedMailboxId: string | null;
  onSelectEmail: (id: string | null) => void;
  selectedEmailId: string | null;
  setEmails: React.Dispatch<React.SetStateAction<Email[]>>;
}

interface DeletedEmail extends Email {
  originalMailboxId: string;
}

const EmailListItem = React.memo(
  ({
    email,
    onSelect,
    onDelete,
    onRestore,
    isTrash,
  }: {
    email: Email;
    onSelect: () => void;
    onDelete: (e: React.MouseEvent) => void;
    onRestore: (e: React.MouseEvent) => void;
    isTrash: boolean;
  }) => {
    return (
      <div
        className="flex justify-between p-2 border-b hover:bg-gray-50 dark:hover:bg-gray-700 cursor-pointer"
        onClick={onSelect}
      >
        <div>
          <p className="font-medium dark:text-dark-text">{email.subject}</p>
          <p className="text-sm text-gray-500 dark:text-gray-400">{email.sender}</p>
          <p className="text-sm text-gray-500 dark:text-gray-400">{email.date}</p>
        </div>
        <button
          onClick={isTrash ? onRestore : onDelete}
          className="text-red-500 hover:text-red-700 dark:text-red-400 dark:hover:text-red-300"
        >
          {isTrash ? <RotateCcw /> : <Trash2 />}
        </button>
      </div>
    );
  }
);

export const EmailList = ({ emails, selectedMailboxId, onSelectEmail, selectedEmailId, setEmails }: EmailListProps) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [sortBy, setSortBy] = useState<'date' | 'subject' | 'sender'>('date');
  const [sortOrder, setSortOrder] = useState<'asc' | 'desc'>('desc');
  const [deletedEmails, setDeletedEmails] = useState<DeletedEmail[]>([]);

  let filteredEmails = emails.filter(
    (email) =>
      email.mailboxId === selectedMailboxId &&
      (email.subject.toLowerCase().includes(searchQuery.toLowerCase()) ||
        email.sender.toLowerCase().includes(searchQuery.toLowerCase()))
  );

  filteredEmails.sort((a, b) => {
    const aValue = a[sortBy];
    const bValue = b[sortBy];
    if (sortBy === 'date') {
      return sortOrder === 'asc' ? aValue.localeCompare(bValue) : bValue.localeCompare(aValue);
    }
    return sortOrder === 'asc' ? aValue.localeCompare(bValue) : bValue.localeCompare(aValue);
  });

  const deleteEmail = (emailId: string) => {
    console.log('Current emails before delete:', emails);
    const email = emails.find((e) => e.id === emailId);
    if (email) {
      console.log('Deleting email:', { id: email.id, subject: email.subject, mailboxId: email.mailboxId });
      setDeletedEmails((prev) => {
        const newDeletedEmails = [...prev, { ...email, originalMailboxId: email.mailboxId }];
        console.log('Updated deletedEmails:', newDeletedEmails);
        return newDeletedEmails;
      });
      setEmails((prev) => {
        const newEmails = prev.map((e) => (e.id === emailId ? { ...e, mailboxId: 'trash' } : e));
        console.log('Updated emails after delete:', newEmails);
        return newEmails;
      });
      if (selectedEmailId === emailId) onSelectEmail(null);
      const toastId = toast.info('Email moved to Trash. Click to undo.', {
        autoClose: 5000,
        closeOnClick: false,
        onClick: () => {
          console.log('Undoing delete for email:', emailId);
          setEmails((prev) => {
            const deletedEmail = deletedEmails.find((e) => e.id === emailId);
            if (deletedEmail) {
              console.log('Restoring email:', { id: deletedEmail.id, originalMailboxId: deletedEmail.originalMailboxId });
              setDeletedEmails((prevDeleted) => {
                const newDeletedEmails = prevDeleted.filter((e) => e.id !== emailId);
                console.log('Updated deletedEmails after undo:', newDeletedEmails);
                return newDeletedEmails;
              });
              const newEmails = prev.map((e) =>
                e.id === emailId ? { ...e, mailboxId: deletedEmail.originalMailboxId } : e
              );
              console.log('Emails after undo:', newEmails);
              return newEmails;
            }
            console.warn('Deleted email not found for undo:', emailId);
            return prev;
          });
          toast.dismiss(toastId);
        },
      });
      console.log('Toast displayed with ID:', toastId);
    } else {
      console.warn('Email not found for delete:', emailId);
    }
  };

  const restoreEmail = (emailId: string) => {
    console.log('Current emails before restore:', emails);
    const deletedEmail = deletedEmails.find((e) => e.id === emailId);
    if (deletedEmail) {
      console.log('Restoring email:', { id: deletedEmail.id, originalMailboxId: deletedEmail.originalMailboxId });
      setEmails((prev) => {
        const newEmails = prev.map((e) =>
          e.id === emailId ? { ...e, mailboxId: deletedEmail.originalMailboxId } : e
        );
        console.log('Emails after restore:', newEmails);
        return newEmails;
      });
      setDeletedEmails((prev) => {
        const newDeletedEmails = prev.filter((e) => e.id !== emailId);
        console.log('Updated deletedEmails after restore:', newDeletedEmails);
        return newDeletedEmails;
      });
      if (selectedEmailId === emailId) onSelectEmail(null);
      toast.success('Email restored to ' + deletedEmail.originalMailboxId + '.', {
        autoClose: 3000,
      });
    } else {
      console.warn('Deleted email not found for restore:', emailId);
    }
  };

  return (
    <div className="p-4 bg-white dark:bg-dark-bg h-full">
      <div className="mb-4 flex space-x-2">
        <input
          type="text"
          placeholder="Search emails..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          className="p-2 border rounded w-full dark:bg-gray-800 dark:text-dark-text dark:border-dark-border"
        />
        <select
          value={sortBy}
          onChange={(e) => setSortBy(e.target.value as 'date' | 'subject' | 'sender')}
          className="p-2 border rounded dark:bg-gray-800 dark:text-dark-text dark:border-dark-border"
        >
          <option value="date">Sort by Date</option>
          <option value="subject">Sort by Subject</option>
          <option value="sender">Sort by Sender</option>
        </select>
        <select
          value={sortOrder}
          onChange={(e) => setSortOrder(e.target.value as 'asc' | 'desc')}
          className="p-2 border rounded dark:bg-gray-800 dark:text-dark-text dark:border-dark-border"
        >
          <option value="asc">Ascending</option>
          <option value="desc">Descending</option>
        </select>
      </div>
      {filteredEmails.length === 0 ? (
        <p className="dark:text-dark-text">No emails in this mailbox.</p>
      ) : (
        filteredEmails.map((email) => (
          <EmailListItem
            key={email.id}
            email={email}
            onSelect={() => onSelectEmail(email.id)}
            onDelete={(e) => {
              e.stopPropagation();
              deleteEmail(email.id);
            }}
            onRestore={(e) => {
              e.stopPropagation();
              restoreEmail(email.id);
            }}
            isTrash={selectedMailboxId === 'trash'}
          />
        ))
      )}
    </div>
  );
};
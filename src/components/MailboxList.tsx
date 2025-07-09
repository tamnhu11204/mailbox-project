import React, { useCallback, useMemo, useRef, useState } from 'react'
import type { Email } from '../types'
import { Trash } from 'lucide-react';
import { toast } from 'react-toastify';

interface MailboxListProps {
    emails: Email[];
    selectedMailboxId: string | null;
    selectedEmailId: string | null;
    onSelectEmail: (id: string | null) => void;
    setEmails: React.Dispatch<React.SetStateAction<Email[]>>;
}

const EmailListItem = React.memo(
    ({ email, onSelect, onDelete }: { email: Email; onSelect: () => void; onDelete: (e: React.MouseEvent) => void }) => {
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
                <button onClick={onDelete} className="text-red-500 hover:text-red-700 dark:text-red-400 dark:hover:text-red-300">
                    <Trash />
                </button>
            </div>
        );
    }
);

export const MailboxList = ({ emails, selectedEmailId, selectedMailboxId, setEmails, onSelectEmail }: MailboxListProps) => {
    const [searchQuery, setSearchQuery] = useState('');
    const [sortBy, setSortBy] = useState<'date' | 'subject' | 'sender'>('date');
    const [sortOrder, setSortOrder] = useState<'asc' | 'desc'>('desc');
    const deletedEmailsRef = useRef<Email[]>([]);

    const filteredEmails = useMemo(() => {
        let result = emails.filter(
            (email) =>
                email.mailboxId === selectedMailboxId &&
                (email.subject.toLowerCase().includes(searchQuery.toLowerCase()) ||
                    email.sender.toLowerCase().includes(searchQuery.toLowerCase()))
        );

        result.sort((a, b) => {
            const aValue = a[sortBy];
            const bValue = b[sortBy];
            if (sortBy === 'date') {
                return sortOrder === 'asc'
                    ? aValue.localeCompare(bValue)
                    : bValue.localeCompare(aValue);
            }
            return sortOrder === 'asc'
                ? aValue.localeCompare(bValue)
                : bValue.localeCompare(aValue);
        });

        return result;
    }, [emails, selectedMailboxId, searchQuery, sortBy, sortOrder]);

    const deleteEmail = useCallback(
        (emailId: string) => {
            const email = emails.find((e) => e.id === emailId);
            if (email) {
                deletedEmailsRef.current.push({ ...email, mailboxId: 'trash' });
                setEmails((prev) =>
                    prev.map((e) => (e.id === emailId ? { ...e, mailboxId: 'trash' } : e))
                );
                if (selectedEmailId === emailId) onSelectEmail(null);
                toast.info('Email moved to Trash', {
                    autoClose: 5000,
                    onClick: () => {
                        setEmails((prev) => {
                            const deletedEmail = deletedEmailsRef.current.find((e) => e.id === emailId);
                            if (deletedEmail) {
                                deletedEmailsRef.current = deletedEmailsRef.current.filter((e) => e.id !== emailId);
                                return prev.map((e) =>
                                    e.id === emailId ? { ...e, mailboxId: deletedEmail.mailboxId } : e
                                );
                            }
                            return prev;
                        });
                        toast.dismiss();
                    },
                });
            }
        },
        [emails, onSelectEmail, selectedEmailId, setEmails]
    );
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
                    />
                ))
            )}
        </div>
    )
}

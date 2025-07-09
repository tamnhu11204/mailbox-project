import { useState, useCallback } from 'react';
import { toast } from 'react-toastify';
import type { Email } from '../types';

interface ComposeEmailProps {
  setEmails: React.Dispatch<React.SetStateAction<Email[]>>;
}

export const ComposeEmail = ({ setEmails }: ComposeEmailProps) => {
  const [form, setForm] = useState({ recipient: '', subject: '', content: '' });

  const handleChange = useCallback(
    (field: keyof typeof form) => (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
      setForm((prev) => ({ ...prev, [field]: e.target.value }));
    },
    []
  );

  const handleSubmit = useCallback(() => {
    if (form.recipient && form.subject && form.content) {
      const id = Math.random().toString(36).slice(2);
      const date = new Date().toISOString().split('T')[0];
      setEmails((prev) => [
        ...prev,
        {
          id,
          sender: 'you@example.com',
          recipient: form.recipient,
          subject: form.subject,
          content: form.content,
          date,
          mailboxId: 'sent',
        },
      ]);
      setForm({ recipient: '', subject: '', content: '' });
      toast.success('Email sent (simulated)!');
    }
  }, [form, setEmails]);

  return (
    <div className="p-4 bg-white dark:bg-dark-bg">
      <h2 className="text-xl font-bold mb-2 dark:text-dark-text">Compose Email</h2>
      <input
        type="text"
        placeholder="To"
        value={form.recipient}
        onChange={handleChange('recipient')}
        className="p-2 border rounded w-full mb-2 dark:bg-gray-800 dark:text-dark-text dark:border-dark-border"
      />
      <input
        type="text"
        placeholder="Subject"
        value={form.subject}
        onChange={handleChange('subject')}
        className="p-2 border rounded w-full mb-2 dark:bg-gray-800 dark:text-dark-text dark:border-dark-border"
      />
      <textarea
        placeholder="Content"
        value={form.content}
        onChange={handleChange('content')}
        className="p-2 border rounded w-full mb-2 h-32 dark:bg-gray-800 dark:text-dark-text dark:border-dark-border"
      />
      <button
        onClick={handleSubmit}
        className="bg-blue-500 text-white p-2 rounded hover:bg-blue-600 dark:bg-blue-600 dark:hover:bg-blue-700"
      >
        Send
      </button>
    </div>
  );
};
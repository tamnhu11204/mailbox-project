import { useState } from 'react';
import { toast } from 'react-toastify';
import type { Email } from '../types';

interface ComposeEmailProps {
  setEmails: React.Dispatch<React.SetStateAction<Email[]>>;
}

export const ComposeEmail = ({ setEmails }: ComposeEmailProps) => {
  const [form, setForm] = useState({ recipient: '', subject: '', content: '' });

  const handleChange = (field: keyof typeof form) => (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setForm((prev) => ({ ...prev, [field]: e.target.value }));
  };

  const handleSubmit = () => {
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
  };

  return (
    <div className="p-4 bg">
      <h2 className="text-xl font-bold mb-2">Compose Email</h2>
      <input
        type="text"
        placeholder="To"
        value={form.recipient}
        onChange={handleChange('recipient')}
        className="p-2 rounded w-full mb-2 color-button"
      />
      <input
        type="text"
        placeholder="Subject"
        value={form.subject}
        onChange={handleChange('subject')}
        className="p-2 rounded w-full mb-2 color-button"
      />
      <textarea
        placeholder="Content"
        value={form.content}
        onChange={handleChange('content')}
        className="p-2 rounded w-full mb-2 h-32 color-button"
      />
      <button
        onClick={handleSubmit}
        className=" color-button text-white p-2 rounded"
      >
        Send
      </button>
    </div>
  );
};
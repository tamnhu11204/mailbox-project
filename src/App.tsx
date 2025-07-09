import { useState } from 'react';
import { mailboxes, emails as initialEmails } from './data';
import type { Email } from './types';
import { Moon, Sun } from 'lucide-react';
import { MailboxTree } from './components/MailboxTree';
import { MailboxList } from './components/MailboxList';
import { EmailContent } from './components/EmailContent';
import { ComposeEmail } from './components/ComposeEmail';
import { ToastContainer } from 'react-toastify';
import { useDarkMode } from './hooks/useDarkMode';

function App() {
  const [emails, setEmails] = useState<Email[]>(initialEmails);
  const [selectedMailboxId, setSelectedMailboxId] = useState<string | null>('inbox');
  const [selectedEmailId, setSelectedEmailId] = useState<string | null>(null);
  const { isDarkMode, toggleDarkMode } = useDarkMode();

  return (
    <div className="flex h-screen">
      <div className="w-1/4 border-r dark:border-dark-border">
        <div className="p-4">
          <button
            onClick={toggleDarkMode}
            className="mb-4 p-2 bg-gray-200 dark:bg-gray-700 rounded flex items-center"
          >
            {isDarkMode ? <Sun className="mr-2" /> : <Moon className="mr-2" />}
            {isDarkMode ? 'Light Mode' : 'Dark Mode'}
          </button>
          <MailboxTree
            mailboxes={mailboxes}
            onSelectMailbox={setSelectedMailboxId}
            selectedMailboxId={selectedMailboxId}
          />
        </div>
      </div>
      <div className="w-1/3 border-r dark:border-dark-border">
        <MailboxList
          emails={emails}
          selectedMailboxId={selectedMailboxId}
          onSelectEmail={setSelectedEmailId}
          selectedEmailId={selectedEmailId}
          setEmails={setEmails}
        />
      </div>
      <div className="w-2/5">
        <EmailContent emails={emails} selectedEmailId={selectedEmailId} />
        <ComposeEmail setEmails={setEmails} />
      </div>
      <ToastContainer />
    </div>
  );
}

export default App;
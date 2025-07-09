import type { Email, Mailbox } from "./types";

export const mailboxes: Mailbox[] = [
    { id: 'inbox', name: 'Inbox' },
    { id: 'sent', name: 'Sent' },
    { id: 'trash', name: 'Trash' },
    {
        id: 'folders', name: 'Folders', children: [
            { id: 'work', name: 'Work' },
            { id: 'study', name: 'Study' }
        ]
    },
];

export const emails: Email[] = [
    {
        id: '1',
        subject: 'Meeting Tomorrow',
        sender: 'abc@gmail.com',
        recipient: 'tyty@gmail.com',
        content: 'Hi, let`s meet tomorrow at 11:00 A.M. We will discuss about something.',
        date: '06/09/2025',
        mailboxId: 'inbox',
    },
    {
        id: '2',
        subject: 'Project Update',
        sender: '123@gmail.com',
        recipient: 'tyty@gmail.com',
        content: 'Hi, tyty. The project have some mistakes, so we have to fix them now.',
        date: '07/09/2025',
        mailboxId: 'inbox',
    },
    {
        id: '3',
        subject: 'Report Daily',
        sender: 'tyty@gmail.com',
        recipient: 'xyz@gmail.com',
        content: 'Dear, Sir/Madam. I completed this task and tomorrow I will learn about React Hooks.',
        date: '07/09/2025',
        mailboxId: 'sent',
    },
    {
        id: '4',
        subject: 'Re: Thanks',
        sender: 'tyty@gmail.com',
        recipient: 'abc@gmail.com',
        content: 'Hi, abc. Thanks for your updating, I will attend tomorrow.',
        date: '08/09/2025',
        mailboxId: 'sent',
    }
]


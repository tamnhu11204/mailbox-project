export interface Email {
    id: string;
    subject: string;
    sender: string;
    recipient: string;
    content: string;
    date: string;
    mailboxId: string;
}

export interface Mailbox {
    id: string;
    name: string;
    children?: Mailbox[];
}
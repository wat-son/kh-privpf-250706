import React from 'react';
import ContactForm from '../components/ContactForm';
import Link from 'next/link';

const ContactPage: React.FC = () => {
    return (
        <div style={{ padding: '20px' }}>
        <h1>お問い合わせ</h1>
        <ContactForm />
        <Link href="/">
            <button style={{ padding: '10px 20px', marginTop: '20px' }}>
            トップ
            </button>
        </Link>
        </div>
    );
};

export default ContactPage;

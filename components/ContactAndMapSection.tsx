'use client';

import React, { useState } from 'react';
import { Lock, Mail, MapPin, Phone, Send, ShieldCheck } from 'lucide-react';
import { usePlatform } from './PlatformProvider';

export function ContactAndMapSection() {
  const { snapshot, callApi, showToast } = usePlatform();
  const s = snapshot.siteSettings;

  const [senderName, setSenderName] = useState('');
  const [senderEmail, setSenderEmail] = useState('');
  const [senderPhone, setSenderPhone] = useState('');
  const [subject, setSubject] = useState('Production House / Talent Inquiry');
  const [message, setMessage] = useState('');
  const [error, setError] = useState('');
  const [sending, setSending] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    if (!senderName.trim() || !senderPhone.trim() || !message.trim()) {
      setError('Please enter your Name, Phone Number, and Message.');
      return;
    }
    setSending(true);
    const res = await callApi('submit_contact_inquiry', {
      payload: {
        senderName,
        senderEmail,
        senderPhone,
        subject,
        message,
      },
    });
    setSending(false);
    if (!res.success) {
      setError(res.error || 'Failed to send message.');
      return;
    }
    setSenderName('');
    setSenderEmail('');
    setSenderPhone('');
    setMessage('');
    showToast('Your encrypted message has been delivered to the 24crofts.com Hyderabad team!');
  };

  return (
    <section className="max-w-[1360px] mx-auto px-4 sm:px-8 py-8 space-y-8">
      <div>
        <p className="text-xs font-semibold text-[#BE123C]">OFFICIAL HEADQUARTERS · HYDERABAD, INDIA</p>
        <h1 className="font-display text-2xl sm:text-3xl font-bold text-[#141413] mt-1">
          Contact 24crofts.com Team & Studio Location Map
        </h1>
        <p className="text-sm text-[#52514E] mt-1">
          Reach our Admin Verification Desk for Production House approvals, Movie Teaser placements, or 24 Crafts artist support.
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-stretch">
        {/* Left: Direct Contact Details + Interactive Hyderabad Map */}
        <div className="lg:col-span-6 space-y-6 flex flex-col justify-between">
          <div className="bg-white border border-[#E6E4DD] rounded-2xl p-6 space-y-4">
            <h2 className="font-display text-lg font-bold text-[#141413]">
              Direct Contact Information
            </h2>

            <div className="space-y-3 text-sm">
              <div className="flex items-start gap-3">
                <Mail className="w-4 h-4 text-[#BE123C] mt-1 shrink-0" />
                <div>
                  <span className="text-xs text-[#6B6963] block">Official Email</span>
                  <a
                    href={`mailto:${s.contactEmail}`}
                    className="font-mono font-semibold text-[#141413] hover:text-[#BE123C]"
                  >
                    {s.contactEmail}
                  </a>
                </div>
              </div>

              <div className="flex items-start gap-3">
                <Phone className="w-4 h-4 text-[#BE123C] mt-1 shrink-0" />
                <div>
                  <span className="text-xs text-[#6B6963] block">Official Mobile / WhatsApp Desk</span>
                  <a
                    href={`tel:+91${s.contactPhone}`}
                    className="font-mono font-semibold text-[#141413] hover:text-[#BE123C] tabular-nums"
                  >
                    +91 {s.contactPhone}
                  </a>
                </div>
              </div>

              <div className="flex items-start gap-3">
                <MapPin className="w-4 h-4 text-[#BE123C] mt-1 shrink-0" />
                <div>
                  <span className="text-xs text-[#6B6963] block">Studio Verification Office</span>
                  <p className="font-semibold text-[#141413]">{s.contactLocation}</p>
                  <p className="text-xs text-[#52514E] mt-0.5">{s.contactAddressFull}</p>
                </div>
              </div>
            </div>
          </div>

          {/* Interactive Hyderabad Map Embed */}
          <div className="bg-white border border-[#E6E4DD] rounded-2xl overflow-hidden flex-1 min-h-[280px] flex flex-col">
            <div className="px-5 py-3 border-b border-[#F1EFEA] flex items-center justify-between text-xs">
              <span className="font-semibold text-[#141413]">
                Film Nagar, Jubilee Hills — Hyderabad, India
              </span>
              <a
                href="https://maps.google.com/?q=Film+Nagar+Jubilee+Hills+Hyderabad+India"
                target="_blank"
                rel="noopener noreferrer"
                className="font-semibold text-[#BE123C] hover:underline"
              >
                Open in Google Maps ↗
              </a>
            </div>
            <iframe
              title="24crofts.com Hyderabad Studio Location Map"
              src={s.mapEmbedUrl}
              className="w-full flex-1 min-h-[250px] border-0"
              loading="lazy"
              referrerPolicy="no-referrer-when-downgrade"
            />
          </div>
        </div>

        {/* Right: End-to-End Encrypted Contact Form */}
        <form
          onSubmit={handleSubmit}
          className="lg:col-span-6 bg-white border border-[#E6E4DD] rounded-2xl p-6 sm:p-8 flex flex-col justify-between space-y-5"
        >
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <h2 className="font-display text-lg font-bold text-[#141413]">
                Send an Encrypted Message
              </h2>
              <span className="inline-flex items-center gap-1 text-xs font-medium text-[#15803D]">
                <Lock className="w-3.5 h-3.5" />
                AES-256 Encrypted
              </span>
            </div>

            {error && (
              <div role="alert" className="p-3 rounded-lg bg-[#FFF1F2] border border-[#FECDD3] text-xs font-semibold text-[#BE123C]">
                {error}
              </div>
            )}

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label htmlFor="cf-name" className="block text-xs font-semibold text-[#141413] mb-1">
                  Your Full Name *
                </label>
                <input
                  id="cf-name"
                  type="text"
                  value={senderName}
                  onChange={(e) => setSenderName(e.target.value)}
                  placeholder="Enter your name"
                  className="w-full px-3.5 py-2.5 text-sm bg-[#FAF9F6] border border-[#DEDBD2] rounded-lg"
                />
              </div>
              <div>
                <label htmlFor="cf-phone" className="block text-xs font-semibold text-[#141413] mb-1">
                  Mobile Number *
                </label>
                <input
                  id="cf-phone"
                  type="tel"
                  value={senderPhone}
                  onChange={(e) => setSenderPhone(e.target.value)}
                  placeholder="10-digit mobile number"
                  className="w-full px-3.5 py-2.5 text-sm bg-[#FAF9F6] border border-[#DEDBD2] rounded-lg"
                />
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label htmlFor="cf-email" className="block text-xs font-semibold text-[#141413] mb-1">
                  Email Address
                </label>
                <input
                  id="cf-email"
                  type="email"
                  value={senderEmail}
                  onChange={(e) => setSenderEmail(e.target.value)}
                  placeholder="you@example.com"
                  className="w-full px-3.5 py-2.5 text-sm bg-[#FAF9F6] border border-[#DEDBD2] rounded-lg"
                />
              </div>
              <div>
                <label htmlFor="cf-subject" className="block text-xs font-semibold text-[#141413] mb-1">
                  Inquiry Topic
                </label>
                <select
                  id="cf-subject"
                  value={subject}
                  onChange={(e) => setSubject(e.target.value)}
                  className="w-full px-3.5 py-2.5 text-sm bg-[#FAF9F6] border border-[#DEDBD2] rounded-lg"
                >
                  <option value="Production House Contact Approval">Production House Contact Approval</option>
                  <option value="Movie Teaser / Ad Placement">Movie Teaser / Ad Placement</option>
                  <option value="24 Crafts Priority Profile Support">24 Crafts Priority Profile Support</option>
                  <option value="General Platform Inquiry">General Platform Inquiry</option>
                </select>
              </div>
            </div>

            <div>
              <label htmlFor="cf-msg" className="block text-xs font-semibold text-[#141413] mb-1">
                Message *
              </label>
              <textarea
                id="cf-msg"
                rows={5}
                value={message}
                onChange={(e) => setMessage(e.target.value)}
                placeholder="Write your inquiry for the 24crofts.com Hyderabad team..."
                className="w-full px-3.5 py-2.5 text-sm bg-[#FAF9F6] border border-[#DEDBD2] rounded-lg"
              />
            </div>
          </div>

          <div className="pt-4 border-t border-[#F1EFEA] flex flex-wrap items-center justify-between gap-4">
            <span className="text-xs text-[#6B6963] inline-flex items-center gap-1.5">
              <ShieldCheck className="w-4 h-4 text-[#15803D]" />
              End-to-End Encrypted Delivery to 24croftsindia@gmail.com
            </span>
            <button
              type="submit"
              disabled={sending}
              className="px-6 py-3 text-sm font-bold text-white bg-[#BE123C] rounded-xl hover:bg-[#9F1239] inline-flex items-center gap-2 cursor-pointer"
            >
              <Send className="w-4 h-4" />
              {sending ? 'Encrypting & Sending...' : 'Send Message'}
            </button>
          </div>
        </form>
      </div>
    </section>
  );
}

import React from 'react';
import { MessageSquare } from 'lucide-react';

export default function Feedback() {
  return (
    <div className="max-w-2xl mx-auto pb-12">
      <div className="neu-card p-8 text-center md:text-left">
        <h1 className="text-3xl font-bold mb-4 flex items-center justify-center md:justify-start gap-3">
          <MessageSquare className="w-8 h-8 text-secondary" /> Feedback
        </h1>
        <p className="text-text-muted mb-8">
          Found a bug? Have a suggestion for a new game? Let us know!
        </p>

        <form className="space-y-4 text-left" onSubmit={(e) => e.preventDefault()}>
          <div>
            <label className="block text-sm font-bold text-text-muted mb-2">Topic</label>
            <select className="w-full p-3 rounded-xl neu-inset bg-surface border-none outline-none text-text">
              <option>General Feedback</option>
              <option>Bug Report</option>
              <option>Game Request</option>
            </select>
          </div>

          <div>
            <label className="block text-sm font-bold text-text-muted mb-2">Message</label>
            <textarea
              rows={5}
              className="w-full p-3 rounded-xl neu-inset bg-surface border-none outline-none text-text resize-none"
              placeholder="Tell us what's on your mind..."
            ></textarea>
          </div>

          <button className="px-6 py-3 rounded-xl neu-button font-bold text-primary w-full md:w-auto">
            Submit Feedback
          </button>
        </form>
      </div>
    </div>
  );
}

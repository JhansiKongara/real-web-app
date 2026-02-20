"use client";

import { X, Send, User, Mail, Phone, MessageSquare } from "lucide-react";
import { useState, useEffect } from "react";
import "@/app/styles/PropertyDetail.scss"; // Reuse glassmorphism styles

interface ContactAgentModalProps {
  isOpen: boolean;
  onClose: () => void;
  propertyTitle: string;
  agentName?: string;
}

export default function ContactAgentModal({
  isOpen,
  onClose,
  propertyTitle,
  agentName = "Agent",
}: ContactAgentModalProps) {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [message, setMessage] = useState(
    `I am interested in ${propertyTitle}. Please contact me.`,
  );
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitted, setSubmitted] = useState(false);

  useEffect(() => {
    // Auto-fill from localStorage if available
    const userStr = localStorage.getItem("user");
    if (userStr) {
      try {
        const user = JSON.parse(userStr);
        if (user.name) setName(user.name);
        if (user.email) setEmail(user.email);
        if (user.phone) setPhone(user.phone);
      } catch (e) {
        console.error("Error parsing user data", e);
      }
    }
  }, [isOpen]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    // Simulate API call
    setTimeout(() => {
      console.log("Inquiry sent:", { name, email, phone, message });
      setIsSubmitting(false);
      setSubmitted(true);

      // Auto close after success
      setTimeout(() => {
        setSubmitted(false);
        onClose();
        // Reset message but keep contact details
        setMessage(`I am interested in ${propertyTitle}. Please contact me.`);
      }, 2000);
    }, 1500);
  };

  if (!isOpen) return null;

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div
        className="modal-content contact-modal"
        onClick={(e) => e.stopPropagation()}
        style={{ maxWidth: "500px", width: "90%" }}
      >
        <button className="close-modal-btn" onClick={onClose}>
          <X size={20} />
        </button>

        {!submitted ? (
          <>
            <div className="modal-header">
              <h3>Contact {agentName}</h3>
              <p className="modal-subtitle">Inquire about {propertyTitle}</p>
            </div>

            <form className="contact-form" onSubmit={handleSubmit}>
              <div className="form-group">
                <label>Name</label>
                <div className="input-with-icon">
                  <User size={16} />
                  <input
                    type="text"
                    required
                    placeholder="Your Name"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                  />
                </div>
              </div>

              <div className="form-group">
                <label>Email</label>
                <div className="input-with-icon">
                  <Mail size={16} />
                  <input
                    type="email"
                    required
                    placeholder="Your Email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                  />
                </div>
              </div>

              <div className="form-group">
                <label>Phone</label>
                <div className="input-with-icon">
                  <Phone size={16} />
                  <input
                    type="tel"
                    required
                    placeholder="Your Phone Number"
                    value={phone}
                    onChange={(e) => setPhone(e.target.value)}
                  />
                </div>
              </div>

              <div className="form-group">
                <label>Message</label>
                <div className="input-with-icon textarea">
                  <MessageSquare size={16} className="mt-1" />
                  <textarea
                    required
                    rows={4}
                    value={message}
                    onChange={(e) => setMessage(e.target.value)}
                  />
                </div>
              </div>

              <button
                type="submit"
                className="submit-inquiry-btn"
                disabled={isSubmitting}
              >
                {isSubmitting ? "Sending..." : "Send Inquiry"}{" "}
                <Send size={16} />
              </button>
            </form>
          </>
        ) : (
          <div className="success-message">
            <div className="success-icon">
              <Send size={32} />
            </div>
            <h3>Inquiry Sent!</h3>
            <p>The agent will contact you shortly.</p>
          </div>
        )}
      </div>

      <style jsx>{`
        .modal-overlay {
          position: fixed;
          top: 0;
          left: 0;
          right: 0;
          bottom: 0;
          background: rgba(0, 0, 0, 0.7);
          backdrop-filter: blur(5px);
          display: flex;
          align-items: center;
          justify-content: center;
          z-index: 2000;
          animation: fadeIn 0.3s ease;
        }

        .modal-content.contact-modal {
          background: rgba(15, 23, 42, 0.9);
          border: 1px solid rgba(34, 211, 238, 0.3);
          border-radius: 20px;
          padding: 30px;
          position: relative;
          box-shadow: 0 20px 50px rgba(0, 0, 0, 0.5);
          animation: slideUp 0.3s ease;
        }

        .close-modal-btn {
          position: absolute;
          top: 15px;
          right: 15px;
          background: transparent;
          border: none;
          color: #94a3b8;
          cursor: pointer;
          padding: 5px;
          border-radius: 50%;
          display: flex;
          transition: 0.2s;
        }

        .close-modal-btn:hover {
          background: rgba(255, 255, 255, 0.1);
          color: #fff;
        }

        .modal-header {
          margin-bottom: 24px;
          text-align: center;
        }

        .modal-header h3 {
          font-family: var(--font-outfit);
          color: #fff;
          font-size: 24px;
          margin-bottom: 5px;
        }

        .modal-subtitle {
          color: #94a3b8;
          font-size: 14px;
        }

        .contact-form {
          display: flex;
          flex-direction: column;
          gap: 16px;
        }

        .form-group label {
          display: block;
          color: #94a3b8;
          font-size: 12px;
          margin-bottom: 6px;
          text-transform: uppercase;
          font-weight: 600;
        }

        .input-with-icon {
          position: relative;
          display: flex;
          align-items: center;
        }

        .input-with-icon svg {
          position: absolute;
          left: 12px;
          color: #64748b;
          pointer-events: none;
        }

        .input-with-icon.textarea {
          align-items: flex-start;
        }

        .input-with-icon.textarea svg {
          top: 12px;
        }

        .contact-form input,
        .contact-form textarea {
          width: 100%;
          background: rgba(255, 255, 255, 0.05);
          border: 1px solid rgba(255, 255, 255, 0.1);
          border-radius: 12px;
          padding: 12px 12px 12px 40px;
          color: #fff;
          font-family: var(--font-inter);
          font-size: 14px;
          outline: none;
          transition: 0.3s;
        }

        .contact-form input:focus,
        .contact-form textarea:focus {
          border-color: var(--neon-cyan);
          background: rgba(6, 182, 212, 0.05);
        }

        .contact-form textarea {
          resize: vertical;
          min-height: 100px;
        }

        .submit-inquiry-btn {
          margin-top: 10px;
          background: var(--neon-gradient);
          border: none;
          border-radius: 12px;
          padding: 14px;
          color: #fff;
          font-weight: 700;
          font-family: var(--font-outfit);
          cursor: pointer;
          display: flex;
          align-items: center;
          justify-content: center;
          gap: 10px;
          transition: 0.3s;
        }

        .submit-inquiry-btn:hover {
          transform: translateY(-2px);
          box-shadow: 0 10px 20px rgba(6, 182, 212, 0.3);
        }

        .submit-inquiry-btn:disabled {
          opacity: 0.7;
          cursor: not-allowed;
          transform: none;
        }

        .success-message {
          text-align: center;
          padding: 40px 20px;
        }

        .success-icon {
          width: 60px;
          height: 60px;
          background: rgba(6, 182, 212, 0.1);
          border-radius: 50%;
          color: var(--neon-cyan);
          display: flex;
          align-items: center;
          justify-content: center;
          margin: 0 auto 20px;
          border: 1px solid var(--neon-cyan);
        }

        .success-message h3 {
          color: #fff;
          font-family: var(--font-outfit);
          font-size: 22px;
          margin-bottom: 10px;
        }

        .success-message p {
          color: #94a3b8;
        }

        @keyframes fadeIn {
          from {
            opacity: 0;
          }
          to {
            opacity: 1;
          }
        }

        @keyframes slideUp {
          from {
            transform: translateY(20px);
            opacity: 0;
          }
          to {
            transform: translateY(0);
            opacity: 1;
          }
        }
      `}</style>
    </div>
  );
}

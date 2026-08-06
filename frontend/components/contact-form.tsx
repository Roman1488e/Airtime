"use client";

import type React from "react";
import { useState } from "react";
import type { ContactInfo, Dictionary, Locale } from "@/types";
import { Send, Mail, Phone, MapPin, Loader2 } from "lucide-react";
import { submitContactForm } from "@/lib/api";
import toast from "react-hot-toast";

interface ContactFormProps {
  dictionary: Dictionary;
  contactInfo: ContactInfo[];
  lang: Locale;
}

export default function ContactForm({
  dictionary: dict,
  contactInfo,
  lang,
}: ContactFormProps) {
  const [formData, setFormData] = useState({
    first_name: "",
    last_name: "",
    phone: "",
    email: "",
    message: "",
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitStatus, setSubmitStatus] = useState<
    "idle" | "success" | "error"
  >("idle");

  // Fetch contact information when component mounts

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    setSubmitStatus("idle");

    try {
      const response = await submitContactForm(formData);
      toast.success(dict.contacts.successMessage);

      console.log(response);

      setSubmitStatus("success");
      setFormData({
        first_name: "",
        last_name: "",
        phone: "",
        email: "",
        message: "",
      });
    } catch (error) {
      console.error("Error submitting form:", error);
      toast.error(dict.contacts.errorMessage);
      setSubmitStatus("error");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="space-y-12">
      <div className="grid md:grid-cols-2 gap-8">
        <div>
          <h3 className="text-2xl font-semibold mb-6">
            {dict.contacts.getInTouch}
          </h3>
          <p className="mb-8 text-gray-600">{dict.contacts.contactMessage}</p>

          <div className="space-y-6">
            {contactInfo[0]?.email && (
              <div className="flex items-start">
                <div className="w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center mr-4 shrink-0">
                  <Mail className="h-5 w-5 text-primary" />
                </div>
                <div>
                  <p className="text-sm text-gray-500 mb-1">
                    {dict.contacts.email}
                  </p>
                  <p className="font-medium">{contactInfo[0].email}</p>
                </div>
              </div>
            )}

            {(contactInfo[0]?.phone_1 || contactInfo[0]?.phone_2) && (
              <div className="flex items-start">
                <div className="w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center mr-4 shrink-0">
                  <Phone className="h-5 w-5 text-primary" />
                </div>
                <div>
                  <p className="text-sm text-gray-500 mb-1">
                    {dict.contacts.phone}
                  </p>
                  {contactInfo[0]?.phone_1 && (
                    <p className="font-medium">{contactInfo[0].phone_1}</p>
                  )}
                  {contactInfo[0]?.phone_2 && (
                    <p className="font-medium mt-1">{contactInfo[0].phone_2}</p>
                  )}
                </div>
              </div>
            )}

            {contactInfo[0]?.translations[lang] && (
              <div className="flex items-start">
                <div className="w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center mr-4 shrink-0">
                  <MapPin className="h-5 w-5 text-primary" />
                </div>
                <div>
                  <p className="text-sm text-gray-500 mb-1">
                    {dict.contacts.address}
                  </p>
                  <p className="font-medium">
                    {contactInfo[0].translations[lang].address}
                  </p>
                </div>
              </div>
            )}
          </div>
        </div>

        <div>
          <form onSubmit={handleSubmit} className="space-y-5">
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label
                  htmlFor="first_name"
                  className="block text-sm font-medium text-gray-700 mb-1"
                >
                  {dict.contacts.firstName || "First Name"}
                </label>
                <input
                  type="text"
                  id="first_name"
                  name="first_name"
                  value={formData.first_name}
                  onChange={handleChange}
                  required
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary/50 focus:border-primary outline-none transition"
                />
              </div>
              <div>
                <label
                  htmlFor="last_name"
                  className="block text-sm font-medium text-gray-700 mb-1"
                >
                  {dict.contacts.lastName || "Last Name"}
                </label>
                <input
                  type="text"
                  id="last_name"
                  name="last_name"
                  value={formData.last_name}
                  onChange={handleChange}
                  required
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary/50 focus:border-primary outline-none transition"
                />
              </div>
            </div>

            <div>
              <label
                htmlFor="phone"
                className="block text-sm font-medium text-gray-700 mb-1"
              >
                {dict.contacts.phone || "Phone"}
              </label>
              <input
                type="tel"
                id="phone"
                name="phone"
                value={formData.phone}
                onChange={handleChange}
                required
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary/50 focus:border-primary outline-none transition"
              />
            </div>

            <div>
              <label
                htmlFor="email"
                className="block text-sm font-medium text-gray-700 mb-1"
              >
                {dict.contacts.email || "Email"}
              </label>
              <input
                type="email"
                id="email"
                name="email"
                value={formData.email}
                onChange={handleChange}
                required
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary/50 focus:border-primary outline-none transition"
              />
            </div>

            <div>
              <label
                htmlFor="message"
                className="block text-sm font-medium text-gray-700 mb-1"
              >
                {dict.contacts.message || "Message"}
              </label>
              <textarea
                id="message"
                name="message"
                value={formData.message}
                onChange={handleChange}
                required
                rows={4}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary/50 focus:border-primary outline-none transition resize-none"
              ></textarea>
            </div>

            {submitStatus === "success" && (
              <div className="p-3 bg-green-50 text-green-800 rounded-lg">
                {dict.contacts.successMessage ||
                  "Your message has been sent successfully. We'll get back to you soon!"}
              </div>
            )}

            {submitStatus === "error" && (
              <div className="p-3 bg-red-50 text-red-800 rounded-lg">
                {dict.contacts.errorMessage ||
                  "There was an error sending your message. Please try again later."}
              </div>
            )}

            <button
              type="submit"
              disabled={isSubmitting}
              className="inline-flex items-center justify-center rounded-lg bg-primary px-6 py-3 text-sm font-medium text-white shadow transition-colors hover:bg-primary-700 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary-500 disabled:bg-primary-300 w-full"
            >
              {isSubmitting ? (
                <>
                  <Loader2 className="animate-spin mr-2 h-4 w-4" />
                  {dict.contacts.sending || "Sending..."}
                </>
              ) : (
                <>
                  <Send className="mr-2 h-4 w-4" />
                  {dict.contacts.sendMessage || "Send Message"}
                </>
              )}
            </button>
          </form>
        </div>
      </div>

      {/* Google Maps Embed */}
      {contactInfo[0]?.map && (
        <div className="bg-white rounded-lg shadow-md p-1 overflow-hidden">
          <div className="w-full h-[400px] rounded-lg overflow-hidden">
            <iframe
              src={contactInfo[0].map}
              width="100%"
              height="100%"
              style={{ border: 0 }}
              allowFullScreen={false}
              loading="lazy"
              referrerPolicy="no-referrer-when-downgrade"
              title="Google Maps"
              className="w-full h-full"
            ></iframe>
          </div>
        </div>
      )}
    </div>
  );
}

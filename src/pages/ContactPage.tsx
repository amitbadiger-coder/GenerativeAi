import React, { useEffect, useState } from "react";
import Container from "@/components/Container";
import { addDoc, collection, serverTimestamp } from "firebase/firestore";
import { db } from "@/config/Firebase.config";
import { useUser } from "@clerk/clerk-react";
import { toast } from "sonner";
import { Mail, Phone, MapPin } from "lucide-react";

const ContactPage = () => {
  const { user, isSignedIn } = useUser();

  const [formData, setFormData] = useState({
    name: "",
    email: "",
    message: "",
  });

  useEffect(() => {
    if (isSignedIn && user?.primaryEmailAddress?.emailAddress) {
      setFormData((prev) => ({
        ...prev,
        email: user?.primaryEmailAddress?.emailAddress ?? "",
      }));
    }
  }, [isSignedIn, user]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const toastMessage = {
    title: "Sent!",
    description: "Message sent successfully.",
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await addDoc(collection(db, "contacts"), {
        name: formData.name,
        email: formData.email,
        message: formData.message,
        createdAt: serverTimestamp(),
        userId: isSignedIn ? user?.id : null,
      });

      toast(toastMessage.title, { description: toastMessage.description });

      setFormData({
        name: "",
        email: isSignedIn ? formData.email : "",
        message: "",
      });
    } catch (error) {
      console.error("Error:", error);
      toast.error("Error", { description: "Something went wrong, try again later." });
    }
  };

  return (
    <div className="w-full bg-black pb-20">
      <Container>
        {/* HEADER */}
        <div className="text-center pt-16 pb-10">
          <h1 className="text-4xl font-bold text-white mb-3">Contact Us</h1>
          <p className="text-gray-400 max-w-xl mx-auto">
            Have questions or need help? Fill out the form below.
          </p>
        </div>

        {/* FORM + NEWSLETTER */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-10">

          {/* LEFT — CONTACT FORM */}
          <div className="lg:col-span-2 p-8 rounded-3xl bg-white/5 border border-white/10 backdrop-blur">
            <form onSubmit={handleSubmit} className="space-y-6">

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <input
                  type="text"
                  name="name"
                  placeholder="Your Name"
                  value={formData.name}
                  required
                  onChange={handleChange}
                  className="w-full bg-white/10 text-white px-4 py-3 rounded-xl focus:ring-2 focus:ring-yellow-400 outline-none"
                />

                <input
                  type="email"
                  name="email"
                  placeholder="Email Address"
                  value={formData.email}
                  onChange={handleChange}
                  disabled={isSignedIn}
                  className="w-full bg-white/10 text-white px-4 py-3 rounded-xl focus:ring-2 focus:ring-yellow-400 outline-none disabled:opacity-50"
                />
              </div>

              <textarea
                name="message"
                rows={5}
                placeholder="Write your message..."
                value={formData.message}
                onChange={handleChange}
                required
                className="w-full bg-white/10 text-white px-4 py-3 rounded-xl focus:ring-2 focus:ring-yellow-400 outline-none"
              ></textarea>

              <button
                type="submit"
                className="w-full bg-yellow-400 hover:bg-yellow-500 text-black font-semibold py-3 rounded-xl transition"
              >
                Send Message
              </button>
            </form>
          </div>

          {/* RIGHT — NEWSLETTER BOX */}
          <div className="p-8 rounded-3xl bg-white/10 border border-white/10 backdrop-blur">
            <h2 className="text-2xl font-semibold text-white mb-3">Our Newsletter</h2>
            <p className="text-gray-300 text-sm mb-6">
              Stay updated with new AI course features, announcements & offers.
            </p>

            <input
              type="email"
              placeholder="Enter your email"
              className="w-full bg-white/10 text-white px-4 py-3 rounded-xl mb-4 outline-none focus:ring-2 focus:ring-yellow-400"
            />

            <button className="w-full bg-black text-white border border-white/20 hover:bg-yellow-400 hover:text-black transition py-3 rounded-xl">
              Subscribe
            </button>
          </div>
        </div>

        {/* CONTACT INFO CARDS */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mt-16">

          <div className="p-6 bg-white/5 rounded-2xl border border-white/10 text-center">
            <Phone className="mx-auto text-yellow-400" size={30} />
            <h4 className="text-white font-semibold mt-4">(+876) 765 865</h4>
            <p className="text-gray-400 text-sm mt-2">
              Call us anytime for support.
            </p>
          </div>

          <div className="p-6 bg-white/5 rounded-2xl border border-white/10 text-center">
            <Mail className="mx-auto text-yellow-400" size={30} />
            <h4 className="text-white font-semibold mt-4">mail@GenCourse.in</h4>
            <p className="text-gray-400 text-sm mt-2">
              Email us for enquiries.
            </p>
          </div>

          <div className="p-6 bg-white/5 rounded-2xl border border-white/10 text-center">
            <MapPin className="mx-auto text-yellow-400" size={30} />
            <h4 className="text-white font-semibold mt-4">KLE MCA College</h4>
            <p className="text-gray-400 text-sm mt-2">
              Chikodi, Karnataka
            </p>
          </div>
        </div>

        {/* MAP SECTION */}
        <div className="mt-16 rounded-3xl overflow-hidden border border-white/10">
          <iframe
            src="https://www.google.com/maps/embed?pb=!1m18..."
            className="w-full h-72"
            allowFullScreen
            loading="lazy"
          ></iframe>
        </div>

      </Container>
    </div>
  );
};

export default ContactPage;

import React, { useState, useEffect } from "react";
import StarfieldScene2D from "../components/animation/StarfieldScene2D";
// import {
//   FaPaperPlane,
//   FaMobileAlt,
//   FaSpinner,
//   FaEnvelope,
//   FaPaperclip,
//   FaEye,
//   FaTimes,
// } from "react-icons/fa";
// import { motion, AnimatePresence } from "framer-motion";

// import {
//   scheduleNotification,
//   scheduleEmail,
//   searchNotificationTargets,
// } from "../../api/notifications_api";

// import {
//   buildPushPayload,
//   buildEmailPayload,
// } from "../../utils/notification_payload";

// import DateTimeScroller from "../../components/UI/DateTimeScroller";


interface FormData {
  title: string;
  body: string;
  attachment: File | null;
  deeplink: string;
  targetAudience: string;
  specificId: string;
  scheduledTime: string;
}

interface SearchResult {
  id?: string;
  _id?: string;
  name?: string;
  title?: string;
}

const AdminNotification: React.FC = () => {
  const [notificationType, setNotificationType] =
    useState<"PUSH" | "EMAIL">("PUSH");

  const [showPreview, setShowPreview] = useState<boolean>(false);
  const [loading, setLoading] = useState<boolean>(false);

  const [formData, setFormData] = useState<FormData>({
    title: "",
    body: "",
    attachment: null,
    deeplink: "",
    targetAudience: "All Communities",
    specificId: "",
    scheduledTime: "",
  });

  const [searchQuery, setSearchQuery] = useState<string>("");
  const [searchResults, setSearchResults] = useState<SearchResult[]>([]);
  const [searchLoading, setSearchLoading] = useState<boolean>(false);

  const targetOptions: string[] = [
    "Specific Community",
    "Specific Club",
    "Specific Event",
    "Specific Profile",
    "All Clubs",
    "All Communities",
    "All Events",
    "All Chats",
    "Explore Page",
    "People Page",
    "Projects",
    "To Memory Lane",
  ];

  type TargetTypeKey =
    | "Specific Community"
    | "Specific Club"
    | "Specific Event"
    | "Specific Profile";

  const typeMap: Record<TargetTypeKey, string> = {
    "Specific Community": "COMMUNITY",
    "Specific Club": "CLUB",
    "Specific Event": "EVENT",
    "Specific Profile": "PROFILE",
  };

  const handleInputChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setFormData((prev) => ({ ...prev, attachment: file }));
    }
  };

  useEffect(() => {
    if (!formData.targetAudience.startsWith("Specific")) {
      setSearchResults([]);
      return;
    }

    if (!searchQuery || searchQuery.trim().length < 2) {
      setSearchResults([]);
      return;
    }

    const type = typeMap[formData.targetAudience as TargetTypeKey];
    if (!type) {
      setSearchResults([]);
      return;
    }

    const arr1 = ["Yes", "No"]
    const timeout = setTimeout(async () => {
      try {
        setSearchLoading(true);

        // const results = await searchNotificationTargets(type, searchQuery);

        Array.isArray(arr1) ? arr1 : [];
      } catch (error) {
        console.error("Search error:", error);
        setSearchResults([]);
      } finally {
        setSearchLoading(false);
      }
    }, 400);

    return () => clearTimeout(timeout);
  }, [searchQuery, formData.targetAudience]);

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    console.log("Submitting notification...");
  };

  return (
    <div className="relative min-h-screen w-full bg-black text-white overflow-x-hidden">
      <StarfieldScene2D />

      <div className="relative z-10 flex flex-col min-h-screen">
       

        <div className="flex-1 p-6 max-w-4xl mx-auto w-full">
          <h1 className="text-5xl font-bold text-center mb-12">
            Scheduler
          </h1>

          {/* Form content continues exactly same as your code */}

        </div>
      </div>

      {/* Email Preview Modal remains same */}
    </div>
  );
};

export default AdminNotification;
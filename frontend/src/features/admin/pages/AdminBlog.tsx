import React, { useState } from "react";
import BlockRenderer, { type Block } from "../components/BlockRender";
import BlogBtn from "../UI/Blogbtn";
import StarfieldScene2D from "../components/animation/StarfieldScene2D";

interface BlogState {
  title: string;
  type: string;
  name: string;
  blocks: Block[];
}

const AdminBlog: React.FC = () => {
  const [blog, setBlog] = useState<BlogState>({
    title: "",
    type: "club",
    name: "",
    blocks: [],
  });

  const addBlock = (type: string) => {
    setBlog((prev) => ({
      ...prev,
      blocks: [
        ...prev.blocks,
        { id: Date.now().toString(), type, value: "", url: "" },
      ],
    }));
  };

  const updateBlock = (
    id: string,
    key: string,
    value: string | ArrayBuffer | null
  ) => {
    setBlog((prev) => ({
      ...prev,
      blocks: prev.blocks.map((b) =>
        b.id === id ? { ...b, [key]: value } : b
      ),
    }));
  };

  const removeBlock = (id: string) => {
    setBlog((prev) => ({
      ...prev,
      blocks: prev.blocks.filter((b) => b.id !== id),
    }));
  };

  const handleInputChange = (key: keyof BlogState, value: string) => {
    setBlog((prev) => ({ ...prev, [key]: value }));
  };

  const submitBlog = () => {
    console.log("Submitting blog:", blog);
  };

  return (
    <div className="relative min-h-screen w-full bg-black text-white overflow-x-hidden">
      
      {/* 🌌 STARFIELD BACKGROUND */}
      <StarfieldScene2D />

      {/* 🌟 FOREGROUND CONTENT */}
      <div className="relative z-10">

        <div className="pt-28 pb-20 max-w-3xl mx-auto px-4 space-y-6">
          
          {/* BLOG INFO */}
          <div className="space-y-4 bg-white/10 border border-white/20 rounded-xl p-4 backdrop-blur-xl">
            <input
              type="text"
              placeholder="Title"
              value={blog.title}
              onChange={(e) => handleInputChange("title", e.target.value)}
              className="w-full bg-transparent border-b border-white/30 outline-none pb-1"
            />

            <select
              value={blog.type}
              onChange={(e) => handleInputChange("type", e.target.value)}
              className="w-full bg-transparent border-b border-white/30 outline-none pb-1 text-white [&>option]:text-black"
            >
              <option value="club">Club</option>
              <option value="community">Community</option>
              <option value="user">User</option>
              <option value="admin">Admin</option>
            </select>

            <input
              type="text"
              placeholder="Name"
              value={blog.name}
              onChange={(e) => handleInputChange("name", e.target.value)}
              className="w-full bg-transparent border-b border-white/30 outline-none pb-1"
            />
          </div>

          {/* ADD BLOCK BUTTONS */}
          <div className="flex gap-3">
            <BlogBtn onClick={() => addBlock("text")}>+ Text</BlogBtn>
            <BlogBtn onClick={() => addBlock("image")}>+ Image</BlogBtn>
            <BlogBtn onClick={() => addBlock("link")}>+ Link</BlogBtn>
          </div>

          {/* DYNAMIC BLOCKS */}
          <div className="space-y-6">
            {blog.blocks.map((block) => (
              <BlockRenderer
                key={block.id}
                block={block}
                updateBlock={updateBlock}
                removeBlock={removeBlock}
              />
            ))}
          </div>

          {/* SUBMIT */}
          <div className="flex justify-end">
            <BlogBtn onClick={submitBlog}>Submit Blog</BlogBtn>
          </div>

        </div>
      </div>
    </div>
  );
};

export default AdminBlog;
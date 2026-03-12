import BlogBtn from "../UI/Blogbtn";
import React from 'react';

export interface Block {
    id: string;
    type: string;
    value: string;
    url?: string;
}

interface BlockRendererProps {
    block: Block;
    updateBlock: (id: string, key: string, value: string | ArrayBuffer | null) => void;
    removeBlock: (id: string) => void;
}

export default function BlockRenderer({ block, updateBlock, removeBlock }: BlockRendererProps): React.JSX.Element {
    const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (!file) return;
        const reader = new FileReader();
        reader.onload = () => updateBlock(block.id, "value", reader.result as string);
        reader.readAsDataURL(file);
    };

    return (
        <div className="bg-white/10 border border-white/20 rounded-xl p-4 backdrop-blur-xl">
            {/* TEXT */}
            {block.type === "text" && (
                <textarea
                    placeholder="Enter text..."
                    value={block.value}
                    onChange={(e) => updateBlock(block.id, "value", e.target.value)}
                    className="w-full bg-transparent outline-none resize-none min-h-[100px] text-white placeholder:text-white/50"
                />
            )}

            {/* IMAGE */}
            {block.type === "image" && (
                <>
                    <input
                        type="file"
                        accept="image/*"
                        onChange={handleImageUpload}
                        className="w-full mb-2 text-white/80"
                    />
                    {block.value && (
                        <img
                            src={block.value}
                            alt="preview"
                            className="rounded-lg mt-2 max-h-64 object-contain"
                        />
                    )}
                </>
            )}

            {/* LINK */}
            {block.type === "link" && (
                <>
                    <input
                        type="text"
                        placeholder="Link Text"
                        value={block.value}
                        onChange={(e) => updateBlock(block.id, "value", e.target.value)}
                        className="w-full bg-transparent border-b border-white/30 mb-2 outline-none text-white placeholder-white/50 py-1"
                    />
                    <input
                        type="text"
                        placeholder="Link URL"
                        value={block.url || ""}
                        onChange={(e) => updateBlock(block.id, "url", e.target.value)}
                        className="w-full bg-transparent border-b border-white/30 outline-none text-white placeholder-white/50 py-1"
                    />
                </>
            )}

            {/* Remove Button */}
            <div className="flex justify-end mt-3">
                <BlogBtn type="danger" onClick={() => removeBlock(block.id)}>
                    Remove
                </BlogBtn>
            </div>
        </div>
    );
}